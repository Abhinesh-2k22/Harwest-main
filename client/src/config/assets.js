/**
 * SINGLE SOURCE OF TRUTH for every image / video / document URL on the site.
 *
 * - Keys are "group.name". Components call useAsset('group.name') — never a raw URL.
 * - Values here are the DEFAULTS. The admin dashboard (/admin) can override any key;
 *   overrides are stored in MongoDB and merged over these defaults at runtime.
 * - `label` + `type` are used by the admin dashboard to render the editor.
 *
 * Paths starting with "/" live in client/public. Swap to full https:// URLs any time.
 */
export const ASSET_DEFAULTS = {
  // BRANDING
  'branding.logo': { url: 'https://res.cloudinary.com/yi8e4nqo/image/upload/v1793173304/harwest/logo.jpg', type: 'image', label: 'HarWest official logo' },

  // HOME HERO
  'hero.image': { url: 'https://res.cloudinary.com/yi8e4nqo/image/upload/v1793173306/harwest/hero.jpg', type: 'image', label: 'Home hero background image' },
  'hero.video': { url: '', type: 'video', label: 'Home hero background video (optional, mp4/webm)' },

  // ABOUT US TAB
  'about.factory': { url: 'https://res.cloudinary.com/yi8e4nqo/image/upload/v1793173313/harwest/factory.jpg', type: 'image', label: 'About page header image' },
  'about.video': { url: '', type: 'video', label: 'About page header video (optional, mp4/webm)' },
  'about.seedling': { url: 'https://res.cloudinary.com/yi8e4nqo/image/upload/v1793173314/harwest/seedling.jpg', type: 'image', label: 'Sustainability / seedling photo' },

  // PRODUCTS TAB
  'products.image': { url: 'https://res.cloudinary.com/yi8e4nqo/image/upload/v1793173313/harwest/factory.jpg', type: 'image', label: 'Products page header image' },
  'products.video': { url: '', type: 'video', label: 'Products page header video (optional, mp4/webm)' },

  // BLOG TAB
  'blog.image': { url: 'https://res.cloudinary.com/yi8e4nqo/image/upload/v1793173306/harwest/hero.jpg', type: 'image', label: 'Blog page header image' },
  'blog.video': { url: '', type: 'video', label: 'Blog page header video (optional, mp4/webm)' },

  // CONTACT TAB
  'contact.image': { url: 'https://res.cloudinary.com/yi8e4nqo/image/upload/v1793173306/harwest/hero.jpg', type: 'image', label: 'Contact page header image' },
  'contact.video': { url: '', type: 'video', label: 'Contact page header video (optional, mp4/webm)' },

  // FEATURED FACILITY VIDEO
  'media.factoryTour': {
    url: 'https://res.cloudinary.com/demo/video/upload/f_auto,q_auto/samples/cld-sample-video.mp4',
    type: 'video',
    label: 'Home factory tour video (1920 × 1080, mp4/webm)',
    size: [1920, 1080],
  },
};

export const ASSET_GROUPS = {
  branding: 'Branding & Identity',
  hero: 'Home Tab',
  about: 'About Us Tab',
  products: 'Products Tab',
  blog: 'Blog Tab',
  contact: 'Contact Tab',
  media: 'Featured Videos',
};
