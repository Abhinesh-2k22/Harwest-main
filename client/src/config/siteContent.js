/** All business copy, contact details and product/blog/FAQ data in one place. */
export const SITE = {
  name: 'HarWest',
  tagline: 'GROW A GREENER TOMORROW',
  subtag: 'COIR PRODUCTS | COCO PEAT | NATURAL FIBER SOLUTIONS',
  email: 'sales@harwestcoirs.com',
  phone: '+91 9344650065',
  phoneAlt: '',
  whatsapp: '919344650065',
  address: 'Plot 12, Coir Industrial Estate, Pollachi, Tamil Nadu, India 642001',
  socials: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/selvakumar-govindasamy-4a9516198?utm_source=share_via&utm_content=profile&utm_medium=member_android' },
    { label: 'Instagram', href: 'https://www.instagram.com/harwestcoirs?utm_source=qr&srtk=NzZzYmVkOWhlOTJ4' },
    // TODO: replace with the real Facebook page link
    { label: 'Facebook', href: 'https://www.facebook.com/harwestcoirs' },
    { label: 'YouTube', href: 'https://youtube.com' },
  ],
};

export const NAV = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/products', label: 'Products' },
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Contact Us' },
];

export const STATS = [
  { value: '25+', label: 'Countries Served' },
  { value: '12,000', label: 'Tons Exported Yearly' },
  { value: '100%', label: 'Natural & Peat-Free' },
  { value: '15+ yrs', label: 'Coir Craftsmanship' },
];

export const CERTIFICATIONS = [
  {
    code: 'SA 8000',
    title: 'SA 8000 Certified',
    subtitle: 'Social Accountability Standard',
    desc: 'Fair labour practices, ethical employee welfare, and safe manufacturing conditions in all our facilities.',
    badgeColor: 'border-leaf-600 text-leaf-800 bg-leaf-50/70',
  },
  {
    code: 'MPS-ECAS',
    title: 'MPS ECAS Certified',
    subtitle: 'Horticultural Environmental Quality',
    desc: 'Strictly audited sustainable environmental standards for raw husk procurement and renewable water recycling.',
    badgeColor: 'border-leaf-700 text-leaf-900 bg-leaf-100/50',
  },
  {
    code: 'RHP',
    title: 'RHP Certified Grade',
    subtitle: 'European Substrates Benchmark',
    desc: 'Highest global standard ensuring stable EC, balanced pH, weed seed-free, and pathogen-free coco substrates.',
    badgeColor: 'border-shell-600 text-shell-900 bg-shell-50',
  },
  {
    code: 'ISO 9001',
    title: 'ISO 9001:2015',
    subtitle: 'Quality Management Systems',
    desc: 'Standardized batch monitoring, laboratory salt analysis, and traceability for worldwide container exports.',
    badgeColor: 'border-shell-700 text-shell-950 bg-shell-100/40',
  },
  {
    code: 'OMRI',
    title: 'OMRI Listed Organic',
    subtitle: 'Organic Materials Review Institute',
    desc: '100% natural, chemical-free coconut coir suitable for certified organic farming and commercial greenhouses.',
    badgeColor: 'border-leaf-600 text-leaf-800 bg-leaf-50',
  },
];

export const PRODUCT_CATEGORIES = [
  'Coir Pith',
  'Compressed Blocks',
  'Husk Chips',
  'Grow Slabs',
  'Grow Bags',
  'Hydroponics',
  'Coir Fibre',
  'Horticulture',
];

