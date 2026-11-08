import { useEffect, useState } from 'react';
import { ArrowRight, ChevronDown, CheckCircle2 } from 'lucide-react';
import { useAsset } from '../context/MediaContext';
import { PROCESS, FAQ } from '../config/siteContent';
import { Reveal } from '../lib/motion';
import { Button, SectionTitle } from '../components/ui';
import ProductShowcase from '../components/ProductShowcase';
import FactoryVideoPlayer from '../components/FactoryVideoPlayer';
import SEO from '../components/SEO';
import { useProducts } from '../lib/useProducts';

const cropSvgCls =
  'h-12 w-12 sm:h-20 sm:w-20 md:h-28 md:w-28 drop-shadow-sm transition-transform duration-300 group-hover:scale-110';

const HYDROPONIC_CROPS = [
  {
    name: 'Raspberries',
    svg: (
      <svg viewBox="0 0 120 120" className={cropSvgCls}>
        <g stroke="#1b3b28" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          {/* Outer drupelets */}
          <circle cx="42" cy="36" r="11" fill="#c93b5b" />
          <circle cx="60" cy="30" r="11" fill="#d94668" />
          <circle cx="78" cy="36" r="11" fill="#c93b5b" />
          <circle cx="32" cy="52" r="11" fill="#b83250" />
          <circle cx="88" cy="52" r="11" fill="#b83250" />
          <circle cx="33" cy="70" r="11" fill="#c93b5b" />
          <circle cx="87" cy="70" r="11" fill="#a82845" />
          <circle cx="42" cy="86" r="10.5" fill="#b83250" />
          <circle cx="78" cy="86" r="10.5" fill="#a82845" />
          <circle cx="60" cy="94" r="11" fill="#b83250" />
          {/* Inner drupelets */}
          <circle cx="46" cy="52" r="11" fill="#e05273" />
          <circle cx="74" cy="52" r="11" fill="#d94668" />
          <circle cx="60" cy="62" r="11.5" fill="#e05273" />
          <circle cx="48" cy="72" r="11" fill="#c93b5b" />
          <circle cx="72" cy="72" r="11" fill="#c93b5b" />
          <circle cx="60" cy="80" r="11" fill="#d94668" />
          {/* Hollow core */}
          <ellipse cx="60" cy="43" rx="13" ry="8" fill="#7a1c33" />
          {/* Subtle leaf accent */}
          <path d="M52 24 C46 14, 34 16, 38 25 Z" fill="#4d8b55" />
          <path d="M68 24 C74 14, 86 16, 82 25 Z" fill="#5da065" />
        </g>
      </svg>
    ),
  },
  {
    name: 'Blueberries',
    svg: (
      <svg viewBox="0 0 120 120" className={cropSvgCls}>
        <g stroke="#1b3b28" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="60" cy="62" r="37" fill="#355c8a" />
          {/* Soft highlight */}
          <path d="M35 45 A28 28 0 0 1 76 34" fill="none" stroke="#5982b3" strokeWidth="3.5" />
          {/* Berry star calyx */}
          <polygon
            points="60,35 64,43 73,41 67,48 72,55 63,53 58,60 55,52 46,53 52,46 48,39 56,42"
            fill="#c5b37a"
          />
          <circle cx="60" cy="47" r="3.5" fill="#1b3b28" />
        </g>
      </svg>
    ),
  },
  {
    name: 'Blackberries',
    svg: (
      <svg viewBox="0 0 120 120" className={cropSvgCls}>
        <g stroke="#2a4a37" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="44" cy="36" r="10.5" fill="#1e192b" />
          <circle cx="60" cy="31" r="10.5" fill="#2d2540" />
          <circle cx="76" cy="36" r="10.5" fill="#1e192b" />
          <circle cx="34" cy="51" r="11" fill="#251f36" />
          <circle cx="86" cy="51" r="11" fill="#181324" />
          <circle cx="35" cy="69" r="11" fill="#1e192b" />
          <circle cx="85" cy="69" r="11" fill="#181324" />
          <circle cx="43" cy="85" r="10.5" fill="#251f36" />
          <circle cx="77" cy="85" r="10.5" fill="#181324" />
          <circle cx="60" cy="93" r="11" fill="#1e192b" />
          <circle cx="47" cy="52" r="11" fill="#332a47" />
          <circle cx="73" cy="52" r="11" fill="#251f36" />
          <circle cx="60" cy="62" r="11.5" fill="#332a47" />
          <circle cx="49" cy="73" r="11" fill="#251f36" />
          <circle cx="71" cy="73" r="11" fill="#1e192b" />
          <circle cx="60" cy="80" r="10.5" fill="#2d2540" />
          <ellipse cx="60" cy="44" rx="11" ry="7" fill="#110d19" />
          {/* Calyx leaf */}
          <path d="M52 24 C46 15, 36 17, 40 25 Z" fill="#4d8b55" stroke="#1b3b28" />
          <path d="M68 24 C74 15, 84 17, 80 25 Z" fill="#3f7847" stroke="#1b3b28" />
        </g>
      </svg>
    ),
  },
  {
    name: 'Strawberries',
    svg: (
      <svg viewBox="0 0 120 120" className={cropSvgCls}>
        <g stroke="#1b3b28" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          {/* Body */}
          <path
            d="M60 32 C84 32, 94 52, 84 76 C75 96, 66 102, 60 102 C54 102, 45 96, 36 76 C26 52, 36 32, 60 32 Z"
            fill="#d63e4f"
          />
          {/* Leafy crown */}
          <path
            d="M60 34 L42 22 L49 34 L32 33 L48 41 L60 36 L72 41 L88 33 L71 34 L78 22 Z"
            fill="#569e54"
          />
          <path d="M60 32 L63 18" strokeWidth="3" />
          {/* Seeds */}
          <ellipse cx="48" cy="52" rx="1.6" ry="2.8" fill="#1b3b28" />
          <ellipse cx="60" cy="50" rx="1.6" ry="2.8" fill="#1b3b28" />
          <ellipse cx="72" cy="53" rx="1.6" ry="2.8" fill="#1b3b28" />
          <ellipse cx="44" cy="67" rx="1.6" ry="2.8" fill="#1b3b28" />
          <ellipse cx="56" cy="65" rx="1.6" ry="2.8" fill="#1b3b28" />
          <ellipse cx="68" cy="66" rx="1.6" ry="2.8" fill="#1b3b28" />
          <ellipse cx="77" cy="68" rx="1.6" ry="2.8" fill="#1b3b28" />
          <ellipse cx="51" cy="80" rx="1.6" ry="2.8" fill="#1b3b28" />
          <ellipse cx="63" cy="81" rx="1.6" ry="2.8" fill="#1b3b28" />
          <ellipse cx="58" cy="92" rx="1.5" ry="2.5" fill="#1b3b28" />
        </g>
      </svg>
    ),
  },
  {
    name: 'Tomatoes',
    svg: (
      <svg viewBox="0 0 120 120" className={cropSvgCls}>
        <g stroke="#1b3b28" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="60" cy="65" rx="37" ry="32" fill="#de4a3f" />
          <path d="M78 46 A24 20 0 0 1 88 68" fill="none" stroke="#f2796f" strokeWidth="3" />
          {/* Stem & calyx */}
          <path
            d="M60 36 L50 25 L55 36 L39 36 L54 42 L51 49 L60 42 L69 49 L66 42 L81 36 L65 36 L70 25 Z"
            fill="#569e54"
          />
          <path d="M60 36 C60 28, 64 23, 67 21" fill="none" strokeWidth="3" />
        </g>
      </svg>
    ),
  },
  {
    name: 'Aubergines',
    svg: (
      <svg viewBox="0 0 120 120" className={cropSvgCls}>
        <g stroke="#1b3b28" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path
            d="M36 34 C46 30, 68 42, 82 58 C96 74, 92 95, 74 98 C54 101, 38 82, 33 62 C29 46, 30 37, 36 34 Z"
            fill="#84438f"
          />
          <path d="M68 56 C80 68, 84 82, 76 90" fill="none" stroke="#a665b0" strokeWidth="3" />
          {/* Green cap */}
          <path
            d="M30 28 L36 34 L31 48 L41 41 L47 50 L49 39 L58 39 L46 31 L36 32 Z"
            fill="#5ca356"
          />
          <path d="M34 32 L26 24" strokeWidth="3.2" />
        </g>
      </svg>
    ),
  },
  {
    name: 'Peppers',
    svg: (
      <svg viewBox="0 0 120 120" className={cropSvgCls}>
        <g stroke="#1b3b28" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          {/* Stem */}
          <path d="M56 34 L53 20 L63 20 L65 34 Z" fill="#4f944d" />
          {/* Back & Side lobes */}
          <path
            d="M46 34 C29 33, 27 56, 32 82 C35 96, 44 99, 50 96"
            fill="#c93b32"
          />
          <path
            d="M74 34 C91 33, 93 56, 88 82 C85 96, 76 99, 70 96"
            fill="#c93b32"
          />
          {/* Center lobe */}
          <path
            d="M46 35 C52 31, 68 31, 74 35 C78 55, 76 82, 70 97 C64 101, 56 101, 50 97 C44 82, 42 55, 46 35 Z"
            fill="#e04b42"
          />
        </g>
      </svg>
    ),
  },
  {
    name: 'Cucumbers',
    svg: (
      <svg viewBox="0 0 120 120" className={cropSvgCls}>
        <g stroke="#1b3b28" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path
            d="M30 34 C38 30, 56 46, 72 62 C86 76, 96 86, 90 94 C84 100, 64 94, 46 76 C30 60, 24 38, 30 34 Z"
            fill="#6cb043"
          />
          {/* Subtle ridges */}
          <path d="M36 42 C48 56, 64 72, 82 84" fill="none" stroke="#457d26" strokeWidth="2" />
          <path d="M33 50 C44 65, 58 79, 75 89" fill="none" stroke="#457d26" strokeWidth="2" />
          <path d="M29 34 L24 27" strokeWidth="2.8" />
        </g>
      </svg>
    ),
  },
  {
    name: 'Cannabis',
    svg: (
      <svg viewBox="0 0 120 120" className={cropSvgCls}>
        <g stroke="#1b3b28" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="#6bb344">
          {/* Center leaflet */}
          <path d="M60 82 C54 60, 55 34, 60 18 C65 34, 66 60, 60 82 Z" />
          {/* Upper left & right leaflets */}
          <path d="M60 82 C46 66, 36 46, 29 33 C43 42, 54 60, 60 82 Z" />
          <path d="M60 82 C74 66, 84 46, 91 33 C77 42, 66 60, 60 82 Z" />
          {/* Mid left & right leaflets */}
          <path d="M60 82 C44 78, 29 73, 20 68 C33 68, 48 73, 60 82 Z" />
          <path d="M60 82 C76 78, 91 73, 100 68 C87 68, 72 73, 60 82 Z" />
          {/* Lower small leaflets */}
          <path d="M60 82 C51 86, 42 90, 36 93 C43 86, 52 83, 60 82 Z" />
          <path d="M60 82 C69 86, 78 90, 84 93 C77 86, 68 83, 60 82 Z" />
          {/* Stem */}
          <path d="M60 82 L60 102" strokeWidth="2.8" />
        </g>
      </svg>
    ),
  },
  {
    name: 'Ginger',
    svg: (
      <svg viewBox="0 0 120 120" className={cropSvgCls}>
        <g stroke="#1b3b28" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
          <path
            d="M46 96 C41 84, 42 74, 34 72 C24 70, 22 58, 31 56 C38 55, 42 62, 44 52 C45 40, 38 30, 48 23 C58 17, 68 26, 66 38 C65 46, 64 54, 72 48 C78 42, 82 28, 92 32 C100 36, 98 50, 90 58 C84 64, 78 72, 74 84 C70 94, 54 102, 46 96 Z"
            fill="#d4a238"
          />
          {/* Cut face highlight */}
          <ellipse cx="58" cy="91" rx="11" ry="6" transform="rotate(-18 58 91)" fill="#f0cf65" />
          {/* Natural root ring lines */}
          <path d="M46 35 C52 33, 58 34, 63 37" fill="none" stroke="#785616" strokeWidth="1.8" />
          <path d="M46 48 C53 46, 58 47, 62 50" fill="none" stroke="#785616" strokeWidth="1.8" />
          <path d="M80 42 C85 43, 89 46, 91 50" fill="none" stroke="#785616" strokeWidth="1.8" />
          <path d="M47 68 C55 66, 64 68, 72 72" fill="none" stroke="#785616" strokeWidth="1.8" />
        </g>
      </svg>
    ),
  },
];

function HomeFaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`overflow-hidden rounded-xl sm:rounded-2xl border transition-all duration-300 bg-white shadow-sm ${open ? 'border-leaf-400 ring-2 ring-leaf-100 shadow-md' : 'border-shell-200/90 hover:border-leaf-300'
      }`}>
      <button
        className="flex w-full items-center justify-between px-4 py-3.5 sm:px-6 sm:py-5 text-left font-head text-[13px] sm:text-lg font-bold text-shell-900 transition hover:text-leaf-700"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="flex items-center gap-2.5 sm:gap-3 pr-2">
          <span className={`grid h-5 w-5 sm:h-6 sm:w-6 shrink-0 place-items-center rounded-full text-[10px] sm:text-xs font-bold transition ${open ? 'bg-leaf-600 text-white' : 'bg-shell-100 text-shell-600'
            }`}>
            {open ? '−' : '+'}
          </span>
          <span className="leading-snug">{q}</span>
        </span>
        <ChevronDown className={`h-4 w-4 sm:h-5 sm:w-5 shrink-0 transition-transform duration-300 ${open ? 'rotate-180 text-leaf-600' : 'text-shell-400'}`} />
      </button>
      <div className={`grid transition-all duration-300 ease-in-out ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden px-4 sm:px-6 text-shell-700 leading-relaxed">
          <p className="mb-3.5 sm:mb-5 pt-1 pl-4 sm:pl-6 text-xs sm:text-base border-l-2 border-leaf-300 ml-1 bg-leaf-50/40 p-3 sm:p-4 rounded-r-xl">
            {a}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const hero = useAsset('hero.image');
  const heroVideo = useAsset('hero.video');
  const factory = useAsset('about.factory');
  const tour = useAsset('media.factoryTour');
  const { items: products } = useProducts();

  return (
    <>
      <SEO
        title="Premium Cocopeat Blocks, Coir Grow Bags & Substrates Exporter India"
        description="HarWest Coir Substrates — Pollachi manufacturer & global exporter of triple-washed Low EC 5 kg cocopeat blocks, hydroponic coir grow bags, coco husk chips, and natural coir fibre."
        keywords="cocopeat exporter India, 5kg low EC cocopeat block, hydroponic coir grow bags, coco husk chips Pollachi, coco peat manufacturer Tamil Nadu, HarWest Coir Substrates"
        path="/"
        image={hero}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: FAQ.slice(0, 5).map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: {
              '@type': 'Answer',
              text: f.a,
            },
          })),
        }}
      />
      {/* HERO SECTION */}
      <section className="grain relative isolate flex min-h-[94vh] items-center overflow-hidden bg-leaf-950 text-white">
        {heroVideo ? (
          <video
            key={heroVideo}
            src={heroVideo}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="absolute inset-0 -z-20 h-full w-full object-cover"
          />
        ) : (
          <img
            src={hero}
            alt="HarWest coconut coir plantation"
            className="absolute inset-0 -z-20 h-full w-full animate-kenburns object-cover"
          />
        )}

        {/* Modern Ambient Radial Glows */}
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-32 h-96 w-96 rounded-full bg-leaf-500/15 blur-3xl pointer-events-none" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-leaf-950/95 via-leaf-950/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-8 bg-gradient-to-t from-shell-50/10 to-transparent" />

        <div className="mx-auto w-full max-w-7xl px-6 pt-32 pb-24">
          <h1 className="max-w-3xl animate-rise text-4xl font-bold leading-[1.08] sm:text-6xl md:text-7xl tracking-tight">
            Soil that grows{' '}
            <span className="bg-gradient-to-r from-coconut-200 via-leaf-300 to-emerald-200 bg-clip-text text-transparent italic font-medium">
              greener
            </span>{' '}
            tomorrows.
          </h1>

          <p className="mt-6 max-w-xl animate-rise text-base sm:text-lg text-white/85 leading-relaxed" style={{ animationDelay: '.2s' }}>
            HarWest turns sun-dried coconut husks into export-grade cocopeat blocks, precision grow bags and husk chips trusted by commercial greenhouses.
          </p>

          <div className="mt-10 flex animate-rise flex-wrap items-center gap-4" style={{ animationDelay: '.3s' }}>
            <Button to="/products" className="shadow-emerald-950/40 hover:shadow-xl hover:scale-105 transition duration-300">
              Explore Products <ArrowRight size={18} />
            </Button>
            <Button to="/contact" variant="ghost" className="backdrop-blur-md hover:bg-white/15 transition duration-300">
              Request a Sample
            </Button>
          </div>

          {/* Quick feature tags */}
          <div className="mt-12 flex flex-wrap items-center gap-6 text-xs text-white/70 font-medium">
            <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-400" /> RHP / SA 8000 Certified</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-400" /> Low EC &lt; 0.5 mS/cm</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-400" /> Worldwide 40ft HC Shipping</span>
          </div>
        </div>
      </section>

      {/* HYDROPONIC CROPS SECTION */}
      <section className="relative overflow-hidden bg-white py-20 border-b border-shell-200/70">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <Reveal>
            <h2 className="font-head text-2xl sm:text-4xl md:text-[42px] font-bold tracking-tight text-leaf-900">
              Coir Substrates for Hydroponic Growing Systems
            </h2>
            <p className="mx-auto mt-4 max-w-4xl text-sm sm:text-base md:text-lg text-shell-700 leading-relaxed">
              Crop-specific coir substrates formulated to yield the highest quality strawberries, blueberries,
              raspberries, blackberries, tomatoes, peppers, cucumbers, eggplants, herbs, micro greens and flowers.
            </p>
          </Reveal>

          <div className="mt-8 sm:mt-12 grid grid-cols-4 gap-y-5 gap-x-2.5 sm:gap-y-10 sm:gap-x-6 md:grid-cols-5 md:gap-y-12 md:gap-x-8">
            {HYDROPONIC_CROPS.map((crop, idx) => (
              <Reveal
                key={crop.name}
                delay={idx * 50}
                className={`group flex-col items-center justify-center ${
                  idx >= 8 ? 'hidden md:flex' : 'flex'
                }`}
              >
                <div className="flex h-16 w-16 sm:h-24 sm:w-24 md:h-32 md:w-32 items-center justify-center rounded-2xl sm:rounded-3xl bg-shell-50/70 border border-shell-200/70 p-2 sm:p-3 shadow-sm transition-all duration-300 group-hover:border-leaf-300 group-hover:bg-leaf-50/50 group-hover:shadow-md">
                  {crop.svg}
                </div>
                <span className="mt-2 sm:mt-3.5 font-head text-[11px] sm:text-sm md:text-base font-bold tracking-wide text-shell-800 group-hover:text-leaf-800 transition-colors leading-tight">
                  {crop.name}
                </span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTS SECTION */}
      <section className="mx-auto max-w-7xl px-6 pt-16 sm:pt-20 pb-6 sm:pb-8">
        <SectionTitle
          eyebrow="Our products"
          title="Grown by nature, refined for growers"
          text="From hydroponic grow bags to orchid-friendly chips — one husk, endless harvests."
        />
        <ProductShowcase products={products} />
        <div className="mt-8 sm:mt-10 text-center">
          <Button to="/products">View Full Technical Catalogue <ArrowRight size={16} /></Button>
        </div>
      </section>

      {/* PROCESS */}
      <section className="mx-auto max-w-7xl px-6 pt-4 sm:pt-6 pb-14 sm:pb-16">
        <SectionTitle center eyebrow="From husk to harvest" title="Our natural process" />
        {/* Mobile: swipeable horizontal row · Desktop: 4-column grid */}
        <div className="relative -mx-6 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:mt-16 md:grid md:grid-cols-4 md:gap-8 md:overflow-visible md:px-0 md:pb-0">
          <div className="absolute left-0 right-0 top-7 hidden border-t-2 border-dashed border-leaf-300 md:block" aria-hidden="true" />
          {PROCESS.map((p, i) => (
            <Reveal
              key={p.title}
              delay={i * 120}
              className="relative w-[72%] shrink-0 snap-center rounded-2xl border border-shell-200 bg-white p-5 text-center shadow-sm sm:w-[44%] md:w-auto md:rounded-none md:border-0 md:bg-transparent md:p-0 md:shadow-none"
            >
              <span className="relative mx-auto grid h-14 w-14 place-items-center rounded-full bg-leaf-700 font-head text-xl font-bold text-white shadow-lg ring-8 ring-white md:ring-shell-50">
                {i + 1}
              </span>
              <h3 className="mt-5 text-xl font-bold text-shell-900">{p.title}</h3>
              <p className="mt-2 text-shell-600 text-sm leading-relaxed">{p.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FACTORY VIDEO SECTION */}
      <section className="px-6 pb-6 sm:pb-8">
        <div className="mx-auto max-w-6xl mb-8 text-center">
          <span className="font-head text-xs uppercase tracking-[.25em] text-leaf-700 font-bold">
            Processing Yard &amp; Facility
          </span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-shell-900 md:text-4xl">
            Pollachi Coir Craftsmanship in Motion
          </h2>
          <p className="mt-3 text-base text-shell-600 max-w-2xl mx-auto">
            Experience our multi-stage freshwater wash, EC desalination, and high-pressure block compression in real-time.
          </p>
        </div>
        <Reveal>
          <FactoryVideoPlayer key={tour} src={tour} poster={factory} />
        </Reveal>
      </section>

      {/* FAQ SECTION */}
      <section className="mx-auto max-w-4xl px-5 pt-4 sm:pt-6 pb-12 sm:pb-16 sm:px-6">
        <div className="max-md:scale-[0.9] max-md:origin-top">
          <SectionTitle
            center
            eyebrow="Got Questions?"
            title="Frequently Asked Questions"
            text="Everything you need to know about coco coir characteristics, washing grades, and global container shipping."
          />
        </div>
        <div className="mt-6 sm:mt-12 space-y-2.5 sm:space-y-4">
          {FAQ.slice(0, 5).map((f) => (
            <HomeFaqItem key={f.q} {...f} />
          ))}
        </div>
        <div className="mt-8 sm:mt-10 text-center">
          <Button to="/contact" variant="ghost" className="!text-leaf-800 !border-leaf-600 hover:!bg-leaf-50 max-sm:!text-xs max-sm:!px-4 max-sm:!py-2.5">
            Have More Questions? Contact Our Team <ArrowRight size={16} />
          </Button>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="px-6 pb-6 sm:pb-8">
        <div className="grain relative mx-auto max-w-4xl overflow-hidden leaf-radius bg-gradient-to-br from-leaf-800 to-leaf-950 px-6 py-8 sm:py-9 text-center text-white shadow-xl border border-leaf-700/40">
          <h2 className="mx-auto max-w-xl text-2xl font-bold sm:text-3xl">Ready to Grow with HarWest?</h2>
          <p className="mx-auto mt-2.5 max-w-lg text-sm sm:text-base text-white/80 leading-relaxed">
            Tell us your target crop, spec requirements, and volume — our technical team will courier samples and provide full container CIF pricing.
          </p>
          <div className="mt-5 sm:mt-6">
            <Button to="/contact" variant="shell" className="!py-2.5 !px-6 text-sm">
              Get a Custom Quote <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
