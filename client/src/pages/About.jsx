import { ShieldCheck, Target, Eye, Sun, Droplets, Recycle, Leaf, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAsset } from '../context/MediaContext';
import { PageHero, SectionTitle, Button } from '../components/ui';
import SEO from '../components/SEO';
import { Reveal } from '../lib/motion';
import { SITE, CERTIFICATIONS } from '../config/siteContent';

export default function About() {
  const factory = useAsset('about.factory');
  const seedling = useAsset('about.seedling');

  return (
    <>
      <SEO
        title="About HarWest — Sustainable Coir Substrates Manufacturer in Pollachi"
        description="Rooted in the coconut heartland of Pollachi, India, HarWest Coir Substrates crafts 100% natural, peat-free, RHP & SA 8000 compliant cocopeat growing media exported to 25+ countries."
        keywords="about HarWest Coir, Pollachi cocopeat manufacturer, sustainable peat-free growing media, SA 8000 coir exporter India"
        path="/about"
        image={factory}
      />
      <PageHero
        breadcrumb="About Us"
        eyebrow="About HarWest"
        title="Coconut Growing Mediums: Premium Quality"
        text="Rooted in the coconut heartland of Pollachi. We turn agricultural byproducts into the world's most trusted, peat-free growing media."
        image="about.factory"
        video="about.video"
      />

      {/* CORE INTRO & CIRCULAR STAMP BADGE */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2">
        <Reveal className="relative">
          <div className="relative overflow-hidden leaf-radius bg-shell-100 shadow-2xl">
            <img
              src={seedling}
              alt="Healthy young sprout in HarWest coir pith"
              loading="lazy"
              className="aspect-[4/3] w-full object-cover transition duration-700 hover:scale-105"
            />
          </div>
          {/* Circular Stamp Badge */}
          <div className="absolute -bottom-6 -right-4 flex h-32 w-32 items-center justify-center rounded-full border-4 border-white bg-leaf-900 p-2 text-center text-white shadow-xl ring-2 ring-coconut-400/40">
            <div className="flex flex-col items-center">
              <Leaf size={20} className="text-coconut-300" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-coconut-200">100% Coir</span>
              <span className="text-[9px] text-white/80">Finest Raw Husk</span>
            </div>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <p className="font-head text-xs uppercase tracking-[.25em] text-leaf-700 font-bold">About Us</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-shell-900 sm:text-4xl">
              Sustainable Coir Solutions, Rooted in Tropical India
            </h2>
            <p className="mt-4 text-shell-800 leading-relaxed font-semibold text-leaf-800">
              HARWEST is a blend of two meaningful words – HARVEST + WEST.
            </p>
            <p className="mt-3 text-shell-700 leading-relaxed">
              <strong className="text-shell-900">WEST</strong> represents the Western Ghats, particularly Pollachi, Tamil Nadu, a region renowned for its rich coconut-growing heritage. This is where our journey begins, transforming carefully sourced coconut resources into premium-quality cocopeat for global markets.
            </p>
            <p className="mt-3 text-shell-700 leading-relaxed">
              <strong className="text-shell-900">HARVEST</strong> reflects our purpose – helping growers achieve healthier plant growth, greater productivity and better yields.
            </p>
            <p className="mt-4 border-l-2 border-leaf-600 pl-3.5 font-head text-sm sm:text-base font-bold text-leaf-900 italic bg-leaf-50/50 py-1.5 rounded-r-lg">
              HARWEST – Rooted in the Western Ghats. Growing Better Harvests Worldwide.
            </p>
            <p className="mt-3 text-shell-700 leading-relaxed">
              Our commitment to environmental stewardship drives us to prioritize tropical solar drying and water recycling in our production processes, minimizing our carbon and environmental footprint. Our products stand out for their superior quality, low electrical conductivity, and eco-conscious nature.
            </p>

            <div className="mt-6 flex items-start gap-4 rounded-2xl border border-leaf-200 bg-leaf-50/80 p-5 shadow-sm">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-leaf-600 text-white">
                <Sparkles size={18} />
              </span>
              <div>
                <h4 className="font-head text-base font-bold text-leaf-900">
                  Investing in a Greener Tomorrow
                </h4>
                <p className="mt-1 text-xs md:text-sm text-leaf-800/80 leading-relaxed">
                  Choosing {SITE.name} means replacing endangered peat bogs with a circular, 100% natural and biodegradable coir growing medium.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* THREE PILLARS: QUALITY, MISSION, VISION (Inspired by Kayacoir) */}
      <section className="bg-shell-100/70 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <SectionTitle
            center
            eyebrow="Our Foundation"
            title="Purpose-Driven Manufacturing"
            text="How our commitment to quality, vision, and sustainability guides every single pallet we ship."
          />

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            <Reveal delay={0} className="rounded-3xl border border-shell-200/80 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-coconut-100 text-coconut-700">
                <ShieldCheck size={24} />
              </span>
              <h3 className="mt-6 font-head text-xl font-bold text-shell-900">Quality Assurance</h3>
              <p className="mt-3 text-sm text-shell-600 leading-relaxed">
                We operate under strict SA 8000, MPS-ECAS, and RHP-aligned quality protocols. In-house lab tests continually verify that EC, pH, moisture, and expansion specs meet exact buyer guarantees before container dispatch.
              </p>
            </Reveal>

            <Reveal delay={120} className="rounded-3xl border border-shell-200/80 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-leaf-100 text-leaf-800">
                <Target size={24} />
              </span>
              <h3 className="mt-6 font-head text-xl font-bold text-shell-900">Our Mission</h3>
              <p className="mt-3 text-sm text-shell-600 leading-relaxed">
                Empower commercial horticulture growers, hydroponic cultivators, and nursery growers worldwide with clean, peat-free coco substrates that foster healthier roots and higher yields.
              </p>
            </Reveal>

            <Reveal delay={240} className="rounded-3xl border border-shell-200/80 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-shell-200 text-shell-900">
                <Eye size={24} />
              </span>
              <h3 className="mt-6 font-head text-xl font-bold text-shell-900">Our Vision</h3>
              <p className="mt-3 text-sm text-shell-600 leading-relaxed">
                Lead the global substrate transition toward zero-carbon agriculture, setting the benchmark for ethical coir sourcing, community farmer welfare, and climate-positive growing solutions.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FULL WIDTH PLANET STATEMENT BANNER */}
      <section className="bg-leaf-950 py-16 text-white text-center">
        <div className="mx-auto max-w-4xl px-6">
          <p className="font-head text-xs uppercase tracking-widest text-coconut-300 font-semibold">Our Commitment</p>
          <h2 className="mt-3 text-2xl font-bold sm:text-4xl leading-snug">
            &ldquo;We are proud to craft high quality coir products that are kind to our planet and its life.&rdquo;
          </h2>
          <p className="mt-4 text-sm text-white/70">100% Biodegradable · Zero Chemical Residues · Peatland Preserving</p>
        </div>
      </section>

      {/* MADE WITH CARE: RAW MATERIAL, ENERGY, WATER (As requested from kayacoir) */}
      <section className="mx-auto max-w-6xl px-6 pt-12 sm:pt-16 pb-6 sm:pb-8">
        <SectionTitle
          center
          eyebrow="Eco Stewardship"
          title="Made with Immense Care"
          text="We take immense care to ensure that the coir reaching your greenhouses isn't just good for your crops, but also for our planet."
        />

        <div className="mt-14 space-y-6">
          {/* 1. Raw Material */}
          <Reveal className="flex flex-col md:flex-row items-start gap-6 rounded-3xl border border-shell-200 bg-white p-8 shadow-sm transition hover:border-leaf-300">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-coconut-100 text-coconut-700">
              <Recycle size={28} />
            </span>
            <div>
              <h3 className="font-head text-xl font-bold text-shell-900">1. Ethically Sourced Raw Material</h3>
              <p className="mt-2 text-shell-600 leading-relaxed text-sm md:text-base">
                We work closely with traditional coconut farmers across the Pollachi coastal belt to procure raw husks locally. By transforming discarded coconut husks into valuable growing media, we eliminate agricultural waste while creating dependable supplemental income for rural farming communities.
              </p>
            </div>
          </Reveal>

          {/* 2. Energy */}
          <Reveal delay={100} className="flex flex-col md:flex-row items-start gap-6 rounded-3xl border border-shell-200 bg-white p-8 shadow-sm transition hover:border-leaf-300">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-leaf-50 text-leaf-800">
              <Sun size={28} />
            </span>
            <div>
              <h3 className="font-head text-xl font-bold text-shell-900">2. Solar & Renewable Energy Drying</h3>
              <p className="mt-2 text-shell-600 leading-relaxed text-sm md:text-base">
                We harness the intense natural sunshine of Tamil Nadu. Washed coco pith is spread across expansive, paved concrete yards for solar drying without burning any fossil fuels or diesel heaters. This zero-emission drying method preserves the physical fiber elasticity while keeping our carbon footprint near zero.
              </p>
            </div>
          </Reveal>

          {/* 3. Water */}
          <Reveal delay={200} className="flex flex-col md:flex-row items-start gap-6 rounded-3xl border border-shell-200 bg-white p-8 shadow-sm transition hover:border-leaf-300">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-blue-50 text-blue-800">
              <Droplets size={28} />
            </span>
            <div>
              <h3 className="font-head text-xl font-bold text-shell-900">3. Closed-Loop Water Recycling</h3>
              <p className="mt-2 text-shell-600 leading-relaxed text-sm md:text-base">
                Our multi-stage washing process requires significant fresh water to desalinate sodium and potassium salts. To protect regional water reserves, our facility operates closed-loop sedimentation filtration, rainwater collection catchments, and wastewater recycling for on-site landscaping.
              </p>
            </div>
          </Reveal>
        </div>

        <div className="mt-14 text-center">
          <Button to="/contact">Request Factory Samples & Pricing</Button>
        </div>
      </section>
    </>
  );
}
