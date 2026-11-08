import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Menu, X, Leaf, Phone, Mail, MapPin, MessageCircle, Linkedin, Instagram, Facebook, Sparkles } from 'lucide-react';
import { NAV, SITE } from '../config/siteContent';
import { useAsset } from '../context/MediaContext';
import { api } from '../lib/api';

function Logo() {
  const logo = useAsset('branding.logo');
  return (
    <div className="group flex items-center">
      {logo ? (
        <img
          src={logo}
          alt={SITE.name}
          className="h-10 sm:h-12 md:h-14 w-auto max-w-[210px] sm:max-w-[260px] object-contain object-left transition-transform duration-300 group-hover:scale-[1.02] drop-shadow-[0_2px_8px_rgba(0,0,0,0.2)]"
        />
      ) : (
        <span className="flex items-center gap-2 font-head text-2xl font-bold tracking-tight text-white">
          <Leaf className="animate-sway text-leaf-300" size={26} strokeWidth={2.2} />
          Har<span className="text-coconut-300 font-bold">West</span>
        </span>
      )}
    </div>
  );
}

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setOpen(false);
    setScrolled(false);
  }, [pathname]);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 transition-all duration-300">
      {/* Top Utility Bar (visible at start of scroll) */}
      <div
        className={`transition-all duration-300 overflow-hidden ${
          scrolled ? 'max-h-0 opacity-0' : 'max-h-24 border-b border-white/10 bg-leaf-950/90 text-white/80'
        }`}
      >
        <div className="mx-auto flex min-h-10 max-w-7xl flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-1.5 text-[11px] font-medium sm:px-6 sm:text-xs">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 sm:gap-6">
            <a href={`tel:${SITE.phone}`} className="flex items-center gap-1.5 whitespace-nowrap transition hover:text-white">
              <Phone size={13} className="shrink-0 text-leaf-300" />
              <span>{SITE.phone}</span>
            </a>
            <a href={`mailto:${SITE.email}`} className="flex items-center gap-1.5 whitespace-nowrap transition hover:text-white">
              <Mail size={13} className="shrink-0 text-leaf-300" />
              <span>{SITE.email}</span>
            </a>
          </div>
          <div className="hidden items-center gap-5 sm:flex">
            <span className="hidden lg:inline text-[11px] text-white/60">Pollachi, India · Worldwide Export</span>
            <div className="flex items-center gap-3">
              <a href={SITE.socials.find(s => s.label === 'LinkedIn')?.href || "https://linkedin.com"} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-white/75 transition hover:text-white">
                <Linkedin size={14} />
              </a>
              <a href={SITE.socials.find(s => s.label === 'Instagram')?.href || "https://instagram.com"} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-white/75 transition hover:text-white">
                <Instagram size={14} />
              </a>
              <a href={SITE.socials.find(s => s.label === 'Facebook')?.href || "https://facebook.com"} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-white/75 transition hover:text-white">
                <Facebook size={14} />
              </a>
              <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="text-white/75 transition hover:text-leaf-300">
                <MessageCircle size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar - Always crisp white text on deep evergreen glass */}
      <div
        className={`transition-all duration-300 ${
          scrolled
            ? 'bg-leaf-950/95 shadow-xl shadow-black/25 backdrop-blur-md border-b border-white/10'
            : pathname === '/'
            ? 'bg-gradient-to-b from-leaf-950/90 via-leaf-950/50 to-transparent'
            : 'bg-leaf-950/95 shadow-lg border-b border-white/10'
        }`}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <Link to="/" aria-label="HarWest home">
            <Logo />
          </Link>

          {/* Desktop Nav: Navbar text is ALWAYS in white */}
          <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === '/'}
                className={({ isActive }) =>
                  `group relative rounded-full px-4 py-2 font-head text-[15px] font-medium transition-colors text-white hover:text-leaf-200 ${
                    isActive ? '!font-bold text-white' : 'text-white/90'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {n.label}
                    <span
                      className={`absolute inset-x-3 -bottom-0.5 h-0.5 origin-left rounded bg-coconut-400 transition-transform duration-300 ${
                        isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ))}
            <Link
              to="/contact"
              className="ml-3 inline-flex items-center gap-1.5 rounded-full bg-leaf-600 px-5 py-2.5 font-head text-sm font-semibold text-white shadow-lg shadow-leaf-950/30 transition hover:-translate-y-0.5 hover:bg-leaf-500"
            >
              <Sparkles size={14} className="text-coconut-300" />
              Get a Quote
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="rounded-lg p-2 text-white hover:bg-white/10 md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-x-0 top-[calc(5rem)] z-40 bg-leaf-950/98 px-6 py-6 shadow-2xl backdrop-blur-xl transition-all duration-300 md:hidden border-b border-white/10 ${
          open ? 'opacity-100 translate-y-0' : 'pointer-events-none -translate-y-4 opacity-0'
        }`}
      >
        <div className="flex flex-col gap-3">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === '/'}
              className={({ isActive }) =>
                `rounded-xl px-4 py-3 font-head text-base font-semibold text-white transition ${
                  isActive ? 'bg-white/15 !text-white font-bold' : 'hover:bg-white/5'
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
          <Link
            to="/contact"
            className="mt-2 text-center rounded-xl bg-leaf-600 py-3 font-head text-sm font-semibold text-white shadow-md"
          >
            Get a Quote
          </Link>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const onSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="relative isolate mt-24 overflow-hidden bg-gradient-to-b from-leaf-800 via-leaf-900 to-leaf-950 text-shell-100">
      {/* Botanical line-art pattern (leaves, berries, tomatoes…) tinted into the green theme */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[url('/images/footer-pattern.png')] bg-[length:760px_auto] bg-center opacity-[0.22] invert mix-blend-screen"
      />
      {/* Soft green vignette so text stays readable over the pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(10,21,12,0.55)_100%)]"
      />
      {/* Top Banner: Crafted for HAPPY BLOOMS & HIGH YIELDS */}
      <div className="border-b border-white/10 bg-leaf-950/30">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-6 py-8">
          <div>
            <p className="font-head text-xs uppercase tracking-widest text-coconut-300 font-semibold">Crafted for</p>
            <h2 className="font-head text-2xl font-bold tracking-tight text-white md:text-3xl">
              HAPPY BLOOMS & HIGH YIELDS
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href={`tel:${SITE.phone}`}
              className="flex items-center gap-2 font-head text-base md:text-lg font-semibold text-white transition hover:text-coconut-200"
            >
              <span className="grid h-10 w-10 place-items-center rounded-full bg-leaf-800/80 text-coconut-300">
                <Phone size={18} />
              </span>
              {SITE.phone}
            </a>
            <Link
              to="/contact"
              className="rounded-full bg-leaf-600 px-6 py-2.5 font-head text-sm font-semibold text-white shadow-lg transition hover:bg-leaf-500 hover:-translate-y-0.5"
            >
              Ask Free Question Here
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Body with 4 Columns & Plant Symbols */}
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-2 lg:grid-cols-4">
        {/* Col 1: Brand Info (Requested text removed per user instructions) */}
        <div className="space-y-4">
          <Logo />
          <div className="flex items-center gap-3 pt-4">
            <span className="text-xs uppercase tracking-wider text-white/50">Follow Us:</span>
            <a
              href={SITE.socials.find(s => s.label === 'LinkedIn')?.href || "https://linkedin.com"}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white hover:bg-leaf-600 transition"
            >
              <Linkedin size={14} />
            </a>
            <a
              href={SITE.socials.find(s => s.label === 'Instagram')?.href || "https://instagram.com"}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white hover:bg-leaf-600 transition"
            >
              <Instagram size={14} />
            </a>
            <a
              href={SITE.socials.find(s => s.label === 'Facebook')?.href || "https://facebook.com"}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white hover:bg-leaf-600 transition"
            >
              <Facebook size={14} />
            </a>
            <a
              href={`https://wa.me/${SITE.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white hover:bg-leaf-600 transition"
            >
              <MessageCircle size={14} />
            </a>
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div>
          <h3 className="font-head text-base font-bold uppercase tracking-wider text-white">Quick Links</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-shell-200/85">
            {NAV.map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="inline-block transition hover:translate-x-1 hover:text-white">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3: Contact Us */}
        <div>
          <h3 className="font-head text-base font-bold uppercase tracking-wider text-white">Contact Us</h3>
          <ul className="mt-4 space-y-3.5 text-sm text-shell-200/85">
            <li className="flex items-start gap-2.5">
              <MapPin size={16} className="mt-0.5 shrink-0 text-leaf-400" />
              <span>{SITE.address}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone size={15} className="shrink-0 text-leaf-400" />
              <a href={`tel:${SITE.phone}`} className="hover:text-white transition">
                {SITE.phone}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail size={15} className="shrink-0 text-leaf-400" />
              <a href={`mailto:${SITE.email}`} className="hover:text-white transition">
                {SITE.email}
              </a>
            </li>
          </ul>
        </div>

        {/* Col 4: Newsletter & Direct Catalog Request */}
        <div>
          <h3 className="font-head text-base font-bold uppercase tracking-wider text-white">Newsletter</h3>
          <p className="mt-3 text-xs leading-relaxed text-shell-300">
            Subscribe for seasonal harvest reports, bulk container export schedules, and greenhouse coir tips.
          </p>
          <form onSubmit={onSubscribe} className="mt-4 space-y-2">
            <div className="flex rounded-xl bg-white/10 p-1 border border-white/15 focus-within:border-leaf-400">
              <input
                type="email"
                required
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent px-3 py-1.5 text-xs text-white placeholder-white/50 outline-none"
              />
              <button
                type="submit"
                className="shrink-0 rounded-lg bg-leaf-600 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-leaf-500"
              >
                Join
              </button>
            </div>
            {subscribed && (
              <p className="text-xs text-leaf-300">Thank you for subscribing to HarWest updates!</p>
            )}
          </form>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="border-t border-white/10 bg-leaf-950 py-6 text-center text-xs text-shell-300/70">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6">
          <p>© {new Date().getFullYear()} HarWest Coir Substrates. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/about" className="hover:text-white transition">About Us</Link>
            <Link to="/products" className="hover:text-white transition">Products</Link>
            <Link to="/contact" className="hover:text-white transition">Export Inquiries</Link>
            <Link to="/admin" className="hover:text-white transition opacity-60">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Layout() {
  const { pathname } = useLocation();

  // Record 1 website visit per user session, and record each tab navigation under Tab Clicks
  useEffect(() => {
    let isNewVisit = false;
    try {
      if (!sessionStorage.getItem('hw_session_visit_counted')) {
        sessionStorage.setItem('hw_session_visit_counted', '1');
        isNewVisit = true;
      }
    } catch {
      isNewVisit = true;
    }
    api.recordVisit(pathname, isNewVisit).catch(() => {});
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-shell-50 text-shell-900 selection:bg-leaf-800 selection:text-white">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
