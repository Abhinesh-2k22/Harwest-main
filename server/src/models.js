import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    failedAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date, default: null },
    tokenVersion: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const mediaSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, match: /^[a-zA-Z0-9_.]{1,80}$/ },
    url: { type: String, required: true, maxlength: 2048 },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, trim: true },
    category: { type: String, default: '' },
    short: { type: String, required: true },
    image: { type: String, default: '' },
    specs: { type: Map, of: String, default: {} },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    category: { type: String, default: '' },
    summary: { type: String, required: true },
    content: { type: String, required: true },
    coverImage: { type: String, default: '' },
    author: { type: String, default: 'HarWest Agronomy Team' },
    publishedAt: {
      type: String,
      default: () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date()),
    },
    readTime: { type: String, default: '5 min read' },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const faqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true },
    category: { type: String, default: 'General' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Replaced/removed uploads waiting to be physically deleted (after a grace period).
const pendingDeletionSchema = new mongoose.Schema(
  {
    url: { type: String, required: true, unique: true },
    deleteAt: { type: Date, required: true, index: true },
  },
  { timestamps: true }
);

const enquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    product: { type: String, default: '' },
    volume: { type: String, default: '' },
    message: { type: String, required: true },
    status: { type: String, enum: ['new', 'contacted', 'archived'], default: 'new' },
    clientIp: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Admin = mongoose.model('Admin', adminSchema);
export const Media = mongoose.model('Media', mediaSchema);
export const Product = mongoose.model('Product', productSchema);
export const Blog = mongoose.model('Blog', blogSchema);
export const Faq = mongoose.model('Faq', faqSchema);
export const Enquiry = mongoose.model('Enquiry', enquirySchema);
export const PendingDeletion = mongoose.model('PendingDeletion', pendingDeletionSchema);
