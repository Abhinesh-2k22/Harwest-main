import { useEffect, useState } from 'react';
import { Building2, Droplets, MapPin, ArrowRight, CheckCircle2, X, Maximize2 } from 'lucide-react';
import { PageHero, Button, SectionTitle } from '../components/ui';
import SEO from '../components/SEO';
import { Reveal } from '../lib/motion';
import { api } from '../lib/api';
import { DEFAULT_INFRASTRUCTURE } from '../config/siteContent';
import { optimizeCloudinaryUrl } from '../lib/media';

const INFRA_HIGHLIGHTS = [
  {
    icon: Building2,
    title: 'Multiple Units',
    text: 'Spread across Pollachi for raw material access and steady year-round production capacity.',
  },
  {
    icon: Droplets,
    title: 'Own Washing Bed',
    text: 'In-house freshwater washing and buffering beds for consistent Low EC coco peat orders.',
  },
  {
    icon: MapPin,
    title: 'Pollachi, Tamil Nadu',
    text: "Situated in the heart of South India's primary coconut belt with direct port connectivity.",
  },
];

function isVideoMedia(item) {
  if (item?.mediaType === 'video') return true;
  const u = String(item?.mediaUrl || '').toLowerCase();
  return u.endsWith('.mp4') || u.endsWith('.webm') || u.includes('/video/upload/');
}

