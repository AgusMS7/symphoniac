import { Link } from "react-router-dom"

import { cn } from "@/lib/utils"

const links = [
  { href: "/productos", label: "Productos" },
  { href: "/donde-estamos", label: "Donde estamos" },
  { href: "/admin", label: "Administración" },
]

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-border/60 bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              to="/"
              className={cn(
                "inline-flex cursor-pointer items-center gap-2 font-display text-xl font-semibold tracking-tight text-foreground",
                focusRing,
              )}
            >
              <img
                src="/icons/logo.svg"
                alt=""
                aria-hidden="true"
                className="size-5"
              />
              Symphoniac
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Instrumentos probados en vivo. Showroom en Mendoza, envíos a todo
              el país.
            </p>
          </div>

          <nav
            aria-label="Pie de página"
            className="flex flex-wrap gap-x-6 gap-y-2 text-sm"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "cursor-pointer text-muted-foreground transition-colors hover:text-foreground",
                  focusRing,
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-2 border-t border-border/60 pt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Agustín Sandoval · Código MIT</span>
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>Demo · Datos locales</span>
            <span>Contenido y marca reservados</span>
            <a
              href="https://github.com/AgusMS7/symphoniac/blob/main/LICENSE"
              target="_blank"
              rel="noreferrer"
              className={cn(
                "underline underline-offset-2 transition-colors hover:text-foreground",
                focusRing,
              )}
            >
              Licencia
            </a>
            <a
              href="https://github.com/AgusMS7/symphoniac/blob/main/NOTICE.md"
              target="_blank"
              rel="noreferrer"
              className={cn(
                "underline underline-offset-2 transition-colors hover:text-foreground",
                focusRing,
              )}
            >
              Créditos
            </a>
          </span>
        </div>
      </div>
    </footer>
  )
}
