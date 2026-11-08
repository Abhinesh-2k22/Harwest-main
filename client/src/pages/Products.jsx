import { useState } from 'react';
import { ArrowRight, CheckCircle2, ChevronRight, MousePointerClick, SlidersHorizontal, Layers, Droplets, Zap, Expand } from 'lucide-react';
import { PageHero, Button } from '../components/ui';
import { Reveal } from '../lib/motion';
import { useProducts } from '../lib/useProducts';
import { optimizeCloudinaryUrl } from '../lib/media';

const BLOCK_COMPARISON_DATA = {
  lowEc: {
    key: 'lowEc',
    label: '5 kg Low EC Block',
    tag: 'Low EC — Washed',
    subtitle: 'Triple-washed in clean Pollachi freshwater to reduce salts below 0.6 mS/cm — ready for direct planting and sensitive hydroponic crops.',
    accent: 'emerald',
    metrics: [
      {
        label: 'Expansion Yield',
        value: '16 L/kg',
        sub: '≈ 80 Litres per 5 kg block',
        percent: 94,
        icon: Expand,
      },
      {
        label: 'Electrical Conductivity (EC)',
        value: '< 0.6 mS/cm',
        sub: '1:1.5v test method · Washed',
        percent: 22,
        icon: Zap,
      },
      {
        label: 'Moisture Level',
        value: '10 – 15%',
        sub: 'Kiln & sun-dried for export stability',
        percent: 30,
        icon: Droplets,
      },
      {
        label: 'Fibre Content',
        value: 'Below 2%',
        sub: 'Uniform pith texture, double-sieved',
        percent: 16,
        icon: Layers,
      },
    ],
    fullSpecs: {
      'Expansion': '16 L/kg (≈ 80 L per 5 kg block)',
      'Moisture': '10 – 15%',
      'Fibre': 'Below 2%',
      'EC': 'Less than 0.6 mS/cm (1:1.5v method)',
      'pH': '5.5 – 6.5',
      'Block': '30 × 30 × 10 cm, 5 kg',
      'Sieve': '6 mm / 8 mm / Unsieved',
      'Compression': '5:1',
      'Packing': 'Loose stuffing / Palletised',
      'Container loading': '5,000 blocks per 40 ft container, about 24 MT',
    },
  },
  highEc: {
    key: 'highEc',
    label: '5 kg High EC Block',
    tag: 'High EC — Unwashed',
    subtitle: 'Natural unwashed coconut coir pith processed and compressed to a 5:1 ratio — ideal for potting soil blenders, bulk composters, and customers with on-site washing.',
    accent: 'amber',
    metrics: [
      {
        label: 'Expansion Yield',
        value: '14 L/kg',
        sub: '≈ 70 Litres per 5 kg block',
        percent: 82,
        icon: Expand,
      },
      {
        label: 'Electrical Conductivity (EC)',
        value: 'Unwashed',
        sub: 'Natural EC · For custom blending / washing',
        percent: 78,
        icon: Zap,
      },
      {
        label: 'Moisture Level',
        value: '10 – 15%',
        sub: 'Sun-dried on concrete yards',
        percent: 30,
        icon: Droplets,
      },
      {
        label: 'Fibre Content',
        value: 'Below 2%',
        sub: 'Cleanly screened pith structure',
        percent: 16,
        icon: Layers,
      },
    ],
    fullSpecs: {
      'Expansion': '14 L/kg (≈ 70 L per 5 kg block)',
      'Moisture': '10 – 15%',
      'Fibre': 'Below 2%',
      'EC': 'Unwashed (Natural EC)',
      'pH': '5.5 – 6.5',
      'Block': '30 × 30 × 10 cm, 5 kg',
      'Sieve': '6 mm / 8 mm / Unsieved',
      'Compression': '5:1',
      'Packing': 'Loose stuffing / Palletised',
      'Container loading': '5,000 blocks per 40 ft container, about 24 MT',
    },
  },
};

