import { Clock, Mail, MapPin, Phone } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const contactos = [
  {
    icon: MapPin,
    title: "Dirección",
    lines: ["Av. Las Heras y Av. San Martín, Ciudad de Mendoza"],
  },
  {
    icon: Phone,
    title: "Teléfono",
    lines: ["(+54) 261-123-4567"],
  },
  {
    icon: Mail,
    title: "Email",
    lines: ["contacto@symphoniac.com"],
  },
  {
    icon: Clock,
    title: "Horarios",
    lines: ["Lunes a Viernes: 9:00 - 18:00", "Sábados: 9:00 - 13:00"],
  },
]

export const DondeEstamos = () => {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <header className="max-w-2xl">
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Donde Estamos
        </h1>
        <p className="mt-2 text-base text-muted-foreground">
          Visitanos en nuestra tienda física
        </p>
      </header>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card className="overflow-hidden p-0">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3350.4482572921247!2d-68.84726492396837!3d-32.88679697339306!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x967e091ed2dd83f7%3A0xf41c7ab7e3522157!2sAv.%20Las%20Heras%20%26%20Av.%20San%20Mart%C3%ADn%2C%20Mendoza!5e0!3m2!1ses!2sar!4v1717711000000!5m2!1ses!2sar"
            className="h-80 w-full border-0 sm:h-[450px]"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ubicación de Symphoniac"
          />
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-display text-xl">
              Información de Contacto
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            {contactos.map((contacto) => (
              <div key={contacto.title} className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted">
                  <contacto.icon
                    className="size-4 text-primary"
                    aria-hidden="true"
                  />
                </span>
                <div>
                  <h2 className="text-sm font-semibold text-foreground">
                    {contacto.title}
                  </h2>
                  {contacto.lines.map((line) => (
                    <p
                      key={line}
                      className="text-sm text-muted-foreground"
                    >
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default DondeEstamos
