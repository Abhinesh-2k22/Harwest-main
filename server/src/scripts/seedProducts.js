import mongoose from 'mongoose';
import { config } from '../config.js';
import { Product } from '../models.js';
import { CATALOGUE } from '../data/products.js';

if (!config.mongoUri) {
  console.error('❌ MONGODB_URI not configured in server/.env');
  process.exit(1);
}

await mongoose.connect(config.mongoUri);
const removed = await Product.deleteMany({});
console.log(`🗑️  Removed ${removed.deletedCount} existing product(s).`);
await Product.insertMany(CATALOGUE);
console.log(`✅ Inserted ${CATALOGUE.length} products: ${CATALOGUE.map((p) => p.name).join(' | ')}`);
await mongoose.disconnect();
