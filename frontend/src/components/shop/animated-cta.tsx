import type { ReactNode } from "react"

import { ArrowUpRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type AnimatedCtaProps = {
  children: ReactNode
  onClick?: () => void
  className?: string
}

export function AnimatedCta({
  children,
  onClick,
  className,
}: AnimatedCtaProps) {
  return (
    <Button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative h-12 w-fit overflow-hidden rounded-full p-1 ps-6 pe-14 text-sm font-medium transition-all duration-500 hover:ps-14 hover:pe-6 motion-reduce:transition-none",
        className,
      )}
    >
      <span className="relative z-10 transition-all duration-500 motion-reduce:transition-none">
        {children}
      </span>
      <span className="absolute right-1 grid size-10 place-items-center rounded-full bg-background text-foreground transition-all duration-500 group-hover:right-[calc(100%-44px)] group-hover:rotate-45 motion-reduce:transition-none">
        <ArrowUpRight className="size-4" aria-hidden="true" />
      </span>
    </Button>
  )
}
