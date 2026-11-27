import type { ComponentPropsWithoutRef, ReactNode } from "react"

import { cn } from "@/lib/utils"

interface MarqueeProps extends ComponentPropsWithoutRef<"div"> {
  className?: string
  reverse?: boolean
  pauseOnHover?: boolean
  children: ReactNode
  vertical?: boolean
  repeat?: number
}

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  ...props
}: MarqueeProps) {
  return (
    <>
      <style>
        {`
          @keyframes symphoniac-marquee {
            from { transform: translateX(0); }
            to { transform: translateX(calc(-100% - var(--gap))); }
          }
          @keyframes symphoniac-marquee-vertical {
            from { transform: translateY(0); }
            to { transform: translateY(calc(-100% - var(--gap))); }
          }
          .animate-symphoniac-marquee {
            animation: symphoniac-marquee var(--duration) linear infinite;
          }
          .animate-symphoniac-marquee-vertical {
            animation: symphoniac-marquee-vertical var(--duration) linear infinite;
          }
          .animate-symphoniac-reverse {
            animation-direction: reverse !important;
          }
          .pause-on-hover:hover .animate-symphoniac-marquee,
          .pause-on-hover:hover .animate-symphoniac-marquee-vertical {
            animation-play-state: paused !important;
          }
          @media (prefers-reduced-motion: reduce) {
            .animate-symphoniac-marquee,
            .animate-symphoniac-marquee-vertical {
              animation: none;
            }
          }
        `}
      </style>
      <div
        {...props}
        className={cn(
          "group flex gap-(--gap) overflow-hidden p-2 [--duration:40s] [--gap:1rem]",
          {
            "flex-row": !vertical,
            "flex-col": vertical,
            "pause-on-hover": pauseOnHover,
          },
          className,
        )}
      >
        {Array(repeat)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className={cn("flex shrink-0 justify-around gap-(--gap)", {
                "animate-symphoniac-marquee flex-row": !vertical,
                "animate-symphoniac-marquee-vertical flex-col": vertical,
                "animate-symphoniac-reverse": reverse,
              })}
            >
              {children}
            </div>
          ))}
      </div>
    </>
  )
}
