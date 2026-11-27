import {
  ArrowUpRight,
  Clock,
  Mail,
  MapPin,
  Phone,
  type LucideIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"

const mapsUrl =
  "https://www.google.com/maps/search/?api=1&query=Av.+Las+Heras+y+Av.+San+Mart%C3%ADn,+Mendoza"

type Contacto = {
  icon: LucideIcon
  title: string
  lines: string[]
  href?: string
}

const contactos: Contacto[] = [
  {
    icon: MapPin,
    title: "Dirección",
    lines: ["Av. Las Heras y Av. San Martín, Ciudad de Mendoza"],
    href: mapsUrl,
  },
  {
    icon: Phone,
    title: "Teléfono",
    lines: ["(+54) 261-123-4567"],
    href: "tel:+542611234567",
  },
  {
    icon: Mail,
    title: "Email",
    lines: ["contacto@symphoniac.com"],
    href: "mailto:contacto@symphoniac.com",
  },
  {
    icon: Clock,
    title: "Horarios",
    lines: ["Lunes a Viernes: 9:00 - 18:00", "Sábados: 9:00 - 13:00"],
  },
]

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"

export const DondeEstamos = () => {
  return (
    <div className="pb-10">
      <header className="mx-auto w-full max-w-6xl px-4 pt-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary">
          Donde estamos
        </p>
        <h1 className="mt-2 font-display text-6xl leading-[0.9] tracking-[-0.05em] text-foreground sm:text-8xl">
          Showroom
        </h1>
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          Mendoza · Av. Las Heras y Av. San Martín
        </p>
      </header>

      <section
        aria-label="Ubicación y contacto del showroom"
        className="relative mt-8 h-[560px] w-full overflow-hidden border-y border-border/60 sm:h-[620px]"
      >
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3350.4482572921247!2d-68.84726492396837!3d-32.88679697339306!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x967e091ed2dd83f7%3A0xf41c7ab7e3522157!2sAv.%20Las%20Heras%20%26%20Av.%20San%20Mart%C3%ADn%2C%20Mendoza!5e0!3m2!1ses!2sar!4v1717711000000!5m2!1ses!2sar"
          className="absolute inset-0 size-full border-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Ubicación de Symphoniac"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/25 to-transparent"
        />

        <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-border/60 bg-background/90 p-5 backdrop-blur-xl sm:left-6 sm:bottom-6 sm:max-w-md lg:inset-y-0 lg:left-auto lg:right-0 lg:w-96 lg:rounded-none lg:border-y-0 lg:border-r-0 lg:border-l lg:p-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary">
            Contacto
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-foreground">
            Información de contacto
          </h2>

          <div className="mt-4 divide-y divide-border/60">
            {contactos.map((contacto) => {
              const content = (
                <div className="flex items-start gap-3 py-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full border border-border/60 bg-muted/40">
                    <contacto.icon
                      className="size-4 text-primary"
                      aria-hidden="true"
                    />
                  </span>
                  <div>
                    <h3 className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                      {contacto.title}
                    </h3>
                    {contacto.lines.map((line) => (
                      <p
                        key={line}
                        className="mt-1 text-sm leading-relaxed text-foreground"
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              )

              if (!contacto.href) {
                return (
                  <div key={contacto.title} className="block">
                    {content}
                  </div>
                )
              }

              return (
                <a
                  key={contacto.title}
                  href={contacto.href}
                  target={
                    contacto.href.startsWith("http") ? "_blank" : undefined
                  }
                  rel={
                    contacto.href.startsWith("http")
                      ? "noreferrer"
                      : undefined
                  }
                  className={`block cursor-pointer transition-colors hover:text-primary ${focusRing}`}
                >
                  {content}
                </a>
              )
            })}
          </div>

          <Button asChild variant="outline" className="mt-4 w-full">
            <a href={mapsUrl} target="_blank" rel="noreferrer">
              Abrir en Google Maps
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
          </Button>
        </div>
      </section>
    </div>
  )
}

export default DondeEstamos
