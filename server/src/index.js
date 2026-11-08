// Enforce Indian Standard Time (IST) globally across Node process
process.env.TZ = 'Asia/Kolkata';

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import { config } from './config.js';
import { Blog } from './models.js';
import authRoutes from './routes/auth.js';
import mediaRoutes from './routes/media.js';
import enquiryRoutes from './routes/enquiries.js';
import productRoutes from './routes/products.js';
import infrastructureRoutes from './routes/infrastructure.js';
import analyticsRoutes from './routes/analytics.js';
import blogRoutes from './routes/blogs.js';
import faqRoutes from './routes/faqs.js';
import { UPLOAD_DIR } from './middleware/upload.js';
import { startCleanupJob } from './lib/cleanup.js';

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// Parse allowed client origins (supports comma-separated list like "http://localhost:5173,https://harwest.vercel.app")
const allowedOrigins = (config.clientOrigin || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim().replace(/\/+$/, ''))
  .filter(Boolean);

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  const cleanOrigin = origin.replace(/\/+$/, '');
  if (!config.isProd || allowedOrigins.includes(cleanOrigin)) return true;
  if (/^https?:\/\/([a-z0-9-]+\.)*(harwestcoirs\.com|pages\.dev|workers\.dev|localhost)(:\d+)?$/i.test(cleanOrigin)) {
    return true;
  }
  return false;
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) return callback(null, true);
      return callback(new Error(`Blocked by CORS: ${origin}`));
    },
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);
app.use(express.json({ limit: '100kb' }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(rateLimit({ windowMs: 60 * 1000, limit: 300, standardHeaders: true, legacyHeaders: false }));

// Serve local uploads
app.use(
  '/uploads',
  express.static(UPLOAD_DIR, {
    dotfiles: 'deny',
    index: false,
    maxAge: '7d',
    setHeaders: (res) => res.set('X-Content-Type-Options', 'nosniff'),
  })
);

// API Routes
app.get('/', (_req, res) => {
  res.json({
    status: 'online',
    message: 'HarWest Backend API is running.',
    frontend: config.clientOrigin,
    admin: `${config.clientOrigin}/admin`,
    health: '/health',
    apiHealth: '/api/health',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/infrastructure', infrastructureRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/faqs', faqRoutes);

// Health Check Route for uptime monitoring (Render, Railway, UptimeRobot, etc.)
const healthCheckHandler = (_req, res) => {
  const dbState = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({
    status: 'ok',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    database: dbState,
    service: 'harwest-server',
  });
};

app.get('/health', healthCheckHandler);
app.get('/api/health', healthCheckHandler);

// Dynamic XML Sitemap (includes all static routes + live published blog posts from MongoDB)
const DEFAULT_BLOG_SLUGS = [
  { slug: 'what-to-check-before-buying-coco-peat-block-for-sale', lastmod: '2026-10-24' },
  { slug: 'how-to-identify-high-quality-coco-coir-before-buying', lastmod: '2026-10-20' },
  { slug: 'what-is-multiple-washed-coco-coir-and-why-does-it-matter', lastmod: '2026-10-14' },
  { slug: 'cannabis-coco-coir-what-makes-it-ideal-for-hydroponics', lastmod: '2026-10-08' },
];

const sitemapHandler = async (_req, res) => {
  const siteBase = 'https://harwestcoirs.com';
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date());
  const staticPages = [
    { path: '/', priority: '1.0', changefreq: 'weekly', lastmod: today },
    { path: '/products', priority: '0.9', changefreq: 'weekly', lastmod: today },
    { path: '/infrastructure', priority: '0.8', changefreq: 'monthly', lastmod: today },
    { path: '/about', priority: '0.8', changefreq: 'monthly', lastmod: today },
    { path: '/blog', priority: '0.8', changefreq: 'weekly', lastmod: today },
    { path: '/contact', priority: '0.8', changefreq: 'monthly', lastmod: today },
  ];

  let blogEntries = [...DEFAULT_BLOG_SLUGS];
  if (mongoose.connection.readyState === 1) {
    try {
      const dbBlogs = await Blog.find({ isPublished: { $ne: false } })
        .select('slug publishedAt updatedAt')
        .lean();
      if (dbBlogs.length > 0) {
        const seen = new Set();
        blogEntries = [];
        for (const b of dbBlogs) {
          if (b.slug && !seen.has(b.slug)) {
            seen.add(b.slug);
            const lastmod =
              (b.updatedAt && new Date(b.updatedAt).toISOString().slice(0, 10)) ||
              (b.publishedAt && /^\d{4}-\d{2}-\d{2}$/.test(b.publishedAt) ? b.publishedAt : today);
            blogEntries.push({ slug: b.slug, lastmod });
          }
        }
      }
    } catch {
      // Fallback to default blog slugs
    }
  }

  const urlsXml = [
    ...staticPages.map(
      (p) => `  <url>
    <loc>${siteBase}${p.path}</loc>
    <lastmod>${p.lastmod}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
    ),
    ...blogEntries.map(
      (b) => `  <url>
    <loc>${siteBase}/blog/${encodeURIComponent(b.slug)}</loc>
    <lastmod>${b.lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
    ),
  ].join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlsXml}\n</urlset>`;
  res.header('Content-Type', 'application/xml; charset=utf-8');
  res.header('Cache-Control', 'public, max-age=3600');
  res.send(xml);
};

app.get('/sitemap.xml', sitemapHandler);
app.get('/api/sitemap.xml', sitemapHandler);

// Single source of truth for IST Time across the entire app
app.get('/api/time', (_req, res) => {
  const now = new Date();
  res.json({
    timezone: 'Asia/Kolkata',
    offset: '+05:30',
    istDate: new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(now),
    istTime: now.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true }) + ' IST',
    iso: now.toISOString(),
    timestamp: now.getTime(),
  });
});

app.use((_req, res) => res.status(404).json({ error: 'Endpoint not found' }));

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('[server error]', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Database connection & Server start
async function start() {
  if (config.mongoUri) {
    try {
      await mongoose.connect(config.mongoUri);
      console.log('🌱 [db] MongoDB connected successfully.');
      startCleanupJob();
    } catch (dbErr) {
      console.error('❌ [db] MongoDB connection failed:', dbErr.message);
      console.log('👉 Please verify your MONGODB_URI in server/.env.');
    }
  } else {
    console.warn('⚠️  [db] MONGODB_URI is not set in server/.env.');
    console.log('👉 To connect to MongoDB Atlas, add your connection string to server/.env.');
  }

  app.listen(config.port, () => {
    console.log(`🚀 [server] HarWest API listening on http://localhost:${config.port}`);
  });
}

start();
