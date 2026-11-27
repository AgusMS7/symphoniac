import { ArrowRight, Play, Plus, Volume2 } from "lucide-react"

import { imageUrl, type Product } from "./data"
import {
  DirectionIntro,
  DpButton,
  MiniNav,
  SectionLabel,
  Stat,
} from "./shared"

const products: Product[] = [
  {
    name: "Guitarra eléctrica ST",
    brand: "Fender · Player II",
    price: "$ 1.850.000",
    image: imageUrl("photo-1516280440614-37939bbacd81", 900),
    tag: "En stock",
  },
  {
    name: "Bajo activo 5 cuerdas",
    brand: "Ibanez · SR305",
    price: "$ 980.000",
    image: imageUrl("photo-1550985616-10810253b84d", 900),
    tag: "Nuevo",
  },
  {
    name: "Estación de estudio",
    brand: "Symphoniac · Session",
    price: "$ 720.000",
    image: imageUrl("photo-1511379938547-c1f69419868d", 900),
    tag: "Demo",
  },
]

const setlist = [
  "Cuerpo de aliso",
  "Mástil de arce",
  "Pastillas activas",
  "Estuche rígido",
]

export function DirectionB() {
  return (
    <section id="dir-b" className="dir-b scroll-mt-20 border-t dp-line">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
        <DirectionIntro
          index="B"
          title="Escenario"
          description="Nocturna, dramática, escénica. La luz y el contraste mandan; la tipografía display y el motion contenido hacen el resto."
          type="Bricolage + Inter"
          tone="Nocturno · escénico"
        />

        <div className="dp-frame dp-noise dp-reveal overflow-hidden rounded-2xl">
          <div className="relative min-h-[560px] overflow-hidden">
            <img
              src={imageUrl("photo-1501386761578-eac5c94b800a", 1600)}
              alt="Escenario con luces de concierto"
              loading="lazy"
              className="absolute inset-0 size-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#09090c] via-[#09090c]/85 to-[#09090c]/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#09090c] via-transparent to-transparent" />
            <MiniNav variant="b" />

            <div className="relative z-10 flex min-h-[560px] flex-col justify-between gap-10 px-6 pb-8 pt-28 sm:px-10 lg:px-14 lg:pt-32">
              <div>
                <p className="dp-mono text-[10px] uppercase tracking-[0.3em] dp-accent">
                  Symphoniac live
                </p>
                <h3 className="dp-display mt-4 max-w-3xl text-6xl leading-[0.9] tracking-[-0.04em] text-white sm:text-7xl lg:text-8xl">
                  El escenario empieza antes de la primera nota.
                </h3>
                <p className="mt-5 max-w-lg text-base leading-relaxed text-white/65">
                  Instrumentos probados en vivo, con la misma exigencia que le
                  pedís a un show. Elegí, enchufá, salí.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <DpButton>
                    Ver instrumentos
                    <ArrowRight className="size-4" />
                  </DpButton>
                  <DpButton variant="outline" tone="light">
                    <Play className="size-4" />
                    Play demo
                  </DpButton>
                </div>
              </div>

              <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex gap-6">
                  <Stat value="120+" label="marcas" />
                  <Stat value="48 h" label="envío" />
                  <Stat value="15" label="años" />
                </div>

                <div className="w-full max-w-xs rounded-xl border border-white/15 bg-black/45 p-4 backdrop-blur">
                  <div className="flex items-center gap-3">
                    <img
                      src={imageUrl("photo-1520523839897-bd0b52f945a0", 200)}
                      alt=""
                      className="size-12 rounded-md object-cover"
                    />
                    <div className="min-w-0">
                      <p className="dp-mono text-[9px] uppercase tracking-[0.18em] text-white/50">
                        Now playing
                      </p>
                      <p className="dp-display truncate text-base text-white">
                        Nocturno en mi menor
                      </p>
                      <p className="dp-mono truncate text-[10px] text-white/50">
                        Symphoniac Sessions
                      </p>
                    </div>
                    <Volume2 className="ml-auto size-4 shrink-0 text-white/60" />
                  </div>
                  <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/15">
                    <div className="h-full w-2/5 rounded-full bg-[var(--dir-accent)]" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t dp-line p-5 sm:p-8 lg:p-12">
            <SectionLabel action="Ver cartelera">En cartelera</SectionLabel>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product, index) => (
                <article
                  key={product.name}
                  className="dp-card-hover group overflow-hidden rounded-xl border dp-line dp-surface"
                >
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <span className="absolute left-3 top-3 border border-white/15 bg-black/45 px-2 py-1 dp-mono text-[9px] uppercase tracking-[0.18em] text-white/80 backdrop-blur">
                      {product.tag}
                    </span>
                    <span className="absolute right-3 top-3 dp-mono text-[10px] text-white/50">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-3">
                      <div>
                        <p className="dp-mono text-[9px] uppercase tracking-[0.18em] text-white/50">
                          {product.brand}
                        </p>
                        <h4 className="dp-display mt-1 text-xl leading-tight text-white">
                          {product.name}
                        </h4>
                      </div>
                      <button
                        type="button"
                        aria-label={`Agregar ${product.name}`}
                        className="grid size-9 shrink-0 place-items-center rounded-full bg-[var(--dir-accent)] text-[#0f0f0f] transition-transform hover:scale-105"
                      >
                        <Plus className="size-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3 px-4 py-3">
                    <p className="dp-display text-lg dp-accent">
                      {product.price}
                    </p>
                    <span className="dp-mono text-[9px] uppercase tracking-[0.16em] dp-muted">
                      Ver ficha
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="border-t dp-line p-5 sm:p-8 lg:p-12">
            <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl border dp-line">
                <img
                  src={imageUrl("photo-1516280440614-37939bbacd81", 1000)}
                  alt="Guitarra eléctrica en detalle"
                  loading="lazy"
                  className="size-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <button
                  type="button"
                  className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full border border-white/20 bg-black/50 px-3 py-2 dp-mono text-[9px] uppercase tracking-[0.16em] text-white backdrop-blur"
                >
                  <Play className="size-3.5" /> Demo en vivo
                </button>
              </div>
              <div>
                <p className="dp-mono text-[10px] uppercase tracking-[0.22em] dp-accent">
                  Ficha de escenario
                </p>
                <h4 className="dp-display mt-2 text-3xl leading-tight sm:text-4xl">
                  Lista para subir al escenario.
                </h4>
                <p className="dp-muted mt-3 text-sm leading-relaxed">
                  Setup revisado, cuerdas nuevas y estuche rígido incluido. Si
                  no te cierra en el local, lo probás en el showroom.
                </p>
                <ol className="mt-5 grid gap-2 border-t dp-line pt-4 text-sm">
                  {setlist.map((item, index) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 border-b dp-line pb-2 last:border-0 last:pb-0"
                    >
                      <span className="dp-mono text-[9px] dp-accent">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ol>
                <div className="mt-5 flex flex-wrap gap-3">
                  <DpButton size="sm">
                    Reservar en showroom
                    <ArrowRight className="size-4" />
                  </DpButton>
                  <DpButton size="sm" variant="outline" tone="light">
                    Comparar
                  </DpButton>
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
                  Live · 2026
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
                  Showroom
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
