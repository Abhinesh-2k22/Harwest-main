import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { v2 as cloudinary } from 'cloudinary';
import mongoose from 'mongoose';
import { config } from '../config.js';
import { Media, Product, Blog } from '../models.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CLIENT_IMAGES_DIR = path.resolve(__dirname, '../../../client/public/images');
const ASSETS_FILE = path.resolve(__dirname, '../../../client/src/config/assets.js');

const ASSET_MAPPINGS = [
  { file: 'logo.png', key: 'branding.logo', publicId: 'logo' },
  { file: 'hero.jpg', key: 'hero.image', publicId: 'hero' },
  { file: 'block.jpg', key: 'products.block', publicId: 'block', productSlug: 'cocopeat-5kg-block', blogSlug: 'what-to-check-before-buying-coco-peat-block-for-sale' },
  { file: 'growbags.jpg', key: 'products.growbag', publicId: 'growbags', productSlug: 'hydroponic-coir-grow-bags' },
  { file: 'chips.jpg', key: 'products.chips', publicId: 'chips', productSlug: 'coco-husk-chips-briquettes' },
  { file: 'factory.jpg', key: 'about.factory', publicId: 'factory', blogSlug: 'how-to-identify-high-quality-coco-coir-before-buying' },
  { file: 'seedling.jpg', key: 'about.seedling', publicId: 'seedling', blogSlug: 'what-is-multiple-washed-coco-coir-and-why-does-it-matter' },
];

async function sync() {
  const cloudUrl = process.env.CLOUDINARY_URL || config.cloudinary.url;
  const hasDirectCreds = config.cloudinary.cloudName && config.cloudinary.apiKey && config.cloudinary.apiSecret;

  if (!hasDirectCreds && (!cloudUrl || cloudUrl.includes('<') || cloudUrl.startsWith('PASTE_'))) {
    console.error('\n❌ Cloudinary credentials missing or incomplete in server/.env.');
    console.error('👉 Please paste your real API Key and API Secret in server/.env:');
    console.error('CLOUDINARY_URL=cloudinary://<your_api_key>:<your_api_secret>@yi8e4nqo\n');
    process.exit(1);
  }

  if (cloudUrl && !hasDirectCreds) {
    process.env.CLOUDINARY_URL = cloudUrl;
    cloudinary.config(true);
  } else {
    cloudinary.config({
      cloud_name: config.cloudinary.cloudName,
      api_key: config.cloudinary.apiKey,
      api_secret: config.cloudinary.apiSecret,
    });
  }

  console.log('☁️  Uploading local images to Cloudinary (folder: harwest)...');
  const uploadedUrls = {};

  for (const item of ASSET_MAPPINGS) {
    const localPath = path.join(CLIENT_IMAGES_DIR, item.file);
    if (!fs.existsSync(localPath)) {
      console.warn(`⚠️  File not found: ${localPath}`);
      continue;
    }

    try {
      const res = await cloudinary.uploader.upload(localPath, {
        folder: 'harwest',
        public_id: item.publicId,
        overwrite: true,
        resource_type: 'image',
      });
      uploadedUrls[item.key] = res.secure_url;
      console.log(`✅ Uploaded ${item.file} -> ${res.secure_url}`);
    } catch (err) {
      console.error(`❌ Failed to upload ${item.file}:`, err.message);
    }
  }

  // Update client/src/config/assets.js default URLs
  if (fs.existsSync(ASSETS_FILE)) {
    let assetsContent = fs.readFileSync(ASSETS_FILE, 'utf8');
    for (const item of ASSET_MAPPINGS) {
      if (uploadedUrls[item.key]) {
        const regex = new RegExp(`'${item.key}':\\s*\\{[^}]*url:\\s*['"][^'"]*['"]`, 'g');
        assetsContent = assetsContent.replace(regex, (match) => {
          return match.replace(/url:\s*['"][^'"]*['"]/, `url: '${uploadedUrls[item.key]}'`);
        });
      }
    }
    fs.writeFileSync(ASSETS_FILE, assetsContent, 'utf8');
    console.log('📄 Updated client/src/config/assets.js with Cloudinary URLs as defaults.');
  }

  // Update MongoDB collections if database is available
  if (config.mongoUri) {
    try {
      await mongoose.connect(config.mongoUri);
      console.log('🌱 Connected to MongoDB to persist Cloudinary references...');

      // Save Media key overrides (product photos are managed in the Products tab instead)
      const mediaEntries = Object.entries(uploadedUrls).filter(([key]) => !key.startsWith('products.'));
      for (const [key, url] of mediaEntries) {
        await Media.findOneAndUpdate({ key }, { url }, { upsert: true });
      }
      await Media.deleteMany({ key: /^products\./ });
      console.log(`✅ Synced ${mediaEntries.length} media keys in MongoDB.`);

      // Update Products
      for (const item of ASSET_MAPPINGS) {
        if (item.productSlug && uploadedUrls[item.key]) {
          await Product.updateOne({ slug: item.productSlug }, { image: uploadedUrls[item.key] });
        }
      }

      // Update Blogs
      for (const item of ASSET_MAPPINGS) {
        if (item.blogSlug && uploadedUrls[item.key]) {
          await Blog.updateOne({ slug: item.blogSlug }, { coverImage: uploadedUrls[item.key] });
        }
      }

      console.log('✅ Updated Product and Blog image links in MongoDB.');
      await mongoose.disconnect();
    } catch (dbErr) {
      console.warn('⚠️  Could not connect to MongoDB:', dbErr.message);
      console.log('   (Media URLs were updated in client/src/config/assets.js)');
    }
  }

  console.log('\n🎉 All photos are now referenced directly from Cloudinary CDN!');
}

sync().catch((err) => {
  console.error('Fatal sync error:', err);
  process.exit(1);
});
