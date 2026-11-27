import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import {
  ArrowUpRight,
  Check,
  Heart,
  ShoppingCart,
  Truck,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { useFavorites } from "../data/hooks"
import { addToCart, toggleFavorite } from "../data/localStore"
import type { Instrumento, ProductImage } from "../types/Instrumento"
import {
  getImageAltText,
  getImageUrl,
  handleImageError,
  loadPrimaryImageSafely,
} from "../utils/imageUtils"

interface InstrumentoCardProps {
  instrumento: Instrumento
  index?: number
}

export const InstrumentoCard = ({
  instrumento,
  index = 0,
}: InstrumentoCardProps) => {
  const [imageError, setImageError] = useState(false)
  const [primaryImage, setPrimaryImage] = useState<ProductImage | null>(null)
  const [added, setAdded] = useState(false)
  const addedTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const reduceMotion = useReducedMotion()
  const favoritos = useFavorites()
  const esFavorito = favoritos.includes(instrumento.id)

  useEffect(() => {
    let active = true
    loadPrimaryImageSafely(instrumento.id, (image) => {
      if (active) setPrimaryImage(image)
    })
    return () => {
      active = false
    }
  }, [instrumento.id])

  useEffect(() => () => clearTimeout(addedTimer.current), [])

  const formatearPrecio = (precio: number) => {
    return `$${precio.toLocaleString("es-AR")}`
  }

  const envioGratis = instrumento.costoEnvio === "G"
  const envioLabel =
    instrumento.costoEnvio === "G"
      ? "Envío gratis"
      : instrumento.costoEnvio === "P"
        ? "Envío con costo"
        : `Envío: $${instrumento.costoEnvio}`

  const imageSrc = imageError
    ? "/site/placeholder-instrument.jpg"
    : getImageUrl(primaryImage, instrumento.imagen)
  const imageAlt = getImageAltText(primaryImage, instrumento.instrumento)
  const isPlaceholder =
    imageError ||
    (!primaryImage &&
      (!instrumento.imagen || instrumento.imagen.trim() === ""))

  const handleImageLoadError = () => {
    setImageError(true)
  }

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.5,
        delay: index * 0.06,
        ease: "easeOut",
      }}
      className="group flex flex-col"
    >
      <div className="relative overflow-hidden rounded-2xl bg-muted">
        <Link
          to={`/instrumento/${instrumento.id}`}
          aria-label={`Ver detalle de ${instrumento.instrumento}`}
          className="block cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <img
            src={imageSrc}
            alt={imageAlt}
            loading="lazy"
            className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            onError={(event) => {
              handleImageError(event, instrumento.id)
              handleImageLoadError()
            }}
          />
        </Link>

        <span className="absolute left-3 top-3 max-w-[70%] truncate rounded-full border border-white/15 bg-black/40 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-white/80 backdrop-blur">
          {instrumento.categoriaDenominacion ?? "Instrumento"}
        </span>

        {isPlaceholder ? (
          <span className="absolute bottom-3 left-3 rounded-full border border-white/15 bg-black/40 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-white/65 backdrop-blur">
            Imagen de referencia
          </span>
        ) : null}

        <button
          type="button"
          aria-label={
            esFavorito
              ? `Quitar ${instrumento.instrumento} de favoritos`
              : `Agregar ${instrumento.instrumento} a favoritos`
          }
          aria-pressed={esFavorito}
          onClick={() => toggleFavorite(instrumento.id)}
          className="absolute right-3 top-3 z-10 grid size-9 cursor-pointer place-items-center rounded-full border border-white/15 bg-black/40 text-white backdrop-blur transition-colors hover:bg-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <Heart
            aria-hidden="true"
            className={esFavorito ? "fill-current text-primary" : undefined}
          />
        </button>
      </div>

      <div className="mt-4 flex flex-1 flex-col border-t border-border/60 pt-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
              {instrumento.marca}
            </p>
            <Link
              to={`/instrumento/${instrumento.id}`}
              className="mt-1 block w-fit cursor-pointer text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <h3 className="line-clamp-2 font-display text-xl font-semibold leading-tight">
                {instrumento.instrumento}
              </h3>
            </Link>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <Button asChild size="icon-sm" variant="outline">
              <Link
                to={`/instrumento/${instrumento.id}`}
                aria-label={`Ver ficha de ${instrumento.instrumento}`}
              >
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button
              type="button"
              size="icon-sm"
              aria-label={
                added
                  ? "Agregado al carrito"
                  : `Agregar ${instrumento.instrumento} al carrito`
              }
              onClick={() => {
                addToCart(instrumento.id)
                toast.success("Agregado al carrito")
                setAdded(true)
                clearTimeout(addedTimer.current)
                addedTimer.current = setTimeout(() => setAdded(false), 1200)
              }}
            >
              <AnimatePresence mode="wait" initial={false}>
                {added ? (
                  <motion.span
                    key="check"
                    initial={
                      reduceMotion ? false : { opacity: 0, scale: 0.6 }
                    }
                    animate={{ opacity: 1, scale: 1 }}
                    exit={
                      reduceMotion ? undefined : { opacity: 0, scale: 0.6 }
                    }
                    transition={{ duration: 0.16 }}
                    className="inline-flex"
                  >
                    <Check className="size-4" aria-hidden="true" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="cart"
                    initial={
                      reduceMotion ? false : { opacity: 0, scale: 0.6 }
                    }
                    animate={{ opacity: 1, scale: 1 }}
                    exit={
                      reduceMotion ? undefined : { opacity: 0, scale: 0.6 }
                    }
                    transition={{ duration: 0.16 }}
                    className="inline-flex"
                  >
                    <ShoppingCart className="size-4" aria-hidden="true" />
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <p className="font-display text-lg font-semibold text-primary">
            {formatearPrecio(instrumento.precio)}
          </p>
          <div className="flex flex-col items-end gap-1 text-right">
            <p className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
              {envioGratis ? (
                <Truck className="size-3.5 text-success" aria-hidden="true" />
              ) : null}
              {envioLabel}
            </p>
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
              {instrumento.cantidadVendida} vendidos
            </p>
          </div>
        </div>
      </div>
    </motion.article>
  )
}
