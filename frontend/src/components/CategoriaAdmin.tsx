import type React from "react"
import { useState } from "react"
import { ArrowLeft, Pencil, Plus, Trash2 } from "lucide-react"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Categoria } from "../types/Categoria"
import { categoriaService } from "../services/api"

interface CategoriaAdminProps {
  categorias: Categoria[]
  setCategorias: (categorias: Categoria[]) => void
  onBack: () => void
}

export const CategoriaAdmin = ({
  categorias,
  setCategorias,
  onBack,
}: CategoriaAdminProps) => {
  const [showForm, setShowForm] = useState(false)
  const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(
    null,
  )
  const [formData, setFormData] = useState({ denominacion: "" })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCreate = () => {
    setEditingCategoria(null)
    setFormData({ denominacion: "" })
    setErrors({})
    setShowForm(true)
  }

  const handleEdit = (categoria: Categoria) => {
    setEditingCategoria(categoria)
    setFormData({ denominacion: categoria.denominacion })
    setErrors({})
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    try {
      const response = await categoriaService.delete(id)
      if (response.success) {
        setCategorias(categorias.filter((cat) => cat.id !== id))
      } else {
        throw new Error(response.message || "Error al eliminar")
      }
    } catch (error) {
      toast.error("Error al eliminar categoría: " + error)
    }
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.denominacion.trim()) {
      newErrors.denominacion = "La denominación es requerida"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      let response

      if (editingCategoria) {
        response = await categoriaService.update(editingCategoria.id, formData)
      } else {
        response = await categoriaService.create(formData)
      }

      if (response.success && response.data) {
        const savedCategoria = response.data

        if (editingCategoria) {
          setCategorias(
            categorias.map((cat) =>
              cat.id === editingCategoria.id ? savedCategoria : cat,
            ),
          )
        } else {
          setCategorias([...categorias, savedCategoria])
        }

        setShowForm(false)
        setEditingCategoria(null)
        setFormData({ denominacion: "" })
      } else {
        throw new Error(response.message || "Error al guardar")
      }
    } catch (error) {
      console.error("Error al guardar:", error)
      toast.error("Error al guardar categoría: " + error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingCategoria(null)
    setFormData({ denominacion: "" })
    setErrors({})
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const renderActions = (categoria: Categoria) => (
    <div className="flex items-center justify-end gap-1">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={`Editar ${categoria.denominacion}`}
        onClick={() => handleEdit(categoria)}
      >
        <Pencil aria-hidden="true" />
      </Button>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Eliminar ${categoria.denominacion}`}
          >
            <Trash2 aria-hidden="true" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar categoría</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que quieres eliminar la categoría "
              {categoria.denominacion}"? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => handleDelete(categoria.id)}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )

  if (showForm) {
    return (
      <section className="mx-auto w-full max-w-2xl px-4 py-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary">
          Administración
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-foreground">
          {editingCategoria ? "Editar categoría" : "Crear categoría"}
        </h1>

        <div className="mt-6 border-y border-border/60 py-4">
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="denominacion">
                  Denominación <span className="text-destructive">*</span>
                </Label>
                <Input
                  type="text"
                  id="denominacion"
                  name="denominacion"
                  value={formData.denominacion}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.denominacion)}
                  placeholder="Ej: Cuerda, Viento, Percusión..."
                />
                {errors.denominacion && (
                  <p className="text-xs text-destructive">
                    {errors.denominacion}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting
                    ? "Guardando..."
                    : editingCategoria
                      ? "Actualizar"
                      : "Crear"}
                </Button>
              </div>
            </form>
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary">
            Administración
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-foreground">
            Categorías
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft aria-hidden="true" />
            Volver a instrumentos
          </Button>
          <Button onClick={handleCreate}>
            <Plus aria-hidden="true" />
            Crear categoría
          </Button>
        </div>
      </div>

      <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        Total de categorías: {categorias.length}
      </p>

      <div className="mt-4 hidden border-y border-border/60 md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">ID</TableHead>
                  <TableHead>Denominación</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categorias.map((categoria) => (
                  <TableRow key={categoria.id}>
                    <TableCell>{categoria.id}</TableCell>
                    <TableCell className="font-medium">
                      {categoria.denominacion}
                    </TableCell>
                    <TableCell>{renderActions(categoria)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {categorias.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No hay categorías registradas.
              </p>
            )}
      </div>

      <div className="mt-4 divide-y divide-border/60 border-y border-border/60 md:hidden">
        {categorias.map((categoria) => (
          <div
            key={categoria.id}
            className="flex items-center justify-between gap-3 py-3"
          >
            <div>
              <p className="font-display text-base font-semibold text-foreground">
                {categoria.denominacion}
              </p>
              <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                ID {categoria.id}
              </p>
            </div>
            {renderActions(categoria)}
          </div>
        ))}
        {categorias.length === 0 && (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No hay categorías registradas.
          </p>
        )}
      </div>
    </section>
  )
}
