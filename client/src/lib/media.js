/** Automatically applies Cloudinary automatic transformation flags (f_auto, q_auto:good, w_1920, c_limit) */
export function optimizeCloudinaryUrl(url) {
  if (!url || typeof url !== 'string') return url;
  if (!url.includes('res.cloudinary.com') || !url.includes('/upload/')) return url;
  if (url.includes('f_auto') || url.includes('q_auto')) return url;
  return url.replace('/upload/', '/upload/f_auto,q_auto:good,w_1920,c_limit/');
}
