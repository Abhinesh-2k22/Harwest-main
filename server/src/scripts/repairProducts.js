import mongoose from 'mongoose';
import 'dotenv/config';
import { Product } from '../models.js';

// One-off repair: remove duplicate products created by the old "edit fallback" bug
// (same name, no specs, no image) and make sure the originals are published.
await mongoose.connect(process.env.MONGODB_URI);
const all = await Product.find().sort({ createdAt: 1 });
const seen = new Map();
let removed = 0;
for (const p of all) {
  const key = (p.slug || p.name || '').toLowerCase();
  const first = seen.get(key);
  if (!first) {
    seen.set(key, p);
  } else if (!p.image && (!p.specs || p.specs.size === 0)) {
    await p.deleteOne();
    removed++;
  }
}
const res = await Product.updateMany({}, { isActive: true });
console.log(`Removed ${removed} duplicate(s); activated ${res.modifiedCount} product(s).`);
await mongoose.disconnect();
