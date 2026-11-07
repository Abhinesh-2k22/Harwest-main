import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { Admin } from '../models.js';

export function signSession(admin) {
  return jwt.sign({ sub: String(admin._id), tv: admin.tokenVersion }, config.jwtSecret, {
    algorithm: 'HS256',
    expiresIn: config.jwtExpiresIn,
  });
}

export const cookieOptions = () => ({
  httpOnly: true,
  secure: config.isProd,
  sameSite: config.isProd ? 'none' : 'lax',
  path: '/',
  maxAge: 1000 * 60 * 60 * 8,
});

/** Requires a valid admin session cookie. */
export async function requireAdmin(req, res, next) {
  try {
    const token = req.cookies?.[config.cookieName];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    const payload = jwt.verify(token, config.jwtSecret, { algorithms: ['HS256'] });
    const admin = await Admin.findById(payload.sub);
    if (!admin || admin.tokenVersion !== payload.tv) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    req.admin = admin;
    next();
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
  }
}

/**
 * CSRF defence for state-changing requests (on top of SameSite=Strict cookie):
 * requires a matching Origin and a custom header browsers can't send cross-site.
 */
export function csrfGuard(req, res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  const origin = req.get('origin');
  if (origin && config.isProd) {
    const cleanOrigin = origin.replace(/\/+$/, '');
    const allowed = (config.clientOrigin || '')
      .split(',')
      .map((o) => o.trim().replace(/\/+$/, ''))
      .filter(Boolean);
    if (!allowed.includes(cleanOrigin)) {
      return res.status(403).json({ error: 'Forbidden: Origin mismatch' });
    }
  }
  if (req.get('x-requested-with') !== 'harwest-admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
}
