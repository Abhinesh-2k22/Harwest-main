import fs from 'node:fs';
import path from 'node:path';
import { v2 as cloudinary } from 'cloudinary';
import { Media, Product, Blog, PendingDeletion } from '../models.js';
import { UPLOAD_DIR } from '../middleware/upload.js';
import { config } from '../config.js';

// Ensure Cloudinary is configured if credentials exist in config
if (config.cloudinary.url) {
  process.env.CLOUDINARY_URL = config.cloudinary.url;
  cloudinary.config(true);
} else if (config.cloudinary.cloudName && config.cloudinary.apiKey) {
  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
  });
}

/** How long a replaced image/video is kept before being permanently deleted (in milliseconds) */
export const getDeleteDelayMs = () => (config.trashTimerSeconds || 30) * 1000;

// Sweep interval: checks every 5 seconds for fast testing
const SWEEP_EVERY_MS = 5 * 1000;

const LOCAL_RE = /^\/uploads\/([a-f0-9]{32}\.(jpg|png|webp|mp4|webm))$/;

// Matches Cloudinary upload URLs for files uploaded through admin (folder: harwest_uploads)
// The built-in static defaults live in the "harwest/" folder and are never auto-deleted.
const CLOUD_RE = /^https:\/\/res\.cloudinary\.com\/[^/]+\/(image|video)\/upload\/(?:[^/]+\/)*?(?:v\d+\/)?(harwest_uploads\/[^?#]+?)(?:\.[a-z0-9]+)?(?:[?#].*)?$/i;

/** True if we own this URL and are allowed to delete it. */
function isManaged(url) {
  return typeof url === 'string' && (LOCAL_RE.test(url) || CLOUD_RE.test(url));
}

/** Is this URL still used anywhere (media override, product, blog)? */
async function isInUse(url) {
  const [m, p, b] = await Promise.all([
    Media.exists({ url }),
    Product.exists({ image: url }),
    Blog.exists({ coverImage: url }),
  ]);
  return Boolean(m || p || b);
}

/** Schedule `oldUrl` for deletion after TRASH_TIMER_SECONDS (no-op if unmanaged, unchanged or still used). */
export async function scheduleDeletion(oldUrl, newUrl) {
  try {
    if (!oldUrl || oldUrl === newUrl || !isManaged(oldUrl)) return;
    if (await isInUse(oldUrl)) return;

    const delayMs = getDeleteDelayMs();
    const deleteAt = new Date(Date.now() + delayMs);

    await PendingDeletion.findOneAndUpdate(
      { url: oldUrl },
      { url: oldUrl, deleteAt },
      { upsert: true }
    );
    console.log(`[cleanup] Scheduled ${oldUrl} for deletion in ${delayMs / 1000}s (at ${deleteAt.toISOString()})`);
  } catch (err) {
    console.error('[cleanup] Schedule failed:', err.message);
  }
}

/** If a URL is (re)used again, cancel its pending deletion. */
export async function cancelDeletion(url) {
  try {
    if (url) await PendingDeletion.deleteOne({ url });
  } catch {
    /* ignore */
  }
}

async function destroy(url) {
  const local = LOCAL_RE.exec(url);
  if (local) {
    try {
      fs.unlinkSync(path.join(UPLOAD_DIR, local[1]));
      console.log(`[cleanup] Local file removed: ${local[1]}`);
    } catch {}
    return;
  }
  const cloud = CLOUD_RE.exec(url);
  if (cloud) {
    const resourceType = cloud[1].toLowerCase();
    const publicId = cloud[2];
    console.log(`[cleanup] Destroying from Cloudinary: ${publicId} (type: ${resourceType})`);
    const res = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
      invalidate: true,
    });
    console.log(`[cleanup] Cloudinary destroy response for ${publicId}:`, res);
  }
}

async function sweep() {
  try {
    const due = await PendingDeletion.find({ deleteAt: { $lte: new Date() } }).lean();
    for (const item of due) {
      if (await isInUse(item.url)) {
        await PendingDeletion.deleteOne({ _id: item._id });
        console.log(`[cleanup] Cancelled deletion for ${item.url} because it is in use`);
        continue;
      }
      try {
        await destroy(item.url);
        await PendingDeletion.deleteOne({ _id: item._id });
        console.log(`[cleanup] Permanently deleted ${item.url}`);
      } catch (err) {
        console.error('[cleanup] Delete failed, will retry on next sweep:', err.message);
      }
    }
  } catch (err) {
    console.error('[cleanup] Sweep error:', err.message);
  }
}

export function startCleanupJob() {
  setInterval(sweep, SWEEP_EVERY_MS).unref();
  sweep();
}
