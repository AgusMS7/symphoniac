import { useEffect, useState } from "react"
import { Pencil, Plus, Search, Trash2 } from "lucide-react"
import { toast } from "sonner"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { InstrumentoForm } from "../components/InstrumentoForm"
import { CategoriaAdmin } from "../components/CategoriaAdmin"
import { ErrorScreen } from "../components/ErrorScreen"
import { useCatalogUpdated } from "../data/hooks"
import type {
  Instrumento,
  Categoria,
  ProductImage,
} from "../types/Instrumento"
import {
  instrumentoService,
  categoriaService,
  imageService,
} from "../services/api"

const ordenamientos = [
  { value: "id", label: "ID" },
  { value: "nombre", label: "Nombre A-Z" },
  { value: "marca", label: "Marca A-Z" },
  { value: "precio-asc", label: "Precio: Menor a Mayor" },
  { value: "precio-desc", label: "Precio: Mayor a Menor" },
  { value: "vendidos", label: "Más Vendidos" },
]

const ALL = "all"

export const Admin = () => {
  const [instrumentos, setInstrumentos] = useState<Instrumento[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRetrying, setIsRetrying] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [showCategorias, setShowCategorias] = useState(false)
  const [editingInstrumento, setEditingInstrumento] =
    useState<Instrumento | null>(null)
  const [filtroCategoria, setFiltroCategoria] = useState<string>("")
  const [busqueda, setBusqueda] = useState("")
  const [ordenamiento, setOrdenamiento] = useState("id")
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>(
    {},
  )
  const [instrumentoImages, setInstrumentoImages] = useState<{
    [key: number]: ProductImage | null
  }>({})

  const fetchData = async () => {
    try {
      setError(null)
      const [instrumentosRes, categoriasRes] = await Promise.all([
        instrumentoService.getAllSimple(),
        categoriaService.getAll(),
      ])

      // Manejar respuesta de instrumentos
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

      setInstrumentos(instrumentosArray)

      // Cargar imágenes principales para cada instrumento
      loadInstrumentosImages(instrumentosArray)

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
    } finally {
      setLoading(false)
      setIsRetrying(false)
    }
  }

  const loadInstrumentosImages = async (instrumentosArray: Instrumento[]) => {
    const imagePromises = instrumentosArray.map(async (instrumento) => {
      try {
        const response = await imageService.getPrimary(instrumento.id)
        if (response.success && response.data) {
          return { id: instrumento.id, image: response.data }
        }
      } catch {
        // Error de conexión, manejar silenciosamente
      }
      return { id: instrumento.id, image: null }
    })

    const results = await Promise.all(imagePromises)
    const imageMap: { [key: number]: ProductImage | null } = {}
    results.forEach((result) => {
      imageMap[result.id] = result.image
    })
    setInstrumentoImages(imageMap)
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useCatalogUpdated(fetchData)

  const handleRetry = () => {
    setIsRetrying(true)
    setLoading(true)
    fetchData()
  }

  const handleCreate = () => {
    setEditingInstrumento(null)
    setShowForm(true)
  }

  const handleEdit = (instrumento: Instrumento) => {
    setEditingInstrumento(instrumento)
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    try {
      const response = await instrumentoService.delete(id)

      // Manejar diferentes tipos de respuesta
      if (response.success || response.status === 200 || !response.error) {
        setInstrumentos((prev) => prev.filter((inst) => inst.id !== id))
      } else {
        throw new Error(response.message || "Error al eliminar")
      }
    } catch (error) {
      toast.error("Error al eliminar instrumento: " + error)
    }
  }

  const handleFormSubmit = async (data: unknown) => {
    try {
      const response = editingInstrumento
        ? await instrumentoService.update(editingInstrumento.id, data)
        : await instrumentoService.create(data)

      const savedInstrumento = response.data
      if (!savedInstrumento) {
        throw new Error(response.message || "No se recibió el instrumento guardado")
      }

      if (editingInstrumento) {
        setInstrumentos((prev) =>
          prev.map((inst) =>
            inst.id === editingInstrumento.id ? savedInstrumento : inst,
          ),
        )
      } else {
        setInstrumentos((prev) => [...prev, savedInstrumento])
      }

      // Refrescar la lista para mostrar las imágenes actualizadas
      setTimeout(() => {
        fetchData()
      }, 500)

      return savedInstrumento
    } catch (error) {
      console.error("Error al guardar:", error)
      toast.error("Error al guardar instrumento: " + error)
      throw error
    }
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingInstrumento(null)
    // Refrescar la lista cuando se cancela para mostrar cambios
    fetchData()
  }

  const handleImageError = (instrumentoId: string) => {
    setImageErrors((prev) => ({ ...prev, [instrumentoId]: true }))
  }

  const getInstrumentoImage = (instrumento: Instrumento) => {
    const instrumentoIdStr = instrumento.id.toString()

    if (imageErrors[instrumentoIdStr]) {
      return "/icons/no-image.svg"
    }

    // Prioridad 1: Imagen principal del nuevo sistema
    const primaryImage = instrumentoImages[instrumento.id]
    if (primaryImage && primaryImage.imageUrl) {
      return imageService.getImageUrl(primaryImage.imageUrl)
    }

    // Prioridad 2: Campo imagen legacy
    if (instrumento.imagen && instrumento.imagen.trim() !== "") {
      return imageService.getImageUrl(instrumento.imagen)
    }

    return "/icons/no-image.svg"
  }

  const formatearPrecio = (precio: number) => {
    return `$${precio.toLocaleString("es-AR")}`
  }

  const getCategoriaName = (idCategoria: number) => {
    const categoria = categorias.find((cat) => cat.id === idCategoria)
    return categoria ? categoria.denominacion : "Sin categoría"
  }

  // Filtrar y ordenar instrumentos
  const instrumentosFiltrados = instrumentos
    .filter((instrumento) => {
      const matchCategoria =
        !filtroCategoria ||
        instrumento.idCategoria === Number.parseInt(filtroCategoria)
      const matchBusqueda =
        !busqueda ||
        instrumento.instrumento
          .toLowerCase()
          .includes(busqueda.toLowerCase()) ||
        instrumento.marca.toLowerCase().includes(busqueda.toLowerCase()) ||
        instrumento.modelo.toLowerCase().includes(busqueda.toLowerCase())

      return matchCategoria && matchBusqueda
    })
    .sort((a, b) => {
      switch (ordenamiento) {
        case "id":
          return a.id - b.id
        case "nombre":
          return a.instrumento.localeCompare(b.instrumento)
        case "marca":
          return a.marca.localeCompare(b.marca)
        case "precio-asc":
          return a.precio - b.precio
        case "precio-desc":
          return b.precio - a.precio
        case "vendidos":
          return (b.cantidadVendida || 0) - (a.cantidadVendida || 0)
        default:
          return 0
      }
    })

  const renderActions = (instrumento: Instrumento) => (
    <div className="flex items-center justify-end gap-1">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={`Editar ${instrumento.instrumento}`}
        onClick={() => handleEdit(instrumento)}
      >
        <Pencil aria-hidden="true" />
      </Button>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Eliminar ${instrumento.instrumento}`}
          >
            <Trash2 aria-hidden="true" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar instrumento</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que quieres eliminar "{instrumento.instrumento}"?
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => handleDelete(instrumento.id)}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <Skeleton className="h-9 w-80" />
        <Skeleton className="mt-6 h-20 w-full rounded-xl" />
        <div className="mt-6 flex flex-col gap-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <ErrorScreen
        title="Error al cargar datos"
        message="No se pudieron cargar los datos desde el servidor."
        details={error}
        onRetry={handleRetry}
        isRetrying={isRetrying}
      />
    )
  }

  if (showForm) {
    return (
      <InstrumentoForm
        instrumento={editingInstrumento}
        categorias={categorias}
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
      />
    )
  }

  if (showCategorias) {
    return (
      <CategoriaAdmin
        categorias={categorias}
        setCategorias={setCategorias}
        onBack={() => setShowCategorias(false)}
      />
    )
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Administración de Instrumentos
        </h1>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setShowCategorias(true)}>
            Administrar categorías
          </Button>
          <Button onClick={handleCreate}>
            <Plus aria-hidden="true" />
            Crear instrumento
          </Button>
        </div>
      </div>

      <Card className="mt-6">
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="categoria">Filtrar por categoría</Label>
              <Select
                value={filtroCategoria || ALL}
                onValueChange={(value) =>
                  setFiltroCategoria(value === ALL ? "" : value)
                }
              >
                <SelectTrigger id="categoria" className="w-full">
                  <SelectValue placeholder="Todas las categorías" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>Todas las categorías</SelectItem>
                  {categorias.map((categoria) => (
                    <SelectItem key={categoria.id} value={categoria.id.toString()}>
                      {categoria.denominacion}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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
          </div>
        </CardContent>
      </Card>

      <p className="mt-6 text-sm text-muted-foreground">
        Mostrando {instrumentosFiltrados.length} de {instrumentos.length}{" "}
        instrumentos
      </p>

      {/* Tabla en desktop */}
      <div className="mt-4 hidden md:block">
        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Imagen</TableHead>
                  <TableHead>Instrumento</TableHead>
                  <TableHead>Marca</TableHead>
                  <TableHead>Modelo</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Vendidos</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {instrumentosFiltrados.map((instrumento) => (
                  <TableRow key={instrumento.id}>
                    <TableCell>
                      <img
                        src={getInstrumentoImage(instrumento)}
                        alt={instrumento.instrumento}
                        className="size-12 rounded-md object-cover"
                        onError={() =>
                          handleImageError(instrumento.id.toString())
                        }
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {instrumento.instrumento}
                    </TableCell>
                    <TableCell>{instrumento.marca}</TableCell>
                    <TableCell>{instrumento.modelo}</TableCell>
                    <TableCell>
                      {getCategoriaName(instrumento.idCategoria || 0)}
                    </TableCell>
                    <TableCell>{formatearPrecio(instrumento.precio)}</TableCell>
                    <TableCell>{instrumento.cantidadVendida}</TableCell>
                    <TableCell>{renderActions(instrumento)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {instrumentosFiltrados.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No se encontraron instrumentos que coincidan con los filtros
                aplicados.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Cards en móvil */}
      <div className="mt-4 grid gap-3 md:hidden">
        {instrumentosFiltrados.map((instrumento) => (
          <Card key={instrumento.id} size="sm">
            <CardContent className="flex gap-3">
              <img
                src={getInstrumentoImage(instrumento)}
                alt={instrumento.instrumento}
                className="size-16 shrink-0 rounded-md object-cover"
                onError={() => handleImageError(instrumento.id.toString())}
              />
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <p className="truncate font-medium text-foreground">
                  {instrumento.instrumento}
                </p>
                <p className="text-xs text-muted-foreground">
                  {instrumento.marca} - {instrumento.modelo}
                </p>
                <p className="text-xs text-muted-foreground">
                  {getCategoriaName(instrumento.idCategoria || 0)}
                </p>
                <p className="text-sm font-semibold text-primary">
                  {formatearPrecio(instrumento.precio)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {instrumento.cantidadVendida} vendidos
                </p>
              </div>
              {renderActions(instrumento)}
            </CardContent>
          </Card>
        ))}
        {instrumentosFiltrados.length === 0 && (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No se encontraron instrumentos que coincidan con los filtros
            aplicados.
          </p>
        )}
      </div>
    </div>
  )
}

export default Admin
