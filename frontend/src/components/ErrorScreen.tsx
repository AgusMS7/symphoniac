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
      <Card className="items-center text-center">
        <CardContent className="flex flex-col items-center gap-4">
          <span className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
            <TriangleAlert
              className="size-6 text-destructive"
              aria-hidden="true"
            />
          </span>

          <h2 className="font-display text-xl font-semibold text-foreground">
            {title}
          </h2>

          <p className="max-w-md text-sm text-muted-foreground">{message}</p>

          {details && (
            <p className="w-full rounded-md border border-border bg-muted/50 px-3 py-2 text-left text-xs text-muted-foreground">
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
