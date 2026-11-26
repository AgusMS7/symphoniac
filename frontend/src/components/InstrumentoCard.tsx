import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Heart, ShoppingCart, Truck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Instrumento, ProductImage } from "../types/Instrumento"
import {
  getImageAltText,
  getImageUrl,
  handleImageError,
  loadPrimaryImageSafely,
} from "../utils/imageUtils"

interface InstrumentoCardProps {
  instrumento: Instrumento
}

export const InstrumentoCard = ({ instrumento }: InstrumentoCardProps) => {
  const [imageError, setImageError] = useState(false)
  const [primaryImage, setPrimaryImage] = useState<ProductImage | null>(null)

  useEffect(() => {
    let active = true
    loadPrimaryImageSafely(instrumento.id, (image) => {
      if (active) setPrimaryImage(image)
    })
    return () => {
      active = false
    }
  }, [instrumento.id])

  const formatearPrecio = (precio: number) => {
    return `$${precio.toLocaleString("es-AR")}`
  }

  const renderEnvio = (costoEnvio: string) => {
    if (costoEnvio === "G") {
      return (
        <span className="flex items-center gap-1.5 text-success">
          <Truck className="size-4" aria-hidden="true" />
          Envío gratis a todo el país
        </span>
      )
    }
    if (costoEnvio === "P") {
      return <span>Envío con costo</span>
    }
    return <span>Envío: ${costoEnvio}</span>
  }

  const imageSrc = imageError
    ? "/icons/no-image.svg"
    : getImageUrl(primaryImage, instrumento.imagen)
  const imageAlt = getImageAltText(primaryImage, instrumento.instrumento)

  const handleImageLoadError = () => {
    setImageError(true)
  }

  return (
    <Card className="group gap-0 overflow-hidden py-0 transition-colors hover:ring-primary/40">
      <Link
        to={`/instrumento/${instrumento.id}`}
        aria-label={`Ver detalle de ${instrumento.instrumento}`}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <div className="aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            onError={(event) => {
              handleImageError(event, instrumento.id)
              handleImageLoadError()
            }}
          />
        </div>

        <CardContent className="flex flex-col gap-1.5 p-4">
          <h3 className="line-clamp-2 font-display text-base font-semibold text-foreground">
            {instrumento.instrumento}
          </h3>

          <p className="text-lg font-semibold text-primary">
            {formatearPrecio(instrumento.precio)}
          </p>

          <div className="text-xs text-muted-foreground">
            {renderEnvio(instrumento.costoEnvio)}
          </div>

          <p className="text-xs text-muted-foreground">
            {instrumento.cantidadVendida} vendidos
          </p>
        </CardContent>
      </Link>

      <div className="flex items-center gap-2 px-4 pb-4">
        <Button asChild size="sm" className="flex-1">
          <Link to={`/instrumento/${instrumento.id}`}>Ver detalle</Link>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Agregar a favoritos (próximamente)"
        >
          <Heart aria-hidden="true" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Agregar al carrito (próximamente)"
        >
          <ShoppingCart aria-hidden="true" />
        </Button>
      </div>
    </Card>
  )
}
