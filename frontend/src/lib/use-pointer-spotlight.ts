import { useEffect, useRef, type PointerEvent as ReactPointerEvent } from "react"
import { useReducedMotion } from "motion/react"

type PointerSpotlightOptions = {
  fixed?: boolean
}

export function usePointerSpotlight<T extends HTMLElement>({
  fixed = false,
}: PointerSpotlightOptions = {}) {
  const reduceMotion = useReducedMotion()
  const frame = useRef<number | null>(null)

  useEffect(
    () => () => {
      if (frame.current) cancelAnimationFrame(frame.current)
    },
    [],
  )

  return (event: ReactPointerEvent<T>) => {
    if (reduceMotion || event.pointerType !== "mouse") return

    const target = event.currentTarget
    const rect = target.getBoundingClientRect()
    const x = fixed ? event.clientX : event.clientX - rect.left
    const y = fixed ? event.clientY : event.clientY - rect.top

    if (frame.current) {
      cancelAnimationFrame(frame.current)
    }

    frame.current = requestAnimationFrame(() => {
      target.style.setProperty("--spot-x", `${x}px`)
      target.style.setProperty("--spot-y", `${y}px`)
    })
  }
}
