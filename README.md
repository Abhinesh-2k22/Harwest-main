# HarWest

Static multipage cocopeat website (React + Tailwind) with a secure Node/MongoDB admin for images & videos.

```
client/   React + Vite + Tailwind site
server/   Express + MongoDB API (auth, media overrides, uploads)
```

## Where things live
| What | File |
| --- | --- |
| **Every image/video URL** (defaults) | `client/src/config/assets.js` |
| Copy, contact, products, FAQ | `client/src/config/siteContent.js` |
| Theme colors / animations | `client/src/index.css` |
| **MongoDB & secrets (paste here)** | `server/.env` (copy from `server/.env.example`) |

## Setup
1. `cd server && copy .env.example .env` — paste `MONGODB_URI`, `JWT_SECRET`, admin email/password.
2. `npm run seed:admin` (creates the admin; then delete `ADMIN_PASSWORD` from `.env`).
3. `npm run dev` in `server/` (port 5000), and `npm run dev` in `client/` (port 5173).
4. Site: http://localhost:5173 · Admin: http://localhost:5173/admin

## Security built in
- bcrypt (cost 12) password hashing; no public registration — admin created only via seed script
- JWT in `httpOnly`, `SameSite=Strict`, `Secure` (prod) cookie; sessions invalidated on password change
- Account lockout (5 fails → 15 min) + strict login rate limit + global rate limit
- CSRF defence: Origin check + custom header; strict CORS
- Helmet headers, NoSQL-injection sanitising, 10kb JSON limit
- Uploads: MIME allow-list, magic-byte check, random filenames, size cap, `nosniff`
- Media URLs must be `https://` or an uploaded file (blocks `javascript:`/`data:`)

## Production notes
- Serve site and API on the same domain (reverse proxy `/api` + `/uploads` to Node) and use HTTPS.
- Set `NODE_ENV=production` and `CLIENT_ORIGIN=https://your-domain`.
- Uploads are stored in `server/uploads`; use a persistent disk, or move to S3/Cloudinary on serverless hosts.
