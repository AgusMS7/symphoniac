import { useEffect, useState, type FormEvent } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { ChevronLeft, ChevronRight, Hash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination"

type CatalogPaginationProps = {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function CatalogPagination({
  page,
  totalPages,
  onPageChange,
}: CatalogPaginationProps) {
  const reduceMotion = useReducedMotion()
  const [isEditing, setIsEditing] = useState(false)
  const [inputValue, setInputValue] = useState(String(page))

  useEffect(() => {
    setInputValue(String(page))
  }, [page])

  const clampPage = (value: number) =>
    Math.max(1, Math.min(totalPages, value))

  const handlePageChange = (nextPage: number) => {
    const next = clampPage(nextPage)
    if (next !== page) onPageChange(next)
    setInputValue(String(next))
    setIsEditing(false)
  }

  const handleInputSubmit = (event: FormEvent) => {
    event.preventDefault()
    const next = Number.parseInt(inputValue, 10)
    if (Number.isNaN(next)) {
      setInputValue(String(page))
      setIsEditing(false)
      return
    }
    handlePageChange(next)
  }

  return (
    <div className="mt-10 flex flex-col items-center gap-3">
      <p className="sr-only" aria-live="polite">
        Página {page} de {totalPages}
      </p>

      <Pagination aria-label="Paginación del catálogo" className="justify-center">
        <PaginationContent className="w-fit flex-nowrap gap-1 rounded-full border border-border/60 bg-card/40 p-1.5">
          <PaginationItem>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Página anterior"
              disabled={page === 1}
              onClick={() => handlePageChange(page - 1)}
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
            </Button>
          </PaginationItem>

          <PaginationItem className="flex items-center">
            <div className="flex min-w-32 items-center justify-center px-1">
              <AnimatePresence mode="wait" initial={false}>
                {!isEditing ? (
                  <motion.button
                    key="viewer"
                    type="button"
                    onClick={() => setIsEditing(true)}
                    initial={
                      reduceMotion ? false : { opacity: 0, y: 4 }
                    }
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="flex cursor-pointer items-center gap-1.5 rounded-full px-2 py-1 transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label={`Página ${page} de ${totalPages}. Editar página`}
                  >
                    <span className="font-display text-lg font-semibold tabular-nums text-foreground">
                      {String(page).padStart(2, "0")}
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                      de {totalPages}
                    </span>
                    <Hash
                      className="size-3 text-muted-foreground"
                      aria-hidden="true"
                    />
                  </motion.button>
                ) : (
                  <motion.form
                    key="editor"
                    onSubmit={handleInputSubmit}
                    onBlur={(event) => {
                      const nextTarget = event.relatedTarget
                      if (
                        !(nextTarget instanceof Node) ||
                        !event.currentTarget.contains(nextTarget)
                      ) {
                        setIsEditing(false)
                        setInputValue(String(page))
                      }
                    }}
                    initial={
                      reduceMotion ? false : { opacity: 0, scale: 0.96 }
                    }
                    animate={{ opacity: 1, scale: 1 }}
                    exit={
                      reduceMotion ? undefined : { opacity: 0, scale: 0.96 }
                    }
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-1.5"
                  >
                    <Input
                      autoFocus
                      value={inputValue}
                      onChange={(event) =>
                        setInputValue(
                          event.target.value.replace(/[^0-9]/g, ""),
                        )
                      }
                      onKeyDown={(event) => {
                        if (event.key === "Escape") {
                          setIsEditing(false)
                          setInputValue(String(page))
                        }
                      }}
                      inputMode="numeric"
                      aria-label="Número de página"
                      className="h-8 w-14 px-2 text-center font-mono text-xs tabular-nums"
                    />
                    <Button
                      type="submit"
                      variant="secondary"
                      size="xs"
                      onMouseDown={(event) => event.preventDefault()}
                      className="h-8 px-2 font-mono text-[9px] uppercase tracking-[0.14em]"
                    >
                      Ir
                    </Button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </PaginationItem>

          <PaginationItem>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Página siguiente"
              disabled={page === totalPages}
              onClick={() => handlePageChange(page + 1)}
            >
              <ChevronRight className="size-4" aria-hidden="true" />
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <div
        aria-hidden="true"
        className="h-px w-40 overflow-hidden rounded-full bg-border/60"
      >
        <motion.div
          className="h-full origin-left bg-primary"
          initial={false}
          animate={{ scaleX: page / totalPages }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 220, damping: 28 }
          }
          style={{ width: "100%" }}
        />
      </div>
    </div>
  )
}
