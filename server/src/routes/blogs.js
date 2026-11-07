import { Router } from 'express';
import { Blog } from '../models.js';
import { requireAdmin, csrfGuard } from '../middleware/auth.js';
import { scheduleDeletion, cancelDeletion } from '../lib/cleanup.js';

const router = Router();

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// PUBLIC: Get published blogs
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = { isPublished: true };

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { summary: { $regex: search, $options: 'i' } },
      ];
    }

    const blogs = await Blog.find(filter).sort({ createdAt: -1 }).lean();
    res.json(blogs);
  } catch (err) {
    console.error('[blogs] Error fetching blogs:', err);
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

// ADMIN: Get all blogs (including unpublished drafts)
router.get('/all', requireAdmin, async (_req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 }).lean();
    res.json(blogs);
  } catch (err) {
    console.error('[blogs] Error fetching all blogs:', err);
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

// PUBLIC: Get single blog by slug
router.get('/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, isPublished: true }).lean();
    if (!blog) return res.status(404).json({ error: 'Article not found' });
    res.json(blog);
  } catch (err) {
    console.error('[blogs] Error fetching blog by slug:', err);
    res.status(500).json({ error: 'Failed to fetch article' });
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

// ADMIN: Create blog
router.post('/', requireAdmin, csrfGuard, async (req, res) => {
  try {
    const { title, summary, content, coverImage, author, readTime, isPublished } = req.body;
    if (!title || !content || !summary) {
      return res.status(400).json({ error: 'Title, summary, and content are required.' });
    }

    const slug = req.body.slug ? slugify(req.body.slug) : slugify(title);

    // Check slug collision
    const existing = await Blog.findOne({ slug });
    const finalSlug = existing ? `${slug}-${Date.now().toString(36)}` : slug;

    const blog = await Blog.create({
      title: String(title).trim(),
      slug: finalSlug,
      category: '',
      summary: String(summary).trim(),
      content: String(content).trim(),
      coverImage: coverImage ? optimizeCloudinaryUrl(String(coverImage).trim()) : '',
      author: author ? String(author).trim() : 'HarWest Agronomy Team',
      readTime: readTime ? String(readTime).trim() : '5 min read',
      publishedAt: new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date()),
      isPublished: isPublished !== false,
    });

    try {
      if (blog.coverImage) await cancelDeletion(blog.coverImage);
    } catch {}
    res.status(201).json(blog);
  } catch (err) {
    console.error('[blogs] Error creating blog:', err);
    res.status(500).json({ error: err.message || 'Failed to create blog post' });
  }
});

// ADMIN: Update blog
router.put('/:id', requireAdmin, csrfGuard, async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || id.length !== 24) {
      return res.status(400).json({ error: 'Invalid article ID' });
    }

    const previous = await Blog.findById(id).lean();
    if (!previous) return res.status(404).json({ error: 'Blog not found' });

    const { title, slug, summary, content, coverImage, author, readTime, isPublished } = req.body;
    const update = {};
    if (title !== undefined) update.title = String(title || '').trim();
    if (slug !== undefined) update.slug = slugify(slug);
    if (summary !== undefined) update.summary = String(summary || '').trim();
    if (content !== undefined) update.content = String(content || '').trim();
    if (coverImage !== undefined) update.coverImage = optimizeCloudinaryUrl(String(coverImage || '').trim());
    if (author !== undefined) update.author = String(author || '').trim();
    if (readTime !== undefined) update.readTime = String(readTime || '').trim();
    if (isPublished !== undefined) update.isPublished = Boolean(isPublished);

    const blog = await Blog.findByIdAndUpdate(id, update, { new: true });

    if (update.coverImage !== undefined && blog?.coverImage) {
      try {
        await cancelDeletion(blog.coverImage);
        await scheduleDeletion(previous?.coverImage, blog.coverImage);
      } catch (cleanErr) {
        console.warn('[cleanup] non-critical cleanup warning:', cleanErr.message);
      }
    }
    res.json(blog);
  } catch (err) {
    console.error('[blogs] Error updating blog:', err);
    res.status(500).json({ error: err.message || 'Failed to update blog' });
  }
});

// ADMIN: Delete blog
router.delete('/:id', requireAdmin, csrfGuard, async (req, res) => {
  try {
    const deleted = await Blog.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Blog not found' });
    await scheduleDeletion(deleted.coverImage, null);
    res.json({ ok: true });
  } catch (err) {
    console.error('[blogs] Error deleting blog:', err);
    res.status(500).json({ error: 'Failed to delete blog' });
  }
});

export default router;
