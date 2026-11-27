import type React from "react"

import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Categoria } from "../types/Categoria"

interface FiltroCategoriaProps {
  categorias: Categoria[]
  categoriaSeleccionada: string
  onCategoriaChange: (categoriaId: string) => void
  loading?: boolean
}

const ALL = "all"

export const FiltroCategoria: React.FC<FiltroCategoriaProps> = ({
  categorias,
  categoriaSeleccionada,
  onCategoriaChange,
  loading = false,
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      <Label
        htmlFor="categoria-select"
        className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground"
      >
        Filtrar por categoría
      </Label>
      <Select
        value={categoriaSeleccionada || ALL}
        onValueChange={(value) =>
          onCategoriaChange(value === ALL ? "" : value)
        }
        disabled={loading}
      >
        <SelectTrigger id="categoria-select" className="w-full">
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
  )
}
