import mongoose from 'mongoose';
import { config } from '../config.js';
import { Product, Blog, Faq } from '../models.js';

const DEFAULT_PRODUCTS = [
  {
    name: 'Cocopeat 5kg Block',
    slug: 'cocopeat-5kg-block',
    category: 'Compressed Coir',
    short: 'Premium compressed, triple-washed, low-EC cocopeat block expanding to ~75 litres of airy substrate.',
    image: '/images/block.jpg',
    specs: {
      'Weight': '5 kg (+/- 200g)',
      'Expansion': '70 – 75 Litres',
      'Electrical Conductivity (EC)': '< 0.5 mS/cm (Washed & Desalinated)',
      'pH Range': '5.5 – 6.5',
      'Moisture Content': '< 18%',
      'Sieve Mesh': 'Fine sieved (unwanted fibres & baby dust removed)',
      'Packing': '220 blocks / pallet, ~24 MT per 40ft HC container',
    },
    order: 1,
    isActive: true,
  },
  {
    name: 'Hydroponic Coir Grow Bags',
    slug: 'hydroponic-coir-grow-bags',
    category: 'Hydroponics',
    short: 'Pre-cut UV-stabilised grow slabs engineered with coco peat & chips matrix for tomatoes, cucumbers and berries.',
    image: '/images/growbags.jpg',
    specs: {
      'Standard Size': '100 × 15 × 10 cm / 100 × 20 × 10 cm',
      'Blend Ratio': '70% Cocopeat + 30% Crushed Husk Chips (Customisable)',
      'Electrical Conductivity (EC)': '< 0.6 mS/cm',
      'pH Range': '5.5 – 6.5',
      'Outer Sleeve': 'White/Black Co-extruded 3-year UV stabilised bag',
      'Pre-drilled Holes': 'Drainage slits and plant hole cutouts pre-punched on order',
    },
    order: 2,
    isActive: true,
  },
  {
    name: 'Coco Husk Chips & Briquettes',
    slug: 'coco-husk-chips-briquettes',
    category: 'Husk Chips',
    short: 'Evenly cut coconut husk cubes providing superior drainage, aeration and orchid potting media structure.',
    image: '/images/chips.jpg',
    specs: {
      'Chip Grade': 'Medium (8–14 mm) / Large (12–20 mm)',
      'Expansion Volume': '5× dry compacted volume',
      'Electrical Conductivity (EC)': '< 0.5 mS/cm',
      'pH Range': '5.5 – 6.5',
      'Packing': '5 kg blocks, 10 kg briquettes, or loose polybags',
      'Ideal Use': 'Orchids, Anthuriums, Hydroponic root zones & potting mix blends',
    },
    order: 3,
    isActive: true,
  },
];

