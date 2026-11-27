import { useEffect, type ReactNode } from "react"
import {
  ArrowUpRight,
  Menu as MenuIcon,
  Search,
  ShoppingBag,
} from "lucide-react"

export function PreviewFonts() {
  useEffect(() => {
    const marker = "design-preview-fonts"
    if (document.querySelector(`link[data-${marker}="true"]`)) return

    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href =
      "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,600;1,9..144,700&family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
    link.dataset.designPreviewFonts = "true"
    document.head.appendChild(link)
  }, [])

  return null
}

type DpButtonProps = {
  children: ReactNode
  variant?: "solid" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
  shape?: "pill" | "square"
  tone?: "default" | "light"
  className?: string
}

export function DpButton({
  children,
  variant = "solid",
  size = "md",
  shape = "pill",
  tone = "default",
  className = "",
}: DpButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 border font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dir-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--dir-bg)]"
  const shapeClass = shape === "square" ? "rounded-none" : "rounded-full"
  const variantClass =
    tone === "light" && variant === "outline"
      ? "border-white/20 bg-transparent text-white hover:border-[var(--dir-accent)] hover:text-[var(--dir-accent)]"
      : {
          solid:
            "border-transparent bg-[var(--dir-accent)] text-[#0f0f0f] hover:brightness-110",
          outline:
            "border-[var(--dir-line)] bg-transparent text-[var(--dir-text)] hover:border-[var(--dir-accent)] hover:text-[var(--dir-accent)]",
          ghost:
            "border-transparent bg-transparent text-[var(--dir-text)] hover:bg-[var(--dir-surface-2)]",
        }[variant]
  const sizeClass = {
    sm: "h-9 px-4 text-xs",
    md: "h-11 px-5 text-sm",
    lg: "h-12 px-6 text-sm",
  }[size]

  return (
    <button
      type="button"
      className={`${base} ${shapeClass} ${variantClass} ${sizeClass} ${className}`}
    >
      {children}
    </button>
  )
}

export function DpBadge({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <span
      className={`inline-flex items-center border bg-transparent px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] ${className}`}
    >
      {children}
    </span>
  )
}

export function DirectionIntro({
  index,
  title,
  description,
  type,
  tone,
}: {
  index: string
  title: string
  description: string
  type: string
  tone: string
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="dp-mono text-[10px] uppercase tracking-[0.25em] dp-accent">
          Dirección {index}
        </p>
        <h2 className="dp-display mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </h2>
        <p className="dp-muted mt-2 max-w-xl text-sm leading-relaxed">
          {description}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <DpBadge className="dp-line dp-muted">{type}</DpBadge>
        <DpBadge className="dp-line dp-muted">{tone}</DpBadge>
      </div>
    </div>
  )
}

export function MiniNav({ variant }: { variant: "a" | "b" | "c" }) {
  const isB = variant === "b"
  const isC = variant === "c"
  const navText = isB
    ? "text-white/65 hover:text-white"
    : "dp-muted hover:text-[var(--dir-text)]"
  const iconButton = isB
    ? "border-white/15 bg-white/5 text-white/75 hover:text-white"
    : "border-[var(--dir-line)] bg-transparent text-[var(--dir-text)] hover:border-[var(--dir-accent)] hover:text-[var(--dir-accent)]"
  const shell = isB
    ? "absolute inset-x-0 top-0 z-30 flex items-center justify-between gap-4 bg-gradient-to-b from-black/70 via-black/30 to-transparent px-5 py-4 sm:px-8"
    : "relative flex items-center justify-between gap-4 border-b dp-line px-5 py-4 sm:px-8"
  const iconShape = isC ? "rounded-none" : "rounded-full"
  const badgeShape = isC ? "rounded-none" : "rounded-full"

  return (
    <div className={shell}>
      <div className="flex min-w-0 items-center gap-2">
        <img src="/icons/logo.svg" alt="" className="size-6 shrink-0" />
        <span
          className={`dp-display truncate text-lg font-semibold ${
            isB ? "text-white" : ""
          }`}
        >
          Symphoniac
        </span>
        {isC ? (
          <span className="dp-mono ml-2 hidden border dp-line px-1.5 py-0.5 text-[9px] uppercase tracking-[0.18em] dp-muted sm:inline">
            SYM-01
          </span>
        ) : null}
      </div>

      <nav
        aria-label="Navegación de la maqueta"
        className={`hidden items-center gap-6 text-xs sm:flex ${
          isC ? "dp-mono uppercase tracking-[0.16em]" : ""
        }`}
      >
        {["Instrumentos", "Taller", "Contacto"].map((label) => (
          <button
            key={label}
            type="button"
            className={`transition-colors ${navText}`}
          >
            {label}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Buscar"
          className={`grid size-9 place-items-center ${iconShape} border transition-colors ${iconButton}`}
        >
          <Search className="size-4" />
        </button>
        <button
          type="button"
          aria-label="Carrito"
          className={`relative grid size-9 place-items-center ${iconShape} border transition-colors ${iconButton}`}
        >
          <ShoppingBag className="size-4" />
          <span
            className={`absolute -right-1 -top-1 grid size-4 place-items-center ${badgeShape} bg-[var(--dir-accent)] text-[9px] font-semibold text-[#0f0f0f]`}
          >
            2
          </span>
        </button>
        <span className="hidden sm:inline-flex">
          <DpButton size="sm" shape={isC ? "square" : "pill"}>
            {isC ? "Catálogo" : "Comprar"}
          </DpButton>
        </span>
        <button
          type="button"
          aria-label="Abrir menú"
          className={`grid size-9 place-items-center ${iconShape} border sm:hidden ${iconButton}`}
        >
          <MenuIcon className="size-4" />
        </button>
      </div>
    </div>
  )
}

export function SectionLabel({
  children,
  action,
}: {
  children: ReactNode
  action?: string
}) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <h4 className="dp-display text-2xl leading-tight sm:text-3xl">
        {children}
      </h4>
      {action ? (
        <button
          type="button"
          className="dp-mono flex items-center gap-1 text-[10px] uppercase tracking-[0.18em] dp-muted transition-colors hover:text-[var(--dir-text)]"
        >
          {action}
          <ArrowUpRight className="size-3.5" />
        </button>
      ) : null}
    </div>
  )
}

export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="dp-display text-2xl leading-none">{value}</p>
      <p className="dp-mono mt-1 text-[9px] uppercase tracking-[0.18em] dp-muted">
        {label}
      </p>
    </div>
  )
}

export type Product = {
  name: string
  brand: string
  price: string
  image: string
  tag: string
}

export function imageUrl(id: string, width = 1200) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=80`
}
