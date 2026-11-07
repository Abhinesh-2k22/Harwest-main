import 'dotenv/config';

const isProd = process.env.NODE_ENV === 'production';

// In production, enforce strict secrets; in dev, warn gracefully if missing
if (isProd) {
  const required = ['MONGODB_URI', 'JWT_SECRET', 'CLIENT_ORIGIN'];
  for (const key of required) {
    const v = process.env[key];
    if (!v || v.startsWith('PASTE_')) {
      console.error(`\n[config] Missing ${key}. Set this environment variable in production.\n`);
      process.exit(1);
    }
  }
}

export const config = {
  port: Number(process.env.PORT) || 5000,
  isProd,
  clientOrigin: process.env.CLIENT_ORIGIN ? process.env.CLIENT_ORIGIN.replace(/\/$/, '') : 'http://localhost:5173',
  mongoUri: process.env.MONGODB_URI && !process.env.MONGODB_URI.startsWith('PASTE_') ? process.env.MONGODB_URI : '',
  jwtSecret: process.env.JWT_SECRET && !process.env.JWT_SECRET.startsWith('PASTE_')
    ? process.env.JWT_SECRET
    : 'dev_secret_harwest_coir_at_least_32_characters_long_for_security',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h',
  maxUploadMb: Number(process.env.MAX_UPLOAD_MB) || 50,
  trashTimerSeconds: Number(process.env.TRASH_TIMER_SECONDS) || 30,
  cookieName: 'hw_admin',
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME && !process.env.CLOUDINARY_CLOUD_NAME.startsWith('PASTE_') ? process.env.CLOUDINARY_CLOUD_NAME : '',
    apiKey: process.env.CLOUDINARY_API_KEY && !process.env.CLOUDINARY_API_KEY.startsWith('PASTE_') ? process.env.CLOUDINARY_API_KEY : '',
    apiSecret: process.env.CLOUDINARY_API_SECRET && !process.env.CLOUDINARY_API_SECRET.startsWith('PASTE_') ? process.env.CLOUDINARY_API_SECRET : '',
    url: process.env.CLOUDINARY_URL && !process.env.CLOUDINARY_URL.includes('<') && !process.env.CLOUDINARY_URL.startsWith('PASTE_') ? process.env.CLOUDINARY_URL : '',
  },
};
