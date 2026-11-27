import { Marquee } from "@/components/shadcn-space/animations/marquee"

export function BrandMarquee({ brands }: { brands: string[] }) {
  if (brands.length === 0) return null

  return (
    <section
      aria-label="Marcas que trabajamos"
      className="border-y border-border/60 bg-background"
    >
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-4">
        <p className="hidden shrink-0 font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground sm:block">
          Marcas
        </p>

        <div className="min-w-0 flex-1" aria-hidden="true">
          <Marquee className="p-0" pauseOnHover>
            {brands.map((brand) => (
              <span
                key={brand}
                className="flex items-center gap-6 font-display text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground"
              >
                {brand}
                <span className="size-1.5 rounded-full bg-primary" />
              </span>
            ))}
          </Marquee>
        </div>

        <ul className="sr-only">
          {brands.map((brand) => (
            <li key={brand}>{brand}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}
