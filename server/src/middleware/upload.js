import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import multer from 'multer';
import { config } from '../config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const UPLOAD_DIR = path.resolve(__dirname, '../../uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// mime -> safe extension (extension is never taken from the user's filename)
const MIME_EXT = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'video/mp4': '.mp4',
  'video/webm': '.webm',
};

export const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOAD_DIR,
    filename: (_req, file, cb) =>
      cb(null, crypto.randomBytes(16).toString('hex') + MIME_EXT[file.mimetype]),
  }),
  // Allows up to maxVideoUploadMb (250 MB) so large videos are never rejected with "File too large"
  // Instead, the server ingests the file and automatically compresses it down via Cloudinary's streaming transcoding pipeline
  limits: {
    fileSize: Math.max(config.maxUploadMb || 50, config.maxVideoUploadMb || 250) * 1024 * 1024,
    files: 1,
  },
  fileFilter: (_req, file, cb) =>
    MIME_EXT[file.mimetype] ? cb(null, true) : cb(new Error('Unsupported file type')),
});

/** Verifies real file signature (magic bytes) matches an allowed media type. */
export function hasValidSignature(filePath) {
  const fd = fs.openSync(filePath, 'r');
  const buf = Buffer.alloc(12);
  fs.readSync(fd, buf, 0, 12, 0);
  fs.closeSync(fd);
  const hex = buf.toString('hex');
  return (
    hex.startsWith('ffd8ff') || // jpg
    hex.startsWith('89504e47') || // png
    (buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') || // webp
    buf.toString('ascii', 4, 8) === 'ftyp' || // mp4
    hex.startsWith('1a45dfa3') // webm
  );
}
