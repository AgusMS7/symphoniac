import { useForm } from "react-hook-form"
import { toast } from "sonner"
import {
  CircleHelp,
  Guitar,
  Heart,
  ShoppingCart,
} from "lucide-react"

import { AppShell } from "@/components/layout/app-shell"
import HeroSection from "@/components/shadcn-space/blocks/hero-01/hero"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Toaster } from "@/components/ui/sonner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const cards = [
  {
    title: "Guitarras",
    description: "Cuerdas, eléctricas y acústicas.",
    icon: Guitar,
  },
  {
    title: "Favoritos",
    description: "Guardá tus instrumentos favoritos.",
    icon: Heart,
  },
  {
    title: "Carrito",
    description: "Armá tu selección localmente.",
    icon: ShoppingCart,
  },
]

function PreviewForm() {
  const form = useForm({ defaultValues: { nombre: "" } })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(() => {
          toast("Formulario enviado", { description: "Validación de ejemplo." })
        })}
        className="grid gap-3"
      >
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del instrumento</FormLabel>
              <FormControl>
                <Input placeholder="Guitarra" {...field} />
              </FormControl>
              <FormDescription>Ejemplo con react-hook-form.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" size="sm">
          Enviar
        </Button>
      </form>
    </Form>
  )
}

export function DesignPreview() {
  return (
    <AppShell>
      <TooltipProvider>
        <HeroSection className="pt-6" />

        <section className="mx-auto max-w-6xl px-4 py-10">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
                Design preview
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Base visual de la Fase 3. Ruta temporal: se elimina antes de
                cerrar el proyecto.
              </p>
            </div>
            <Badge variant="outline">Tema oscuro</Badge>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => (
              <Card key={card.title}>
                <CardHeader>
                  <card.icon
                    className="size-5 text-primary"
                    aria-hidden="true"
                  />
                  <CardTitle className="font-display">{card.title}</CardTitle>
                  <CardDescription>{card.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button variant="outline" size="sm">
                    Ver más
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <Separator className="my-10" />

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="font-display">Inventario</CardTitle>
                <CardDescription>Tabla con tokens del tema.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Instrumento</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead className="text-right">Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Guitarra Yamaha</TableCell>
                      <TableCell>Cuerdas</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="secondary">Activo</Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Piano digital</TableCell>
                      <TableCell>Teclados</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="secondary">Activo</Badge>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-display">
                  Formulario y feedback
                </CardTitle>
                <CardDescription>
                  Form, toast y tooltip sobre el tema.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-5">
                <PreviewForm />
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      toast("Toast de prueba", {
                        description: "Sonner con el tema aplicado.",
                      })
                    }
                  >
                    Mostrar toast
                  </Button>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Ayuda"
                      >
                        <CircleHelp className="size-4" aria-hidden="true" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Ayuda contextual</TooltipContent>
                  </Tooltip>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
        <Toaster />
      </TooltipProvider>
    </AppShell>
  )
}
