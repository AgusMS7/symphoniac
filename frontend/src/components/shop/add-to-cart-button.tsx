import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { Check, ShoppingCart } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { addToCart } from "../../data/localStore"

type AddToCartButtonProps = {
  instrumentoId: number
  name: string
  label?: string
  size?: "sm" | "lg"
  className?: string
}

export function AddToCartButton({
  instrumentoId,
  name,
  label = "Agregar al carrito",
  size = "lg",
  className,
}: AddToCartButtonProps) {
  const reduceMotion = useReducedMotion()
  const [added, setAdded] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  const handleAdd = () => {
    addToCart(instrumentoId)
    toast.success("Agregado al carrito")
    setAdded(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setAdded(false), 1400)
  }

  return (
    <Button
      type="button"
      size={size}
      onClick={handleAdd}
      aria-label={added ? "Agregado al carrito" : `Agregar ${name} al carrito`}
      className={cn("relative overflow-hidden", className)}
    >
      <AnimatePresence mode="wait" initial={false}>
        {added ? (
          <motion.span
            key="added"
            initial={reduceMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="inline-flex items-center gap-2"
          >
            <Check className="size-4" aria-hidden="true" />
            Agregado
          </motion.span>
        ) : (
          <motion.span
            key="add"
            initial={reduceMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="inline-flex items-center gap-2"
          >
            <ShoppingCart className="size-4" aria-hidden="true" />
            {label}
          </motion.span>
        )}
      </AnimatePresence>
      <span className="sr-only" aria-live="polite">
        {added ? "Agregado al carrito" : ""}
      </span>
    </Button>
  )
}
