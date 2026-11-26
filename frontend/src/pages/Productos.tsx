import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { InstrumentoCard } from "../components/InstrumentoCard"
import { FiltroCategoria } from "../components/FiltroCategoria"
import { ErrorScreen } from "../components/ErrorScreen"
import type { Instrumento, Categoria } from "../types/Instrumento"
import { instrumentoService, categoriaService } from "../services/api"

const ordenamientos = [
  { value: "nombre", label: "Nombre A-Z" },
  { value: "precio-asc", label: "Precio: Menor a Mayor" },
  { value: "precio-desc", label: "Precio: Mayor a Menor" },
  { value: "marca", label: "Marca A-Z" },
  { value: "vendidos", label: "Más Vendidos" },
]

export const Productos = () => {
  const [instrumentos, setInstrumentos] = useState<Instrumento[]>([])
  const [instrumentosFiltrados, setInstrumentosFiltrados] = useState<
    Instrumento[]
  >([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [categoriaSeleccionada, setCategoriaSeleccionada] =
    useState<string>("")
  const [busqueda, setBusqueda] = useState("")
  const [ordenamiento, setOrdenamiento] = useState("nombre")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRetrying, setIsRetrying] = useState(false)

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1)
  const instrumentosPorPagina = 12

  const fetchData = async () => {
    try {
      setError(null)
      const [instrumentosRes, categoriasRes] = await Promise.all([
        instrumentoService.getAllSimple(),
        categoriaService.getAll(),
      ])

      // Manejar respuesta de instrumentos - evitar duplicados
      let instrumentosArray: Instrumento[] = []
      if (Array.isArray(instrumentosRes)) {
        instrumentosArray = instrumentosRes
      } else if (
        instrumentosRes.content &&
        Array.isArray(instrumentosRes.content)
      ) {
        instrumentosArray = instrumentosRes.content
      } else if (
        instrumentosRes.success &&
        instrumentosRes.data &&
        Array.isArray(instrumentosRes.data)
      ) {
        instrumentosArray = instrumentosRes.data
      } else if (instrumentosRes.data && Array.isArray(instrumentosRes.data)) {
        instrumentosArray = instrumentosRes.data
      }

      // Eliminar duplicados por ID
      const instrumentosUnicos = instrumentosArray.filter(
        (instrumento, index, self) =>
          index === self.findIndex((i) => i.id === instrumento.id),
      )

      setInstrumentos(instrumentosUnicos)

      // Manejar respuesta de categorías
      let categoriasArray: Categoria[] = []
      if (Array.isArray(categoriasRes)) {
        categoriasArray = categoriasRes
      } else if (
        categoriasRes.success &&
        categoriasRes.data &&
        Array.isArray(categoriasRes.data)
      ) {
        categoriasArray = categoriasRes.data
      } else if (categoriasRes.data && Array.isArray(categoriasRes.data)) {
        categoriasArray = categoriasRes.data
      }

      setCategorias(categoriasArray)
    } catch (error) {
      console.error("Error conectando al backend:", error)
      setError(error instanceof Error ? error.message : "Error desconocido")
      setInstrumentos([])
      setCategorias([])
    } finally {
      setLoading(false)
      setIsRetrying(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    aplicarFiltros()
    setPaginaActual(1) // Resetear a primera página cuando cambian los filtros
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instrumentos, categoriaSeleccionada, busqueda, ordenamiento])

  const aplicarFiltros = () => {
    let resultado = [...instrumentos]

    // Filtrar por categoría
    if (categoriaSeleccionada) {
      resultado = resultado.filter(
        (instrumento) =>
          instrumento.idCategoria === Number(categoriaSeleccionada),
      )
    }

    // Filtrar por búsqueda
    if (busqueda) {
      const busquedaLower = busqueda.toLowerCase()
      resultado = resultado.filter(
        (instrumento) =>
          instrumento.instrumento.toLowerCase().includes(busquedaLower) ||
          instrumento.marca.toLowerCase().includes(busquedaLower) ||
          instrumento.modelo.toLowerCase().includes(busquedaLower),
      )
    }

    // Ordenar
    resultado.sort((a, b) => {
      switch (ordenamiento) {
        case "nombre":
          return a.instrumento.localeCompare(b.instrumento)
        case "precio-asc":
          return a.precio - b.precio
        case "precio-desc":
          return b.precio - a.precio
        case "marca":
          return a.marca.localeCompare(b.marca)
        case "vendidos":
          return (b.cantidadVendida || 0) - (a.cantidadVendida || 0)
        default:
          return 0
      }
    })

    setInstrumentosFiltrados(resultado)
  }

  const handleRetry = () => {
    setIsRetrying(true)
    setLoading(true)
    fetchData()
  }

  const handleCategoriaChange = (categoriaId: string) => {
    setCategoriaSeleccionada(categoriaId)
  }

  const limpiarFiltros = () => {
    setCategoriaSeleccionada("")
    setBusqueda("")
    setOrdenamiento("nombre")
  }

  // Lógica de paginación
  const totalPaginas = Math.ceil(
    instrumentosFiltrados.length / instrumentosPorPagina,
  )
  const indiceInicio = (paginaActual - 1) * instrumentosPorPagina
  const indiceFin = indiceInicio + instrumentosPorPagina
  const instrumentosPaginados = instrumentosFiltrados.slice(
    indiceInicio,
    indiceFin,
  )

  const cambiarPagina = (nuevaPagina: number) => {
    setPaginaActual(nuevaPagina)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const generarNumerosPagina = () => {
    const numeros = []
    const maxVisible = 5
    let inicio = Math.max(1, paginaActual - Math.floor(maxVisible / 2))
    const fin = Math.min(totalPaginas, inicio + maxVisible - 1)

    if (fin - inicio < maxVisible - 1) {
      inicio = Math.max(1, fin - maxVisible + 1)
    }

    for (let i = inicio; i <= fin; i++) {
      numeros.push(i)
    }
    return numeros
  }

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="mt-6 h-20 w-full rounded-xl" />
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="h-72 w-full rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <ErrorScreen
        title="Error al cargar productos"
        message="No se pudieron cargar los productos desde el servidor."
        details={error}
        onRetry={handleRetry}
        isRetrying={isRetrying}
      />
    )
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <header className="max-w-2xl">
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Nuestros Productos
        </h1>
        <p className="mt-2 text-base text-muted-foreground">
          Explora nuestra colección de instrumentos musicales de alta calidad
        </p>
      </header>

      <Card className="mt-8">
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:items-end">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="busqueda">Buscar</Label>
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id="busqueda"
                  type="text"
                  placeholder="Nombre, marca o modelo..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <FiltroCategoria
              categorias={categorias}
              categoriaSeleccionada={categoriaSeleccionada}
              onCategoriaChange={handleCategoriaChange}
              loading={loading}
            />

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ordenamiento">Ordenar por</Label>
              <Select value={ordenamiento} onValueChange={setOrdenamiento}>
                <SelectTrigger id="ordenamiento" className="w-full">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  {ordenamientos.map((opcion) => (
                    <SelectItem key={opcion.value} value={opcion.value}>
                      {opcion.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" onClick={limpiarFiltros}>
              Limpiar filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      <p className="mt-6 text-sm text-muted-foreground">
        Mostrando {instrumentosPaginados.length} de{" "}
        {instrumentosFiltrados.length} instrumentos
        {totalPaginas > 1 && ` (Página ${paginaActual} de ${totalPaginas})`}
      </p>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {instrumentosPaginados.map((instrumento) => (
          <InstrumentoCard
            key={`instrumento-${instrumento.id}`}
            instrumento={instrumento}
          />
        ))}
      </div>

      {instrumentosFiltrados.length === 0 && (
        <Card className="mt-6">
          <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
            <p className="text-sm text-muted-foreground">
              No se encontraron instrumentos que coincidan con los filtros
              aplicados.
            </p>
            <Button onClick={limpiarFiltros}>Limpiar filtros</Button>
          </CardContent>
        </Card>
      )}

      {totalPaginas > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => cambiarPagina(paginaActual - 1)}
                disabled={paginaActual === 1}
              >
                <ChevronLeft aria-hidden="true" />
                Anterior
              </Button>
            </PaginationItem>

            {paginaActual > 3 && (
              <>
                <PaginationItem>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => cambiarPagina(1)}
                    aria-label="Página 1"
                  >
                    1
                  </Button>
                </PaginationItem>
                {paginaActual > 4 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
              </>
            )}

            {generarNumerosPagina().map((numero) => (
              <PaginationItem key={numero}>
                <Button
                  variant={numero === paginaActual ? "outline" : "ghost"}
                  size="icon"
                  onClick={() => cambiarPagina(numero)}
                  aria-label={`Página ${numero}`}
                  aria-current={numero === paginaActual ? "page" : undefined}
                >
                  {numero}
                </Button>
              </PaginationItem>
            ))}

            {paginaActual < totalPaginas - 2 && (
              <>
                {paginaActual < totalPaginas - 3 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
                <PaginationItem>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => cambiarPagina(totalPaginas)}
                    aria-label={`Página ${totalPaginas}`}
                  >
                    {totalPaginas}
                  </Button>
                </PaginationItem>
              </>
            )}

            <PaginationItem>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => cambiarPagina(paginaActual + 1)}
                disabled={paginaActual === totalPaginas}
              >
                Siguiente
                <ChevronRight aria-hidden="true" />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}

export default Productos
