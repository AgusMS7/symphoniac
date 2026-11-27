import {
  ArrowRight,
  Check,
  Plus,
  ShieldCheck,
  SlidersHorizontal,
  Truck,
} from "lucide-react"

import {
  DirectionIntro,
  DpButton,
  MiniNav,
  Stat,
  imageUrl,
  type Product,
} from "./shared"

const products: Product[] = [
  {
    name: "Guitarra clásica",
    brand: "Yamaha · CG192",
    price: "$ 480.000",
    image: imageUrl("photo-1510915361894-db8b60106cb1", 700),
    tag: "CG192",
  },
  {
    name: "Piano digital",
    brand: "Roland · FP-30X",
    price: "$ 1.120.000",
    image: imageUrl("photo-1520523839897-bd0b52f945a0", 700),
    tag: "FP30X",
  },
  {
    name: "Violín 4/4",
    brand: "Stentor · SR1500",
    price: "$ 320.000",
    image: imageUrl("photo-1513883049090-d0b7439799bf", 700),
    tag: "SR1500",
  },
  {
    name: "Bajo 5 cuerdas",
    brand: "Ibanez · SR305",
    price: "$ 980.000",
    image: imageUrl("photo-1550985616-10810253b84d", 700),
    tag: "SR305",
  },
]

const specs = [
  ["Cuerpo", "Cedro"],
  ["Tapa", "Abeto sólido"],
  ["Mástil", "Nato"],
  ["Diapasón", "Palosanto"],
  ["Escala", "650 mm"],
  ["Cuerdas", "6 · nylon"],
]

const filters = ["Todos", "Cuerdas", "Teclados", "Vientos"]

