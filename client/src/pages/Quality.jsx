import { useState, useEffect } from 'react';
import { ChevronDown, ShieldCheck, CheckCircle2, Award, FileText, FlaskConical } from 'lucide-react';
import { PageHero, SectionTitle, Button } from '../components/ui';
import { Reveal } from '../lib/motion';
import { PROCESS, FAQ, CERTIFICATIONS } from '../config/siteContent';
import { api } from '../lib/api';

function Faq({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-hidden rounded-2xl border border-shell-200/80 bg-white shadow-sm transition hover:border-leaf-300">
      <button
        className="flex w-full items-center justify-between px-6 py-5 text-left font-head text-lg font-semibold text-shell-900 transition hover:text-leaf-700"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="flex items-center gap-3">
          <span className="text-leaf-600 font-bold">{open ? '−' : '+'}</span>
          {q}
        </span>
        <ChevronDown className={`shrink-0 transition-transform duration-300 ${open ? 'rotate-180 text-leaf-600' : 'text-shell-400'}`} />
      </button>
      <div className={`grid transition-all duration-300 ease-in-out ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <p className="overflow-hidden px-6 text-shell-700 leading-relaxed">
          <span className="block pb-5 pt-1 pl-6 text-sm md:text-base border-l-2 border-leaf-200 ml-1">{a}</span>
        </p>
      </div>
    </div>
  );
}

export default function Quality() {
  const [faqs, setFaqs] = useState(FAQ);

  useEffect(() => {
    api
      .getFaqs()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setFaqs(data.map((d) => ({ q: d.question, a: d.answer })));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <PageHero
        breadcrumb="Quality & Certifications"
        eyebrow="Certified Excellence"
        title="Tested. Washed. Globally Certified."
        text="Every batch is lab-verified for EC, pH, expansion and pathogen purity before container sealing."
        image="quality.image"
        video="quality.video"
      />

      {/* CERTIFICATIONS GRID (Referencing kayacoir) */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <SectionTitle
          center
          eyebrow="International Accreditations"
          title="Globally Recognised Standards"
          text="We adhere to the highest European and international horticultural standards."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CERTIFICATIONS.map((c, i) => (
            <Reveal key={c.code} delay={i * 80} className="flex flex-col justify-between rounded-3xl border border-shell-200/80 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-leaf-100 px-3 py-1 font-head text-xs font-bold text-leaf-800">
                    {c.code}
                  </span>
                  <Award size={20} className="text-coconut-500" />
                </div>
                <h3 className="mt-4 font-head text-xl font-bold text-shell-900">{c.title}</h3>
                <p className="text-xs font-semibold uppercase tracking-wider text-leaf-700 mt-1">{c.subtitle}</p>
                <p className="mt-3 text-sm text-shell-600 leading-relaxed">{c.desc}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-shell-100 flex items-center gap-2 text-xs font-bold text-leaf-700">
                <CheckCircle2 size={15} />
                <span>Verified Facility Compliance</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* LAB TESTING PARAMETERS */}
      <section className="bg-leaf-950 text-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <p className="font-head text-xs uppercase tracking-widest text-coconut-300 font-semibold">Laboratory Verification</p>
              <h2 className="mt-2 text-3xl font-bold md:text-4xl">Rigorous In-House & 3rd-Party Batch QC</h2>
              <p className="mt-4 text-white/80 leading-relaxed text-sm md:text-base">
                Prior to hydraulic compaction, random samples are taken from every washing lot. We test with calibrated Hanna & Eutech scientific probes using 1:1.5 extraction method.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-white/10 p-4 border border-white/10">
                  <span className="text-coconut-300 font-head text-2xl font-bold">&lt; 0.5 mS/cm</span>
                  <p className="text-xs text-white/70 mt-1">Electrical Conductivity (Washed)</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4 border border-white/10">
                  <span className="text-coconut-300 font-head text-2xl font-bold">5.5 – 6.5</span>
                  <p className="text-xs text-white/70 mt-1">Balanced Substrate pH</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4 border border-white/10">
                  <span className="text-coconut-300 font-head text-2xl font-bold">&lt; 18%</span>
                  <p className="text-xs text-white/70 mt-1">Export Block Moisture</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4 border border-white/10">
                  <span className="text-coconut-300 font-head text-2xl font-bold">75+ Litres</span>
                  <p className="text-xs text-white/70 mt-1">Hydration Volume per 5kg</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white/5 p-8 border border-white/10 backdrop-blur-sm">
              <h3 className="font-head text-xl font-bold text-white mb-4 flex items-center gap-2">
                <FlaskConical size={20} className="text-coconut-300" /> Laboratory Batch Certificate Included
              </h3>
              <p className="text-xs text-white/80 leading-relaxed">
                Every container shipment is accompanied by a Certificate of Analysis (CoA) containing:
              </p>
              <ul className="mt-4 space-y-2.5 text-xs text-white/90">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-coconut-300 shrink-0" />
                  <span>Sodium (Na) & Chloride (Cl) ppm assay</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-coconut-300 shrink-0" />
                  <span>Sieve particle distribution (% pith vs fiber vs chips)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-coconut-300 shrink-0" />
                  <span>Phytosanitary inspection & methyl bromide/heat treatment stamp</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-coconut-300 shrink-0" />
                  <span>Heavy metal (Pb, Cd, As) screening test</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS TIMELINE */}
      <section className="mx-auto max-w-5xl px-6 py-24">
        <SectionTitle eyebrow="Production Protocol" title="Four Steps to Export Grade" />
        <div className="mt-12 space-y-6 border-l-2 border-leaf-300 pl-8">
          {PROCESS.map((p, i) => (
            <Reveal key={p.title} delay={i * 80} className="relative rounded-2xl border border-shell-200 bg-white p-6 shadow-sm transition hover:translate-x-2">
              <span className="absolute -left-[3.05rem] top-6 h-4 w-4 rounded-full bg-leaf-600 ring-4 ring-shell-50" />
              <h3 className="text-xl font-bold text-shell-900">{p.title}</h3>
              <p className="mt-1 text-shell-600 text-sm leading-relaxed">{p.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="mx-auto max-w-3xl px-6 pb-6 sm:pb-8">
        <SectionTitle center eyebrow="Knowledge Base" title="Frequently Asked Questions" />
        <div className="mt-10 space-y-4">
          {faqs.map((f) => (
            <Faq key={f.q} {...f} />
          ))}
        </div>
      </section>
    </>
  );
}
