import { useEffect, useState } from "react"
import { Minus, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCart, useIsDemo, useOrders } from "../data/hooks"
import {
  decrementCartItem,
  incrementCartItem,
  parseShipping,
  removeFromCart,
} from "../data/localStore"
import { instrumentoService } from "../services/api"
import type { Instrumento, ProductImage } from "../types/Instrumento"
import {
  getImageAltText,
  getImageUrl,
  loadPrimaryImageSafely,
} from "../utils/imageUtils"

interface CartDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const formatearPrecio = (precio: number) =>
  `$${precio.toLocaleString("es-AR")}`

function CartLineImage({ instrumento }: { instrumento: Instrumento }) {
  const [primaryImage, setPrimaryImage] = useState<ProductImage | null>(null)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    let active = true
    loadPrimaryImageSafely(instrumento.id, (image) => {
      if (active) setPrimaryImage(image)
    })
    return () => {
      active = false
    }
  }, [instrumento.id])

  const src = imageError
    ? "/icons/no-image.svg"
    : getImageUrl(primaryImage, instrumento.imagen)
  const alt = getImageAltText(primaryImage, instrumento.instrumento)

  return (
    <img
      src={src}
      alt={alt}
      className="size-full object-cover"
      onError={() => setImageError(true)}
    />
  )
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const cart = useCart()
  const orders = useOrders()
  const isDemo = useIsDemo()
  const [instrumentos, setInstrumentos] = useState<Instrumento[]>([])
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return

    let active = true
    setCargando(true)
    setError(null)
    instrumentoService
      .getAllSimple()
      .then((response) => {
        if (!active) return
        const list = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.content)
            ? response.content
            : []
        setInstrumentos(list)
      })
      .catch((error) => {
        console.error("No se pudo cargar el catálogo del carrito", error)
        if (active) {
          setError("No se pudo cargar el catálogo del carrito.")
        }
      })
      .finally(() => {
        if (active) setCargando(false)
      })

    return () => {
      active = false
    }
  }, [open])

  const lineas = cart.flatMap((item) => {
    const instrumento = instrumentos.find(
      (candidato) => candidato.id === item.instrumentoId,
    )
    return instrumento ? [{ ...item, instrumento }] : []
  })

  const faltantes =
    cargando || error
      ? []
      : cart.filter(
          (item) =>
            !instrumentos.some(
              (candidato) => candidato.id === item.instrumentoId,
            ),
        )

  const cantidadTotal = cart.reduce((total, item) => total + item.cantidad, 0)
  const subtotal = lineas.reduce(
    (total, linea) => total + linea.instrumento.precio * linea.cantidad,
    0,
  )
  const envio = lineas.reduce(
    (total, linea) => total + parseShipping(linea.instrumento.costoEnvio),
    0,
  )
  const total = subtotal + envio

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Carrito y pedidos</SheetTitle>
          <SheetDescription>
            Los datos se guardan en este navegador.
          </SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="carrito" className="flex min-h-0 flex-1 flex-col px-4">
          <TabsList className="w-full">
            <TabsTrigger value="carrito">Carrito ({cantidadTotal})</TabsTrigger>
            <TabsTrigger value="pedidos">Mis pedidos</TabsTrigger>
          </TabsList>

          <TabsContent
            value="carrito"
            className="mt-4 flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto"
          >
            {faltantes.length > 0 && (
              <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm">
                <p className="text-foreground">
                  {faltantes.length === 1
                    ? "Un producto del carrito ya no está disponible."
                    : `${faltantes.length} productos del carrito ya no están disponibles.`}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => {
                    faltantes.forEach((item) =>
                      removeFromCart(item.instrumentoId),
                    )
                    toast.info(
                      "Productos no disponibles eliminados del carrito",
                    )
                  }}
                >
                  Quitar del carrito
                </Button>
              </div>
            )}

            {error ? (
              <p className="py-10 text-center text-sm text-destructive">
                {error}
              </p>
            ) : cargando ? (
              <p className="py-10 text-center text-sm text-muted-foreground">
                Cargando carrito...
              </p>
            ) : lineas.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">
                {faltantes.length > 0
                  ? "No hay productos disponibles en el carrito."
                  : "Tu carrito está vacío."}
              </p>
            ) : (
              <>
                <div className="flex flex-col gap-3">
                  {lineas.map((linea) => {
                    const nombre = linea.instrumento.instrumento

                    return (
                      <div key={linea.instrumentoId} className="flex gap-3">
                        <div className="size-16 shrink-0 overflow-hidden rounded-md bg-muted">
                          <CartLineImage instrumento={linea.instrumento} />
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col gap-1">
                          <p className="truncate text-sm font-medium text-foreground">
                            {nombre}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatearPrecio(linea.instrumento.precio)}
                          </p>
                          <div className="flex items-center gap-1">
                            <Button
                              type="button"
                              size="icon-sm"
                              variant="outline"
                              aria-label={`Quitar una unidad de ${nombre}`}
                              onClick={() =>
                                decrementCartItem(linea.instrumentoId)
                              }
                            >
                              <Minus aria-hidden="true" />
                            </Button>
                            <span className="min-w-6 text-center text-sm">
                              {linea.cantidad}
                            </span>
                            <Button
                              type="button"
                              size="icon-sm"
                              variant="outline"
                              aria-label={`Agregar una unidad de ${nombre}`}
                              onClick={() =>
                                incrementCartItem(linea.instrumentoId)
                              }
                            >
                              <Plus aria-hidden="true" />
                            </Button>
                            <Button
                              type="button"
                              size="icon-sm"
                              variant="ghost"
                              className="ml-auto"
                              aria-label={`Eliminar ${nombre} del carrito`}
                              onClick={() =>
                                removeFromCart(linea.instrumentoId)
                              }
                            >
                              <Trash2 aria-hidden="true" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <Separator />

                <dl className="flex flex-col gap-1.5 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Subtotal</dt>
                    <dd className="font-medium text-foreground">
                      {formatearPrecio(subtotal)}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Envío</dt>
                    <dd className="font-medium text-foreground">
                      {envio === 0 ? "Gratis" : formatearPrecio(envio)}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4 text-base">
                    <dt className="font-semibold text-foreground">Total</dt>
                    <dd className="font-semibold text-foreground">
                      {formatearPrecio(total)}
                    </dd>
                  </div>
                </dl>

                <Button
                  type="button"
                  className="w-full"
                  onClick={() =>
                    toast.info(
                      isDemo
                        ? "No disponible para demo"
                        : "La compra no está implementada",
                    )
                  }
                >
                  Confirmar compra
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  {isDemo
                    ? "Esta demo no procesa pagos ni pedidos."
                    : "La compra no está implementada todavía."}
                </p>
              </>
            )}
          </TabsContent>

          <TabsContent
            value="pedidos"
            className="mt-4 flex min-h-0 flex-1 flex-col overflow-y-auto"
          >
            {orders.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">
                Sin pedidos
              </p>
            ) : (
              <ul className="flex flex-col gap-2">
                {orders.map((order) => (
                  <li
                    key={order.id}
                    className="rounded-md border border-border p-3"
                  >
                    <p className="text-sm font-medium text-foreground">
                      Pedido #{order.id}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.fecha).toLocaleString("es-AR")}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-foreground">
                      {formatearPrecio(order.total)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}
