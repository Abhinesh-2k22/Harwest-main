import { Router } from 'express';
import { Enquiry } from '../models.js';
import { requireAdmin, csrfGuard } from '../middleware/auth.js';

const router = Router();

// PUBLIC: Submit customer enquiry
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, product, volume, message } = req.body || {};

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Please enter your name.' });
    }
    if (!email || typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Please enter a message or specifications.' });
    }

    const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '';

    const enquiry = await Enquiry.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: (phone || '').toString().trim(),
      product: (product || '').toString().trim(),
      volume: (volume || '').toString().trim(),
      message: message.trim(),
      status: 'new',
      clientIp: String(clientIp).split(',')[0].trim(),
    });

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
