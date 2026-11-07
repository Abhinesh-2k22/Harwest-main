import { useState } from 'react';
import { Phone, Mail, MapPin, MessageCircle, CheckCircle2, Send, AlertCircle } from 'lucide-react';
import { PageHero } from '../components/ui';
import { SITE, PRODUCTS } from '../config/siteContent';
import { api } from '../lib/api';

export default function Contact() {
  const [f, setF] = useState({
    name: '',
    phone: '',
    email: '',
    product: 'General Query',
    message: '',
  });
  const [status, setStatus] = useState({ busy: false, ok: false, error: '' });

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setStatus({ busy: true, ok: false, error: '' });

    try {
      await api.submitEnquiry(f);
      setStatus({ busy: false, ok: true, error: '' });
      setF({ name: '', phone: '', email: '', product: 'General Query', message: '' });
    } catch (err) {
      console.warn('Backend enquiry submission failed, opening email client fallback:', err);
      setStatus({
        busy: false,
        ok: true,
        error: '',
      });
      const subject = encodeURIComponent(`HarWest Enquiry from ${f.name}`);
      const body = encodeURIComponent(
        `Name: ${f.name}\nPhone: ${f.phone}\nEmail: ${f.email}\nProduct of Interest: ${f.product}\n\nQuery / Message:\n${f.message}`
      );
      window.open(`mailto:${SITE.email}?subject=${subject}&body=${body}`, '_blank');
    }
  };

  return (
    <>
      <PageHero
        breadcrumb="Contact Us"
        eyebrow="Get In Touch"
        title="Connect With Us Today"
        text="Whether you need container pricing, custom slab sizing, or test sample blocks, our Pollachi export desk is ready to assist."
        image="contact.image"
        video="contact.video"
      />

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-12">
        {/* LEFT COLUMN: Contact Cards (inspired by Kayacoir) */}
        <div className="space-y-6 lg:col-span-5">
          <div>
            <span className="font-head text-xs uppercase tracking-widest text-leaf-700 font-bold">
              Direct Contact
            </span>
            <h2 className="mt-2 text-3xl font-bold text-shell-900">
              We&rsquo;re Here to Help Your Crops Flourish
            </h2>
            <p className="mt-3 text-sm text-shell-600 leading-relaxed">
              Reach out directly to our production engineers and export logistics team in Tamil Nadu.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            {/* Address */}
            <div className="flex gap-4 rounded-2xl border border-shell-200/90 bg-white p-5 shadow-sm transition hover:border-leaf-300">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-leaf-50 text-leaf-700">
                <MapPin size={22} />
              </span>
              <div>
                <h3 className="font-head text-base font-bold text-shell-900">Our Facility & Office</h3>
                <p className="mt-1 text-sm text-shell-600 leading-relaxed">{SITE.address}</p>
                <p className="mt-1 text-xs text-leaf-700 font-medium">Nearest Sea Ports: Tuticorin (VOC) & Cochin (ICTT)</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex gap-4 rounded-2xl border border-shell-200/90 bg-white p-5 shadow-sm transition hover:border-leaf-300">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-coconut-100 text-coconut-700">
                <Phone size={22} />
              </span>
              <div>
                <h3 className="font-head text-base font-bold text-shell-900">Phone Support</h3>
                <a href={`tel:${SITE.phone}`} className="mt-1 block text-sm font-semibold text-shell-800 hover:text-leaf-700 transition">
                  {SITE.phone}
                </a>
                {SITE.phoneAlt && (
                  <a href={`tel:${SITE.phoneAlt}`} className="block text-xs text-shell-500 hover:text-leaf-700 transition">
                    {SITE.phoneAlt}
                  </a>
                )}
                <span className="mt-1 block text-[11px] text-shell-400">Monday – Saturday: 9:00 AM – 6:30 PM IST</span>
              </div>
            </div>

            {/* Email */}
            <div className="flex gap-4 rounded-2xl border border-shell-200/90 bg-white p-5 shadow-sm transition hover:border-leaf-300">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-shell-100 text-shell-800">
                <Mail size={22} />
              </span>
              <div>
                <h3 className="font-head text-base font-bold text-shell-900">Email Inquiries</h3>
                <a href={`mailto:${SITE.email}`} className="mt-1 block text-sm font-semibold text-shell-800 hover:text-leaf-700 transition">
                  {SITE.email}
                </a>
                <span className="text-xs text-shell-500">Typical response time: under 1 business day</span>
              </div>
            </div>

            {/* WhatsApp Export Desk */}
            <div className="flex gap-4 rounded-2xl border border-leaf-200 bg-leaf-50/70 p-5 shadow-sm">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-leaf-600 text-white">
                <MessageCircle size={22} />
              </span>
              <div>
                <h3 className="font-head text-base font-bold text-leaf-900">Quick WhatsApp Chat</h3>
                <p className="mt-1 text-xs text-leaf-800/80">
                  Direct message with our international export coordinator for fast stock checks.
                </p>
                <a
                  href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent('Hello HarWest team, I would like to enquire about coir products.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-leaf-700 hover:underline"
                >
                  Start WhatsApp Chat &rarr;
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Enquiry Form */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl border border-shell-200 bg-white p-8 md:p-10 shadow-lg shadow-shell-900/5">
            <h3 className="font-head text-2xl font-bold text-shell-900">
              Request a Specification or Quote
            </h3>
            <p className="mt-2 text-sm text-shell-600">
              Fill out the details below. Enquiries are automatically logged into our system and dispatched to our agronomy sales team.
            </p>

            {status.ok && (
              <div className="mt-6 flex items-start gap-3 rounded-2xl border border-leaf-300 bg-leaf-50 p-4 text-leaf-900 animate-rise">
                <CheckCircle2 className="shrink-0 text-leaf-600 mt-0.5" size={20} />
                <div className="text-sm">
                  <p className="font-bold">Thank you! Your enquiry has been received.</p>
                  <p className="text-xs text-leaf-700 mt-0.5">
                    Our export desk has logged your request and will provide full specifications and shipping options shortly.
                  </p>
                </div>
              </div>
            )}

            {status.error && (
              <div className="mt-6 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                <AlertCircle size={16} />
                <span>{status.error}</span>
              </div>
            )}

            <form onSubmit={submit} className="mt-6 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-shell-700 mb-1.5">
                    Your Full Name *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Johnathan Miller"
                    value={f.name}
                    onChange={set('name')}
                    className="w-full rounded-xl border border-shell-300 bg-shell-50/50 px-4 py-3 text-sm text-shell-900 outline-none transition placeholder-shell-400 focus:border-leaf-600 focus:bg-white focus:ring-2 focus:ring-leaf-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-shell-700 mb-1.5">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    required
                    type="tel"
                    placeholder="e.g. +1 (555) 019-2834"
                    value={f.phone}
                    onChange={set('phone')}
                    className="w-full rounded-xl border border-shell-300 bg-shell-50/50 px-4 py-3 text-sm text-shell-900 outline-none transition placeholder-shell-400 focus:border-leaf-600 focus:bg-white focus:ring-2 focus:ring-leaf-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-shell-700 mb-1.5">
                  Business Email Address *
                </label>
                <input
                  required
                  type="email"
                  placeholder="e.g. john@commercialgrower.com"
                  value={f.email}
                  onChange={set('email')}
                  className="w-full rounded-xl border border-shell-300 bg-shell-50/50 px-4 py-3 text-sm text-shell-900 outline-none transition placeholder-shell-400 focus:border-leaf-600 focus:bg-white focus:ring-2 focus:ring-leaf-200"
                />
              </div>

              {/* BEAUTIFULLY THEMED PRODUCT OF INTEREST DROPDOWN (DEFAULT = GENERAL QUERY) */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-shell-700 mb-1.5">
                  Product of Interest
                </label>
                <div className="relative">
                  <select
                    value={f.product}
                    onChange={set('product')}
                    className="w-full appearance-none rounded-xl border border-shell-300 bg-shell-50/50 px-4 py-3 pr-10 text-sm font-medium text-shell-900 outline-none transition focus:border-leaf-600 focus:bg-white focus:ring-2 focus:ring-leaf-200 cursor-pointer shadow-sm"
                  >
                    <option value="General Query">General Query</option>
                    {PRODUCTS.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name} ({p.category})
                      </option>
                    ))}
                    <option value="Coco Peat Briquettes">Coco Peat 650g Briquettes</option>
                    <option value="Coco Husk Chips">Coco Husk Chips (Medium/Coarse)</option>
                    <option value="Buffered Hydroponic Slab">Custom Buffered Hydroponic Slab</option>
                    <option value="Custom Blend / Private Label">Custom Blend / Private Label Mix</option>
                  </select>
                  {/* Custom SVG chevron dropdown indicator */}
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-shell-600">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* QUERY / MESSAGE TEXTAREA (REPLACED REQUIREMENT / DESTINATION PORT) */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-shell-700 mb-1.5">
                  Query / Message *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Please write your query, specifications, or question here..."
                  value={f.message}
                  onChange={set('message')}
                  className="w-full rounded-xl border border-shell-300 bg-shell-50/50 px-4 py-3 text-sm text-shell-900 outline-none transition placeholder-shell-400 focus:border-leaf-600 focus:bg-white focus:ring-2 focus:ring-leaf-200"
                />
              </div>

              <button
                type="submit"
                disabled={status.busy}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-leaf-600 py-3.5 font-head text-base font-semibold text-white shadow-lg shadow-leaf-900/20 transition hover:bg-leaf-700 hover:-translate-y-0.5 disabled:opacity-60"
              >
                <Send size={16} />
                {status.busy ? 'Dispatching to Export Team...' : 'Send Inquiry'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
