import { Router } from 'express';
import bcrypt from 'bcryptjs';
import rateLimit from 'express-rate-limit';
import { Admin } from '../models.js';
import { config } from '../config.js';
import { signSession, cookieOptions, requireAdmin, csrfGuard } from '../middleware/auth.js';

const router = Router();

const MAX_ATTEMPTS = 5;
const LOCK_MS = 15 * 60 * 1000;
// Valid bcrypt hash used to equalise timing when the email doesn't exist.
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', 12);

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many attempts. Try again later.' },
});

const isStr = (v, max) => typeof v === 'string' && v.length > 0 && v.length <= max;

router.post('/login', loginLimiter, csrfGuard, async (req, res) => {
  const { email, password } = req.body || {};
  const fail = () => res.status(401).json({ error: 'Invalid email or password' });
  if (!isStr(email, 254) || !isStr(password, 200)) return fail();

  const admin = await Admin.findOne({ email: email.toLowerCase().trim() }).select('+passwordHash');
  if (!admin) {
    await bcrypt.compare(password, DUMMY_HASH);
    return fail();
  }
  if (admin.lockUntil && admin.lockUntil > new Date()) {
    return res.status(429).json({ error: 'Account temporarily locked. Try again later.' });
  }

  const ok = await bcrypt.compare(password, admin.passwordHash);
  if (!ok) {
    admin.failedAttempts += 1;
    if (admin.failedAttempts >= MAX_ATTEMPTS) {
      admin.lockUntil = new Date(Date.now() + LOCK_MS);
      admin.failedAttempts = 0;
    }
    await admin.save();
    return fail();
  }

  admin.failedAttempts = 0;
  admin.lockUntil = null;
  await admin.save();
  res.cookie(config.cookieName, signSession(admin), cookieOptions());
  res.json({ email: admin.email });
});

router.post('/logout', csrfGuard, (_req, res) => {
  res.clearCookie(config.cookieName, { ...cookieOptions(), maxAge: undefined });
  res.json({ ok: true });
});

router.get('/me', requireAdmin, (req, res) => res.json({ email: req.admin.email }));

router.post('/change-password', requireAdmin, csrfGuard, loginLimiter, async (req, res) => {
  const { currentPassword, newPassword } = req.body || {};
  if (!isStr(currentPassword, 200) || !isStr(newPassword, 200) || newPassword.length < 12) {
    return res.status(400).json({ error: 'New password must be at least 12 characters' });
  }
  const admin = await Admin.findById(req.admin._id).select('+passwordHash');
  if (!(await bcrypt.compare(currentPassword, admin.passwordHash))) {
    return res.status(401).json({ error: 'Current password is incorrect' });
  }
  admin.passwordHash = await bcrypt.hash(newPassword, 12);
  admin.tokenVersion += 1; // logs out every other session
  await admin.save();
  res.cookie(config.cookieName, signSession(admin), cookieOptions());
  res.json({ ok: true });
});

export default router;
