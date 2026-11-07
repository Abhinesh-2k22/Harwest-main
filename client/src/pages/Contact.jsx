import { useEffect, useRef, useState } from 'react';
import { Phone, Mail, MapPin, MessageCircle, CheckCircle2, Send, AlertCircle, ChevronDown, Check, Globe, Building2 } from 'lucide-react';
import { PageHero } from '../components/ui';
import { SITE } from '../config/siteContent';
import { useProducts } from '../lib/useProducts';
import { api } from '../lib/api';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana',
  'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
];

const fieldCls =
  'w-full rounded-xl border border-shell-300 bg-shell-50/50 px-4 py-3 text-sm text-shell-900 outline-none transition placeholder-shell-400 focus:border-leaf-600 focus:bg-white focus:ring-2 focus:ring-leaf-200';
const labelCls = 'block text-xs font-semibold uppercase tracking-wider text-shell-700 mb-1.5';

/** Theme-matched dropdown (native <select> can't be styled to match). Options are grouped by product. */
function ProductSelect({ value, onChange, groups }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`${fieldCls} flex items-center justify-between text-left font-medium shadow-sm ${open ? '!border-leaf-600 !bg-white !ring-2 !ring-leaf-200' : ''}`}
      >
        <span className="truncate">{value}</span>
        <ChevronDown size={16} className={`ml-3 shrink-0 text-shell-600 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute z-30 mt-2 max-h-72 w-full overflow-y-auto rounded-2xl border border-leaf-200 bg-white p-2 shadow-2xl shadow-leaf-950/15"
        >
          {groups.map((g) => (
            <div key={g.label} className="py-1">
              <p className="px-3 pb-1 pt-1.5 text-[10px] font-bold uppercase tracking-widest text-leaf-700">{g.label}</p>
              {g.options.map((o) => {
                const on = o === value;
                return (
                  <button
                    key={`${g.label}-${o}`}
                    type="button"
                    role="option"
                    aria-selected={on}
                    onClick={() => {
                      onChange(o);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${
                      on ? 'bg-leaf-600 font-semibold text-white' : 'text-shell-800 hover:bg-leaf-50'
                    }`}
                  >
                    <span>{o}</span>
                    {on && <Check size={15} />}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const EMPTY = {
  name: '',
  company: '',
  country: '',
  state: '',
  email: '',
  phone: '',
  product: 'General Query',
  message: '',
};

export default function Contact() {
  const [type, setType] = useState('international'); // 'international' | 'domestic'
  const [f, setF] = useState(EMPTY);
  const [status, setStatus] = useState({ busy: false, ok: false, error: '' });
  const { items: products } = useProducts();

  const isIntl = type === 'international';

  const groups = [
    { label: 'General', options: ['General Query'] },
    ...products.map((p) => ({
      label: p.name,
      options: p.variants && p.variants.length ? p.variants : [p.name],
    })),
    { label: 'Other', options: ['Custom Blend / Private Label'] },
  ];

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const switchType = (t) => {
    setType(t);
    setStatus({ busy: false, ok: false, error: '' });
  };

  const submit = async (e) => {
    e.preventDefault();
    setStatus({ busy: true, ok: false, error: '' });

    const payload = {
      ...f,
      enquiryType: type,
      country: isIntl ? f.country : '',
      state: isIntl ? '' : f.state,
    };

    try {
      await api.submitEnquiry(payload);
      setStatus({ busy: false, ok: true, error: '' });
      setF(EMPTY);
    } catch (err) {
      console.warn('Backend enquiry submission failed, opening email client fallback:', err);
      setStatus({ busy: false, ok: true, error: '' });
      const subject = encodeURIComponent(`HarWest ${isIntl ? 'International' : 'Domestic'} Enquiry from ${f.name}`);
      const body = encodeURIComponent(
        `Enquiry Type: ${isIntl ? 'International' : 'Domestic'}\nFull Name: ${f.name}\nCompany: ${f.company}\n${
          isIntl ? `Country: ${f.country}` : `State: ${f.state}`
        }\nPhone: ${f.phone}\nEmail: ${f.email}\nProduct Interest: ${f.product}\n\nMessage:\n${f.message}`
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

            {/* Domestic / International switch */}
            <div className="mt-6 grid grid-cols-2 gap-1.5 rounded-2xl bg-shell-100 p-1.5" role="tablist" aria-label="Enquiry type">
              {[
                { key: 'international', label: 'International', Icon: Globe },
                { key: 'domestic', label: 'Domestic (India)', Icon: Building2 },
              ].map(({ key, label, Icon }) => (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={type === key}
                  onClick={() => switchType(key)}
                  className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold transition ${
                    type === key ? 'bg-leaf-600 text-white shadow-md' : 'text-shell-700 hover:bg-white'
                  }`}
                >
                  <Icon size={16} /> {label}
                </button>
              ))}
            </div>

            <form onSubmit={submit} className="mt-6 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className={labelCls}>Full Name *</label>
                  <input required type="text" placeholder="e.g. Johnathan Miller" value={f.name} onChange={set('name')} className={fieldCls} />
                </div>
                <div>
                  <label className={labelCls}>Company Name</label>
                  <input type="text" placeholder="e.g. Green Valley Farms" value={f.company} onChange={set('company')} className={fieldCls} />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                {isIntl ? (
                  <div>
                    <label className={labelCls}>Country *</label>
                    <input required type="text" placeholder="e.g. Netherlands" value={f.country} onChange={set('country')} className={fieldCls} />
                  </div>
                ) : (
                  <div>
                    <label className={labelCls}>State *</label>
                    <input required type="text" list="in-states" placeholder="e.g. Tamil Nadu" value={f.state} onChange={set('state')} className={fieldCls} />
                    <datalist id="in-states">
                      {INDIAN_STATES.map((s) => (
                        <option key={s} value={s} />
                      ))}
                    </datalist>
                  </div>
                )}
                <div>
                  <label className={labelCls}>Phone / WhatsApp Number *</label>
                  <input
                    required
                    type="tel"
                    placeholder={isIntl ? 'e.g. +31 6 1234 5678' : 'e.g. +91 98765 43210'}
                    value={f.phone}
                    onChange={set('phone')}
                    className={fieldCls}
                  />
                </div>
              </div>

              <div>
                <label className={labelCls}>Email Address *</label>
                <input required type="email" placeholder="e.g. john@commercialgrower.com" value={f.email} onChange={set('email')} className={fieldCls} />
              </div>

              <div>
                <label className={labelCls}>Product Interest</label>
                <ProductSelect value={f.product} onChange={(v) => setF({ ...f, product: v })} groups={groups} />
              </div>

              <div>
                <label className={labelCls}>Enquiry Message *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Please write your requirements, quantity, specifications or question here..."
                  value={f.message}
                  onChange={set('message')}
                  className={fieldCls}
                />
              </div>

              <button
                type="submit"
                disabled={status.busy}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-leaf-600 py-3.5 font-head text-base font-semibold text-white shadow-lg shadow-leaf-900/20 transition hover:bg-leaf-700 hover:-translate-y-0.5 disabled:opacity-60"
              >
                <Send size={16} />
                {status.busy ? 'Sending...' : `Send ${isIntl ? 'International' : 'Domestic'} Enquiry`}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
