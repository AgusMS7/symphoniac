import { Link } from "react-router-dom"

import { cn } from "@/lib/utils"

const links = [
  { href: "/productos", label: "Productos" },
  { href: "/donde-estamos", label: "Donde estamos" },
]

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          <span className="font-display font-semibold text-foreground">
            Symphoniac
          </span>{" "}
          · © 2026
        </p>
        <nav aria-label="Pie de página" className="flex flex-wrap gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn("rounded-sm hover:text-foreground", focusRing)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}
