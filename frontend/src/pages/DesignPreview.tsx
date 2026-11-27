import { ArrowRight, ArrowUpRight } from "lucide-react"

import { DirectionA } from "./design-preview/DirectionA"
import { DirectionB } from "./design-preview/DirectionB"
import { DirectionC } from "./design-preview/DirectionC"
import { PreviewFonts } from "./design-preview/shared"
import "./design-preview/design-preview.css"

const directions = [
  {
    id: "dir-a",
    index: "A",
    title: "Taller de luthería",
    short: "Cálida, editorial, artesanal.",
    type: "Fraunces + Inter",
    swatches: ["#ff7f32", "#b87333", "#14110e"],
  },
  {
    id: "dir-b",
    index: "B",
    title: "Escenario",
    short: "Nocturna, dramática, escénica.",
    type: "Bricolage + Inter",
    swatches: ["#ff7f32", "#09090c", "#f7f7fb"],
  },
  {
    id: "dir-c",
    index: "C",
    title: "Instrumento de precisión",
    short: "Técnica, suiza, medible.",
    type: "Inter + IBM Plex Mono",
    swatches: ["#ff7f32", "#10b981", "#0d0f10"],
  },
]

const comparison = [
  {
    label: "Tipografía",
    a: "Fraunces + Inter",
    b: "Bricolage Grotesque + Inter",
    c: "Inter + IBM Plex Mono",
  },
  {
    label: "Textura",
    a: "Papel, madera, ruido suave",
    b: "Luz, negro, glass",
    c: "Grilla, líneas, scanline",
  },
  { label: "Densidad", a: "Media", b: "Baja", c: "Alta" },
  {
    label: "Tono",
    a: "Cálido y artesanal",
    b: "Dramático y nocturno",
    c: "Técnico y exacto",
  },
  {
    label: "Mejor para",
    a: "Contar el oficio y la curaduría",
    b: "Vender deseo y experiencia",
    c: "Comparar y decidir rápido",
  },
]

export function DesignPreview() {
  return (
    <div className="min-h-screen bg-[#0b0b0c] text-white">
      <PreviewFonts />

      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0b0b0c]/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
          <a
            href="/"
            className="flex items-center gap-2"
            aria-label="Volver a Symphoniac"
          >
            <img src="/icons/logo.svg" alt="" className="size-6" />
            <span className="font-display text-lg font-semibold tracking-tight">
              Symphoniac
            </span>
            <span className="ml-2 rounded-full border border-white/15 px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.18em] text-white/55">
              Fase 6
            </span>
          </a>

          <nav
            aria-label="Direcciones"
            className="hidden items-center gap-6 text-xs text-white/55 md:flex"
          >
            <a href="#dir-a" className="transition-colors hover:text-white">
              A · Taller
            </a>
            <a href="#dir-b" className="transition-colors hover:text-white">
              B · Escenario
            </a>
            <a href="#dir-c" className="transition-colors hover:text-white">
              C · Precisión
            </a>
            <a href="#comparar" className="transition-colors hover:text-white">
              Comparar
            </a>
          </nav>

          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-white/55 transition-colors hover:text-white"
          >
            Volver al sitio
            <ArrowUpRight className="size-3.5" />
          </a>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-4 pb-10 pt-14 sm:pt-20">
          <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-[#ff7f32]">
            Fase 6 / Direcciones visuales
          </p>
          <h1 className="mt-3 max-w-4xl font-display text-4xl font-bold leading-[1.02] tracking-tight sm:text-6xl">
            Tres formas de vestir la misma tienda.
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/55 sm:text-base">
            Misma paleta, mismos componentes, distinta jerarquía. Cada bloque es
            una maqueta de home, grilla y ficha de producto. La base estructural
            viene de bloques Free de shadcnspace; acá se ve el tratamiento.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {directions.map((direction) => (
              <a
                key={direction.id}
                href={`#${direction.id}`}
                className="group rounded-xl border border-white/10 bg-white/[0.025] p-4 transition-colors hover:border-white/20 hover:bg-white/[0.045]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/40">
                    {direction.index}
                  </span>
                  <ArrowRight className="size-4 text-white/30 transition-transform group-hover:translate-x-0.5 group-hover:text-[#ff7f32]" />
                </div>
                <p className="mt-3 font-display text-xl font-semibold">
                  {direction.title}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-white/50">
                  {direction.short}
                </p>
                <div className="mt-4 flex gap-1">
                  {direction.swatches.map((color) => (
                    <span
                      key={color}
                      className="h-1.5 flex-1 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <p className="mt-3 text-[10px] uppercase tracking-[0.16em] text-white/35">
                  {direction.type}
                </p>
              </a>
            ))}
          </div>
        </section>

        <DirectionA />
        <DirectionB />
        <DirectionC />

        <section id="comparar" className="scroll-mt-20 border-t border-white/10">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
            <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-[#ff7f32]">
              Comparar
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Qué cambia entre A, B y C
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/55">
              La dirección B · Escenario fue la elegida. A y C quedan como
              referencia del proceso; la implementación real ya usa Bricolage +
              Inter, superficies frías y controles pill.
            </p>

            <div className="mt-6 overflow-x-auto rounded-xl border border-white/10">
              <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.03]">
                    <th className="px-4 py-3 text-[10px] font-medium uppercase tracking-[0.16em] text-white/40">
                      Criterio
                    </th>
                    <th className="px-4 py-3 font-display text-base">
                      A · Taller
                    </th>
                    <th className="px-4 py-3 font-display text-base">
                      B · Escenario
                    </th>
                    <th className="px-4 py-3 font-display text-base">
                      C · Precisión
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((row) => (
                    <tr
                      key={row.label}
                      className="border-b border-white/10 last:border-0"
                    >
                      <th
                        scope="row"
                        className="px-4 py-3 text-[10px] font-medium uppercase tracking-[0.14em] text-white/40"
                      >
                        {row.label}
                      </th>
                      <td className="px-4 py-3 text-white/70">{row.a}</td>
                      <td className="px-4 py-3 text-white/70">{row.b}</td>
                      <td className="px-4 py-3 text-white/70">{row.c}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 rounded-xl border border-[#ff7f32]/25 bg-[#ff7f32]/[0.06] p-4">
              <p className="text-sm leading-relaxed text-white/70">
                <span className="font-medium text-white">Estado:</span>{" "}
                B · Escenario aprobada e implementada en las páginas reales.
                Quedan el checkpoint visual, las capturas de Fase 8 y la
                documentación del design system.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-[10px] uppercase tracking-[0.14em] text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <span>Preview temporal · Fase 6 · No es la implementación final</span>
          <span>Imágenes de referencia: Unsplash</span>
        </div>
      </footer>
    </div>
  )
}
