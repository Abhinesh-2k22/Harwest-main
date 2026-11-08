import { Router } from 'express';
import { SiteAnalytics, Enquiry } from '../models.js';
import { requireAdmin, csrfGuard } from '../middleware/auth.js';

const router = Router();

const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
const ipCountryCache = new Map();

const TIMEZONE_TO_COUNTRY = {
  'Asia/Kolkata': 'India',
  'Asia/Calcutta': 'India',
  'Asia/Dubai': 'United Arab Emirates',
  'Asia/Singapore': 'Singapore',
  'Asia/Tokyo': 'Japan',
  'Asia/Seoul': 'South Korea',
  'Asia/Shanghai': 'China',
  'Asia/Hong_Kong': 'Hong Kong',
  'Asia/Bangkok': 'Thailand',
  'Asia/Jakarta': 'Indonesia',
  'Asia/Kuala_Lumpur': 'Malaysia',
  'Asia/Manila': 'Philippines',
  'Asia/Colombo': 'Sri Lanka',
  'Asia/Riyadh': 'Saudi Arabia',
  'Asia/Qatar': 'Qatar',
  'Asia/Kuwait': 'Kuwait',
  'Asia/Muscat': 'Oman',
  'Europe/London': 'United Kingdom',
  'Europe/Amsterdam': 'Netherlands',
  'Europe/Berlin': 'Germany',
  'Europe/Paris': 'France',
  'Europe/Madrid': 'Spain',
  'Europe/Rome': 'Italy',
  'Europe/Brussels': 'Belgium',
  'Europe/Zurich': 'Switzerland',
  'Europe/Vienna': 'Austria',
  'Europe/Warsaw': 'Poland',
  'Europe/Stockholm': 'Sweden',
  'Europe/Oslo': 'Norway',
  'Europe/Copenhagen': 'Denmark',
  'Europe/Helsinki': 'Finland',
  'Europe/Dublin': 'Ireland',
  'Europe/Lisbon': 'Portugal',
  'Europe/Athens': 'Greece',
  'Europe/Istanbul': 'Turkey',
  'America/New_York': 'United States',
  'America/Chicago': 'United States',
  'America/Denver': 'United States',
  'America/Los_Angeles': 'United States',
  'America/Phoenix': 'United States',
  'America/Toronto': 'Canada',
  'America/Vancouver': 'Canada',
  'America/Mexico_City': 'Mexico',
  'America/Sao_Paulo': 'Brazil',
  'America/Buenos_Aires': 'Argentina',
  'America/Santiago': 'Chile',
  'America/Bogota': 'Colombia',
  'Australia/Sydney': 'Australia',
  'Australia/Melbourne': 'Australia',
  'Australia/Perth': 'Australia',
  'Australia/Brisbane': 'Australia',
  'Pacific/Auckland': 'New Zealand',
  'Africa/Johannesburg': 'South Africa',
  'Africa/Cairo': 'Egypt',
  'Africa/Nairobi': 'Kenya',
  'Africa/Lagos': 'Nigeria',
  'Africa/Casablanca': 'Morocco',
};

function getIstDateKey(date = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(date);
}

function normalizePageKey(rawPath) {
  const p = String(rawPath || '/').toLowerCase().split('?')[0];
  if (p === '/' || p === '') return 'Home';
  if (p.startsWith('/products')) return 'Products';
  if (p.startsWith('/infrastructure')) return 'Infrastructure';
  if (p.startsWith('/about')) return 'About Us';
  if (p.startsWith('/blog')) return 'Blog';
  if (p.startsWith('/contact')) return 'Contact / Enquiry';
  return 'Other';
}

function sanitizeMongoMapKey(str) {
  return String(str || '')
    .trim()
    .replace(/[.$]/g, '')
    .slice(0, 80);
}

function countryCodeToName(code) {
  const clean = String(code || '').trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(clean) || clean === 'XX' || clean === 'T1') return '';
  try {
    return regionNames.of(clean) || clean;
  } catch {
    return clean;
  }
}

function extractClientIp(req) {
  const xff = req.headers['x-forwarded-for'];
  if (xff) {
    const first = String(xff).split(',')[0].trim();
    if (first) return first.replace(/^::ffff:/, '');
  }
  const realIp = req.headers['x-real-ip'] || req.headers['cf-connecting-ip'];
  if (realIp) return String(realIp).trim().replace(/^::ffff:/, '');
  const remote = req.socket?.remoteAddress || '';
  return String(remote).replace(/^::ffff:/, '');
}

function isPrivateOrLocalIp(ip) {
  if (!ip) return true;
  if (ip === '127.0.0.1' || ip === '::1' || ip === 'localhost') return true;
  if (ip.startsWith('10.') || ip.startsWith('192.168.') || ip.startsWith('169.254.')) return true;
  if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(ip)) return true;
  return false;
}

async function resolveVisitorCountry(req, clientTimezone) {
  // 1. Check trusted CDN / Reverse-Proxy Geo Headers first (Cloudflare, Vercel, Render)
  const headerCode =
    req.headers['cf-ipcountry'] ||
    req.headers['x-vercel-ip-country'] ||
    req.headers['x-country-code'];
  if (headerCode) {
    const fromHeader = countryCodeToName(headerCode);
    if (fromHeader) return fromHeader;
  }

  // 2. Check visitor's public IP via IP geolocation API
  const ip = extractClientIp(req);
  if (ip && !isPrivateOrLocalIp(ip)) {
    if (ipCountryCache.has(ip)) {
      return ipCountryCache.get(ip);
    }
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 2200);
      const resp = await fetch(`https://ipwho.is/${encodeURIComponent(ip)}`, {
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (resp.ok) {
        const data = await resp.json();
        if (data && data.success !== false && data.country) {
          const country = sanitizeMongoMapKey(data.country);
          if (country) {
            if (ipCountryCache.size > 1000) ipCountryCache.clear();
            ipCountryCache.set(ip, country);
            return country;
          }
        }
      }
    } catch {
      // Fall through to timezone fallback
    }
  }

  // 3. Fallback to real browser IANA Timezone (especially useful for local development or strict firewalls)
  if (clientTimezone && typeof clientTimezone === 'string') {
    const tz = clientTimezone.trim();
    if (TIMEZONE_TO_COUNTRY[tz]) {
      return TIMEZONE_TO_COUNTRY[tz];
    }
  }

  return '';
}

