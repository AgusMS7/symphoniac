import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { CircleHelp, Heart, Menu, ShoppingCart, ArrowUpRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { CartDrawer } from "../cart-drawer"
import { IS_DEMO } from "../../data/config"
import { useCart, useFavorites } from "../../data/hooks"
import { clearDemoData } from "../../data/storage"

const links = [
  { href: "/", label: "Inicio" },
  { href: "/productos", label: "Productos" },
  { href: "/donde-estamos", label: "Donde estamos" },
  { href: "/admin", label: "Administración" },
]

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/"
  if (href === "/productos")
    return pathname === "/productos" || pathname.startsWith("/instrumento")
  return pathname.startsWith(href)
}

function formatBadgeCount(count: number) {
  return count > 99 ? "99+" : count.toString()
}

function DemoChip() {
  const borrarDatos = () => {
    clearDemoData()
    window.location.reload()
  }

  return (
    <div className="flex items-center gap-1.5">
      <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
        Demo
      </span>
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label="Información sobre la demo"
            className={cn(
              "grid size-8 cursor-pointer place-items-center rounded-full border border-border/60 bg-muted/40 text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground",
              focusRing,
            )}
          >
            <CircleHelp className="size-4" aria-hidden="true" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-72">
          <p className="font-display text-sm font-semibold text-foreground">
            Modo demo
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            El catálogo viene del backend. Tus cambios (instrumentos, categorías,
            favoritos y carrito) se guardan en este navegador. La compra no está
            disponible en la demo.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-3 w-full"
            onClick={borrarDatos}
          >
            Borrar datos demo
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  )
}

function ActionIcons({
  onCartClick,
  onFavoritesClick,
}: {
  onCartClick: () => void
  onFavoritesClick?: () => void
}) {
  const favoritos = useFavorites()
  const cart = useCart()
  const cartCount = cart.reduce((total, item) => total + item.cantidad, 0)

  return (
    <div className="flex items-center gap-0.5">
      <Button
        asChild
        variant="ghost"
        size="icon"
        className={cn("relative", focusRing)}
      >
        <Link
          to="/productos?favoritos=1"
          aria-label={`Favoritos (${favoritos.length})`}
          onClick={onFavoritesClick}
        >
          <Heart className="size-4" aria-hidden="true" />
          {favoritos.length > 0 && (
            <Badge className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full p-0 text-[10px]">
              {formatBadgeCount(favoritos.length)}
            </Badge>
          )}
        </Link>
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={`Carrito (${cartCount})`}
        className={cn("relative", focusRing)}
        onClick={onCartClick}
      >
        <ShoppingCart className="size-4" aria-hidden="true" />
        {cartCount > 0 && (
          <Badge className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full p-0 text-[10px]">
            {formatBadgeCount(cartCount)}
          </Badge>
        )}
      </Button>
    </div>
  )
}

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const { pathname } = useLocation()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
        <div className="flex min-w-0 items-center gap-2">
          <Link
            to="/"
            aria-label="Symphoniac, ir al inicio"
            className={cn(
              "group flex cursor-pointer items-center gap-2.5 font-display text-xl font-semibold tracking-tight text-foreground",
              focusRing,
            )}
          >
            <img
              src="/icons/logo.svg"
              alt=""
              aria-hidden="true"
              className="size-10 shrink-0 transition-transform duration-300 group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
            <span>Symphoniac</span>
          </Link>
          {IS_DEMO ? (
            <>
              <span
                aria-hidden="true"
                className="hidden h-5 w-px bg-border/60 sm:block"
              />
              <DemoChip />
            </>
          ) : null}
        </div>

        <nav
          aria-label="Navegación principal"
          className="hidden items-center gap-1 md:flex"
        >
          {links.map((link) => {
            const active = isActive(pathname, link.href)
            return (
              <Link
                key={link.href}
                to={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative cursor-pointer rounded-full px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:bg-muted/40 hover:text-foreground",
                  focusRing,
                )}
              >
                {link.label}
                {active ? (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-3 -bottom-0.5 h-px bg-primary"
                  />
                ) : null}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-1.5">
          <div className="hidden sm:block">
            <ActionIcons onCartClick={() => setCartOpen(true)} />
          </div>
          <Button asChild size="sm" className="hidden lg:inline-flex">
            <Link to="/productos">
              Ver catálogo
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Abrir menú"
                className={cn("md:hidden", focusRing)}
              >
                <Menu className="size-5" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 border-border/60 bg-background/95 backdrop-blur-xl">
              <SheetTitle className="font-display text-xl">Menú</SheetTitle>
              <SheetDescription className="sr-only">
                Navegación principal de Symphoniac
              </SheetDescription>
              <nav
                aria-label="Navegación móvil"
                className="mt-6 flex flex-col gap-1"
              >
                {links.map((link) => {
                  const active = isActive(pathname, link.href)
                  return (
                    <SheetClose asChild key={link.href}>
                      <Link
                        to={link.href}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex cursor-pointer items-center justify-between rounded-full px-4 py-2.5 text-base font-medium transition-colors",
                          active
                            ? "bg-muted/60 text-foreground"
                            : "text-muted-foreground hover:bg-muted/40 hover:text-foreground",
                          focusRing,
                        )}
                      >
                        {link.label}
                        {active ? (
                          <span
                            aria-hidden="true"
                            className="size-1.5 rounded-full bg-primary"
                          />
                        ) : null}
                      </Link>
                    </SheetClose>
                  )
                })}
              </nav>
              <Button asChild className="mt-6 w-full">
                <Link to="/productos" onClick={() => setOpen(false)}>
                  Ver catálogo
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              <div className="mt-6 border-t border-border/60 pt-4 sm:hidden">
                <ActionIcons
                  onCartClick={() => {
                    setOpen(false)
                    setCartOpen(true)
                  }}
                  onFavoritesClick={() => setOpen(false)}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </header>
  )
}
