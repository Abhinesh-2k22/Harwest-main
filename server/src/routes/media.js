import { Router } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { v2 as cloudinary } from 'cloudinary';
import { Media } from '../models.js';
import { config } from '../config.js';
import { requireAdmin, csrfGuard } from '../middleware/auth.js';
import { upload, hasValidSignature, UPLOAD_DIR } from '../middleware/upload.js';
import { scheduleDeletion, cancelDeletion } from '../lib/cleanup.js';

const router = Router();
const KEY_RE = /^[a-zA-Z0-9_.]{1,80}$/;

// Configure Cloudinary if credentials are provided
const hasCloudinary = Boolean(
  config.cloudinary.url ||
  (config.cloudinary.cloudName && config.cloudinary.apiKey && config.cloudinary.apiSecret)
);

if (hasCloudinary) {
  if (config.cloudinary.url) {
    process.env.CLOUDINARY_URL = config.cloudinary.url;
    cloudinary.config(true);
  } else {
    cloudinary.config({
      cloud_name: config.cloudinary.cloudName,
      api_key: config.cloudinary.apiKey,
      api_secret: config.cloudinary.apiSecret,
    });
  }
  console.log('[media] Cloudinary initialized for cloud media storage');
} else {
  console.log('[media] Using local disk uploads directory (/uploads)');
}

/** Only https URLs or our own /uploads/ files are allowed (blocks javascript:, data:, etc). */
function isSafeUrl(url) {
  if (typeof url !== 'string' || url.length > 2048) return false;
  if (/^\/uploads\/[a-f0-9]{32}\.(jpg|png|webp|mp4|webm)$/.test(url)) return true;
  try {
    const u = new URL(url);
    return u.protocol === 'https:';
  } catch {
    return false;
  }
}

// PUBLIC: key -> url overrides
router.get('/', async (_req, res) => {
  try {
    const items = await Media.find().lean();
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.json(Object.fromEntries(items.map((m) => [m.key, m.url])));
  } catch (err) {
    console.error('[media] Error fetching media keys:', err);
    res.json({});
  }
});

/** Automatically applies Cloudinary delivery optimization flags (f_mp4 for videos, f_auto for images) */
function optimizeCloudinaryUrl(url) {
  if (typeof url !== 'string' || !url.includes('res.cloudinary.com') || !url.includes('/upload/')) {
    return url;
  }
  if (url.includes('f_auto') || url.includes('q_auto') || url.includes('f_mp4') || url.includes('vc_auto')) {
    return url;
  }
  const isVideo = url.includes('/video/upload/') || /\.(mp4|webm|mov)$/i.test(url);
  if (isVideo) {
    // Videos are compressed at upload time; on-the-fly transforms can be refused for large sources, so serve as-is
    return url;
  }
  return url.replace('/upload/', '/upload/f_auto,q_auto:good,w_1920,c_limit/');
}

router.put('/:key', requireAdmin, csrfGuard, async (req, res) => {
  try {
    const { key } = req.params;
    let { url } = req.body || {};
    if (!KEY_RE.test(key)) return res.status(400).json({ error: 'Invalid key' });
    if (!isSafeUrl(url)) return res.status(400).json({ error: 'URL must be https:// or an uploaded file' });

    url = optimizeCloudinaryUrl(url);

    const previous = await Media.findOne({ key }).lean();
    const item = await Media.findOneAndUpdate({ key }, { url }, { upsert: true, new: true });
    await cancelDeletion(url);
    // The replaced asset is queued for cleanup deletion
    await scheduleDeletion(previous?.url, url);
    res.json({ key: item.key, url: item.url });
  } catch (err) {
    console.error('[media] Error setting media key:', err);
    res.status(500).json({ error: 'Failed to update media key' });
  }
});

// Reset one asset back to its built-in default
router.delete('/:key', requireAdmin, csrfGuard, async (req, res) => {
  try {
    if (!KEY_RE.test(req.params.key)) return res.status(400).json({ error: 'Invalid key' });
    const removed = await Media.findOneAndDelete({ key: req.params.key }).lean();
    await scheduleDeletion(removed?.url, null);
    res.json({ ok: true });
  } catch (err) {
    console.error('[media] Error deleting media key:', err);
    res.status(500).json({ error: 'Failed to delete media key' });
  }
});

router.post('/upload', requireAdmin, csrfGuard, (req, res) => {
  upload.single('file')(req, res, async (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        const ceilingMb = Math.max(config.maxUploadMb || 50, config.maxVideoUploadMb || 250);
        return res.status(400).json({
          error: `File exceeds maximum allowed upload size (${ceilingMb} MB). Please select a file under ${ceilingMb} MB.`,
        });
      }
      return res.status(400).json({ error: err.message });
    }
    if (!req.file) return res.status(400).json({ error: 'No file provided' });
    const full = path.join(UPLOAD_DIR, req.file.filename);

    if (!hasValidSignature(full)) {
      try { fs.unlinkSync(full); } catch {}
      return res.status(400).json({ error: 'File content does not match an allowed media type (JPEG, PNG, WebP, MP4, WebM)' });
    }

    // If Cloudinary is configured, upload with transformation flags and delete local temp file
    // Large videos (>50 MB) use chunked upload_large and auto-compress down to standard 1080p web bitrate
    if (hasCloudinary) {
      const isVideo = req.file.mimetype.startsWith('video/');
      const baseOpts = {
        folder: 'harwest_uploads',
        resource_type: isVideo ? 'video' : 'image',
        chunk_size: 6 * 1024 * 1024,
      };
      // NOTE: cloudinary.uploader.upload_large() returns a stream (NOT a promise) -> must use its callback
      const send = (opts) =>
        new Promise((resolve, reject) => {
          const cb = (error, result) => {
            if (error) return reject(error);
            if (!result || !(result.secure_url || result.url)) {
              return reject(new Error('Cloudinary returned no file URL'));
            }
            resolve(result);
          };
          if (isVideo || req.file.size > 20 * 1024 * 1024) {
            cloudinary.uploader.upload_large(full, opts, cb);
          } else {
            cloudinary.uploader.upload(full, opts, cb);
          }
        });

      try {
        let result;
        if (isVideo) {
          // Attempt 1: compress on ingest (1080p cap, auto quality). Attempt 2: store original if Cloudinary refuses to transform it.
          try {
            result = await send({
              ...baseOpts,
              transformation: [{ width: 1920, height: 1080, crop: 'limit', quality: 'auto:good' }],
            });
          } catch (compressErr) {
            console.warn('[media] Video compress-on-upload failed, retrying with original:', compressErr?.message || compressErr);
            result = await send(baseOpts);
          }
        } else {
          result = await send({
            ...baseOpts,
            transformation: [{ width: 1920, crop: 'limit', quality: 'auto:good', fetch_format: 'auto' }],
          });
        }
        try { fs.unlinkSync(full); } catch {}

        const rawUrl = (result.secure_url || result.url || '').replace(/^http:\/\//, 'https://');
        const finalUrl = optimizeCloudinaryUrl(rawUrl);
        return res.json({ url: finalUrl, originalSize: req.file.size });
      } catch (cloudErr) {
        console.error('[media] Cloudinary upload error:', cloudErr);
        try { fs.unlinkSync(full); } catch {}
        const reason = cloudErr?.message || cloudErr?.error?.message || 'unknown error';
        // Never silently save a local /uploads path for videos: it cannot play on the deployed site
        return res.status(502).json({ error: `Cloud upload failed: ${reason}` });
      }
    }

    // Otherwise serve from local /uploads
    res.json({ url: `/uploads/${req.file.filename}` });
  });
});

export default router;
