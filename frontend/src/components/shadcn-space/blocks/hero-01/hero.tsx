import { Link } from "react-router-dom"
import { motion, useReducedMotion } from "motion/react"
import { ArrowUpRight } from "lucide-react"

import { AnimatedCta } from "@/components/shop/animated-cta"
import { Button } from "@/components/ui/button"
import { usePointerSpotlight } from "@/lib/use-pointer-spotlight"

type HeroFeatured = {
  name: string
  brand: string
  price: string
  href: string
  imageSrc?: string
}

type HeroSectionProps = {
  className?: string
  onCtaClick?: () => void
  featured?: HeroFeatured
}

function HeroSection({ className, onCtaClick, featured }: HeroSectionProps) {
  const reduceMotion = useReducedMotion()
  const offset = reduceMotion ? 0 : 18
  const transition = { duration: 0.5, ease: "easeOut" as const }
  const handlePointerMove = usePointerSpotlight<HTMLDivElement>()

  return (
    <section className={className}>
      <div
        className="hero-stage relative isolate overflow-hidden bg-background"
        onPointerMove={handlePointerMove}
      >
        <img
          src="/site/hero-stage.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-20 size-full object-cover opacity-40"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-r from-background via-background/85 to-background/15"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-background/40 to-background/10"
        />
        <div
          aria-hidden="true"
          className="hero-spotlight pointer-events-none absolute -z-10 size-[1400px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
        />
        <div
          aria-hidden="true"
          className="grain-overlay pointer-events-none absolute inset-0 -z-10 opacity-[0.06]"
        />

        <div className="mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-14 sm:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pb-24 lg:pt-24">
          <div>
            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: offset }}
              animate={{ opacity: 1, y: 0 }}
              transition={transition}
              className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-primary"
            >
              <span className="size-1.5 rounded-full bg-primary" />
              Symphoniac live
            </motion.p>

            <motion.h1
              initial={reduceMotion ? false : { opacity: 0, y: offset }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...transition, delay: 0.05 }}
              className="mt-4 max-w-3xl font-display text-5xl leading-[0.9] tracking-[-0.04em] text-foreground sm:text-6xl lg:text-8xl"
            >
              El escenario empieza antes de la primera nota.
            </motion.h1>

            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: offset }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...transition, delay: 0.1 }}
              className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground"
            >
              Instrumentos probados en vivo, con la misma exigencia que le pedís
              a un show. Elegí, enchufá, salí.
            </motion.p>

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: offset }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...transition, delay: 0.15 }}
              className="mt-7 flex flex-wrap gap-3"
            >
              <AnimatedCta onClick={onCtaClick}>Ver instrumentos</AnimatedCta>
              <Button asChild variant="outline" size="lg" className="h-12">
                <Link to="/donde-estamos">
                  Conocer el showroom
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            </motion.div>

            <motion.dl
              initial={reduceMotion ? false : { opacity: 0, y: offset }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...transition, delay: 0.2 }}
              className="mt-8 grid grid-cols-3 gap-4 border-t border-border/60 pt-5"
            >
              <div>
                <dt className="font-display text-2xl font-semibold leading-none text-foreground">
                  15
                </dt>
                <dd className="mt-1 font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                  años
                </dd>
              </div>
              <div>
                <dt className="font-display text-lg font-semibold leading-none text-foreground">
                  Showroom
                </dt>
                <dd className="mt-1 font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                  Mendoza
                </dd>
              </div>
              <div>
                <dt className="font-display text-lg font-semibold leading-none text-foreground">
                  Envíos
                </dt>
                <dd className="mt-1 font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                  a todo el país
                </dd>
              </div>
            </motion.dl>
          </div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: offset }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transition, delay: 0.1 }}
            className="relative mx-auto w-full max-w-sm lg:ml-auto"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-border/40 bg-muted">
              {featured?.imageSrc ? (
                <img
                  src={featured.imageSrc}
                  alt={featured.name}
                  className="size-full object-cover"
                  onError={(event) => {
                    event.currentTarget.src = "/site/placeholder-instrument.jpg"
                  }}
                />
              ) : (
                <img
                  src="/site/placeholder-instrument.jpg"
                  alt=""
                  aria-hidden="true"
                  className="size-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent" />
              <span className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/40 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-white/80 backdrop-blur">
                En cartelera
              </span>
              <div className="absolute inset-x-4 bottom-4">
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/55">
                  {featured?.brand ?? "Catálogo en vivo"}
                </p>
                <p className="mt-1 font-display text-2xl leading-tight text-white">
                  {featured?.name ?? "Instrumentos para hacer música"}
                </p>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <p className="font-display text-lg font-semibold text-primary">
                    {featured?.price ?? "Ver catálogo"}
                  </p>
                  <Button asChild size="icon" className="shrink-0">
                    <Link
                      to={featured?.href ?? "/productos"}
                      aria-label={
                        featured
                          ? `Ver ${featured.name}`
                          : "Ver catálogo de instrumentos"
                      }
                    >
                      <ArrowUpRight className="size-4" aria-hidden="true" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between gap-3 border-t border-border/60 px-1 pt-3">
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                Selección del showroom
              </p>
              <div className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-primary" />
                <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                  En vivo
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
