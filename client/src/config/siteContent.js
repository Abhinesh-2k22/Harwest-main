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
  { to: '/infrastructure', label: 'Infrastructure' },
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
    slug: 'coir-pith-blocks',
    name: 'Coir Pith 5kg Block',
    categories: ['Coir Pith', 'Compressed Blocks', 'Horticulture'],
    variants: ['5 kg Low EC Coir Pith Block', '5 kg High EC Coir Pith Block'],
    variantDetails: [
      {
        name: '5 kg Low EC Coir Pith Block',
        badge: 'Washed · Low EC < 0.6 mS/cm',
        short:
          'Freshwater-washed 5 kg coco peat block processed to bring Electrical Conductivity below 0.6 mS/cm. Engineered for nursery propagation, potting mixes, greenhouse crops and hydroponic growing.',
        image: '/images/block.jpg',
        specs: {
          'Expansion Volume': '16 L/kg (≈ 80 L per 5 kg block)',
          'Moisture Content': '10 – 15%',
          'Fibre Content': 'Below 2%',
          'Electrical Conductivity (EC)': 'Less than 0.6 mS/cm (Washed)',
          'pH Range': '5.5 – 6.5',
          'Block Dimensions': '30 × 30 × 10 cm, 5 kg',
          'Sieve Options': '6 mm / 8 mm / Unsieved',
          'Compression Ratio': '5:1',
          'Packing Type': 'Loose stuffing / Palletised',
          'Container Loading': '5,000 blocks per 40 ft container, about 24 MT',
        },
      },
      {
        name: '5 kg High EC Coir Pith Block',
        badge: 'Unwashed · High EC',
        short:
          'Natural unwashed 5 kg coco peat block pressed from screened coir pith at 5:1. Ideal for open-field horticulture, agriculture, soil conditioning, lawn and landscape work where ultra-low EC is less critical.',
        image: '/images/seedling.jpg',
        specs: {
          'Expansion Volume': '14 L/kg (≈ 70 L per 5 kg block)',
          'Moisture Content': '10 – 15%',
          'Fibre Content': 'Below 2%',
          'Electrical Conductivity (EC)': 'Unwashed (Natural EC)',
          'pH Range': '5.5 – 6.5',
          'Block Dimensions': '30 × 30 × 10 cm, 5 kg',
          'Sieve Options': '6 mm / 8 mm / Unsieved',
          'Compression Ratio': '5:1',
          'Packing Type': 'Loose stuffing / Palletised',
          'Container Loading': '5,000 blocks per 40 ft container, about 24 MT',
        },
      },
    ],
    image: '/images/block.jpg',
    short:
      '5 kg compressed coco peat blocks manufactured in Pollachi, Tamil Nadu — pressed from screened coir pith at 5:1 in Washed Low EC and Unwashed High EC specifications.',
    specs: {
      'Expansion Volume': '16 L/kg (Low EC ≈ 80 L) · 14 L/kg (High EC ≈ 70 L)',
      'Moisture Content': '10 – 15%',
      'Fibre Content': 'Below 2%',
      'Electrical Conductivity (EC)': 'Low EC < 0.6 mS/cm · High EC Unwashed',
      'pH Range': '5.5 – 6.5',
      'Block Dimensions': '30 × 30 × 10 cm, 5 kg',
      'Sieve Options': '6 mm / 8 mm / Unsieved',
      'Compression Ratio': '5:1',
      'Packing Type': 'Loose stuffing / Palletised',
      'Container Loading': '5,000 blocks per 40 ft container, about 24 MT',
    },
  },
  {
    id: 'coco-husk-chips',
    slug: 'coco-husk-chips',
    name: 'Coco Husk Chips',
    categories: ['Husk Chips', 'Horticulture'],
    variants: ['Coco Husk Chips', 'Coco Husk Chips Mix'],
    variantDetails: [
      {
        name: 'Coco Husk Chips',
        badge: '100% Pure Cut Husk Cubes',
        short:
          'Uniformly cut coconut husk cubes providing superior root aeration, rapid drainage and long-lasting structure for orchids, anthuriums, bromeliads and tropical ornamentals.',
        image: '/images/chips.jpg',
        specs: {
          'Chip Cut Size': 'Small (4–8 mm) / Medium (8–14 mm) / Large (12–20 mm)',
          'Expansion Volume': '12 – 14 L/kg',
          'Electrical Conductivity (EC)': '< 0.5 mS/cm (Washed) or Unwashed',
          'pH Range': '5.5 – 6.5',
          'Moisture Content': '10 – 15%',
          'Compression Ratio': '5:1 (5 kg Block or Briquette)',
          'Ideal Crop Use': 'Orchids, Anthuriums, Aroids & Mulching',
        },
      },
      {
        name: 'Coco Husk Chips Mix',
        badge: 'Coir Pith + Husk Chips Blend',
        short:
          'Custom-engineered blend of screened coco peat and crushed husk chips balancing high water retention with 30%+ air-filled porosity for berry crops and container nurseries.',
        image: '/images/block.jpg',
        specs: {
          'Standard Blend Ratios': '70:30 / 60:40 / 50:50 (Pith : Chips)',
          'Expansion Volume': '14 – 15 L/kg',
          'Electrical Conductivity (EC)': '< 0.5 mS/cm (Washed / Buffered)',
          'pH Range': '5.5 – 6.5',
          'Moisture Content': '10 – 15%',
          'Ideal Crop Use': 'Blueberries, Raspberries, Strawberries & Hydroponic Pots',
        },
      },
    ],
    image: '/images/chips.jpg',
    short: 'Evenly cut coconut husk chips giving superior drainage and aeration. Available as pure husk chips or as a custom chips mix blended with coir pith.',
    specs: {
      'Available Types': 'Coco Husk Chips / Coco Husk Chips Mix',
      'Chip Grades': '4–8 mm / 8–14 mm / 12–20 mm',
      'pH Range': '5.5 – 6.5',
      'Moisture Content': '10 – 15%',
    },
  },
  {
    id: 'coir-grow-slabs',
    slug: 'coir-grow-slabs',
    name: 'Coir Grow Slabs',
    categories: ['Grow Slabs', 'Hydroponics'],
    variants: ['Coir Grow Slabs'],
    variantDetails: [
      {
        name: 'Coir Grow Slabs',
        badge: 'UV-Stabilised Hydroponic Slab',
        short:
          'Ready-to-use UV-stabilised co-extruded grow slabs engineered with precision coco peat & husk chip matrices for commercial greenhouse tomatoes, cucumbers, peppers and strawberries.',
        image: '/images/growbags.jpg',
        specs: {
          'Standard Dimensions': '100 × 15 × 8 cm / 100 × 15 × 10 cm / 100 × 20 × 10 cm',
          'Substrate Matrix': '100% Coir Pith or 70:30 Pith + Crush Chips',
          'Electrical Conductivity (EC)': '< 0.5 mS/cm (Washed / Calcium Buffered)',
          'pH Range': '5.5 – 6.5',
          'Outer Sleeve': 'Black/White Co-extruded UV-stabilised polyethylene (3-year life)',
          'Customisation': 'Pre-cut plant holes, dripper holes & drainage slits',
        },
      },
    ],
    image: '/images/growbags.jpg',
    short: 'Ready-to-use coir grow slabs for soilless cultivation of tomatoes, cucumbers, peppers and berries in commercial greenhouses.',
    specs: {
      'Standard Dimensions': '100 × 15 × 10 cm / 100 × 20 × 10 cm',
      'Electrical Conductivity (EC)': '< 0.5 mS/cm (Washed / Buffered)',
      'pH Range': '5.5 – 6.5',
      'Outer Sleeve': 'UV-stabilised black/white co-extruded film',
    },
  },
  {
    id: 'open-top-grow-bags',
    slug: 'open-top-grow-bags',
    name: 'Open Top Grow Bags',
    categories: ['Grow Bags', 'Hydroponics'],
    variants: ['Open Top Grow Bag', 'Cocopeat Grow Bags', 'Slab Type'],
    variantDetails: [
      {
        name: 'Open Top Grow Bag',
        badge: 'Self-Standing Open Top Container',
        short:
          'Self-standing UV-stabilised open top poly bag pre-filled with a compressed block of washed coco peat and husk chips. Simply add water to expand into an instant root zone pot for blueberries, raspberries and ginger.',
        image: '/images/growbags.jpg',
        specs: {
          'Expanded Volume': '10 L / 15 L / 20 L / 25 L / 30 L / 40 L',
          'Substrate Blend': '50:50 or 60:40 Pith & Husk Chips (Customisable)',
          'Electrical Conductivity (EC)': '< 0.5 mS/cm (Washed)',
          'pH Range': '5.5 – 6.5',
          'Drainage': 'Pre-punched bottom and side drainage holes',
          'Target Crops': 'Blueberries, Raspberries, Blackberries, Cannabis & Ginger',
        },
      },
      {
        name: 'Cocopeat Grow Bags',
        badge: 'Greenhouse Multi-Crop Bag',
        short:
          'High-yield cocopeat grow bags formulated with triple-washed low-EC coir pith for uniform water distribution, rapid root colonisation and high fruit set.',
        image: '/images/seedling.jpg',
        specs: {
          'Standard Sizes': '100 × 18 × 10 cm / 100 × 20 × 12 cm',
          'Substrate Matrix': '80% Washed Coir Pith + 20% Crush Chips',
          'Electrical Conductivity (EC)': '< 0.5 mS/cm',
          'pH Range': '5.5 – 6.5',
          'Target Crops': 'Tomatoes, Bell Peppers, Aubergines & Cucumbers',
        },
      },
      {
        name: 'Slab Type',
        badge: 'Horizontal Channel Grow Slab',
        short:
          'Horizontal trough and gutter-ready slab type grow bags designed for high-density hydroponic rows with precision drainage control.',
        image: '/images/block.jpg',
        specs: {
          'Dimensions': '100 × 15 × 10 cm / 100 × 20 × 10 cm',
          'Compression': '5:1 compressed dry slab for maximum container loading',
          'Electrical Conductivity (EC)': '< 0.5 mS/cm',
          'pH Range': '5.5 – 6.5',
          'Target Crops': 'Strawberries, Leafy Greens & Cut Flowers',
        },
      },
    ],
    image: '/images/growbags.jpg',
    short: 'Cocopeat-filled grow bags in open top, multi-crop and slab type formats for commercial greenhouse and open-field berry and vegetable growers.',
    specs: {
      'Available Formats': 'Open Top Grow Bag / Cocopeat Grow Bags / Slab Type',
      'Electrical Conductivity (EC)': '< 0.5 mS/cm (Washed)',
      'pH Range': '5.5 – 6.5',
    },
  },
  {
    id: 'coconut-fiber',
    slug: 'coconut-fiber',
    name: 'Coconut Fiber',
    categories: ['Coir Fibre'],
    variants: ['Natural Brown Coir Fiber', 'White Bristle & Mattress Fiber'],
    variantDetails: [
      {
        name: 'Natural Brown Coir Fiber',
        badge: 'Mature Husk Extraction',
        short:
          'High-tensile natural brown coconut fibre extracted from matured Pollachi coconut husks. Cleaned, dried and hydraulically baled for erosion control blankets, geotextiles, horticultural basket liners and mattress manufacturing.',
        image: '/images/factory.jpg',
        specs: {
          'Fibre Length': '10 – 25 cm (Long & Medium grades)',
          'Moisture Content': '< 15%',
          'Impurities / Pith Dust': '< 3%',
          'Bale Weight': '110 – 125 kg hydraulically strapped bales',
          'Container Load': '20 – 22 MT per 40 ft HC container',
        },
      },
      {
        name: 'White Bristle & Mattress Fiber',
        badge: 'Horticultural & Industrial Grade',
        short:
          'Resilient, rot-resistant coconut fibre suited for coir twine, geo-rolls, mulching mats, pot toppers and soil aeration mixes.',
        image: '/images/hero.jpg',
        specs: {
          'Fibre Length': '8 – 20 cm',
          'Moisture Content': '< 15%',
          'Packing': 'Compressed hydraulic bales with rust-free strapping',
          'Applications': 'Mulch mats, Orchid totem poles, Geotextiles & Curled Rope',
        },
      },
    ],
    image: '/images/factory.jpg',
    short: 'Natural coconut coir fibre extracted from mature husks in Pollachi, cleaned and hydraulically baled for horticulture, geotextiles and industrial applications.',
    specs: {
      'Fibre Length': '10 – 25 cm',
      'Moisture Content': '< 15%',
      'Impurities': '< 3%',
      'Packing': '110 – 125 kg hydraulic bales (~21 MT / 40ft HC)',
    },
  },
];

