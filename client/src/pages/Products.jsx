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
        <h2 className="text-3xl sm:text-4xl font-bold text-shell-900">{p.name}</h2>
        <p className="mt-3 text-base sm:text-lg text-shell-700 leading-relaxed">{p.short}</p>

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
