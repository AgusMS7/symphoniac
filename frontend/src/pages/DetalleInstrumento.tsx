import type React from "react"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { motion, useReducedMotion } from "motion/react"
import {
  ArrowLeft,
  Heart,
  MapPin,
  TriangleAlert,
  Truck,
} from "lucide-react"

import { AddToCartButton } from "@/components/shop/add-to-cart-button"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { useFavorites } from "../data/hooks"
import { toggleFavorite } from "../data/localStore"
import type {
  Instrumento,
  Categoria,
  ProductImage,
} from "../types/Instrumento"
import {
  instrumentoService,
  categoriaService,
  imageService,
} from "../services/api"

export const DetalleInstrumento: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [instrumento, setInstrumento] = useState<Instrumento | null>(null)
  const [categoria, setCategoria] = useState<Categoria | null>(null)
  const [images, setImages] = useState<ProductImage[]>([])
  const [primaryImage, setPrimaryImage] = useState<ProductImage | null>(null)
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [imageError, setImageError] = useState(false)
  const favoritos = useFavorites()
  const reduceMotion = useReducedMotion()
  const esFavorito = instrumento ? favoritos.includes(instrumento.id) : false

  useEffect(() => {
    if (id) {
      fetchInstrumento(Number(id))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const fetchInstrumento = async (instrumentoId: number) => {
    try {
      setLoading(true)
      setSelectedImageUrl(null)
      setImageError(false)
      const response = await instrumentoService.getById(instrumentoId)

      if (response.success && response.data) {
        const instrumentoData = response.data
        setInstrumento(instrumentoData)

        // Cargar categoría si existe
        if (instrumentoData.idCategoria) {
          await fetchCategoria(instrumentoData.idCategoria)
        }

        // Cargar imágenes
        await fetchImages(instrumentoId)
      } else {
        setError("Instrumento no encontrado")
      }
    } catch (error) {
      console.error("Error conectando al backend:", error)
      setError(
        "Error al cargar el instrumento. Verifica que el backend esté funcionando.",
      )
    } finally {
      setLoading(false)
    }
  }

  const fetchCategoria = async (categoriaId: number) => {
    try {
      const response = await categoriaService.getById(categoriaId)
      if (response.success && response.data) {
        setCategoria(response.data)
      }
    } catch (error) {
      console.error("Error al cargar categoría:", error)
    }
  }

  const fetchImages = async (instrumentoId: number) => {
    try {
      // Obtener todas las imágenes
      const imagesResponse = await imageService.getByInstrumento(instrumentoId)
      if (imagesResponse.success && imagesResponse.data) {
        setImages(imagesResponse.data)
      }

      // Obtener imagen principal
      try {
        const primaryResponse = await imageService.getPrimary(instrumentoId)
        if (primaryResponse.success && primaryResponse.data) {
          setPrimaryImage(primaryResponse.data)
        }
      } catch {
        // Error de conexión, no mostrar error crítico
      }
    } catch (error) {
      console.error("Error al cargar imágenes:", error)
    }
  }

  const handleImageError = () => {
    setImageError(true)
  }

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <Skeleton className="h-9 w-36 rounded-full" />
        <div className="mt-6 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <Skeleton className="aspect-square w-full rounded-2xl" />
          <div className="flex flex-col gap-4">
            <Skeleton className="h-4 w-24 rounded-full" />
            <Skeleton className="h-12 w-3/4 rounded-xl" />
            <Skeleton className="h-4 w-40 rounded-full" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-12 w-48 rounded-full" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !instrumento) {
    return (
      <div className="mx-auto w-full max-w-xl px-4 py-16">
        <Card className="rounded-2xl border-border/60 bg-card/60 text-center">
          <CardContent className="flex flex-col items-center gap-4 py-10">
            <span className="grid size-12 place-items-center rounded-full border border-destructive/30 bg-destructive/10">
              <TriangleAlert
                className="size-6 text-destructive"
                aria-hidden="true"
              />
            </span>
            <div>
              <h1 className="font-display text-2xl font-semibold text-foreground">
                Instrumento no encontrado
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {error || "Instrumento no encontrado"}
              </p>
            </div>
            <Button asChild>
              <Link to="/productos">
                <ArrowLeft aria-hidden="true" />
                Volver a productos
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const galleryUrls = Array.from(
    new Set([
      ...(primaryImage?.imageUrl
        ? [imageService.getImageUrl(primaryImage.imageUrl)]
        : []),
      ...images
        .filter((image) => Boolean(image.imageUrl))
        .map((image) => imageService.getImageUrl(image.imageUrl)),
      ...(instrumento.imagen && instrumento.imagen.trim() !== ""
        ? [imageService.getImageUrl(instrumento.imagen)]
        : []),
    ]),
  )
  const mainImageUrl = imageError
    ? "/site/placeholder-instrument.jpg"
    : (selectedImageUrl ?? galleryUrls[0] ?? "/site/placeholder-instrument.jpg")
  const isPlaceholder = imageError || galleryUrls.length === 0

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <Button variant="ghost" asChild className="mb-6 -ml-2">
        <Link to="/productos">
          <ArrowLeft aria-hidden="true" />
          Volver a productos
        </Link>
      </Button>

      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div className="relative flex flex-col gap-3 lg:flex-row-reverse lg:items-start">
          <div className="relative aspect-square flex-1 overflow-hidden rounded-2xl border border-border/40 bg-muted">
            <motion.img
              key={mainImageUrl}
              src={mainImageUrl}
              alt={instrumento.instrumento}
              initial={reduceMotion ? false : { opacity: 0.35, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="size-full object-cover"
              onError={handleImageError}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
            <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/40 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-white/80 backdrop-blur">
              En vivo
            </span>
            {isPlaceholder ? (
              <span className="absolute bottom-4 left-4 rounded-full border border-white/15 bg-black/40 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-white/65 backdrop-blur">
                Imagen de referencia
              </span>
            ) : null}
          </div>

          {galleryUrls.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1 lg:w-20 lg:flex-col lg:overflow-visible lg:pb-0">
              {galleryUrls.map((url, index) => {
                const active = mainImageUrl === url
                return (
                  <button
                    key={`${url}-${index}`}
                    type="button"
                    onClick={() => {
                      setSelectedImageUrl(url)
                      setImageError(false)
                    }}
                    aria-label={`Ver imagen ${index + 1} de ${instrumento.instrumento}`}
                    aria-pressed={active}
                    className={
                      active
                        ? "relative aspect-square w-16 shrink-0 cursor-pointer overflow-hidden rounded-xl border border-primary bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:w-full"
                        : "relative aspect-square w-16 shrink-0 cursor-pointer overflow-hidden rounded-xl border border-border/60 bg-muted transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:w-full"
                    }
                  >
                    <img
                      src={url}
                      alt=""
                      loading="lazy"
                      className="size-full object-cover"
                      onError={(event) => {
                        event.currentTarget.style.visibility = "hidden"
                      }}
                    />
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            {categoria && (
              <Badge
                variant="outline"
                className="w-fit border-border/60 bg-muted/40 font-mono text-[9px] uppercase tracking-[0.16em]"
              >
                {categoria.denominacion}
              </Badge>
            )}
            <h1 className="font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              {instrumento.instrumento}
            </h1>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              {instrumento.marca} · {instrumento.modelo}
            </p>
            <p className="font-display text-3xl font-semibold text-primary">
              ${instrumento.precio?.toLocaleString("es-AR")}
            </p>
          </div>

          <div className="flex flex-col gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            {instrumento.costoEnvio === "G" ? (
              <span className="flex items-center gap-2 text-success">
                <Truck className="size-4" aria-hidden="true" />
                Envío gratis a todo el país
              </span>
            ) : (
              <span>
                Envío:{" "}
                {instrumento.costoEnvio === "P"
                  ? "Con costo"
                  : `$${instrumento.costoEnvio}`}
              </span>
            )}
            <span>{instrumento.cantidadVendida || 0} vendidos</span>
          </div>

          <Separator className="bg-border/60" />

          <section aria-labelledby="especificaciones">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary">
              Ficha técnica
            </p>
            <h2
              id="especificaciones"
              className="mt-1 font-display text-xl font-semibold text-foreground"
            >
              Especificaciones
            </h2>
            <dl className="mt-3 divide-y divide-border/60 border-y border-border/60 text-sm">
              <div className="flex items-center justify-between gap-4 py-2.5">
                <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                  Marca
                </dt>
                <dd className="text-right font-medium text-foreground">
                  {instrumento.marca}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4 py-2.5">
                <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                  Modelo
                </dt>
                <dd className="text-right font-medium text-foreground">
                  {instrumento.modelo}
                </dd>
              </div>
              {categoria && (
                <div className="flex items-center justify-between gap-4 py-2.5">
                  <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                    Categoría
                  </dt>
                  <dd className="text-right font-medium text-foreground">
                    {categoria.denominacion}
                  </dd>
                </div>
              )}
            </dl>
          </section>

          {instrumento.descripcion && (
            <>
              <Separator className="bg-border/60" />
              <section aria-labelledby="descripcion">
                <h2
                  id="descripcion"
                  className="font-display text-xl font-semibold text-foreground"
                >
                  Descripción
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {instrumento.descripcion}
                </p>
              </section>
            </>
          )}

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <AddToCartButton
              instrumentoId={instrumento.id}
              name={instrumento.instrumento}
              className="min-w-44"
            />
            <Button asChild variant="outline" size="lg">
              <Link to="/donde-estamos">
                <MapPin aria-hidden="true" />
                Consultar en el showroom
              </Link>
            </Button>
            <Button
              variant="outline"
              size="icon-lg"
              aria-label={
                esFavorito
                  ? "Quitar de favoritos"
                  : "Agregar a favoritos"
              }
              aria-pressed={esFavorito}
              onClick={() => toggleFavorite(instrumento.id)}
            >
              <Heart
                aria-hidden="true"
                className={esFavorito ? "fill-current text-primary" : undefined}
              />
            </Button>
          </div>

          <div className="sticky bottom-4 z-20 mt-2 flex items-center justify-between gap-3 rounded-full border border-border/60 bg-background/90 p-2 pl-4 shadow-lg backdrop-blur lg:hidden">
            <p className="font-display text-lg font-semibold text-primary">
              ${instrumento.precio?.toLocaleString("es-AR")}
            </p>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                aria-label={
                  esFavorito
                    ? "Quitar de favoritos"
                    : "Agregar a favoritos"
                }
                aria-pressed={esFavorito}
                onClick={() => toggleFavorite(instrumento.id)}
              >
                <Heart
                  aria-hidden="true"
                  className={
                    esFavorito ? "fill-current text-primary" : undefined
                  }
                />
              </Button>
              <AddToCartButton
                instrumentoId={instrumento.id}
                name={instrumento.instrumento}
                size="sm"
                label="Agregar"
                className="min-w-20"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetalleInstrumento
