import { Router } from 'express';
import { Product } from '../models.js';
import { requireAdmin, csrfGuard } from '../middleware/auth.js';
import { scheduleDeletion, cancelDeletion } from '../lib/cleanup.js';
import { PRODUCT_CATEGORIES } from '../data/products.js';

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

// PUBLIC: Allowed category options (used by the admin multi-select)
router.get('/categories', (_req, res) => res.json(PRODUCT_CATEGORIES));

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

const cleanList = (arr, max, maxLen) =>
  [...new Set((Array.isArray(arr) ? arr : []).map((v) => String(v || '').trim().slice(0, maxLen)).filter(Boolean))].slice(0, max);

// NOTE: Creating and deleting products is intentionally NOT supported.
// The catalogue is fixed (see server/src/data/products.js); admins only update details.

// ADMIN: Update an existing product's details
router.put('/:id', requireAdmin, csrfGuard, async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || id.length !== 24) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    const previous = await Product.findById(id).lean();
    if (!previous) return res.status(404).json({ error: 'Product not found' });

    const { name, short, image, specs, categories, variants, isActive } = req.body;
    const update = {};
    if (name !== undefined) {
      const n = String(name || '').trim();
      if (!n) return res.status(400).json({ error: 'Product name cannot be empty.' });
      update.name = n;
    }
    if (short !== undefined) {
      const s = String(short || '').trim();
      if (!s) return res.status(400).json({ error: 'Description cannot be empty.' });
      update.short = s;
    }
    if (image !== undefined) update.image = optimizeCloudinaryUrl(String(image || '').trim());
    if (specs !== undefined) update.specs = typeof specs === 'object' && specs !== null ? specs : {};
    if (categories !== undefined) {
      update.categories = cleanList(categories, 12, 40).filter((c) => PRODUCT_CATEGORIES.includes(c));
    }
    if (variants !== undefined) update.variants = cleanList(variants, 20, 120);
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

export default router;
