import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useReducedMotion } from "motion/react"
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react"

import HeroSection from "@/components/shadcn-space/blocks/hero-01/hero"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { InstrumentoCard } from "../components/InstrumentoCard"
import { ErrorScreen } from "../components/ErrorScreen"
import { useCatalogUpdated } from "../data/hooks"
import type { Instrumento } from "../types/Instrumento"
import { instrumentoService, imageService } from "../services/api"

export const Home = () => {
  const [instrumentos, setInstrumentos] = useState<Instrumento[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRetrying, setIsRetrying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const reduceMotion = useReducedMotion()
  const navigate = useNavigate()

  const destacados = instrumentos.slice(0, 3)

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

  useEffect(() => {
    setCurrentSlide(0)
  }, [destacados.length])

  useEffect(() => {
    if (destacados.length <= 1) return
    if (reduceMotion || isPaused) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % destacados.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [destacados.length, reduceMotion, isPaused])

  const handleRetry = () => {
    setIsRetrying(true)
    setLoading(true)
    fetchInstrumentos()
  }

  const handleSlideChange = (index: number) => {
    setCurrentSlide(index)
  }

  const handlePrevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? destacados.length - 1 : prev - 1,
    )
  }

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % destacados.length)
  }

  const handleInstrumentoClick = (instrumentoId: number) => {
    navigate(`/instrumento/${instrumentoId}`)
  }

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <Skeleton className="h-64 w-full rounded-2xl" />
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-72 w-full rounded-xl" />
          ))}
        </div>
      </div>
    )
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
    <div className="pb-16">
      <HeroSection onCtaClick={() => navigate("/productos")} />

      <div className="mx-auto w-full max-w-6xl px-4">
        {destacados.length > 0 && (
          <section
            aria-label="Instrumentos destacados en portada"
            className="relative overflow-hidden rounded-2xl border border-border bg-card"
          >
            <div
              className="flex transition-transform duration-300 ease-out motion-reduce:transition-none"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {destacados.map((instrumento) => {
                const imageSrc = instrumento.imagen
                  ? imageService.getImageUrl(instrumento.imagen)
                  : "/icons/no-image.svg"

                return (
                  <button
                    type="button"
                    key={instrumento.id}
                    onClick={() => handleInstrumentoClick(instrumento.id)}
                    className="relative block aspect-[16/9] w-full shrink-0 grow-0 basis-full overflow-hidden text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label={`Ver detalle de ${instrumento.instrumento}`}
                  >
                    <img
                      src={imageSrc}
                      alt={instrumento.instrumento}
                      className="size-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/icons/no-image.svg"
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-6">
                      <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
                        {instrumento.instrumento}
                      </h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {instrumento.marca} - {instrumento.modelo}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>

            {destacados.length > 1 && (
              <>
                <div className="absolute inset-y-0 left-0 flex items-center pl-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    onClick={handlePrevSlide}
                    aria-label="Destacado anterior"
                    className="rounded-full"
                  >
                    <ChevronLeft aria-hidden="true" />
                  </Button>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    onClick={handleNextSlide}
                    aria-label="Siguiente destacado"
                    className="rounded-full"
                  >
                    <ChevronRight aria-hidden="true" />
                  </Button>
                </div>
                <div className="absolute bottom-4 right-4 flex items-center gap-1.5">
                  {!reduceMotion && (
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      onClick={() => setIsPaused((paused) => !paused)}
                      aria-label={
                        isPaused
                          ? "Reanudar la rotación de destacados"
                          : "Pausar la rotación de destacados"
                      }
                      className="mr-1 size-7 rounded-full"
                    >
                      {isPaused ? (
                        <Play className="size-3.5" aria-hidden="true" />
                      ) : (
                        <Pause className="size-3.5" aria-hidden="true" />
                      )}
                    </Button>
                  )}
                  {destacados.map((instrumento, index) => (
                    <button
                      type="button"
                      key={instrumento.id}
                      onClick={() => handleSlideChange(index)}
                      aria-label={`Ir al destacado ${index + 1}`}
                      aria-current={currentSlide === index ? "true" : undefined}
                      className={
                        currentSlide === index
                          ? "size-2.5 rounded-full bg-primary"
                          : "size-2.5 rounded-full bg-muted-foreground/40 hover:bg-muted-foreground"
                      }
                    />
                  ))}
                </div>
              </>
            )}
          </section>
        )}

        <section aria-labelledby="sobre-nosotros" className="mt-14">
          <h2
            id="sobre-nosotros"
            className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
          >
            Sobre Nosotros
          </h2>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-muted-foreground">
            Symphoniac es una tienda de instrumentos musicales con más de 15
            años de experiencia en el mercado. Tenemos el conocimiento y la
            capacidad como para informarte acerca de las mejores elecciones
            para tu compra musical. Ofrecemos una amplia variedad de
            instrumentos de las mejores marcas, con envíos a todo el país y
            garantía en todos nuestros productos.
          </p>
        </section>

        <section aria-labelledby="destacados" className="mt-14">
          <h2
            id="destacados"
            className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
          >
            Instrumentos Destacados
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {instrumentos.slice(0, 4).map((instrumento) => (
              <InstrumentoCard
                key={instrumento.id}
                instrumento={instrumento}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default Home
