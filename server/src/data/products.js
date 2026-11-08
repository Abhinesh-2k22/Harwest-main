/**
 * The fixed HarWest product catalogue.
 * Products are NOT created/deleted from the admin panel — the admin can only
 * edit the details (description, photo, specs, categories, types & per-type photos/details) of these products.
 * Run `npm run seed:products` in /server to reset the database to this list.
 */
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

export const CATALOGUE = [
  {
    name: 'Coir Pith 5kg Block',
    slug: 'coir-pith-blocks',
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
    short:
      '5 kg compressed coco peat blocks manufactured in Pollachi, Tamil Nadu — pressed from screened coir pith at 5:1 in Washed Low EC and Unwashed High EC specifications.',
    image: '/images/block.jpg',
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
    order: 1,
    isActive: true,
  },
  {
    name: 'Coco Husk Chips',
    slug: 'coco-husk-chips',
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
    short:
      'Evenly cut coconut husk chips giving superior drainage and aeration. Available as pure husk chips or as a custom chips mix blended with coir pith.',
    image: '/images/chips.jpg',
    specs: {
      'Available Types': 'Coco Husk Chips / Coco Husk Chips Mix',
      'Chip Grades': '4–8 mm / 8–14 mm / 12–20 mm',
      'pH Range': '5.5 – 6.5',
      'Moisture Content': '10 – 15%',
    },
    order: 2,
    isActive: true,
  },
  {
    name: 'Coir Naked Slabs',
    slug: 'coir-grow-slabs',
    categories: ['Grow Slabs', 'Hydroponics'],
    variants: ['Coir Naked Slabs'],
    variantDetails: [
      {
        name: 'Coir Naked Slabs',
        badge: 'Compressed Hydroponic Naked Slab',
        short:
          'Ready-to-expand compressed coir naked slabs engineered with precision coco peat & husk chip matrices for commercial greenhouse troughs, grow channels, tomatoes, cucumbers, peppers and strawberries.',
        image: '/images/growbags.jpg',
        specs: {
          'Standard Dimensions': '100 × 15 × 8 cm / 100 × 15 × 10 cm / 100 × 20 × 10 cm',
          'Substrate Matrix': '100% Coir Pith or 70:30 Pith + Crush Chips',
          'Electrical Conductivity (EC)': '< 0.5 mS/cm (Washed / Calcium Buffered)',
          'pH Range': '5.5 – 6.5',
          'Format': 'Compressed naked slab (for troughs, gutters or custom poly sleeves)',
          'Compression Ratio': '5:1',
        },
      },
    ],
    short:
      'Compressed coir naked slabs for soilless cultivation of tomatoes, cucumbers, peppers and berries in commercial greenhouse troughs and hydroponic channels.',
    image: '/images/growbags.jpg',
    specs: {
      'Standard Dimensions': '100 × 15 × 10 cm / 100 × 20 × 10 cm',
      'Electrical Conductivity (EC)': '< 0.5 mS/cm (Washed / Buffered)',
      'pH Range': '5.5 – 6.5',
      'Format': 'Compressed Naked Coir Slab',
    },
    order: 3,
    isActive: true,
  },
  {
    name: 'Open Top Grow Bags',
    slug: 'open-top-grow-bags',
    categories: ['Grow Bags', 'Hydroponics'],
    variants: ['Open Top Grow Bag'],
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
    ],
    short:
      'Self-standing UV-stabilised open top grow bags pre-filled with washed coco peat and husk chips for commercial greenhouse and open-field berry and vegetable growers.',
    image: '/images/growbags.jpg',
    specs: {
      'Expanded Volume': '10 L / 15 L / 20 L / 25 L / 30 L / 40 L',
      'Electrical Conductivity (EC)': '< 0.5 mS/cm (Washed)',
      'pH Range': '5.5 – 6.5',
    },
    order: 4,
    isActive: true,
  },
  {
    name: 'Coconut Fiber',
    slug: 'coconut-fiber',
    categories: ['Coir Fibre'],
    variants: ['Natural Brown Coir Fiber'],
    variantDetails: [
      {
        name: 'Natural Brown Coir Fiber',
        badge: 'Mature Husk Extraction',
        short:
          'High-tensile natural brown coconut fibre extracted from matured Pollachi coconut husks. Cleaned, dried and hydraulically baled for erosion control blankets, geotextiles, horticultural basket liners and industrial applications.',
        image: '/images/factory.jpg',
        specs: {
          'Fibre Length': '10 – 25 cm (Long & Medium grades)',
          'Moisture Content': '< 15%',
          'Impurities / Pith Dust': '< 3%',
          'Bale Weight': '110 – 125 kg hydraulically strapped bales',
          'Container Load': '20 – 22 MT per 40 ft HC container',
        },
      },
    ],
    short:
      'Natural coconut coir fibre extracted from mature husks in Pollachi, cleaned and hydraulically baled for horticulture, geotextiles and industrial applications.',
    image: '/images/factory.jpg',
    specs: {
      'Fibre Length': '10 – 25 cm',
      'Moisture Content': '< 15%',
      'Impurities': '< 3%',
      'Packing': '110 – 125 kg hydraulic bales (~21 MT / 40ft HC)',
    },
    order: 5,
    isActive: true,
  },
];
