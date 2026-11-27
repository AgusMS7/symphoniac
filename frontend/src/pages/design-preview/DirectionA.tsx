import { ArrowRight, Heart, ShieldCheck, Truck } from "lucide-react"

import {
  DirectionIntro,
  DpButton,
  MiniNav,
  SectionLabel,
  Stat,
  imageUrl,
  type Product,
} from "./shared"

const products: Product[] = [
  {
    name: "Guitarra criolla de estudio",
    brand: "Yamaha · CG192",
    price: "$ 480.000",
    image: imageUrl("photo-1510915361894-db8b60106cb1", 900),
    tag: "Cuerdas",
  },
  {
    name: "Piano vertical de taller",
    brand: "Kawai · K-15",
    price: "$ 1.240.000",
    image: imageUrl("photo-1520523839897-bd0b52f945a0", 900),
    tag: "Teclados",
  },
  {
    name: "Violín de estudio 4/4",
    brand: "Stentor · SR1500",
    price: "$ 320.000",
    image: imageUrl("photo-1513883049090-d0b7439799bf", 900),
    tag: "Cuerdas frotadas",
  },
]

const specs = [
  ["Maderas", "Cedro / palosanto"],
  ["Escala", "650 mm"],
  ["Cuerdas", "6 · nylon"],
  ["Terminación", "Nitrocelulosa"],
]