function BlockSpecVisualizer({ selectedKey, onSelectKey }) {
  const active = BLOCK_COMPARISON_DATA[selectedKey] || BLOCK_COMPARISON_DATA.lowEc;
  const otherKey = selectedKey === 'lowEc' ? 'highEc' : 'lowEc';
  const other = BLOCK_COMPARISON_DATA[otherKey];

  return (
    <Reveal className="mt-10 overflow-hidden rounded-3xl border border-leaf-200/90 bg-gradient-to-br from-leaf-950 via-leaf-900 to-leaf-950 text-white shadow-2xl">
      <div className="border-b border-white/10 px-6 py-6 sm:px-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-400/15 border border-emerald-400/30 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-emerald-300">
            <SlidersHorizontal size={13} /> Interactive Specification Explorer
          </span>
          <h3 className="mt-2 font-head text-2xl sm:text-3xl font-bold text-white">
            Low EC vs High EC — Technical Visualizer
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-white/75 max-w-2xl">
            Switch between our two 5 kg block categories below to compare expansion volume, electrical conductivity, moisture, and full container loading specifications.
          </p>
        </div>

        {/* Category Switcher */}
        <div className="inline-flex rounded-2xl bg-black/35 p-1.5 border border-white/15">
          {Object.values(BLOCK_COMPARISON_DATA).map((item) => {
            const isSelected = active.key === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onSelectKey(item.key)}
                className={`relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all duration-300 ${
                  isSelected
                    ? 'bg-emerald-500 text-leaf-950 shadow-lg shadow-emerald-950/50 scale-[1.02]'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    isSelected ? 'bg-leaf-950 animate-ping' : 'bg-emerald-400/60'
                  }`}
                />
                {item.tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* Visual Metric Bars + Side-by-Side Specs */}
      <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-12">
        {/* Left: Visual Bars */}
        <div className="lg:col-span-6 space-y-5">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
            <div className="flex items-center justify-between gap-2">
              <span className="rounded-full bg-emerald-400/20 px-3 py-0.5 text-xs font-bold text-emerald-300 border border-emerald-400/30">
                {active.tag}
              </span>
              <span className="text-xs text-white/60 font-medium">5:1 Hydraulic Compression</span>
            </div>
            <h4 className="mt-3 font-head text-xl font-bold text-white">{active.label}</h4>
            <p className="mt-1.5 text-xs sm:text-sm text-white/80 leading-relaxed">{active.subtitle}</p>
          </div>

          <div className="space-y-4">
            {active.metrics.map((m, idx) => {
              const Icon = m.icon;
              const otherMetric = other.metrics[idx];
              return (
                <div
                  key={m.label}
                  className="rounded-2xl bg-white/[0.06] border border-white/10 p-4 transition hover:bg-white/[0.09]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-300">
                      <Icon size={15} /> {m.label}
                    </span>
                    <span className="font-head text-lg sm:text-xl font-bold text-white">{m.value}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-white/70">{m.sub}</p>

                  {/* Animated Bar */}
                  <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-black/40 p-0.5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-leaf-400 to-coconut-300 transition-all duration-500 ease-out"
                      style={{ width: `${m.percent}%` }}
                    />
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-[11px] text-white/55">
                    <span>Selected: {m.value}</span>
                    <span>
                      {other.tag}: {otherMetric.value}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Full Specification Table */}
        <div className="lg:col-span-6 flex flex-col justify-between rounded-2xl bg-white text-shell-900 p-6 shadow-xl">
          <div>
            <div className="flex items-center justify-between border-b border-shell-200 pb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-leaf-700">
                  Full Specification
                </span>
                <h4 className="font-head text-xl font-bold text-shell-900 mt-0.5">
                  {active.label} ({active.tag.split('—')[1]?.trim()})
                </h4>
              </div>
              <span className="rounded-xl bg-leaf-50 border border-leaf-200 px-3 py-1 text-xs font-bold text-leaf-800">
                30 × 30 × 10 cm
              </span>
            </div>

            <dl className="mt-3 divide-y divide-shell-200/80">
              {Object.entries(active.fullSpecs).map(([k, v]) => (
                <div key={k} className="flex items-center justify-between gap-4 py-2.5 text-xs sm:text-sm">
                  <dt className="font-semibold text-shell-600">{k}</dt>
                  <dd className="font-bold text-shell-900 text-right">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-shell-200 pt-4">
            <span className="text-xs text-shell-600 flex items-center gap-1.5 font-medium">
              <CheckCircle2 size={15} className="text-leaf-600 shrink-0" />
              Custom palletising &amp; private labeling available
            </span>
            <Button to="/contact" className="!py-2 !px-4 !text-xs">
              Enquire for {active.tag.split('—')[0].trim()} <ArrowRight size={14} />
            </Button>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

function buildVariantList(p) {
  const details = (Array.isArray(p.variantDetails) ? p.variantDetails : []).filter(
    (d) => !/bristle|mattress/i.test(d.name || '')
  );
  const names = (Array.isArray(p.variants) ? p.variants : []).filter(
    (name) => !/bristle|mattress/i.test(name || '')
  );

  if (details.length > 0) {
    return details.map((d) => ({
      name: d.name,
      badge: d.badge || '',
      short: d.short || p.short,
      image: d.image || p.image || '/images/block.jpg',
      specs: d.specs && Object.keys(d.specs).length > 0 ? d.specs : p.specs || {},
    }));
  }

  return names.map((name) => ({
    name,
    badge: '',
    short: p.short,
    image: p.image || '/images/block.jpg',
    specs: p.specs || {},
  }));
}

function Row({ p, flip, index }) {
  const variantList = buildVariantList(p);
  const [selectedIdx, setSelectedIdx] = useState(0);

  const activeVariant = variantList[selectedIdx] || null;
  const displayImage = optimizeCloudinaryUrl(
    (activeVariant && activeVariant.image) || p.image || '/images/block.jpg'
  );
  const displayShort = (activeVariant && activeVariant.short) || p.short;
  const displayBadge = activeVariant?.badge || '';
  const displaySpecs =
    activeVariant && activeVariant.specs && Object.keys(activeVariant.specs).length > 0
      ? activeVariant.specs
      : p.specs || {};

  const isCoirPithBlock =
    p.slug === 'coir-pith-blocks' ||
    /coir\s*pith.*5\s*kg/i.test(p.name || '') ||
    index === 0;

  const handleVisualizerSelect = (key) => {
    if (key === 'lowEc') {
      const idx = variantList.findIndex((v) => /low\s*ec/i.test(v.name));
      setSelectedIdx(idx >= 0 ? idx : 0);
    } else {
      const idx = variantList.findIndex((v) => /high\s*ec/i.test(v.name));
      setSelectedIdx(idx >= 0 ? idx : Math.min(1, variantList.length - 1));
    }
  };

  const currentVisualizerKey =
    activeVariant && /high\s*ec/i.test(activeVariant.name) ? 'highEc' : 'lowEc';

  return (
    <div className="space-y-8">
      <Reveal className={`grid items-start gap-12 lg:grid-cols-2 ${flip ? 'lg:[&>*:first-child]:order-2' : ''}`}>
        {/* Product Image Card */}
        <div className="relative overflow-hidden leaf-radius shadow-xl bg-shell-100 border border-shell-200 group">
          <img
            key={displayImage}
            src={displayImage}
            alt={activeVariant ? `${p.name} - ${activeVariant.name}` : p.name}
            loading={index === 0 ? 'eager' : 'lazy'}
            className="aspect-[4/3] w-full object-cover transition-all duration-500 group-hover:scale-105 animate-fadeIn"
            onError={(e) => {
              e.currentTarget.src = '/images/block.jpg';
            }}
          />
          {activeVariant && (
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-2 rounded-2xl bg-leaf-950/85 px-4 py-2.5 text-white backdrop-blur-md border border-white/15 shadow-lg">
              <div className="flex items-center gap-2 min-w-0">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-400 animate-pulse" />
                <span className="truncate text-xs sm:text-sm font-bold">{activeVariant.name}</span>
              </div>
              {displayBadge && (
                <span className="shrink-0 rounded-full bg-emerald-400/20 border border-emerald-400/40 px-2.5 py-0.5 text-[11px] font-bold text-emerald-200">
                  {displayBadge}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Product Content & Interactive Variant Selector */}
        <div>
          {(p.categories || []).length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {p.categories.map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-leaf-200 bg-leaf-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-leaf-800"
                >
                  {c}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-3xl sm:text-4xl font-bold text-shell-900">{p.name}</h2>
            {displayBadge && (
              <span className="rounded-full bg-leaf-100 border border-leaf-300 px-3 py-1 text-xs font-bold text-leaf-900">
                {displayBadge}
              </span>
            )}
          </div>

          {/* Interactive Clickable Product Types */}
          {variantList.length > 0 && (
            <div className="mt-5 rounded-2xl border border-leaf-200/90 bg-leaf-50/50 p-4 shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-leaf-900">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-leaf-500 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-leaf-600" />
                  </span>
                  Available Product Types
                </p>
                <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-0.5 text-[11px] font-semibold text-leaf-700 border border-leaf-200 shadow-2xs">
                  <MousePointerClick size={12} className="text-leaf-600 animate-bounce" />
                  Click type to switch view
                </span>
              </div>

              <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                {variantList.map((v, idx) => {
                  const isSelected = idx === selectedIdx;
                  return (
                    <button
                      key={v.name}
                      type="button"
                      onClick={() => setSelectedIdx(idx)}
                      aria-pressed={isSelected}
                      className={`group flex items-center justify-between gap-2 rounded-xl border px-3.5 py-3 text-left text-sm font-bold transition-all duration-200 ${
                        isSelected
                          ? 'border-leaf-700 bg-leaf-800 text-white shadow-md ring-2 ring-leaf-400/50 scale-[1.01]'
                          : 'border-shell-200 bg-white text-shell-800 hover:border-leaf-400 hover:bg-leaf-50/80 shadow-xs'
                      }`}
                    >
                      <span className="flex items-center gap-2.5 min-w-0">
                        <span
                          className={`h-2.5 w-2.5 shrink-0 rounded-full transition ${
                            isSelected
                              ? 'bg-emerald-300 shadow-[0_0_8px_rgba(110,231,183,0.9)] animate-pulse'
                              : 'bg-leaf-500 group-hover:scale-125'
                          }`}
                        />
                        <span className="truncate">{v.name}</span>
                      </span>
                      <ChevronRight
                        size={16}
                        className={`shrink-0 transition-transform duration-200 ${
                          isSelected
                            ? 'translate-x-0.5 text-emerald-300'
                            : 'text-shell-400 group-hover:translate-x-1 group-hover:text-leaf-700'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <p className="mt-4 text-base sm:text-lg text-shell-700 leading-relaxed">{displayShort}</p>

          {!isCoirPithBlock && Object.keys(displaySpecs).length > 0 && (
            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-shell-500">
                  Technical Specifications {activeVariant ? `— ${activeVariant.name}` : ''}
                </span>
              </div>
              <dl className="divide-y divide-shell-200 overflow-hidden rounded-2xl bg-white shadow-sm border border-shell-200/80">
                {Object.entries(displaySpecs).map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 px-5 py-3 text-sm transition hover:bg-leaf-50/50">
                    <dt className="font-medium text-shell-600">{k}</dt>
                    <dd className="font-semibold text-shell-900 text-right">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button to="/contact">
              Request Container Quote <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </Reveal>

      {/* Low EC vs High EC Visualizer right beneath Product 1 */}
      {isCoirPithBlock && (
        <BlockSpecVisualizer
          selectedKey={currentVisualizerKey}
          onSelectKey={handleVisualizerSelect}
        />
      )}
    </div>
  );
}

export default function Products() {
  const { items } = useProducts();

  return (
    <>
      <PageHero
        breadcrumb="Products"
        eyebrow="Technical Catalogue"
        title="Coir Substrates, Crafted by Nature"
        text="Precision-engineered cocopeat blocks, hydroponic grow bags, and aerating husk chips for greenhouse growers worldwide."
        image="products.image"
        video="products.video"
      />
      <div className="mx-auto max-w-7xl space-y-24 px-6 pt-12 sm:pt-16 pb-6 sm:pb-8">
        {items.length === 0 && (
          <p className="py-16 text-center text-shell-600">Our catalogue is being updated. Please check back soon.</p>
        )}
        {items.map((p, i) => (
          <Row key={p.slug || p._id || p.id || i} p={p} flip={i % 2 === 1} index={i} />
        ))}
      </div>
    </>
  );
}