// PUBLIC: Record a website visit / page click with accurate country detection
router.post('/visit', async (req, res) => {
  try {
    const path = req.body?.path || '/';
    const tz = req.body?.tz || '';
    // Don't count admin or health check hits as public website visits
    if (String(path).startsWith('/admin') || String(path).startsWith('/health')) {
      return res.json({ ok: true, ignored: true });
    }

    const todayKey = getIstDateKey();
    const pageKey = normalizePageKey(path);
    const countryName = sanitizeMongoMapKey(await resolveVisitorCountry(req, tz));

    const incFields = {
      totalVisits: 1,
      [`dailyVisits.${todayKey}`]: 1,
      [`pageClicks.${pageKey}`]: 1,
    };
    if (countryName) {
      incFields[`countryClicks.${countryName}`] = 1;
    }

    const updated = await SiteAnalytics.findOneAndUpdate(
      { key: 'global' },
      { $inc: incFields },
      { upsert: true, new: true }
    ).lean();

    res.json({ ok: true, totalVisits: updated?.totalVisits || 1, country: countryName });
  } catch (err) {
    console.error('[analytics] Error recording visit:', err.message);
    res.status(200).json({ ok: false });
  }
});

// ADMIN: Reset all click & visit counters to zero (does not touch customer enquiries)
router.delete('/reset', requireAdmin, csrfGuard, async (_req, res) => {
  try {
    await SiteAnalytics.findOneAndUpdate(
      { key: 'global' },
      {
        $set: {
          totalVisits: 0,
          dailyVisits: {},
          pageClicks: {},
          countryClicks: {},
        },
      },
      { upsert: true, new: true }
    );
    res.json({ ok: true });
  } catch (err) {
    console.error('[analytics] Error resetting click data:', err.message);
    res.status(500).json({ error: 'Failed to reset click data' });
  }
});

// ADMIN: Get comprehensive visit + enquiry + country analytics summary for visualization
router.get('/summary', requireAdmin, async (_req, res) => {
  try {
    const [statsDoc, enquiries] = await Promise.all([
      SiteAnalytics.findOne({ key: 'global' }).lean(),
      Enquiry.find().sort({ createdAt: -1 }).lean(),
    ]);

    const totalVisits = statsDoc?.totalVisits || 0;
    const dailyVisitsMap = statsDoc?.dailyVisits || {};
    const pageClicksMap = statsDoc?.pageClicks || {};
    const countryClicksMap = statsDoc?.countryClicks || {};

    // Build last 14 days in IST
    const now = new Date();
    const dailyEnquiriesMap = {};
    let domesticCount = 0;
    let internationalCount = 0;
    let newCount = 0;
    let contactedCount = 0;
    const productCounts = {};

    for (const enq of enquiries) {
      if (enq.enquiryType === 'domestic') domesticCount++;
      else internationalCount++;

      if (enq.status === 'new') newCount++;
      else if (enq.status === 'contacted') contactedCount++;

      const prod = (enq.product || 'General / Unspecified').trim();
      productCounts[prod] = (productCounts[prod] || 0) + 1;

      if (enq.createdAt) {
        const dKey = getIstDateKey(new Date(enq.createdAt));
        dailyEnquiriesMap[dKey] = (dailyEnquiriesMap[dKey] || 0) + 1;
      }
    }

    const dailySeries = [];
    let last7DaysVisits = 0;

    for (let i = 13; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateKey = getIstDateKey(d);
      const label = d.toLocaleDateString('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: 'numeric',
        month: 'short',
      });
      const vCount = Number(dailyVisitsMap[dateKey] || 0);
      const eCount = Number(dailyEnquiriesMap[dateKey] || 0);
      if (i < 7) last7DaysVisits += vCount;
      dailySeries.push({
        date: dateKey,
        label,
        visits: vCount,
        enquiries: eCount,
      });
    }

    const todayKey = getIstDateKey(now);
    const todayVisits = Number(dailyVisitsMap[todayKey] || 0);
    const totalEnquiries = enquiries.length;

    const pageOrder = ['Home', 'Products', 'Infrastructure', 'About Us', 'Blog', 'Contact / Enquiry'];
    const pageClicks = pageOrder.map((page) => ({
      page,
      clicks: Number(pageClicksMap[page] || 0),
    }));

    const countryClicks = Object.entries(countryClicksMap)
      .map(([country, clicks]) => ({ country, clicks: Number(clicks || 0) }))
      .filter((c) => c.clicks > 0)
      .sort((a, b) => b.clicks - a.clicks);

    const productBreakdown = Object.entries(productCounts)
      .map(([product, count]) => ({ product, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    res.json({
      totalVisits,
      todayVisits,
      last7DaysVisits,
      totalEnquiries,
      domesticCount,
      internationalCount,
      newCount,
      contactedCount,
      dailySeries,
      pageClicks,
      countryClicks,
      productBreakdown,
    });
  } catch (err) {
    console.error('[analytics] Error building analytics summary:', err.message);
    res.status(500).json({ error: 'Failed to load analytics' });
  }
});

export default router;
