import { useEffect, useRef, useState } from 'react';

/** Adds `.in` class once scrolled into view (pairs with .reveal in index.css). */
export function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('in'); io.disconnect(); } },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

export function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) {
  const ref = useReveal();
  return (
    <Tag ref={ref} style={{ transitionDelay: `${delay}ms` }} className={`reveal ${className}`} {...rest}>
      {children}
    </Tag>
  );
}

/** Counts up from 0 when visible. Accepts strings like "12,000" or "25+". */
export function useCountUp(target, duration = 1600) {
  const ref = useRef(null);
  const [text, setText] = useState(target);
  useEffect(() => {
    const m = String(target).match(/^([\d,]+)(.*)$/);
    if (!m) return;
    const end = Number(m[1].replace(/,/g, ''));
    const suffix = m[2];
    setText('0' + suffix);
    const el = ref.current;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (t) => {
        const p = Math.min((t - t0) / duration, 1);
        const v = Math.round(end * (1 - Math.pow(1 - p, 3)));
        setText(v.toLocaleString('en-US') + suffix);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => io.disconnect();
  }, [target, duration]);
  return [ref, text];
}
