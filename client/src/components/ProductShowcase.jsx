import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductCard } from './ui';

const GRID_BY_COUNT = {
  1: 'mx-auto max-w-md grid-cols-1',
  2: 'mx-auto max-w-3xl md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-2 lg:grid-cols-4',
};

/**
 * Shows products as a static grid when there are 4 or fewer,
 * and as an auto-scrolling, swipeable carousel when there are more than 4.
 */
export default function ProductShowcase({ products }) {
  const count = products.length;
  if (count === 0) return null;
  if (count <= 4) {
    return (
      <div className={`mt-14 grid gap-8 ${GRID_BY_COUNT[count]}`}>
        {products.map((p, i) => (
          <ProductCard key={p._id || p.id || i} product={p} delay={i * 120} />
        ))}
      </div>
    );
  }
  return <Carousel products={products} />;
}

function Carousel({ products }) {
  const trackRef = useRef(null);
  const [paused, setPaused] = useState(false);

  const scrollByCard = useCallback((dir) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.firstElementChild;
    const step = card ? card.getBoundingClientRect().width + 32 : el.clientWidth;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8;
    if (dir > 0 && atEnd) el.scrollTo({ left: 0, behavior: 'smooth' });
    else el.scrollBy({ left: dir * step, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (paused) return undefined;
    const t = setInterval(() => scrollByCard(1), 4000);
    return () => clearInterval(t);
  }, [paused, scrollByCard]);

  return (
    <div
      className="relative mt-14"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-8 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {products.map((p, i) => (
          <div
            key={p._id || p.id || i}
            className="w-[85%] shrink-0 snap-start sm:w-[calc(50%-1rem)] lg:w-[calc(25%-1.5rem)]"
          >
            <ProductCard product={p} delay={0} />
          </div>
        ))}
      </div>
      <button
        type="button"
        aria-label="Previous products"
        onClick={() => scrollByCard(-1)}
        className="absolute -left-3 top-1/3 grid h-11 w-11 place-items-center rounded-full bg-white text-leaf-800 shadow-lg ring-1 ring-shell-200 transition hover:bg-leaf-600 hover:text-white md:-left-5"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        type="button"
        aria-label="Next products"
        onClick={() => scrollByCard(1)}
        className="absolute -right-3 top-1/3 grid h-11 w-11 place-items-center rounded-full bg-white text-leaf-800 shadow-lg ring-1 ring-shell-200 transition hover:bg-leaf-600 hover:text-white md:-right-5"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