// Offline fallback only � the live catalogue comes from the database (editable in Admin).
export const PRODUCTS = [
  {
    id: 'coir-pith-blocks',
    name: 'Coir Pith 5kg Block & 650g Block',
    categories: ['Coir Pith', 'Compressed Blocks', 'Horticulture'],
    variants: ['5 kg Low EC Coir Pith Block', '5 kg High EC Coir Pith Block', '650 grams Block'],
    image: '/images/block.jpg',
    short: 'Compressed coir pith blocks in 5 kg and 650 g sizes, available in Low EC and High EC grades. Expands into a light, airy, water-retentive growing medium.',
    specs: { 'Available Sizes': '5 kg Block / 650 g Block', 'EC Grades': 'Low EC / High EC (5 kg)' },
  },
  {
    id: 'coco-husk-chips',
    name: 'Coco Husk Chips',
    categories: ['Husk Chips', 'Horticulture'],
    variants: ['Coco Husk Chips', 'Coco Husk Chips Mix'],
    image: '/images/chips.jpg',
    short: 'Evenly cut coconut husk chips giving superior drainage and aeration. Available as pure husk chips or as a chips mix blended with coir pith.',
    specs: { Types: 'Coco Husk Chips / Coco Husk Chips Mix' },
  },
  {
    id: 'coir-grow-slabs',
    name: 'Coir Grow Slabs',
    categories: ['Grow Slabs', 'Hydroponics'],
    variants: [],
    image: '/images/growbags.jpg',
    short: 'Ready-to-use coir grow slabs for soilless cultivation of tomatoes, cucumbers, peppers and berries.',
    specs: {},
  },
  {
    id: 'open-top-grow-bags',
    name: 'Open Top Grow Bags',
    categories: ['Grow Bags', 'Hydroponics'],
    variants: ['Open Top Grow Bag', 'Cocopeat Grow Bags', 'Slab Type'],
    image: '/images/growbags.jpg',
    short: 'Cocopeat-filled grow bags in open top and slab type formats for greenhouse and open-field crops.',
    specs: { Types: 'Open Top Grow Bag / Cocopeat Grow Bags / Slab Type' },
  },
  {
    id: 'coconut-fiber',
    name: 'Coconut Fiber',
    categories: ['Coir Fibre'],
    variants: [],
    image: '/images/factory.jpg',
    short: 'Natural coconut coir fibre extracted from mature husks, for horticulture and industrial use.',
    specs: {},
  },
];

export const PROCESS = [
  {
    title: 'Husk collection',
    text: 'Mature coconut husks ethically sourced directly from partner farms within the fertile Pollachi coastal belt.',
  },
  {
    title: 'Washing & buffering',
    text: 'Multi-stage fresh-water washing and optional calcium buffering to displace sodium and achieve export-grade low EC.',
  },
  {
    title: 'Sun drying',
    text: 'Open-air tropical sun drying on cement floors under tropical sun — clean, zero fuel emissions, zero contamination.',
  },
  {
    title: 'Sieving & compressing',
    text: 'Fine dust sieving, hydraulic high-pressure compression, strict moisture QC and heat-shrink palletisation.',
  },
];

export const VALUES = [
  {
    title: 'Peat-free & Eco-conscious',
    text: 'Harvested from renewable coconut husks, reducing reliance on ecologically fragile peat moss bogs.',
  },
  {
    title: 'Superior Water-Air Matrix',
    text: 'Holds up to 8× its weight in moisture while maintaining exceptional root porosity and aeration.',
  },
  {
    title: 'Rigorous Lab Verification',
    text: 'Every production batch is tested in-house and third-party certified for EC, pH, hydration, and pathogen purity.',
  },
];

export const TESTIMONIALS = [
  {
    quote:
      'Since switching to HarWest coir grow bags across our 12-hectare tomato greenhouses, our root development and yield uniformity have noticeably improved. Their washed low-EC grade is consistent container after container.',
    author: 'Graeme V. D.',
    role: 'Commercial Greenhouse Lead, Almería, Spain',
  },
  {
    quote:
      'The HarWest team never just ships an order; they act as a technical substrate partner. Exceptional expansion volume, zero weed seeds, and immaculate container pallet packaging.',
    author: 'Brian Chase',
    role: 'Substrate Distributor, North America',
  },
];

export const FAQ = [
  {
    q: 'What is coco coir, and why is it used as a premier growing medium?',
    a: 'Coco coir is a natural organic fibre and pith extracted from coconut husks. It is celebrated worldwide by commercial greenhouses and home gardeners because of its superior water retention (holding 7–8× its weight), excellent aeration, neutral pH, and biodegradable sustainability as a 100% peat-free growing medium.',
    category: 'General',
  },
  {
    q: 'How does HarWest ensure the quality and low-EC of its coco peat?',
    a: 'We operate our own multi-stage washing and filtration facilities in Pollachi. Every batch undergoes freshwater desalination to reduce natural electrical conductivity (EC < 0.5 mS/cm) and balanced pH testing before hydraulic compaction. We strictly verify compliance against RHP standards and provide batch test reports with every shipment.',
    category: 'Quality',
  },
  {
    q: 'What is the difference between washed, buffered, and unwashed coir?',
    a: 'Unwashed coir contains natural sea salts (high EC, suitable for civil engineering/erosion control). Washed coir is desalinated with fresh water to bring EC below 0.5 mS/cm (ideal for most horticultural crops). Buffered coir undergoes an additional calcium-nitrate treatment to displace potassium and sodium ions, ensuring optimal nutrient availability for sensitive crops like cannabis, berries, and hydroponic greens.',
    category: 'Technical',
  },
  {
    q: 'Are HarWest products suitable for home gardening and hydroponics?',
    a: 'Yes! Our 5kg blocks, easy-to-use coco disks, and custom coir grow bags are used universally in commercial hydroponics, soil conditioning, seedling nurseries, raised garden beds, indoor tropicals, and potted plants.',
    category: 'Usage',
  },
  {
    q: 'What is the Minimum Order Quantity (MOQ) and container shipping capacity?',
    a: 'Our standard export MOQ is one 20ft or 40ft High Cube container (approx. 24–26 metric tons for 5kg blocks). We also support consolidated sample pallets for trial evaluations. We export FOB, CIF, or CFR to major ports worldwide.',
    category: 'Export',
  },
  {
    q: 'Can HarWest customize dimensions, packaging, and private labelling?',
    a: 'Absolutely. We regularly produce custom-dimension grow slabs, personalized blend ratios (e.g. 70/30 coir pith to chips), custom pre-punched planting slits, and private-label full-colour sleeve printing with your brand logo.',
    category: 'Customization',
  },
];

export const DEFAULT_BLOGS = [
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
  },
  {
    slug: 'cannabis-coco-coir-what-makes-it-ideal-for-hydroponics',
    title: 'Cannabis & Hydroponic Coco Coir: What Makes It Ideal for High Yields?',
    category: 'Hydroponics',
    summary:
      'Hydroponic success starts with the right growing medium. Cannabis and high-value crops thrive in buffered coir due to its moisture retention, air porosity, and buffering capacity.',
    author: 'HarWest Technical Sales',
    publishedAt: '2026-10-08',
    readTime: '7 min read',
    coverImage: '/images/growbags.jpg',
    content: `Commercial licensed cannabis cultivators and modern hydroponic farmers have largely transitioned away from peat moss and rockwool to specialized coir matrices. Here is why:

### 1. Optimal 30% Air-Filled Porosity
Even when fully saturated with nutrient solution, high-grade coco coir maintains approximately 25–30% air-filled porosity. This oxygenates the rhizosphere, stimulating explosive root branching and vegetative biomass.

### 2. Complete Buffer Stability
Cannabis is a heavy consumer of calcium and magnesium. HarWest buffers its specialized hydroponic slabs with calcium nitrate, satisfying the cation exchange sites so all Cal-Mag in your nutrient feed reaches your plants.

### 3. Environmentally Sustainable & Reusable
Unlike rockwool—which cannot be composted and fills municipal landfills—coco coir is 100% natural and biodegradable. After harvest, slabs can be reconditioned or incorporated into field agriculture as a soil conditioner.`,
  },
];
