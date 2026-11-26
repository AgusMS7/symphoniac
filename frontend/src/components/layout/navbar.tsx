import { useState } from "react"
import { Link } from "react-router-dom"
import { CircleHelp, Heart, Menu, ShoppingCart } from "lucide-react"

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
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const links = [
  { href: "/", label: "Inicio" },
  { href: "/productos", label: "Productos" },
  { href: "/donde-estamos", label: "Donde estamos" },
]

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"

function DemoChip() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Información sobre la demo"
          className={cn(
            "inline-flex items-center gap-1 rounded-full border border-border bg-muted/60 p-0.5 pl-1.5 transition-colors hover:bg-muted",
            focusRing,
          )}
        >
          <Badge
            variant="secondary"
            className="rounded-full px-1.5 py-0 text-[10px] font-semibold"
          >
            Demo
          </Badge>
          <span className="flex size-5 items-center justify-center rounded-full">
            <CircleHelp
              className="size-3.5 text-muted-foreground"
              aria-hidden="true"
            />
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72">
        <p className="font-display text-sm font-semibold text-foreground">
          Modo demo
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Catálogo de ejemplo en solo lectura. Carrito, favoritos y pedidos se
          guardan en este navegador.
        </p>
      </PopoverContent>
    </Popover>
  )
}

function ActionIcons() {
  return (
    <div className="flex items-center gap-0.5">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Favoritos"
        className={cn("relative", focusRing)}
      >
        <Heart className="size-4" aria-hidden="true" />
        <Badge className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full p-0 text-[10px]">
          0
        </Badge>
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Carrito"
        className={cn("relative", focusRing)}
      >
        <ShoppingCart className="size-4" aria-hidden="true" />
        <Badge className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full p-0 text-[10px]">
          0
        </Badge>
      </Button>
    </div>
  )
}

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
        <Link
          to="/"
          className={cn(
            "font-display text-lg font-bold tracking-tight text-primary",
            focusRing,
          )}
        >
          Symphoniac
        </Link>

        <nav
          aria-label="Navegación principal"
          className="hidden items-center gap-1 md:flex"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                focusRing,
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <DemoChip />
          <div className="hidden sm:block">
            <ActionIcons />
          </div>
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
            <SheetContent side="right" className="w-72">
              <SheetTitle className="font-display text-lg">Menú</SheetTitle>
              <nav
                aria-label="Navegación móvil"
                className="mt-6 flex flex-col gap-1"
              >
                {links.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <Link
                      to={link.href}
                      className={cn(
                        "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground",
                        focusRing,
                      )}
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
              <div className="mt-6 border-t border-border pt-4 sm:hidden">
                <ActionIcons />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
