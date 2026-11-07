/**
 * The fixed HarWest product catalogue.
 * Products are NOT created/deleted from the admin panel any more — the admin can only
 * edit the details (description, photo, specs, categories, types) of these products.
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
    name: 'Coir Pith 5kg Block & 650g Block',
    slug: 'coir-pith-blocks',
    categories: ['Coir Pith', 'Compressed Blocks', 'Horticulture'],
    variants: ['5 kg Low EC Coir Pith Block', '5 kg High EC Coir Pith Block', '650 grams Block'],
    short:
      'Compressed coir pith blocks in 5 kg and 650 g sizes, available in Low EC and High EC grades. Expands into a light, airy, water-retentive growing medium.',
    image: '/images/block.jpg',
    specs: {
      'Available Sizes': '5 kg Block / 650 g Block',
      'EC Grades': 'Low EC / High EC (5 kg)',
    },
    order: 1,
    isActive: true,
  },
  {
    name: 'Coco Husk Chips',
    slug: 'coco-husk-chips',
    categories: ['Husk Chips', 'Horticulture'],
    variants: ['Coco Husk Chips', 'Coco Husk Chips Mix'],
    short:
      'Evenly cut coconut husk chips giving superior drainage and aeration. Available as pure husk chips or as a chips mix blended with coir pith.',
    image: '/images/chips.jpg',
    specs: {
      'Types': 'Coco Husk Chips / Coco Husk Chips Mix',
    },
    order: 2,
    isActive: true,
  },
  {
    name: 'Coir Grow Slabs',
    slug: 'coir-grow-slabs',
    categories: ['Grow Slabs', 'Hydroponics'],
    variants: [],
    short:
      'Ready-to-use coir grow slabs for soilless cultivation of tomatoes, cucumbers, peppers and berries.',
    image: '/images/growbags.jpg',
    specs: {},
    order: 3,
    isActive: true,
  },
  {
    name: 'Open Top Grow Bags',
    slug: 'open-top-grow-bags',
    categories: ['Grow Bags', 'Hydroponics'],
    variants: ['Open Top Grow Bag', 'Cocopeat Grow Bags', 'Slab Type'],
    short:
      'Cocopeat-filled grow bags in open top and slab type formats for greenhouse and open-field crops.',
    image: '/images/growbags.jpg',
    specs: {
      'Types': 'Open Top Grow Bag / Cocopeat Grow Bags / Slab Type',
    },
    order: 4,
    isActive: true,
  },
  {
    name: 'Coconut Fiber',
    slug: 'coconut-fiber',
    categories: ['Coir Fibre'],
    variants: [],
    short: 'Natural coconut coir fibre extracted from mature husks, for horticulture and industrial use.',
    image: '/images/factory.jpg',
    specs: {},
    order: 5,
    isActive: true,
  },
];

