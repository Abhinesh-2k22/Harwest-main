import { Router } from 'express';
import { Enquiry } from '../models.js';
import { config } from '../config.js';
import { requireAdmin, csrfGuard } from '../middleware/auth.js';

const router = Router();

/**
 * Non-blocking webhook call to Google Apps Script.
 * Appends the enquiry to Google Sheets AND sends an instant email notification.
 */
async function forwardEnquiryToGoogleWebhook(enquiry) {
  const webhookUrl = config.googleSheetsWebhookUrl;
  if (!webhookUrl) return;

  try {
    const createdAt = enquiry.createdAt ? new Date(enquiry.createdAt) : new Date();
    const istTimestamp =
      createdAt.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      }) + ' IST';

    const payload = {
      id: String(enquiry._id || ''),
      timestamp: istTimestamp,
      enquiryType: enquiry.enquiryType === 'domestic' ? 'Domestic (India)' : 'International',
      name: enquiry.name || '',
      company: enquiry.company || '',
      location:
        enquiry.enquiryType === 'domestic'
          ? enquiry.state || ''
          : enquiry.country || '',
      country: enquiry.country || '',
      state: enquiry.state || '',
      email: enquiry.email || '',
      phone: enquiry.phone || '',
      product: enquiry.product || '',
      volume: enquiry.volume || '',
      message: enquiry.message || '',
      notifyEmail: config.notifyEmail,
    };

    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      redirect: 'follow',
    });

    if (!res.ok) {
      console.warn(`[enquiries] Google Webhook responded with HTTP ${res.status}`);
    } else {
      console.log('[enquiries] Forwarded enquiry to Google Sheets & Email webhook.');
    }
  } catch (err) {
    console.error('[enquiries] Failed to forward enquiry to Google Webhook:', err.message);
  }
}

// PUBLIC: Submit customer enquiry
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, product, volume, message, company, country, state } = req.body || {};
    const enquiryType = req.body?.enquiryType === 'domestic' ? 'domestic' : 'international';
    const clip = (v, n = 200) => (v || '').toString().trim().slice(0, n);

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Please enter your name.' });
    }
    if (!email || typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Please enter a message or specifications.' });
    }
    if (enquiryType === 'international' && !clip(country)) {
      return res.status(400).json({ error: 'Please enter your country.' });
    }
    if (enquiryType === 'domestic' && !clip(state)) {
      return res.status(400).json({ error: 'Please enter your state.' });
    }

    const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '';

    const enquiry = await Enquiry.create({
      enquiryType,
      name: clip(name),
      company: clip(company),
      country: enquiryType === 'international' ? clip(country) : '',
      state: enquiryType === 'domestic' ? clip(state) : '',
      email: email.trim().toLowerCase().slice(0, 254),
      phone: clip(phone, 40),
      product: clip(product),
      volume: clip(volume),
      message: message.trim().slice(0, 5000),
      status: 'new',
      clientIp: String(clientIp).split(',')[0].trim(),
    });

    // Fire-and-forget webhook to Google Sheets + Email notification
    forwardEnquiryToGoogleWebhook(enquiry);

    res.status(201).json({
      success: true,
      id: enquiry._id,
      message: 'Thank you! Your enquiry has been received. Our export team will reach out shortly.',
    });
  } catch (err) {
    console.error('[enquiries] Error creating enquiry:', err);
    res.status(500).json({ error: 'Failed to submit enquiry. Please try again or reach out directly via WhatsApp.' });
  }
});

// ADMIN: Get all enquiries
router.get('/', requireAdmin, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status && status !== 'all' ? { status } : {};
    const enquiries = await Enquiry.find(filter).sort({ createdAt: -1 }).lean();
    res.json(enquiries);
  } catch (err) {
    console.error('[enquiries] Error fetching enquiries:', err);
    res.status(500).json({ error: 'Failed to fetch enquiries' });
  }
});

// ADMIN: Update enquiry status (new | contacted | archived)
router.patch('/:id', requireAdmin, csrfGuard, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['new', 'contacted', 'archived'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!enquiry) return res.status(404).json({ error: 'Enquiry not found' });
    res.json(enquiry);
  } catch (err) {
    console.error('[enquiries] Error updating enquiry:', err);
    res.status(500).json({ error: 'Failed to update enquiry' });
  }
});

// ADMIN: Delete enquiry
router.delete('/:id', requireAdmin, csrfGuard, async (req, res) => {
  try {
    const deleted = await Enquiry.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Enquiry not found' });
    res.json({ ok: true });
  } catch (err) {
    console.error('[enquiries] Error deleting enquiry:', err);
    res.status(500).json({ error: 'Failed to delete enquiry' });
  }
});

export default router;
