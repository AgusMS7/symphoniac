import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ArrowUpRight } from "lucide-react"

import HeroSection from "@/components/shadcn-space/blocks/hero-01/hero"
import { BrandMarquee } from "@/components/shop/brand-marquee"
import { FeaturedCarousel } from "@/components/shop/featured-carousel"
import { NumberTicker } from "@/components/shadcn-space/number-ticker/number-ticker"
import { Button } from "@/components/ui/button"
import { DataLoading } from "../components/DataLoading"
import { InstrumentoCard } from "../components/InstrumentoCard"
import { ErrorScreen } from "../components/ErrorScreen"
import { useCatalogUpdated } from "../data/hooks"
import type { Instrumento } from "../types/Instrumento"
import { instrumentoService, imageService } from "../services/api"

export const Home = () => {
  const [instrumentos, setInstrumentos] = useState<Instrumento[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRetrying, setIsRetrying] = useState(false)
  const navigate = useNavigate()

  const destacados = instrumentos.slice(4, 7)
  const instrumentoDestacado = instrumentos[0]
  const marcas = Array.from(
    new Set(
      instrumentos
        .map((instrumento) => instrumento.marca.trim())
        .filter(Boolean),
    ),
  )

  const fetchInstrumentos = async () => {
    try {
      setError(null)
      const response = await instrumentoService.getAllSimple()

      // Manejar diferentes tipos de respuesta
      let instrumentosArray: Instrumento[] = []

      if (Array.isArray(response)) {
        instrumentosArray = response
      } else if (response.content && Array.isArray(response.content)) {
        instrumentosArray = response.content
      } else if (
        response.success &&
        response.data &&
        Array.isArray(response.data)
      ) {
        instrumentosArray = response.data
      } else if (response.data && Array.isArray(response.data)) {
        instrumentosArray = response.data
      }

      setInstrumentos(instrumentosArray)
    } catch (error) {
      console.error("Error conectando al backend:", error)
      setError(error instanceof Error ? error.message : "Error desconocido")
      setInstrumentos([])
    } finally {
      setLoading(false)
      setIsRetrying(false)
    }
  }

  useEffect(() => {
    fetchInstrumentos()
  }, [])

  useCatalogUpdated(fetchInstrumentos)

  const handleRetry = () => {
    setIsRetrying(true)
    setLoading(true)
    fetchInstrumentos()
  }

  if (loading) {
    return <DataLoading />
  }

  if (error) {
    return (
      <ErrorScreen
        title="Error al cargar instrumentos"
        message="No se pudieron cargar los instrumentos desde el servidor."
        details={error}
        onRetry={handleRetry}
        isRetrying={isRetrying}
        showHomeButton={false}
      />
    )
  }

  return (
    <div className="pb-20">
      <HeroSection
        onCtaClick={() => navigate("/productos")}
        featured={
          instrumentoDestacado
            ? {
                name: instrumentoDestacado.instrumento,
                brand: `${instrumentoDestacado.marca} · ${instrumentoDestacado.modelo}`,
                price: `$${instrumentoDestacado.precio.toLocaleString("es-AR")}`,
                href: `/instrumento/${instrumentoDestacado.id}`,
                imageSrc: instrumentoDestacado.primaryImage?.imageUrl
                  ? imageService.getImageUrl(
                      instrumentoDestacado.primaryImage.imageUrl,
                    )
                  : instrumentoDestacado.imagen
                    ? imageService.getImageUrl(instrumentoDestacado.imagen)
                    : undefined,
              }
            : undefined
        }
      />

      <BrandMarquee brands={marcas} />

      <div className="mx-auto w-full max-w-6xl px-4">
        <FeaturedCarousel instruments={destacados} />

        <section
          aria-labelledby="sobre-nosotros"
          className="mt-16 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start"
        >
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary">
              El showroom
            </p>
            <h2
              id="sobre-nosotros"
              className="mt-2 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
            >
              Instrumentos probados en vivo.
            </h2>
          </div>
          <div>
            <p className="text-base leading-relaxed text-muted-foreground">
              Symphoniac es una tienda de instrumentos musicales con más de 15
              años de experiencia en el mercado. Tenemos el conocimiento y la
              capacidad como para informarte acerca de las mejores elecciones
              para tu compra musical. Ofrecemos una amplia variedad de
              instrumentos de las mejores marcas, con envíos a todo el país y
              garantía en todos nuestros productos.
            </p>
            <dl className="mt-6 grid grid-cols-3 gap-4 border-t border-border/60 pt-4">
              <div>
                <dt className="font-display text-2xl font-semibold leading-none text-foreground">
                  <NumberTicker end={15} className="tabular-nums" />
                </dt>
                <dd className="mt-1 font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                  años
                </dd>
              </div>
              <div>
                <dt className="font-display text-2xl font-semibold leading-none text-foreground">
                  <NumberTicker end={instrumentos.length} className="tabular-nums" />
                </dt>
                <dd className="mt-1 font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                  instrumentos
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
            </dl>
          </div>
        </section>

        <section aria-labelledby="destacados" className="mt-16">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary">
                Selección
              </p>
              <h2
                id="destacados"
                className="mt-2 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
              >
                Instrumentos destacados
              </h2>
            </div>
            <Button variant="ghost" asChild className="w-fit">
              <Link to="/productos">
                Ver catálogo
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
          {instrumentos.length > 0 ? (
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2">
              {instrumentos.slice(0, 4).map((instrumento, index) => (
                <InstrumentoCard
                  key={instrumento.id}
                  instrumento={instrumento}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border/60 bg-card/40 px-4 py-12 text-center">
              <p className="font-display text-xl font-semibold text-foreground">
                Catálogo en preparación
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                No hay instrumentos disponibles por ahora.
              </p>
              <Button className="mt-4" onClick={handleRetry}>
                Reintentar
              </Button>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default Home
