import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
  useCarousel,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Instrumento } from "../../types/Instrumento"
import { getImageUrl, handleImageError } from "../../utils/imageUtils"

type FeaturedCarouselProps = {
  instruments: Instrumento[]
}

const formatearPrecio = (precio: number) =>
  `$${precio.toLocaleString("es-AR")}`

function CarouselControls() {
  const { scrollPrev, scrollNext, canScrollPrev, canScrollNext } = useCarousel()

  return (
    <div className="flex items-center gap-1">
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={scrollPrev}
        disabled={!canScrollPrev}
        aria-label="Instrumento anterior"
      >
        <ChevronLeft className="size-4" aria-hidden="true" />
      </Button>
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={scrollNext}
        disabled={!canScrollNext}
        aria-label="Instrumento siguiente"
      >
        <ChevronRight className="size-4" aria-hidden="true" />
      </Button>
    </div>
  )
}

export function FeaturedCarousel({ instruments }: FeaturedCarouselProps) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!api) return

    const onSelect = () => setCurrent(api.selectedScrollSnap())
    onSelect()
    api.on("select", onSelect)

    return () => {
      api.off("select", onSelect)
    }
  }, [api])

  if (instruments.length === 0) return null

  return (
    <section aria-labelledby="en-cartelera" className="mt-14">
      <Carousel
        setApi={setApi}
        opts={{ loop: true }}
        className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-start"
        aria-label="Instrumentos destacados"
      >
        <div className="relative">
          <CarouselContent>
            {instruments.map((instrumento) => {
              const imageSrc = getImageUrl(
                instrumento.primaryImage,
                instrumento.imagen,
              )
              const isPlaceholder =
                !instrumento.primaryImage &&
                (!instrumento.imagen || instrumento.imagen.trim() === "")

              return (
                <CarouselItem key={instrumento.id}>
                  <article className="relative overflow-hidden rounded-2xl border border-border/40 bg-muted">
                    <img
                      src={imageSrc}
                      alt={instrumento.instrumento}
                      loading="lazy"
                      className="aspect-[4/3] w-full object-cover"
                      onError={(event) => handleImageError(event)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/10 to-transparent" />
                    <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/40 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-white/80 backdrop-blur">
                      {isPlaceholder ? "Imagen de referencia" : "En cartelera"}
                    </span>
                    <div className="absolute inset-x-4 bottom-4">
                      <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/55">
                        {instrumento.marca} · {instrumento.modelo}
                      </p>
                      <h3 className="mt-1 font-display text-2xl leading-tight text-white sm:text-3xl">
                        {instrumento.instrumento}
                      </h3>
                    </div>
                    <div className="absolute right-4 top-4 hidden font-mono text-[9px] uppercase tracking-[0.18em] text-white/55 sm:block">
                      {String(current + 1).padStart(2, "0")} /{" "}
                      {String(instruments.length).padStart(2, "0")}
                    </div>
                  </article>
                </CarouselItem>
              )
            })}
          </CarouselContent>
        </div>

        <div className="flex flex-col">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary">
                En cartelera
              </p>
              <h2
                id="en-cartelera"
                className="mt-2 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
              >
                Destacados del showroom
              </h2>
            </div>
            <CarouselControls />
          </div>

          <ol className="flex flex-col">
            {instruments.map((instrumento, index) => {
              const active = current === index
              return (
                <li key={instrumento.id}>
                  <button
                    type="button"
                    onClick={() => api?.scrollTo(index)}
                    aria-current={active ? "true" : undefined}
                    className={cn(
                      "group flex w-full cursor-pointer items-start gap-3 border-b border-border/60 border-l-2 py-3 pl-3 pr-1 text-left transition-colors",
                      active
                        ? "border-l-primary bg-muted/30"
                        : "border-l-transparent hover:bg-muted/20",
                    )}
                  >
                    <span className="pt-0.5 font-mono text-[9px] text-muted-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-display text-base font-semibold text-foreground">
                        {instrumento.instrumento}
                      </span>
                      <span className="mt-0.5 block font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                        {instrumento.marca} · {instrumento.modelo}
                      </span>
                    </span>
                    <span className="shrink-0 font-display text-sm font-semibold text-primary">
                      {formatearPrecio(instrumento.precio)}
                    </span>
                  </button>
                </li>
              )
            })}
          </ol>

          <Button variant="ghost" asChild className="mt-4 w-fit">
            <Link to="/productos">
              Ver todo
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </Carousel>
    </section>
  )
}
