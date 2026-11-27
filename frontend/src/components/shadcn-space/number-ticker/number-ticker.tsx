import { useEffect, useRef, useState } from "react"
import { useReducedMotion } from "motion/react"

type NumberTickerProps = {
  end: number
  start?: number
  duration?: number
  decimals?: number
  prefix?: string
  suffix?: string
  className?: string
}

export function NumberTicker({
  end,
  start = 0,
  duration = 2,
  decimals = 0,
  prefix = "",
  suffix = "",
  className,
}: NumberTickerProps) {
  const reduceMotion = useReducedMotion()
  const [value, setValue] = useState(reduceMotion ? end : start)
  const startTimeRef = useRef<number | null>(null)

  useEffect(() => {
    if (reduceMotion) {
      setValue(end)
      return
    }

    startTimeRef.current = null
    let frame = 0

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) startTimeRef.current = timestamp

      const progress = timestamp - startTimeRef.current
      const percent = Math.min(progress / (duration * 1000), 1)
      const eased = 1 - Math.pow(1 - percent, 3)
      setValue(start + (end - start) * eased)

      if (percent < 1) frame = requestAnimationFrame(animate)
    }

    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [start, end, duration, reduceMotion])

  return (
    <span className={className}>
      {prefix}
      {value.toFixed(decimals)}
      {suffix}
    </span>
  )
}
