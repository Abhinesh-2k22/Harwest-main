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

const variantDetailSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    badge: { type: String, default: '', trim: true },
    short: { type: String, default: '' },
    image: { type: String, default: '' },
    specs: { type: Map, of: String, default: {} },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, trim: true },
    category: { type: String, default: '' }, // legacy single category (unused)
    categories: { type: [String], default: [] },
    variants: { type: [String], default: [] }, // sub-types, e.g. "5 kg Low EC Coir Pith Block"
    variantDetails: { type: [variantDetailSchema], default: [] },
    short: { type: String, required: true },
    image: { type: String, default: '' },
    specs: { type: Map, of: String, default: {} },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const infrastructureSchema = new mongoose.Schema(
  {
    title: { type: String, default: '', trim: true },
    category: { type: String, default: '', trim: true },
    description: { type: String, default: '', trim: true },
    mediaUrl: { type: String, required: true, trim: true },
    mediaType: { type: String, enum: ['image', 'video'], default: 'image' },
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
    enquiryType: { type: String, enum: ['domestic', 'international'], default: 'international' },
    company: { type: String, default: '', trim: true },
    country: { type: String, default: '', trim: true },
    state: { type: String, default: '', trim: true },
    product: { type: String, default: '' },
    volume: { type: String, default: '' },
    message: { type: String, required: true },
    status: { type: String, enum: ['new', 'contacted', 'archived'], default: 'new' },
    clientIp: { type: String, default: '' },
  },
  { timestamps: true }
);

const siteAnalyticsSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: 'global' },
    totalVisits: { type: Number, default: 0 },
    dailyVisits: { type: Map, of: Number, default: {} },
    pageClicks: { type: Map, of: Number, default: {} },
    countryClicks: { type: Map, of: Number, default: {} },
  },
  { timestamps: true }
);

export const Admin = mongoose.model('Admin', adminSchema);
export const Media = mongoose.model('Media', mediaSchema);
export const Product = mongoose.model('Product', productSchema);
export const Infrastructure = mongoose.model('Infrastructure', infrastructureSchema);
export const Blog = mongoose.model('Blog', blogSchema);
export const Faq = mongoose.model('Faq', faqSchema);
export const Enquiry = mongoose.model('Enquiry', enquirySchema);
export const PendingDeletion = mongoose.model('PendingDeletion', pendingDeletionSchema);
export const SiteAnalytics = mongoose.model('SiteAnalytics', siteAnalyticsSchema);
