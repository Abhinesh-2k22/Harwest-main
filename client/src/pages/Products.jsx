import { PageHero, Button } from '../components/ui';
import { Reveal } from '../lib/motion';
import { useProducts } from '../lib/useProducts';
import { optimizeCloudinaryUrl } from '../lib/media';

function Row({ p, flip, index }) {
  const src = optimizeCloudinaryUrl(p.image || '/images/block.jpg');
  const specs = p.specs || {};

  return (
    <Reveal className={`grid items-center gap-12 lg:grid-cols-2 ${flip ? 'lg:[&>*:first-child]:order-2' : ''}`}>
      <div className="overflow-hidden leaf-radius shadow-xl bg-shell-100 border border-shell-200">
        <img
          src={src}
          alt={p.name}
          loading={index === 0 ? 'eager' : 'lazy'}
          className="aspect-[4/3] w-full object-cover transition duration-700 hover:scale-105"
        />
      </div>
      <div>
        {(p.categories || []).length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {p.categories.map((c) => (
              <span key={c} className="rounded-full border border-leaf-200 bg-leaf-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-leaf-800">
                {c}
              </span>
            ))}
          </div>
        )}
        <h2 className="text-3xl sm:text-4xl font-bold text-shell-900">{p.name}</h2>
        <p className="mt-3 text-base sm:text-lg text-shell-700 leading-relaxed">{p.short}</p>

        {(p.variants || []).length > 0 && (
          <div className="mt-5">
            <p className="text-xs font-bold uppercase tracking-widest text-shell-500">Available Types</p>
            <ul className="mt-2 grid gap-2 sm:grid-cols-2">
              {p.variants.map((v) => (
                <li key={v} className="flex items-center gap-2 rounded-xl border border-shell-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-shell-800 shadow-sm">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-leaf-500" />
                  {v}
                </li>
              ))}
            </ul>
          </div>
        )}
        {Object.keys(specs).length > 0 && (
          <dl className="mt-6 divide-y divide-shell-200 overflow-hidden rounded-2xl bg-white shadow-sm border border-shell-200/80">
            {Object.entries(specs).map(([k, v]) => (
              <div key={k} className="flex justify-between px-5 py-3 text-sm transition hover:bg-leaf-50/50">
                <dt className="font-medium text-shell-600">{k}</dt>
                <dd className="font-semibold text-shell-900 text-right">{v}</dd>
              </div>
            ))}
          </dl>
        )}

        <div className="mt-8">
          <Button to="/contact">Request Container Quote</Button>
        </div>
      </div>
    </Reveal>
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
      <div className="mx-auto max-w-7xl space-y-24 px-6 py-20">
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
