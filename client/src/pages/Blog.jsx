import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, Tag, BookOpen, Search } from 'lucide-react';
import { PageHero } from '../components/ui';
import SEO from '../components/SEO';
import { DEFAULT_BLOGS } from '../config/siteContent';
import { api } from '../lib/api';
import { Reveal } from '../lib/motion';

export default function Blog() {
  const [blogs, setBlogs] = useState(DEFAULT_BLOGS);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // Fetch live blogs from MongoDB API if available; fall back to defaults
    api
      .getBlogs()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setBlogs(data);
        }
      })
      .catch(() => {
        // server offline or no blogs yet: use DEFAULT_BLOGS
      });
  }, []);

  const filtered = blogs.filter((b) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      (b.title && b.title.toLowerCase().includes(q)) ||
      (b.summary && b.summary.toLowerCase().includes(q)) ||
      (b.author && b.author.toLowerCase().includes(q))
    );
  });

  return (
    <>
      <SEO
        title="Coco Coir Agronomy Guides, Low-EC Washing & Hydroponic Tips"
        description="Read expert articles from the HarWest Agronomy Team on buying 5kg coco peat blocks, low-EC washing, buffering coir for hydroponics, and commercial greenhouse substrates."
        keywords="coco coir blog, how to buy cocopeat block, washed vs buffered coco coir, hydroponic substrate guide, EC in coco peat"
        path="/blog"
      />
      <PageHero
        breadcrumb="Blog"
        eyebrow="Industry Insights"
        title="Coir Industry News, Tips & Guides"
        text="Discover technical agronomy tips, substrate comparisons, low-EC washing guides, and sustainable coir trends."
        image="blog.image"
        video="blog.video"
      />

      <section className="mx-auto max-w-7xl px-6 pt-12 sm:pt-16 pb-6 sm:pb-8">
        {/* SEARCH & COUNT BAR */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-8 border-b border-shell-200">
          <div>
            <h2 className="text-xl font-bold text-shell-900">Articles & Agronomy Guides</h2>
            <p className="text-xs text-shell-500 mt-0.5">
              Showing {filtered.length} {filtered.length === 1 ? 'article' : 'articles'}
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Search by topic, keyword, or author..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full border border-shell-300 bg-white px-4 py-2.5 pl-10 pr-9 text-xs text-shell-900 outline-none transition focus:border-leaf-600 focus:ring-2 focus:ring-leaf-200 shadow-sm"
            />
            <Search size={15} className="absolute left-3.5 top-3 text-shell-400" />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-2.5 text-xs text-shell-400 hover:text-shell-700"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* 3-COLUMN BLOG GRID */}
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((b, idx) => (
            <Reveal key={b.slug || b._id || idx} delay={idx * 80}>
              <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-shell-200/80 bg-white shadow-sm transition duration-500 hover:-translate-y-2 hover:shadow-2xl hover:border-leaf-300">
                {/* Cover Image */}
                <Link to={`/blog/${b.slug}`} className="relative aspect-[16/10] overflow-hidden bg-shell-100 block">
                  <img
                    src={b.coverImage || '/images/block.jpg'}
                    alt={b.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </Link>

                {/* Content Box */}
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-3 text-[11px] font-medium text-shell-500 mb-3">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={13} className="text-leaf-600" />
                      {b.publishedAt || 'Recent'}
                    </span>
                    {b.readTime && <span>· {b.readTime}</span>}
                  </div>

                  <h3 className="font-head text-lg font-bold leading-snug text-shell-900 group-hover:text-leaf-700 transition">
                    <Link to={`/blog/${b.slug}`}>{b.title}</Link>
                  </h3>

                  <p className="mt-3 flex-1 text-sm text-shell-600 line-clamp-3 leading-relaxed">
                    {b.summary}
                  </p>

                  <div className="mt-6 pt-4 border-t border-shell-100 flex items-center justify-between">
                    <Link
                      to={`/blog/${b.slug}`}
                      className="inline-flex items-center gap-1 font-head text-xs font-bold uppercase tracking-wider text-leaf-700 hover:text-leaf-900 transition group-hover:translate-x-0.5"
                    >
                      <span>Read Article</span>
                      <ArrowRight size={13} />
                    </Link>
                    {b.author && (
                      <span className="text-[11px] text-shell-400 truncate max-w-[140px]">
                        {b.author}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-20 text-center">
            <BookOpen size={48} className="mx-auto text-shell-400" />
            <h4 className="mt-4 font-head text-lg font-bold text-shell-800">No articles found</h4>
            <p className="mt-1 text-sm text-shell-500">
              {search ? `No articles matching "${search}".` : 'No published articles yet.'}
            </p>
            {search && (
              <button
                onClick={() => setSearch('')}
                className="mt-4 rounded-full bg-leaf-100 px-4 py-1.5 text-xs font-bold text-leaf-800 hover:bg-leaf-200 transition"
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </section>
    </>
  );
}
