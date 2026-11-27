import { Link } from "react-router-dom"
import { Home, RotateCw, TriangleAlert } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface ErrorScreenProps {
  title?: string
  message?: string
  details?: string
  onRetry?: () => void
  showHomeButton?: boolean
  isRetrying?: boolean
}

export const ErrorScreen = ({
  title = "Error de Conexión",
  message = "No se pudo conectar con el servidor. Por favor, verifica tu conexión a internet e intenta nuevamente.",
  details,
  onRetry,
  showHomeButton = true,
  isRetrying = false,
}: ErrorScreenProps) => {
  return (
    <div className="mx-auto w-full max-w-xl px-4 py-16">
      <Card className="rounded-2xl border-border/60 bg-card/60 text-center">
        <CardContent className="flex flex-col items-center gap-4 py-10">
          <span className="grid size-12 place-items-center rounded-full border border-destructive/30 bg-destructive/10">
            <TriangleAlert
              className="size-6 text-destructive"
              aria-hidden="true"
            />
          </span>

          <h2 className="font-display text-2xl font-semibold text-foreground">
            {title}
          </h2>

          <p className="max-w-md text-sm text-muted-foreground">{message}</p>

          {details && (
            <p className="w-full rounded-xl border border-border/60 bg-muted/30 px-3 py-2 text-left font-mono text-[10px] leading-relaxed text-muted-foreground">
              <strong className="text-foreground">Detalles técnicos:</strong>{" "}
              {details}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            {onRetry && (
              <Button onClick={onRetry} disabled={isRetrying}>
                <RotateCw
                  className={isRetrying ? "animate-spin" : undefined}
                  aria-hidden="true"
                />
                {isRetrying ? "Reintentando..." : "Reintentar"}
              </Button>
            )}

            {showHomeButton && (
              <Button variant="outline" asChild>
                <Link to="/">
                  <Home aria-hidden="true" />
                  Ir al inicio
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
