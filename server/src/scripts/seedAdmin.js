import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { config } from '../config.js';
import { Admin } from '../models.js';

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

if (!email || !password || email.startsWith('PASTE_') || password.startsWith('PASTE_')) {
  console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD in server/.env first.');
  process.exit(1);
}
if (password.length < 12) {
  console.error('ADMIN_PASSWORD must be at least 12 characters.');
  process.exit(1);
}

await mongoose.connect(config.mongoUri);
const passwordHash = await bcrypt.hash(password, 12);
await Admin.findOneAndUpdate(
  { email: email.toLowerCase().trim() },
  { passwordHash, failedAttempts: 0, lockUntil: null, $inc: { tokenVersion: 1 } },
  { upsert: true }
);
console.log(`Admin ready: ${email}. Now remove ADMIN_PASSWORD from .env.`);
await mongoose.disconnect();