const DEFAULT_BLOGS = [
  {
    slug: 'what-to-check-before-buying-coco-peat-block-for-sale',
    title: 'What to Check Before Buying a Coco Peat Block for Sale',
    category: 'Coco Coir',
    summary:
      'Choosing the right coco peat block can make a real difference in how your crops grow. Before buying, check electrical conductivity (EC), pH stability, expansion volume, and washing certification.',
    author: 'HarWest Agronomy Team',
    publishedAt: '2026-10-24',
    readTime: '5 min read',
    coverImage: '/images/block.jpg',
    content: `Choosing the right coco peat block can make a genuine difference in how you grow your plants. A good block should expand rapidly, hold enough moisture without getting waterlogged, and give roots immediate access to oxygen. Before you place a container order or buy in bulk, here are the essential factors every commercial grower must inspect:

### 1. Check the Electrical Conductivity (EC)
Raw coconut husk naturally contains potassium and sodium salts from the coastal environment. If unwashed coir is used directly, high salinity causes root burn and locks out essential nutrients. Look for triple-washed low-EC coir with an EC rating under 0.5 mS/cm (1:1.5 extraction ratio).

### 2. Verify Expansion Volume and Moisture
A premium 5 kg compressed block should consistently yield between 70 and 75 litres of rehydrated growing medium when saturated with 20–25 litres of fresh water. Moisture in the dry block must stay below 18% to ensure you are paying for coir fiber rather than trapped moisture weight.

### 3. Sieve Consistency and Fiber Ratio
High-grade coir blocks have fine baby dust and long stringy bristles removed. A uniform texture guarantees even water absorption throughout the container and eliminates dry pockets in the substrate.

### 4. Certification and Traceability
Always check if your supplier holds international certifications such as SA 8000 (ethical production) and RHP or ISO quality guidelines. At HarWest, every batch is stamped with a tracking code linked to its laboratory analysis certificate.`,
    isPublished: true,
  },
  {
    slug: 'how-to-identify-high-quality-coco-coir-before-buying',
    title: 'How to Identify High-Quality Coco Coir Before Buying',
    category: 'Quality Guide',
    summary:
      'High-quality coco coir gives plants a balanced environment of water retention, root aeration, and nutrient availability. Learn how to spot aged, buffered coir from low-grade alternatives.',
    author: 'Dr. R. Ramanathan, Senior Agronomist',
    publishedAt: '2026-10-20',
    readTime: '6 min read',
    coverImage: '/images/factory.jpg',
    content: `Experienced commercial growers know that cheap growing media quickly becomes the most expensive mistake in a greenhouse. Here is a practical field guide to identifying top-tier coco coir:

### Visual Color and Scent
Premium coco coir has a rich, earthy brown to dark copper color with an aroma like fresh potting soil. Avoid coir that looks greyish-yellow (indicating raw, un-aged husks with active tannins) or smells sour and fermented (a warning sign of anaerobic decay).

### The "Squeeze Test" for Aeration
Hydrate a sample and squeeze it firmly in your hand. High-quality coir will release excess gravitational water cleanly through your fingers and spring back immediately when you open your palm. If it forms a sticky ball like wet mud, it contains too much fine dust.

### Buffering Quality
Buffering replaces potassium and sodium ions on the coir exchange complex with calcium and magnesium. For fast-growing annuals and hydroponic tomatoes, pre-buffered coir prevents sudden calcium deficiencies in the vegetative growth stage.

### Ageing of the Husks
Fresh husks contain high levels of organic acids. At HarWest, husks are naturally aged and seasoned for at least six months before washing and processing, creating chemically inert, microbially stable growing substrate.`,
    isPublished: true,
  },
  {
    slug: 'what-is-multiple-washed-coco-coir-and-why-does-it-matter',
    title: 'What Is Multiple Washed Coco Coir and Why Does It Matter?',
    category: 'Technical',
    summary:
      'Multiple washed coco coir is coconut fiber that has been repeatedly washed with freshwater to eliminate excess salts and improve its suitability as a growing medium.',
    author: 'HarWest Quality Lab',
    publishedAt: '2026-10-14',
    readTime: '4 min read',
    coverImage: '/images/seedling.jpg',
    content: `When exploring commercial coir specifications, you will frequently see the terms "unwashed", "washed", and "triple washed". Understanding what happens during this washing process reveals why it is the hallmark of export-grade media:

### The Desalination Process
Coconut palms thrive along tropical coasts where they absorb minerals like sodium chloride and potassium. If husks are crushed without thorough washing, these salts remain locked in the pith.

At HarWest's Pollachi facility, crushed pith is washed in multi-stage concrete cascading tanks using fresh mountain spring and filtered rainwater. This dissolves free mineral salts until electrical conductivity drops down to horticultural standards (EC < 0.5 mS/cm).

### Why Low EC Protects Your Plants
1. **Zero Salt Shock:** Seedlings and young cuttings establish roots instantly without osmotic shock.
2. **Precise Fertilizer Dosing:** When your base substrate has nearly zero background EC, you have complete control over the nutrient solution (NPK, calcium, micronutrients) you feed your plants.
3. **Optimized Drainage:** Washing removes fine silt and clay-like mud particles, allowing irrigation water to drain smoothly and preventing root rot.`,
    isPublished: true,
  },
];

