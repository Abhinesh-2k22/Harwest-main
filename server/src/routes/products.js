import { Router } from 'express';
import { Product } from '../models.js';
import { requireAdmin, csrfGuard } from '../middleware/auth.js';
import { scheduleDeletion, cancelDeletion } from '../lib/cleanup.js';
import { CATALOGUE, PRODUCT_CATEGORIES } from '../data/products.js';

const router = Router();

async function ensureProductsSynced() {
  const count = await Product.countDocuments();
  if (count === 0) {
    await Product.insertMany(CATALOGUE);
    return;
  }
  const existing = await Product.find().sort({ order: 1, createdAt: 1 });
  for (let i = 0; i < existing.length; i++) {
    const doc = existing[i];
    const template =
      CATALOGUE.find((c) => c.slug === doc.slug) ||
      CATALOGUE.find((c) => c.order === doc.order) ||
      CATALOGUE[i];
    if (!template) continue;

    let changed = false;
    // Ensure Product 1 no longer has 650g block and has updated name/variants
    if (template.slug === 'coir-pith-blocks') {
      if (doc.name.includes('650')) {
        doc.name = template.name;
        changed = true;
      }
      if (Array.isArray(doc.variants) && doc.variants.some((v) => /650/i.test(v))) {
        doc.variants = template.variants;
        doc.variantDetails = template.variantDetails;
        doc.specs = template.specs;
        doc.short = template.short;
        changed = true;
      }
    }
    if (template.slug === 'coir-grow-slabs' && doc.name === 'Coir Grow Slabs') {
      doc.name = template.name;
      doc.variants = template.variants;
      doc.variantDetails = template.variantDetails;
      doc.short = template.short;
      doc.specs = template.specs;
      changed = true;
    }
    if (template.slug === 'open-top-grow-bags' && Array.isArray(doc.variants) && doc.variants.length > 1) {
      doc.variants = template.variants;
      doc.variantDetails = template.variantDetails;
      doc.short = template.short;
      doc.specs = template.specs;
      changed = true;
    }
    if (
      template.slug === 'coconut-fiber' ||
      doc.slug === 'coconut-fiber' ||
      doc.name === 'Coconut Fiber'
    ) {
      const hasOldVariant =
        (Array.isArray(doc.variants) &&
          (doc.variants.length > 1 || doc.variants.some((v) => /bristle|mattress|white/i.test(v)))) ||
        (Array.isArray(doc.variantDetails) &&
          (doc.variantDetails.length > 1 || doc.variantDetails.some((vd) => /bristle|mattress|white/i.test(vd.name))));

      if (hasOldVariant || !Array.isArray(doc.variantDetails) || doc.variantDetails.length === 0) {
        doc.variants = ['Natural Brown Coir Fiber'];
        doc.variantDetails = template.variantDetails.filter((vd) => !/bristle|mattress|white/i.test(vd.name));
        doc.short = template.short;
        doc.specs = template.specs;
        changed = true;
      }
    }
    if (!Array.isArray(doc.variantDetails) || doc.variantDetails.length === 0) {
      doc.variantDetails = template.variantDetails;
      changed = true;
    }
    if (changed) {
      await doc.save();
    }
  }
}

// PUBLIC: List all active products
router.get('/', async (_req, res) => {
  try {
    await ensureProductsSynced();
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
    await ensureProductsSynced();
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

const cleanVariantDetails = (arr) => {
  if (!Array.isArray(arr)) return [];
  return arr
    .map((v) => {
      if (!v || typeof v !== 'object') return null;
      const name = String(v.name || '').trim().slice(0, 120);
      if (!name) return null;
      const badge = String(v.badge || '').trim().slice(0, 100);
      const short = String(v.short || '').trim().slice(0, 1200);
      const image = v.image ? optimizeCloudinaryUrl(String(v.image).trim()) : '';
      const specs = v.specs && typeof v.specs === 'object' ? v.specs : {};
      return { name, badge, short, image, specs };
    })
    .filter(Boolean)
    .slice(0, 20);
};

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

    const { name, short, image, specs, categories, variants, variantDetails, isActive } = req.body;
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
    if (variantDetails !== undefined) {
      const cleanedDetails = cleanVariantDetails(variantDetails);
      update.variantDetails = cleanedDetails;
      update.variants = cleanedDetails.map((d) => d.name);
    } else if (variants !== undefined) {
      update.variants = cleanList(variants, 20, 120);
    }
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
    if (Array.isArray(update.variantDetails)) {
      for (const vd of update.variantDetails) {
        if (vd.image) {
          try {
            await cancelDeletion(vd.image);
          } catch {}
        }
      }
    }
    res.json(product);
  } catch (err) {
    console.error('[products] Error updating product:', err);
    res.status(500).json({ error: err.message || 'Failed to update product' });
  }
});

export default router;
