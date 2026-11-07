import { Router } from 'express';
import { Product } from '../models.js';
import { requireAdmin, csrfGuard } from '../middleware/auth.js';
import { scheduleDeletion, cancelDeletion } from '../lib/cleanup.js';

const router = Router();

// PUBLIC: List all active products
router.get('/', async (_req, res) => {
  try {
    const products = await Product.find({ isActive: true }).sort({ order: 1, createdAt: 1 }).lean();
    res.set('Cache-Control', 'no-store');
    res.json(products);
  } catch (err) {
    console.error('[products] Error fetching products:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// ADMIN: List all products (including inactive)
router.get('/all', requireAdmin, async (_req, res) => {
  try {
    const products = await Product.find().sort({ order: 1, createdAt: 1 }).lean();
    res.set('Cache-Control', 'no-store');
    res.json(products);
  } catch (err) {
    console.error('[products] Error fetching all products:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

function optimizeCloudinaryUrl(url) {
  if (typeof url !== 'string' || !url.includes('res.cloudinary.com') || !url.includes('/upload/')) {
    return url;
  }
  if (url.includes('f_auto') || url.includes('q_auto')) {
    return url;
  }
  return url.replace('/upload/', '/upload/f_auto,q_auto:good,w_1920,c_limit/');
}

// ADMIN: Create product
router.post('/', requireAdmin, csrfGuard, async (req, res) => {
  try {
    const { name, short, image, specs, order, isActive } = req.body;
    if (!name || !short) {
      return res.status(400).json({ error: 'Product name and short description are required.' });
    }

    const slug = req.body.slug ? String(req.body.slug).trim() : String(name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const product = await Product.create({
      name: String(name).trim(),
      slug,
      category: '',
      short: String(short).trim(),
      image: image ? optimizeCloudinaryUrl(String(image).trim()) : '',
      specs: typeof specs === 'object' && specs !== null ? specs : {},
      order: Number(order) || 0,
      isActive: isActive !== false,
    });

    try {
      if (product.image) await cancelDeletion(product.image);
    } catch {}
    res.status(201).json(product);
  } catch (err) {
    console.error('[products] Error creating product:', err);
    res.status(500).json({ error: err.message || 'Failed to create product' });
  }
});

// ADMIN: Update product
router.put('/:id', requireAdmin, csrfGuard, async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || id.length !== 24) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    const previous = await Product.findById(id).lean();
    if (!previous) return res.status(404).json({ error: 'Product not found' });

    const { name, slug, short, image, specs, order, isActive } = req.body;
    const update = {};
    if (name !== undefined) update.name = String(name || '').trim();
    if (slug !== undefined) update.slug = String(slug || '').trim();
    if (short !== undefined) update.short = String(short || '').trim();
    if (image !== undefined) update.image = optimizeCloudinaryUrl(String(image || '').trim());
    if (specs !== undefined) update.specs = typeof specs === 'object' && specs !== null ? specs : {};
    if (order !== undefined) update.order = Number(order) || 0;
    if (isActive !== undefined) update.isActive = Boolean(isActive);

    const product = await Product.findByIdAndUpdate(id, update, { new: true });

    if (update.image !== undefined && product?.image) {
      try {
        await cancelDeletion(product.image);
        await scheduleDeletion(previous?.image, product.image);
      } catch (cleanErr) {
        console.warn('[cleanup] non-critical cleanup warning:', cleanErr.message);
      }
    }
    res.json(product);
  } catch (err) {
    console.error('[products] Error updating product:', err);
    res.status(500).json({ error: err.message || 'Failed to update product' });
  }
});

// ADMIN: Delete product
router.delete('/:id', requireAdmin, csrfGuard, async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Product not found' });
    await scheduleDeletion(deleted.image, null);
    res.json({ ok: true });
  } catch (err) {
    console.error('[products] Error deleting product:', err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

export default router;
