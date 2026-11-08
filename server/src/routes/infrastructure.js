import { Router } from 'express';
import { Infrastructure } from '../models.js';
import { requireAdmin, csrfGuard } from '../middleware/auth.js';
import { scheduleDeletion, cancelDeletion } from '../lib/cleanup.js';
import { DEFAULT_INFRASTRUCTURE, INFRASTRUCTURE_CATEGORIES } from '../data/infrastructure.js';

const router = Router();

function optimizeCloudinaryUrl(url) {
  if (typeof url !== 'string' || !url.includes('res.cloudinary.com') || !url.includes('/upload/')) {
    return url;
  }
  if (url.includes('f_auto') || url.includes('q_auto')) {
    return url;
  }
  return url.replace('/upload/', '/upload/f_auto,q_auto:good,w_1920,c_limit/');
}

function detectMediaType(url, explicitType) {
  if (explicitType === 'video' || explicitType === 'image') return explicitType;
  if (typeof url === 'string' && /\.(mp4|webm|mov|m4v)(\?|$)/i.test(url)) return 'video';
  if (typeof url === 'string' && url.includes('/video/upload/')) return 'video';
  return 'image';
}

async function ensureSeeded() {
  const count = await Infrastructure.countDocuments();
  if (count === 0) {
    await Infrastructure.insertMany(DEFAULT_INFRASTRUCTURE);
  }
}

// PUBLIC: List all active infrastructure items
router.get('/', async (_req, res) => {
  try {
    await ensureSeeded();
    const items = await Infrastructure.find({ isActive: true }).sort({ order: 1, createdAt: 1 }).lean();
    res.set('Cache-Control', 'no-store');
    res.json(items);
  } catch (err) {
    console.error('[infrastructure] Error fetching items:', err);
    res.status(500).json({ error: 'Failed to fetch infrastructure items' });
  }
});

// PUBLIC: Allowed categories
router.get('/categories', (_req, res) => res.json(INFRASTRUCTURE_CATEGORIES));

// ADMIN: List all items (including hidden)
router.get('/all', requireAdmin, async (_req, res) => {
  try {
    await ensureSeeded();
    const items = await Infrastructure.find().sort({ order: 1, createdAt: 1 }).lean();
    res.set('Cache-Control', 'no-store');
    res.json(items);
  } catch (err) {
    console.error('[infrastructure] Error fetching all items:', err);
    res.status(500).json({ error: 'Failed to fetch infrastructure items' });
  }
});

// ADMIN: Create new infrastructure item
router.post('/', requireAdmin, csrfGuard, async (req, res) => {
  try {
    const { title, description, mediaUrl, mediaType, order, isActive } = req.body || {};
    if (!mediaUrl || !String(mediaUrl).trim()) {
      return res.status(400).json({ error: 'Image or video URL is required.' });
    }

    const cleanUrl = optimizeCloudinaryUrl(String(mediaUrl).trim());
    const item = await Infrastructure.create({
      title: String(title || '').trim().slice(0, 160),
      category: '',
      description: String(description || '').trim().slice(0, 1000),
      mediaUrl: cleanUrl,
      mediaType: detectMediaType(cleanUrl, mediaType),
      order: Number(order) || 0,
      isActive: isActive !== false,
    });

    try {
      if (item.mediaUrl) await cancelDeletion(item.mediaUrl);
    } catch {}

    res.status(201).json(item);
  } catch (err) {
    console.error('[infrastructure] Error creating item:', err);
    res.status(500).json({ error: err.message || 'Failed to create infrastructure item' });
  }
});

// ADMIN: Update infrastructure item
router.put('/:id', requireAdmin, csrfGuard, async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || id.length !== 24) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const previous = await Infrastructure.findById(id).lean();
    if (!previous) return res.status(404).json({ error: 'Item not found' });

    const { title, description, mediaUrl, mediaType, order, isActive } = req.body || {};
    const update = {};
    if (title !== undefined) {
      update.title = String(title || '').trim().slice(0, 160);
    }
    update.category = '';
    if (description !== undefined) update.description = String(description || '').trim().slice(0, 1000);
    if (mediaUrl !== undefined) {
      const cleanUrl = optimizeCloudinaryUrl(String(mediaUrl || '').trim());
      if (!cleanUrl) return res.status(400).json({ error: 'Media URL cannot be empty.' });
      update.mediaUrl = cleanUrl;
      update.mediaType = detectMediaType(cleanUrl, mediaType);
    } else if (mediaType !== undefined) {
      update.mediaType = detectMediaType(previous.mediaUrl, mediaType);
    }
    if (order !== undefined) update.order = Number(order) || 0;
    if (isActive !== undefined) update.isActive = Boolean(isActive);

    const item = await Infrastructure.findByIdAndUpdate(id, update, { new: true });

    if (update.mediaUrl && item?.mediaUrl) {
      try {
        await cancelDeletion(item.mediaUrl);
        await scheduleDeletion(previous?.mediaUrl, item.mediaUrl);
      } catch {}
    }

    res.json(item);
  } catch (err) {
    console.error('[infrastructure] Error updating item:', err);
    res.status(500).json({ error: err.message || 'Failed to update infrastructure item' });
  }
});

// ADMIN: Delete infrastructure item
router.delete('/:id', requireAdmin, csrfGuard, async (req, res) => {
  try {
    const deleted = await Infrastructure.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Item not found' });
    try {
      await scheduleDeletion(deleted.mediaUrl, null);
    } catch {}
    res.json({ ok: true });
  } catch (err) {
    console.error('[infrastructure] Error deleting item:', err);
    res.status(500).json({ error: 'Failed to delete infrastructure item' });
  }
});

export default router;

