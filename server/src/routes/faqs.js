import { Router } from 'express';
import { Faq } from '../models.js';
import { requireAdmin, csrfGuard } from '../middleware/auth.js';

const router = Router();

// PUBLIC: Get all FAQs
router.get('/', async (_req, res) => {
  try {
    const faqs = await Faq.find().sort({ order: 1, createdAt: 1 }).lean();
    res.json(faqs);
  } catch (err) {
    console.error('[faqs] Error fetching faqs:', err);
    res.status(500).json({ error: 'Failed to fetch FAQs' });
  }
});

// ADMIN: Create FAQ
router.post('/', requireAdmin, csrfGuard, async (req, res) => {
  try {
    const { question, answer, category, order } = req.body;
    if (!question || !answer) {
      return res.status(400).json({ error: 'Question and answer are required.' });
    }

    const faq = await Faq.create({
      question: question.trim(),
      answer: answer.trim(),
      category: category ? category.trim() : 'General',
      order: Number(order) || 0,
    });

    res.status(201).json(faq);
  } catch (err) {
    console.error('[faqs] Error creating faq:', err);
    res.status(500).json({ error: 'Failed to create FAQ' });
  }
});

// ADMIN: Update FAQ
router.put('/:id', requireAdmin, csrfGuard, async (req, res) => {
  try {
    const { question, answer, category, order } = req.body;
    const update = {};
    if (question !== undefined) update.question = question.trim();
    if (answer !== undefined) update.answer = answer.trim();
    if (category !== undefined) update.category = category.trim();
    if (order !== undefined) update.order = Number(order);

    const faq = await Faq.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!faq) return res.status(404).json({ error: 'FAQ not found' });
    res.json(faq);
  } catch (err) {
    console.error('[faqs] Error updating faq:', err);
    res.status(500).json({ error: 'Failed to update FAQ' });
  }
});

// ADMIN: Delete FAQ
router.delete('/:id', requireAdmin, csrfGuard, async (req, res) => {
  try {
    const deleted = await Faq.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'FAQ not found' });
    res.json({ ok: true });
  } catch (err) {
    console.error('[faqs] Error deleting faq:', err);
    res.status(500).json({ error: 'Failed to delete FAQ' });
  }
});

export default router;
