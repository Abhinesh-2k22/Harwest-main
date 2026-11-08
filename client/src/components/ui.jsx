import { Link } from 'react-router-dom';
import { ArrowUpRight, ChevronRight } from 'lucide-react';
import { useAsset } from '../context/MediaContext';
import { Reveal } from '../lib/motion';

export function PageHero({ eyebrow, title, text, image, video, breadcrumb }) {
  const assetSrc = useAsset(image);
  const videoSrc = useAsset(video);
  const src = image && /^(https?:)?\//.test(image) ? image : assetSrc;
  const vSrc = video && /^(https?:)?\//.test(video) ? video : videoSrc;

  return (
    <section className="grain relative isolate flex h-[380px] md:h-[420px] flex-col justify-center overflow-hidden bg-leaf-950 pt-24 text-white">
      {/* Background Video if configured, otherwise Background Image */}
      {vSrc ? (
        <video
          key={vSrc}
          src={vSrc}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 -z-20 h-full w-full object-cover opacity-35"
        />
      ) : src ? (
        <img
          src={src}
          alt=""
          className="absolute inset-0 -z-20 h-full w-full animate-kenburns object-cover opacity-25"
        />
      ) : null}

      {/* Modern Ambient Radial Glows */}
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-24 h-72 w-72 rounded-full bg-leaf-500/10 blur-3xl pointer-events-none" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-leaf-950/85 via-leaf-950/60 to-leaf-950/95" />

      <div className="mx-auto w-full max-w-7xl px-6">
        {breadcrumb && (
          <nav className="mb-4 flex items-center gap-2 text-xs text-white/60 font-medium" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-white transition">Home</Link>
            <ChevronRight size={12} />
            <span className="text-coconut-300 font-semibold">{breadcrumb}</span>
          </nav>
        )}
        {eyebrow && (
          <p className="animate-rise font-head text-xs uppercase tracking-[.25em] text-coconut-300 font-semibold">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-2 max-w-3xl animate-rise text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl" style={{ animationDelay: '.1s' }}>
          {title}
        </h1>
        {text && (
          <p className="mt-4 max-w-2xl animate-rise text-base md:text-lg text-white/85 leading-relaxed" style={{ animationDelay: '.2s' }}>
            {text}
          </p>
        )}
      </div>
    </section>
  );
}

export function SectionTitle({ eyebrow, title, text, center }) {
  return (
    <Reveal className={center ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      {eyebrow && (
        <p className="font-head text-xs uppercase tracking-[.25em] text-leaf-700 font-bold">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-2 text-3xl font-bold tracking-tight text-shell-900 md:text-4xl lg:text-5xl">
        {title}
      </h2>
      {text && (
        <p className="mt-4 text-base md:text-lg text-shell-700 leading-relaxed">
          {text}
        </p>
      )}
    </Reveal>
  );
}

export function ProductCard({ product, delay = 0 }) {
  const src = product.image || '/images/block.jpg';

  return (
    <Reveal delay={delay}>
      <Link
        to="/products"
        className="group block overflow-hidden leaf-radius bg-white border border-shell-200/70 shadow-sm transition duration-500 hover:-translate-y-2 hover:shadow-xl hover:border-leaf-300"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-shell-100">
          <img
            src={src}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-leaf-950/60 via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
          <span className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/95 text-leaf-800 shadow-md opacity-0 transition duration-300 group-hover:rotate-45 group-hover:opacity-100">
            <ArrowUpRight size={18} />
          </span>
        </div>
        <div className="p-6">
          <h3 className="font-head text-xl font-bold text-shell-900 group-hover:text-leaf-700 transition">
            {product.name}
          </h3>
          <p className="mt-2 text-sm text-shell-600 line-clamp-2 leading-relaxed">
            {product.short}
          </p>
          <div className="mt-4 flex items-center text-xs font-bold text-leaf-700 group-hover:text-leaf-800">
            <span>Explore Specs</span>
            <ArrowUpRight size={14} className="ml-1 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>
      </Link>
    </Reveal>
  );
}

export function Button({ to, children, variant = 'primary', onClick, className = '', ...rest }) {
  const styles = {
    primary: 'bg-leaf-600 text-white shadow-lg shadow-leaf-950/25 hover:bg-leaf-500',
    ghost: 'border border-white/40 text-white hover:bg-white/10 backdrop-blur-sm',
    shell: 'bg-shell-700 text-white hover:bg-shell-800 shadow-md',
    outline: 'border border-leaf-600 text-leaf-800 hover:bg-leaf-50',
  };

  const cls = `inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 font-head text-sm font-semibold transition hover:-translate-y-0.5 ${styles[variant]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={cls} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={cls} {...rest}>
      {children}
    </button>
  );
}
