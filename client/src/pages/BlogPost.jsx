import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Share2, Linkedin, Twitter, MessageCircle, Copy, Check, Clock, ChevronRight } from 'lucide-react';
import { DEFAULT_BLOGS } from '../config/siteContent';
import { api } from '../lib/api';

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);

    // Try fetching from API first, then look up in default list
    api
      .getBlogBySlug(slug)
      .then((data) => {
        if (data && data.title) {
          setPost(data);
        } else {
          fallback();
        }
      })
      .catch(() => fallback())
      .finally(() => setLoading(false));

    function fallback() {
      const found = DEFAULT_BLOGS.find((b) => b.slug === slug) || DEFAULT_BLOGS[0];
      setPost(found);
    }
  }, [slug]);

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="pt-40 pb-32 text-center">
        <p className="text-shell-500 font-head">Loading article…</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="pt-40 pb-32 text-center">
        <h2 className="text-2xl font-bold text-shell-900">Article not found</h2>
        <Link to="/blog" className="mt-4 inline-block text-leaf-700 font-bold hover:underline">
          &larr; Back to all articles
        </Link>
      </div>
    );
  }

  const shareText = encodeURIComponent(`${post.title} — HarWest Coco Coir`);
  const currentUrl = encodeURIComponent(window.location.href);

  return (
    <article className="pt-32 pb-24">
      {/* HEADER SECTION (Inspired by kayacoir article page) */}
      <div className="mx-auto max-w-4xl px-6">
        {/* Breadcrumb */}
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-xs text-shell-500 font-medium">
          <Link to="/" className="hover:text-leaf-800 transition">Home</Link>
          <ChevronRight size={12} />
          <Link to="/blog" className="hover:text-leaf-800 transition">Blog</Link>
          <ChevronRight size={12} />
          <span className="text-shell-900 font-semibold truncate max-w-xs">{post.title}</span>
        </nav>

        <h1 className="font-head text-3xl font-bold tracking-tight text-shell-900 sm:text-4xl md:text-5xl leading-tight">
          {post.title}
        </h1>

        <div className="mt-5 flex flex-wrap items-center gap-6 border-b border-shell-200 pb-6 text-xs text-shell-600 font-medium">
          <span className="flex items-center gap-1.5">
            <User size={14} className="text-leaf-600" />
            By {post.author || 'HarWest Team'}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar size={14} className="text-leaf-600" />
            {post.publishedAt || 'October 2026'}
          </span>
          {post.readTime && (
            <span className="flex items-center gap-1.5">
              <Clock size={14} className="text-leaf-600" />
              {post.readTime}
            </span>
          )}
        </div>

        {/* Featured Image */}
        <div className="mt-8 overflow-hidden rounded-3xl bg-shell-100 shadow-xl">
          <img
            src={post.coverImage || '/images/block.jpg'}
            alt={post.title}
            className="aspect-[16/9] w-full object-cover"
          />
        </div>

        {/* Article Body */}
        <div className="prose prose-shell max-w-none mt-12 space-y-6 text-shell-800 leading-relaxed text-base md:text-lg">
          {post.content.split('\n\n').map((block, i) => {
            const trimmed = block.trim();
            if (!trimmed) return null;

            // # Heading 1
            if (trimmed.startsWith('# ')) {
              return (
                <h1 key={i} className="font-head text-3xl sm:text-4xl font-bold text-shell-900 pt-6 pb-2 text-leaf-950 border-b border-shell-200">
                  {trimmed.replace(/^#\s+/, '')}
                </h1>
              );
            }

            // ## Heading 2 (Subheading)
            if (trimmed.startsWith('## ')) {
              return (
                <h2 key={i} className="font-head text-2xl sm:text-3xl font-bold text-shell-900 pt-5 pb-1 text-leaf-900">
                  {trimmed.replace(/^##\s+/, '')}
                </h2>
              );
            }

            // ### Heading 3 (Subsection)
            if (trimmed.startsWith('### ')) {
              return (
                <h3 key={i} className="font-head text-xl sm:text-2xl font-bold text-shell-900 pt-4 text-leaf-800">
                  {trimmed.replace(/^###\s+/, '')}
                </h3>
              );
            }

            // Unordered list (- item)
            if (trimmed.includes('\n- ') || trimmed.startsWith('- ')) {
              const items = trimmed.split('\n').filter((l) => l.trim().startsWith('- '));
              return (
                <ul key={i} className="my-4 space-y-2 list-disc list-inside text-shell-700 pl-2">
                  {items.map((item, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {item.replace(/^-\s+/, '')}
                    </li>
                  ))}
                </ul>
              );
            }

            // Numbered list
            if (/^\d+\.\s/.test(trimmed)) {
              return (
                <div key={i} className="rounded-2xl border-l-4 border-leaf-600 bg-leaf-50/70 p-5 shadow-sm my-4">
                  <p className="font-semibold text-leaf-950 text-base leading-relaxed">{trimmed}</p>
                </div>
              );
            }

            // Regular paragraph (replaces **bold** with <strong>)
            const parts = trimmed.split(/(\*\*[^*]+\*\*)/g);
            return (
              <p key={i} className="leading-relaxed text-shell-700">
                {parts.map((p, idx) => {
                  if (p.startsWith('**') && p.endsWith('**')) {
                    return <strong key={idx} className="font-bold text-shell-900">{p.slice(2, -2)}</strong>;
                  }
                  return p;
                })}
              </p>
            );
          })}
        </div>

        {/* Social Share Buttons (Like kayacoir) */}
        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-y border-shell-200 py-6">
          <div className="flex items-center gap-2 text-sm font-bold text-shell-900">
            <Share2 size={18} className="text-leaf-600" />
            <span>Share this article:</span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${currentUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on LinkedIn"
              className="grid h-10 w-10 place-items-center rounded-full bg-[#0077b5] text-white hover:opacity-90 transition"
            >
              <Linkedin size={16} />
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${shareText}&url=${currentUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on Twitter"
              className="grid h-10 w-10 place-items-center rounded-full bg-black text-white hover:opacity-90 transition"
            >
              <Twitter size={16} />
            </a>
            <a
              href={`https://wa.me/?text=${shareText}%20${currentUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on WhatsApp"
              className="grid h-10 w-10 place-items-center rounded-full bg-leaf-600 text-white hover:opacity-90 transition"
            >
              <MessageCircle size={16} />
            </a>
            <button
              onClick={copyUrl}
              className="flex items-center gap-1.5 rounded-full border border-shell-300 bg-white px-4 py-2 text-xs font-semibold text-shell-800 hover:bg-shell-50 transition"
            >
              {copied ? <Check size={14} className="text-leaf-600" /> : <Copy size={14} />}
              <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
            </button>
          </div>
        </div>

        {/* Author Bio Box */}
        <div className="mt-10 flex items-center gap-5 rounded-3xl border border-shell-200 bg-shell-100/60 p-6 md:p-8">
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-leaf-700 text-2xl font-bold text-white shadow-md">
            H
          </div>
          <div>
            <h4 className="font-head text-lg font-bold text-shell-900">
              {post.author || 'HarWest Agronomy Team'}
            </h4>
            <p className="text-xs text-leaf-700 font-medium mt-0.5">Pollachi Coir Craft & Substrate Engineering</p>
            <p className="mt-2 text-xs text-shell-600 leading-relaxed">
              Our technical team works directly with commercial growers, substrate distributors, and universities worldwide to publish empirical growing data and low-EC washing protocols.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 rounded-full border border-leaf-600 px-6 py-2.5 font-head text-sm font-bold text-leaf-800 hover:bg-leaf-50 transition"
          >
            <ArrowLeft size={16} /> Back to All Articles
          </Link>
        </div>
      </div>
    </article>
  );
}
