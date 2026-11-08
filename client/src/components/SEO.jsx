import { useEffect } from 'react';

const SITE_URL = 'https://harwestcoirs.com';
const DEFAULT_IMAGE = 'https://res.cloudinary.com/yi8e4nqo/image/upload/v1793173304/harwest/logo.jpg';

function upsertMeta(selector, attrName, attrValue, content) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export default function SEO({
  title,
  description,
  keywords,
  path = '/',
  image,
  type = 'website',
  noindex = false,
  jsonLd = null,
}) {
  useEffect(() => {
    const fullTitle = title
      ? `${title} | HarWest Coir Substrates`
      : 'HarWest | Premium Cocopeat Blocks, Coir Grow Bags & Substrates Exporter India';
    const desc =
      description ||
      'HarWest Coir Substrates — Pollachi manufacturer & global exporter of triple-washed Low EC 5 kg cocopeat blocks, hydroponic coir grow bags, coco husk chips, and natural coir fibre.';
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const canonicalUrl = `${SITE_URL}${cleanPath === '/' ? '/' : cleanPath.replace(/\/+$/, '')}`;
    const ogImg = image
      ? image.startsWith('http')
        ? image
        : `${SITE_URL}${image.startsWith('/') ? image : `/${image}`}`
      : DEFAULT_IMAGE;

    document.title = fullTitle;

    upsertMeta('meta[name="description"]', 'name', 'description', desc);
    if (keywords) {
      upsertMeta('meta[name="keywords"]', 'name', 'keywords', keywords);
    }
    upsertMeta(
      'meta[name="robots"]',
      'name',
      'robots',
      noindex
        ? 'noindex, nofollow'
        : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    );

    upsertLink('canonical', canonicalUrl);

    // Open Graph
    upsertMeta('meta[property="og:type"]', 'property', 'og:type', type);
    upsertMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
    upsertMeta('meta[property="og:title"]', 'property', 'og:title', fullTitle);
    upsertMeta('meta[property="og:description"]', 'property', 'og:description', desc);
    upsertMeta('meta[property="og:image"]', 'property', 'og:image', ogImg);

    // Twitter
    upsertMeta('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle);
    upsertMeta('meta[name="twitter:description"]', 'name', 'twitter:description', desc);
    upsertMeta('meta[name="twitter:image"]', 'name', 'twitter:image', ogImg);

    // Page-specific JSON-LD Structured Data
    const scriptId = 'harwest-page-jsonld';
    let scriptEl = document.getElementById(scriptId);
    if (jsonLd) {
      if (!scriptEl) {
        scriptEl = document.createElement('script');
        scriptEl.id = scriptId;
        scriptEl.type = 'application/ld+json';
        document.head.appendChild(scriptEl);
      }
      scriptEl.textContent = JSON.stringify(jsonLd);
    } else if (scriptEl) {
      scriptEl.remove();
    }

    return () => {
      const existing = document.getElementById(scriptId);
      if (existing) existing.remove();
    };
  }, [title, description, keywords, path, image, type, noindex, jsonLd]);

  return null;
}