export function DirectionC() {
  return (
    <section id="dir-c" className="dir-c scroll-mt-20 border-t dp-line">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
        <DirectionIntro
          index="C"
          title="Instrumento de precisión"
          description="Técnica, suiza, medible. Grilla, líneas finas y mono para comparar; la densidad justa para decidir rápido."
          type="Inter + IBM Plex Mono"
          tone="Técnico · exacto"
        />

        <div className="dp-frame dp-grid dp-reveal overflow-hidden rounded-none">
          <MiniNav variant="c" />

          <div className="grid gap-8 p-5 sm:p-8 lg:grid-cols-[1.05fr_0.95fr] lg:p-12">
            <div className="flex flex-col justify-center">
              <p className="dp-mono text-[10px] uppercase tracking-[0.25em] dp-accent">
                SYM-01 / Catálogo 2026
              </p>
              <h3 className="dp-display mt-4 text-5xl leading-[0.95] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
                Cada instrumento, medido.
              </h3>
              <div className="mt-5 flex items-center gap-3">
                <span className="h-px flex-1 bg-[var(--dir-line)]" />
                <span className="dp-mono text-[9px] uppercase tracking-[0.18em] dp-muted">
                  Ficha técnica + disponibilidad
                </span>
              </div>
              <p className="dp-muted mt-5 max-w-md text-base leading-relaxed">
                Compará medidas, maderas y terminaciones sin adivinar. La misma
                lectura para todos los modelos.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <DpButton shape="square">
                  Abrir catálogo
                  <ArrowRight className="size-4" />
                </DpButton>
                <DpButton shape="square" variant="outline">
                  Comparar modelos
                </DpButton>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-4 border-t dp-line pt-5">
                <Stat value="142" label="modelos" />
                <Stat value="38" label="marcas" />
                <Stat value="HOY" label="actualizado" />
              </div>
            </div>

            <div className="dp-corner relative aspect-[4/5] overflow-hidden border dp-line dp-surface-2">
              <img
                src={imageUrl("photo-1525201548942-d8732f6617a0", 1000)}
                alt="Mástil de guitarra en detalle"
                loading="lazy"
                className="size-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/20" />
              <div className="absolute inset-x-6 top-1/3 h-px bg-[var(--dir-accent-2)] opacity-70" />
              <div className="absolute inset-y-8 left-[58%] w-px bg-[var(--dir-accent-2)] opacity-70" />
              <span className="absolute right-6 top-1/3 -translate-y-1/2 bg-[var(--dir-bg)] px-1 dp-mono text-[9px] uppercase tracking-[0.16em] dp-accent-2">
                650 mm
              </span>
              <span className="absolute left-[58%] top-8 -translate-x-1/2 bg-[var(--dir-bg)] px-1 dp-mono text-[9px] uppercase tracking-[0.16em] dp-accent-2">
                43 mm
              </span>
              <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-4 border-t border-white/15 pt-3">
                <div>
                  <p className="dp-mono text-[9px] uppercase tracking-[0.18em] text-white/55">
                    SYM-CG192 / 01
                  </p>
                  <p className="dp-display mt-1 text-xl text-white">
                    Guitarra clásica
                  </p>
                </div>
                <p className="dp-mono text-[10px] uppercase tracking-[0.16em] text-white/70">
                  Escala 650 mm
                </p>
              </div>
            </div>
          </div>

          <div className="border-t dp-line p-5 sm:p-8 lg:p-12">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <h4 className="dp-display text-2xl leading-tight sm:text-3xl">
                Catálogo / 04 resultados
              </h4>
              <div className="flex flex-wrap gap-2">
                {filters.map((filter, index) => (
                  <button
                    key={filter}
                    type="button"
                    className={`border px-2.5 py-2 dp-mono text-[9px] uppercase tracking-[0.16em] transition-colors ${
                      index === 0
                        ? "border-[var(--dir-accent)] bg-[var(--dir-accent)] text-[#0f0f0f]"
                        : "dp-line dp-muted hover:text-[var(--dir-text)]"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product, index) => (
                <article
                  key={product.name}
                  className="dp-card-hover group border dp-line dp-surface"
                >
                  <div className="relative aspect-square overflow-hidden border-b dp-line">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute left-2 top-2 bg-black/60 px-1.5 py-0.5 dp-mono text-[9px] uppercase tracking-[0.16em] dp-accent-2 backdrop-blur">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="p-3">
                    <p className="dp-mono text-[9px] uppercase tracking-[0.16em] dp-muted">
                      {product.brand}
                    </p>
                    <h4 className="dp-display mt-1 text-lg leading-tight">
                      {product.name}
                    </h4>
                    <div className="mt-2 flex items-center justify-between gap-2 border-t dp-line pt-2">
                      <span className="dp-mono text-[9px] uppercase tracking-[0.14em] dp-muted">
                        {product.tag}
                      </span>
                      <span className="dp-display text-base dp-accent">
                        {product.price}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="border-t dp-line p-5 sm:p-8 lg:p-12">
            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div className="relative aspect-[4/3] overflow-hidden border dp-line dp-surface-2">
                <img
                  src={imageUrl("photo-1510915361894-db8b60106cb1", 1000)}
                  alt="Caja de guitarra clásica"
                  loading="lazy"
                  className="size-full object-cover"
                />
                <div className="absolute inset-0 dp-scanline opacity-40" />
              </div>
              <div>
                <p className="dp-mono text-[10px] uppercase tracking-[0.22em] dp-accent">
                  Ficha técnica / CG192
                </p>
                <h4 className="dp-display mt-2 text-3xl leading-tight sm:text-4xl">
                  Guitarra clásica de estudio
                </h4>
                <p className="dp-muted mt-3 text-sm leading-relaxed">
                  Tapa sólida, escala de 650 mm y acción ajustada de fábrica. La
                  ficha completa incluye medidas, maderas y stock por sucursal.
                </p>

                <div className="mt-5 overflow-hidden border dp-line">
                  <table className="w-full border-collapse text-left">
                    <tbody>
                      {specs.map(([label, value]) => (
                        <tr
                          key={label}
                          className="border-b dp-line last:border-0"
                        >
                          <th
                            scope="row"
                            className="w-1/2 border-r dp-line px-3 py-2 dp-mono text-[9px] uppercase tracking-[0.16em] dp-muted"
                          >
                            {label}
                          </th>
                          <td className="px-3 py-2 text-sm">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <DpButton size="sm" shape="square">
                    Agregar al carrito
                    <Plus className="size-4" />
                  </DpButton>
                  <DpButton size="sm" shape="square" variant="outline">
                    Comparar
                    <SlidersHorizontal className="size-4" />
                  </DpButton>
                </div>

                <div className="mt-4 flex flex-wrap gap-4 dp-mono text-[9px] uppercase tracking-[0.14em] dp-muted">
                  <span className="flex items-center gap-1.5">
                    <Check className="size-3.5 dp-accent-2" /> Stock: 3
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Truck className="size-3.5" /> Envío 48 h
                  </span>
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="size-3.5" /> Garantía 12 meses
                  </span>
                </div>
              </div>
            </div>
          </div>

          <footer className="border-t dp-line px-5 py-6 sm:px-8 lg:px-12">
            <div className="grid gap-6 sm:grid-cols-3">
              <div>
                <p className="dp-mono text-[9px] uppercase tracking-[0.18em] dp-muted">
                  Catálogo
                </p>
                <div className="mt-2 grid gap-1 text-sm">
                  {["Cuerdas", "Teclados", "Vientos"].map((item) => (
                    <button
                      key={item}
                      type="button"
                      className="text-left transition-colors hover:text-[var(--dir-accent)]"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="dp-mono text-[9px] uppercase tracking-[0.18em] dp-muted">
                  Soporte
                </p>
                <div className="mt-2 grid gap-1 text-sm">
                  {["Envíos", "Garantía", "Contacto"].map((item) => (
                    <button
                      key={item}
                      type="button"
                      className="text-left transition-colors hover:text-[var(--dir-accent)]"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="dp-mono text-[9px] uppercase tracking-[0.18em] dp-muted">
                  Symphoniac
                </p>
                <p className="mt-2 text-sm dp-muted">
                  Instrumentos medidos, probados y documentados.
                </p>
                <p className="mt-3 dp-mono text-[9px] uppercase tracking-[0.16em] dp-muted">
                  SYM-01 / 2026
                </p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </section>
  )
}
