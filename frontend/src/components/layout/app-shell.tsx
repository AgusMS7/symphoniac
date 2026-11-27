import type { ReactNode } from "react"
import { useLocation } from "react-router-dom"
import { motion, useReducedMotion } from "motion/react"

import { usePointerSpotlight } from "@/lib/use-pointer-spotlight"
import { Footer } from "./footer"
import { Navbar } from "./navbar"

export function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation()
  const reduceMotion = useReducedMotion()
  const offset = reduceMotion ? 0 : 8
  const handlePointerMove = usePointerSpotlight<HTMLDivElement>({
    fixed: true,
  })

  return (
    <div
      className="ambient-stage relative flex min-h-screen flex-col bg-background text-foreground"
      onPointerMove={handlePointerMove}
    >
      <div
        aria-hidden="true"
        className="ambient-spotlight pointer-events-none fixed inset-0 z-0"
      />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
      >
        Saltar al contenido
      </a>
      <Navbar />
      <main id="main-content" className="relative z-10 flex-1">
        <motion.div
          key={location.pathname}
          initial={reduceMotion ? false : { opacity: 0, y: offset }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </main>
      <Footer />
    </div>
  )
}