export default function Infrastructure() {
  const [items, setItems] = useState(DEFAULT_INFRASTRUCTURE);
  const [lightboxItem, setLightboxItem] = useState(null);

  useEffect(() => {
    let mounted = true;
    api
      .getInfrastructure()
      .then((data) => {
        if (!mounted) return;
        if (Array.isArray(data) && data.length > 0) {
          setItems(data.filter((x) => x.isActive !== false));
        }
      })
      .catch(() => {
        // Fallback to DEFAULT_INFRASTRUCTURE on offline/error
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      <SEO
        title="Coir Processing Infrastructure & Washing Facility in Pollachi"
        description="Tour HarWest's coco peat manufacturing units in Pollachi, Tamil Nadu: freshwater low-EC washing beds, concrete solar drying yards, rotary screening, and 5:1 hydraulic block machines."
        keywords="coco peat factory Pollachi, coir washing facility Tamil Nadu, low EC cocopeat processing, 5kg block hydraulic machine, coir export facility India"
        path="/infrastructure"
      />
      <PageHero
        breadcrumb="Infrastructure"
        eyebrow="Pollachi · Tamil Nadu · India"
        title="Our Coco Peat Infrastructure in Pollachi"
        text="We run multiple processing units around Pollachi, Tamil Nadu — the coconut belt of South India — with our own washing bed, concrete drying yards, rotary screening, and high-pressure hydraulic block machines."
        image="about.factory"
      />

      {/* 3 HIGHLIGHT PILLARS */}
      <section className="mx-auto max-w-7xl px-6 pt-16 pb-10">
        <div className="grid gap-6 md:grid-cols-3">
          {INFRA_HIGHLIGHTS.map((h, i) => {
            const Icon = h.icon;
            return (
              <Reveal
                key={h.title}
                delay={i * 100}
                className="group relative overflow-hidden rounded-3xl border border-shell-200/90 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-leaf-300 hover:shadow-xl"
              >
                <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-leaf-100 text-leaf-800 transition-colors group-hover:bg-leaf-700 group-hover:text-white">
                  <Icon size={24} />
                </div>
                <h2 className="mt-5 font-head text-2xl font-bold text-shell-900">{h.title}</h2>
                <p className="mt-2 text-sm sm:text-base text-shell-600 leading-relaxed">{h.text}</p>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* INSIDE OUR UNITS — PURE GALLERY OF PHOTOS & VIDEOS */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <SectionTitle
          eyebrow="Inside Our Units"
          title="Real Photos & Videos from the Site"
          text="Explore our raw material yards, freshwater washing beds, concrete sun-drying floors, rotary sieves, and container stuffing operations."
        />

        {/* Media Gallery Grid */}
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, idx) => {
            const isVideo = isVideoMedia(item);
            const mediaSrc = optimizeCloudinaryUrl(item.mediaUrl || '/images/factory.jpg');
            const hasCaption = Boolean(item.title || item.description);

            return (
              <Reveal
                key={item._id || item.title || idx}
                delay={(idx % 3) * 90}
                className="group flex flex-col overflow-hidden rounded-3xl border border-shell-200/90 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-leaf-300 hover:shadow-xl"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-leaf-950">
                  {isVideo ? (
                    <video
                      src={mediaSrc}
                      controls
                      preload="metadata"
                      playsInline
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <>
                      <img
                        src={mediaSrc}
                        alt={item.title || `HarWest Facility ${idx + 1}`}
                        loading={idx < 3 ? 'eager' : 'lazy'}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105 cursor-pointer"
                        onClick={() => setLightboxItem(item)}
                        onError={(e) => {
                          e.currentTarget.src = '/images/factory.jpg';
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setLightboxItem(item)}
                        aria-label="View fullscreen"
                        className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-black/55 text-white opacity-0 backdrop-blur-md transition group-hover:opacity-100 hover:bg-leaf-700"
                      >
                        <Maximize2 size={15} />
                      </button>
                    </>
                  )}
                </div>

                {hasCaption && (
                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div>
                      {item.title && (
                        <h3 className="font-head text-xl font-bold text-shell-900 group-hover:text-leaf-800 transition-colors">
                          {item.title}
                        </h3>
                      )}
                      {item.description && (
                        <p className="mt-2 text-sm text-shell-600 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* QUALITY & EXPORT CAPABILITY BANNER */}
      <section className="px-6 pb-6 sm:pb-8 pt-4 sm:pt-6">
        <div className="grain relative mx-auto max-w-6xl overflow-hidden leaf-radius bg-gradient-to-br from-leaf-800 to-leaf-950 px-8 py-14 text-white shadow-2xl border border-leaf-700/40">
          <div className="grid items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <span className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-300">
                Direct Factory Export
              </span>
              <h2 className="mt-2 text-3xl sm:text-4xl font-bold">
                Want to inspect a batch or schedule a facility visit in Pollachi?
              </h2>
              <p className="mt-3 max-w-2xl text-white/80 text-sm sm:text-base leading-relaxed">
                We welcome international buyers and domestic greenhouse growers to visit our washing beds, drying yards, and compression units in Pollachi, or request live batch photos and EC/pH test reports before container loading.
              </p>
              <div className="mt-6 flex flex-wrap gap-5 text-xs text-emerald-200 font-semibold">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={15} className="text-emerald-400" /> In-House EC &amp; pH Testing Lab
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={15} className="text-emerald-400" /> 100% Concrete Drying Floors
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={15} className="text-emerald-400" /> 40ft HC Container Loading on Site
                </span>
              </div>
            </div>
            <div className="lg:col-span-4 lg:text-right">
              <Button to="/contact" variant="shell">
                Book a Visit / Request Quote <ArrowRight size={18} />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FULLSCREEN IMAGE LIGHTBOX */}
      {lightboxItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={() => setLightboxItem(null)}
        >
          <div
            className="relative max-w-5xl w-full overflow-hidden rounded-3xl bg-leaf-950 border border-white/15 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightboxItem(null)}
              className="absolute right-4 top-4 z-10 rounded-full bg-black/60 p-2 text-white hover:bg-leaf-700 transition"
            >
              <X size={20} />
            </button>
            <img
              src={optimizeCloudinaryUrl(lightboxItem.mediaUrl)}
              alt={lightboxItem.title || 'HarWest Facility'}
              className="max-h-[75vh] w-full object-contain bg-black"
            />
            {(lightboxItem.title || lightboxItem.description) && (
              <div className="p-6 text-white">
                {lightboxItem.title && (
                  <h3 className="font-head text-2xl font-bold">{lightboxItem.title}</h3>
                )}
                {lightboxItem.description && (
                  <p className="mt-2 text-sm text-white/80">{lightboxItem.description}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