const DEFAULT_FAQS = [
  {
    question: 'What is coco coir, and why is it used as a premier growing medium?',
    answer:
      'Coco coir is a natural organic fibre and pith extracted from coconut husks. It is celebrated worldwide by commercial greenhouses and home gardeners because of its superior water retention (holding 7–8× its weight), excellent aeration, neutral pH, and biodegradable sustainability as a 100% peat-free growing medium.',
    category: 'General',
    order: 1,
  },
  {
    question: 'How does HarWest ensure the quality and low-EC of its coco peat?',
    answer:
      'We operate our own multi-stage washing and filtration facilities in Pollachi. Every batch undergoes freshwater desalination to reduce natural electrical conductivity (EC < 0.5 mS/cm) and balanced pH testing before hydraulic compaction. We strictly verify compliance against RHP standards and provide batch test reports with every shipment.',
    category: 'Quality',
    order: 2,
  },
  {
    question: 'What is the difference between washed, buffered, and unwashed coir?',
    answer:
      'Unwashed coir contains natural sea salts (high EC, suitable for civil engineering/erosion control). Washed coir is desalinated with fresh water to bring EC below 0.5 mS/cm (ideal for most horticultural crops). Buffered coir undergoes an additional calcium-nitrate treatment to displace potassium and sodium ions, ensuring optimal nutrient availability for sensitive crops like cannabis, berries, and hydroponic greens.',
    category: 'Technical',
    order: 3,
  },
  {
    question: 'Are HarWest products suitable for home gardening and hydroponics?',
    answer:
      'Yes! Our 5kg blocks, easy-to-use coco disks, and custom coir grow bags are used universally in commercial hydroponics, soil conditioning, seedling nurseries, raised garden beds, indoor tropicals, and potted plants.',
    category: 'Usage',
    order: 4,
  },
  {
    question: 'What is the Minimum Order Quantity (MOQ) and container shipping capacity?',
    answer:
      'Our standard export MOQ is one 20ft or 40ft High Cube container (approx. 24–26 metric tons for 5kg blocks). We also support consolidated sample pallets for trial evaluations. We export FOB, CIF, or CFR to major ports worldwide.',
    category: 'Export',
    order: 5,
  },
  {
    question: 'Can HarWest customize dimensions, packaging, and private labelling?',
    answer:
      'Absolutely. We regularly produce custom-dimension grow slabs, personalized blend ratios (e.g. 70/30 coir pith to chips), custom pre-punched planting slits, and private-label full-colour sleeve printing with your brand logo.',
    category: 'Customization',
    order: 6,
  },
];

async function seed() {
  if (!config.mongoUri) {
    console.error('❌ MONGODB_URI not configured in server/.env');
    process.exit(1);
  }

  await mongoose.connect(config.mongoUri);
  console.log('🌱 Connected to MongoDB for seeding defaults...');

  // Seed Products if none exist
  const prodCount = await Product.countDocuments();
  if (prodCount === 0) {
    await Product.insertMany(DEFAULT_PRODUCTS);
    console.log(`✅ Seeded ${DEFAULT_PRODUCTS.length} default products.`);
  } else {
    console.log(`ℹ️ Products collection already has ${prodCount} items.`);
  }

  // Seed Blogs if none exist
  const blogCount = await Blog.countDocuments();
  if (blogCount === 0) {
    await Blog.insertMany(DEFAULT_BLOGS);
    console.log(`✅ Seeded ${DEFAULT_BLOGS.length} default blog posts.`);
  } else {
    console.log(`ℹ️ Blogs collection already has ${blogCount} items.`);
  }

  // Seed FAQs if none exist
  const faqCount = await Faq.countDocuments();
  if (faqCount === 0) {
    await Faq.insertMany(DEFAULT_FAQS);
    console.log(`✅ Seeded ${DEFAULT_FAQS.length} default FAQs.`);
  } else {
    console.log(`ℹ️ FAQs collection already has ${faqCount} items.`);
  }

  console.log('🎉 Seeding complete.');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seeding error:', err);
  process.exit(1);
});