export const INFRASTRUCTURE_CATEGORIES = [
  'Main Exterior',
  'Raw Coconuts',
  'Fibre Extraction',
  'Pith Extraction',
  'Washing Bed',
  'Drying Yard',
  'Machinery',
  'Compression',
  'Warehouse',
  'Packing & Dispatch',
];

export const DEFAULT_INFRASTRUCTURE = [
  {
    id: 'infra-1',
    title: 'The Main Factory Building',
    category: 'Main Exterior',
    description: 'Our primary coir processing and export manufacturing unit in Pollachi, Tamil Nadu.',
    mediaUrl: '/images/factory.jpg',
    mediaType: 'image',
    order: 1,
    isActive: true,
  },
  {
    id: 'infra-2',
    title: 'Raw Coconut Husk Stocked in Bulk',
    category: 'Raw Coconuts',
    description: 'Freshly harvested coconut husks arriving from partner plantations across the Pollachi coconut belt.',
    mediaUrl: '/images/hero.jpg',
    mediaType: 'image',
    order: 2,
    isActive: true,
  },
  {
    id: 'infra-3',
    title: 'Fibre & Pith Extraction Line',
    category: 'Pith Extraction',
    description: 'Automated decortication separating long coir fibres and discharging clean pith onto the conditioning heap.',
    mediaUrl: '/images/chips.jpg',
    mediaType: 'image',
    order: 3,
    isActive: true,
  },
  {
    id: 'infra-4',
    title: 'Dedicated Freshwater Washing Bed',
    category: 'Washing Bed',
    description: 'In-house multi-stage washing bed where pith is flushed with clean water to bring EC below 0.6 mS/cm.',
    mediaUrl: '/images/seedling.jpg',
    mediaType: 'image',
    order: 4,
    isActive: true,
  },
  {
    id: 'infra-5',
    title: 'Open-Air Cement Drying Yard',
    category: 'Drying Yard',
    description: 'Zero-contamination solar drying yards bringing moisture content down to 10–15% naturally.',
    mediaUrl: '/images/hero.jpg',
    mediaType: 'image',
    order: 5,
    isActive: true,
  },
  {
    id: 'infra-6',
    title: 'Screening Line & Hydraulic Block Press',
    category: 'Compression',
    description: '6 mm / 8 mm rotary screening conveyors feeding high-pressure 5:1 hydraulic 5 kg block presses.',
    mediaUrl: '/images/block.jpg',
    mediaType: 'image',
    order: 6,
    isActive: true,
  },
  {
    id: 'infra-7',
    title: 'Finished-Product Warehouse & Dispatch',
    category: 'Packing & Dispatch',
    description: 'Covered moisture-safe warehousing, palletising and 40 ft HC container truck loading bay.',
    mediaUrl: '/images/growbags.jpg',
    mediaType: 'image',
    order: 7,
    isActive: true,
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
