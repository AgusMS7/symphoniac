import type React from "react"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import {
  ArrowLeft,
  Heart,
  ShoppingCart,
  TriangleAlert,
  Truck,
} from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { useFavorites } from "../data/hooks"
import { addToCart, toggleFavorite } from "../data/localStore"
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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [imageError, setImageError] = useState(false)
  const favoritos = useFavorites()
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

  const getImageUrl = (): string => {
    if (!instrumento) return "/icons/no-image.svg"

    // Si hay error de carga, mostrar imagen por defecto
    if (imageError) {
      return "/icons/no-image.svg"
    }

    // Prioridad 1: Imagen principal del nuevo sistema
    if (primaryImage && primaryImage.imageUrl) {
      return imageService.getImageUrl(primaryImage.imageUrl)
    }

    // Prioridad 2: Primera imagen disponible del sistema nuevo
    if (images.length > 0 && images[0].imageUrl) {
      return imageService.getImageUrl(images[0].imageUrl)
    }

    // Prioridad 3: Campo imagen legacy
    if (instrumento.imagen && instrumento.imagen.trim() !== "") {
      return imageService.getImageUrl(instrumento.imagen)
    }

    // Fallback: imagen por defecto
    return "/icons/no-image.svg"
  }

  const handleImageError = () => {
    setImageError(true)
  }

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="grid gap-8 lg:grid-cols-2">
          <Skeleton className="aspect-square w-full rounded-2xl" />
          <div className="flex flex-col gap-4">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-48" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !instrumento) {
    return (
      <div className="mx-auto w-full max-w-xl px-4 py-16">
        <Card className="items-center text-center">
          <CardContent className="flex flex-col items-center gap-4">
            <span className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
              <TriangleAlert
                className="size-6 text-destructive"
                aria-hidden="true"
              />
            </span>
            <h1 className="font-display text-xl font-semibold text-foreground">
              Instrumento no encontrado
            </h1>
            <p className="text-sm text-muted-foreground">
              {error || "Instrumento no encontrado"}
            </p>
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

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <Button variant="ghost" asChild className="mb-6 -ml-2">
        <Link to="/productos">
          <ArrowLeft aria-hidden="true" />
          Volver a productos
        </Link>
      </Button>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="overflow-hidden p-0">
          <img
            src={getImageUrl()}
            alt={primaryImage?.altText || instrumento.instrumento}
            className="aspect-square w-full object-cover"
            onError={handleImageError}
          />
        </Card>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            {categoria && (
              <Badge variant="secondary" className="w-fit">
                {categoria.denominacion}
              </Badge>
            )}
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {instrumento.instrumento}
            </h1>
            <p className="text-2xl font-semibold text-primary">
              ${instrumento.precio?.toLocaleString("es-AR")}
            </p>
          </div>

          <div className="flex flex-col gap-2 text-sm">
            {instrumento.costoEnvio === "G" ? (
              <span className="flex items-center gap-2 text-success">
                <Truck className="size-4" aria-hidden="true" />
                Envío gratis a todo el país
              </span>
            ) : (
              <span className="text-muted-foreground">
                Envío:{" "}
                {instrumento.costoEnvio === "P"
                  ? "Con costo"
                  : `$${instrumento.costoEnvio}`}
              </span>
            )}
            <span className="text-muted-foreground">
              {instrumento.cantidadVendida || 0} vendidos
            </span>
          </div>

          <Separator />

          <section aria-labelledby="especificaciones">
            <h2
              id="especificaciones"
              className="font-display text-lg font-semibold text-foreground"
            >
              Especificaciones
            </h2>
            <dl className="mt-3 grid gap-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Marca</dt>
                <dd className="text-right font-medium text-foreground">
                  {instrumento.marca}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Modelo</dt>
                <dd className="text-right font-medium text-foreground">
                  {instrumento.modelo}
                </dd>
              </div>
              {categoria && (
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Categoría</dt>
                  <dd className="text-right font-medium text-foreground">
                    {categoria.denominacion}
                  </dd>
                </div>
              )}
            </dl>
          </section>

          {instrumento.descripcion && (
            <>
              <Separator />
              <section aria-labelledby="descripcion">
                <h2
                  id="descripcion"
                  className="font-display text-lg font-semibold text-foreground"
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
            <Button
              onClick={() => {
                addToCart(instrumento.id)
                toast.success("Agregado al carrito")
              }}
            >
              <ShoppingCart aria-hidden="true" />
              Agregar al carrito
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
        </div>
      </div>
    </div>
  )
}

export default DetalleInstrumento
