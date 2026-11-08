/** Automatically applies Cloudinary automatic transformation flags */
export function optimizeCloudinaryUrl(url) {
  if (!url || typeof url !== 'string') return url;
  if (!url.includes('res.cloudinary.com') || !url.includes('/upload/')) return url;
  if (url.includes('f_auto') || url.includes('q_auto') || url.includes('f_mp4') || url.includes('vc_auto')) return url;

  const isVideo = url.includes('/video/upload/') || /\.(mp4|webm|mov)$/i.test(url);
  if (isVideo) {
    // Deliver universal H.264 MP4 stream so native HTML5 <video> elements always play seamlessly
    return url.replace('/upload/', '/upload/f_mp4,vc_auto,q_auto:good,w_1920,c_limit/');
  }
  return url.replace('/upload/', '/upload/f_auto,q_auto:good,w_1920,c_limit/');
}