export function DirectionA() {
  return (
    <section id="dir-a" className="dir-a scroll-mt-20 border-t dp-line">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
        <DirectionIntro
          index="A"
          title="Taller de luthería"
          description="Cálida, editorial, artesanal. La madera y el papel mandan; la tipografía serif y el aire hacen el resto."
          type="Fraunces + Inter"
          tone="Cálido · artesanal"
        />

        <div className="dp-frame dp-paper dp-reveal overflow-hidden rounded-2xl">
          <MiniNav variant="a" />

          <div className="grid gap-8 p-5 sm:p-8 lg:grid-cols-[1.05fr_0.95fr] lg:p-12">
            <div className="flex flex-col justify-center">
              <p className="dp-mono text-[10px] uppercase tracking-[0.25em] dp-accent">
                Desde 2009 · Buenos Aires
              </p>
              <h3 className="dp-display mt-4 text-5xl leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
                Instrumentos que se eligen{" "}
                <span className="italic dp-accent">con el oído</span> y con las
                manos.
              </h3>
              <p className="dp-muted mt-5 max-w-md text-base leading-relaxed">
                Curamos cada pieza con luthiers y músicos. Menos catálogo, más
                criterio: lo que ves es lo que probamos.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <DpButton>
                  Explorar catálogo
                  <ArrowRight className="size-4" />
                </DpButton>
                <DpButton variant="outline">Conocer el taller</DpButton>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-4 border-t dp-line pt-5">
                <Stat value="15" label="años" />
                <Stat value="+120" label="marcas" />
                <Stat value="48 h" label="envío" />
              </div>
            </div>

            <div className="relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.25rem] border dp-line">
                <img
                  src={imageUrl("photo-1510915361894-db8b60106cb1", 1200)}
                  alt="Guitarra criolla apoyada en un taller de luthería"
                  className="size-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                <div className="absolute inset-x-4 bottom-4 rounded-xl border border-white/15 bg-black/45 p-4 backdrop-blur">
                  <p className="dp-mono text-[9px] uppercase tracking-[0.2em] text-white/60">
                    Selección del taller
                  </p>
                  <p className="dp-display mt-1 text-xl text-white">
                    Guitarra criolla · Cedro y palosanto
                  </p>
                  <p className="dp-mono mt-1 text-xs text-white/70">
                    $ 480.000
                  </p>
                </div>
              </div>
              <div className="absolute -left-3 top-8 hidden rounded-full border dp-line dp-surface px-4 py-2 dp-mono text-[9px] uppercase tracking-[0.2em] dp-accent-2 sm:block">
                Hecho a mano
              </div>
            </div>
          </div>

          <div className="border-t dp-line p-5 sm:p-8 lg:p-12">
            <SectionLabel action="Ver todo">
              Selección del taller
            </SectionLabel>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <article
                  key={product.name}
                  className="dp-card-hover group overflow-hidden rounded-xl border dp-line dp-surface-2"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute left-3 top-3 border border-white/15 bg-black/45 px-2 py-1 dp-mono text-[9px] uppercase tracking-[0.18em] text-white/80 backdrop-blur">
                      {product.tag}
                    </span>
                    <button
                      type="button"
                      aria-label={`Guardar ${product.name}`}
                      className="absolute right-3 top-3 grid size-9 place-items-center rounded-full border border-white/15 bg-black/35 text-white/75 backdrop-blur transition-colors hover:text-white"
                    >
                      <Heart className="size-4" />
                    </button>
                  </div>
                  <div className="p-4">
                    <p className="dp-mono text-[9px] uppercase tracking-[0.18em] dp-muted">
                      {product.brand}
                    </p>
                    <h4 className="dp-display mt-1 text-xl leading-tight">
                      {product.name}
                    </h4>
                    <div className="mt-3 flex items-end justify-between gap-3">
                      <p className="dp-display text-lg dp-accent">
                        {product.price}
                      </p>
                      <button
                        type="button"
                        className="dp-mono text-[9px] uppercase tracking-[0.16em] dp-muted transition-colors hover:text-[var(--dir-text)]"
                      >
                        Ver ficha
                      </button>
                    </div>
                    <p className="dp-mono mt-3 flex items-center gap-1.5 border-t dp-line pt-3 text-[9px] uppercase tracking-[0.14em] dp-muted">
                      <Truck className="size-3.5" /> Envío gratis
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="border-t dp-line p-5 sm:p-8 lg:p-12">
            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl border dp-line">
                <img
                  src={imageUrl("photo-1550985616-10810253b84d", 1000)}
                  alt="Detalle de la caja de una guitarra"
                  loading="lazy"
                  className="size-full object-cover"
                />
              </div>
              <div>
                <p className="dp-mono text-[10px] uppercase tracking-[0.22em] dp-accent">
                  Ficha de taller
                </p>
                <h4 className="dp-display mt-2 text-3xl leading-tight sm:text-4xl">
                  La madera decide el carácter. La mano, el resto.
                </h4>
                <p className="dp-muted mt-3 text-sm leading-relaxed">
                  Cada instrumento llega con una ficha escrita por el luthier
                  que lo ajustó: maderas, escala, cuerdas y una nota de sonido.
                </p>
                <dl className="mt-5 grid gap-2 border-t dp-line pt-4 text-sm">
                  {specs.map(([label, value]) => (
                    <div
                      key={label}
                      className="flex items-center justify-between gap-4 border-b dp-line pb-2 last:border-0 last:pb-0"
                    >
                      <dt className="dp-mono text-[9px] uppercase tracking-[0.16em] dp-muted">
                        {label}
                      </dt>
                      <dd className="text-right text-sm">{value}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <DpButton size="sm">
                    Ver ficha completa
                    <ArrowRight className="size-4" />
                  </DpButton>
                  <span className="dp-mono flex items-center gap-1.5 text-[9px] uppercase tracking-[0.14em] dp-muted">
                    <ShieldCheck className="size-3.5" /> Garantía real
                  </span>
                </div>
              </div>
            </div>
          </div>

          <footer className="border-t dp-line px-5 py-6 sm:px-8 lg:px-12">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <img src="/icons/logo.svg" alt="" className="size-5" />
                <span className="dp-display text-base font-semibold">
                  Symphoniac
                </span>
                <span className="dp-mono text-[9px] uppercase tracking-[0.16em] dp-muted">
                  Taller · Buenos Aires
                </span>
              </div>
              <div className="flex flex-wrap gap-4 dp-mono text-[9px] uppercase tracking-[0.16em] dp-muted">
                <button
                  type="button"
                  className="hover:text-[var(--dir-text)]"
                >
                  Instrumentos
                </button>
                <button
                  type="button"
                  className="hover:text-[var(--dir-text)]"
                >
                  Taller
                </button>
                <button
                  type="button"
                  className="hover:text-[var(--dir-text)]"
                >
                  Contacto
                </button>
                <span>© 2026</span>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </section>
  )
}
