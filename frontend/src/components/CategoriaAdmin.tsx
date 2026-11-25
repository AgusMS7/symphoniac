import type React from "react"

import { useState } from "react"
import type { Categoria } from "../types/Categoria"
import { categoriaService } from "../services/api"
import "./CategoriaAdmin.css"

interface CategoriaAdminProps {
  categorias: Categoria[]
  setCategorias: (categorias: Categoria[]) => void
  onBack: () => void
}

export const CategoriaAdmin = ({ categorias, setCategorias, onBack }: CategoriaAdminProps) => {
  const [showForm, setShowForm] = useState(false)
  const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null)
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
    if (!confirm("¿Estás seguro de que quieres eliminar esta categoría?")) {
      return
    }

    try {
      const response = await categoriaService.delete(id)
      if (response.success) {
        setCategorias(categorias.filter((cat) => cat.id !== id))
      } else {
        throw new Error(response.message || "Error al eliminar")
      }
    } catch (error) {
      alert("Error al eliminar categoría: " + error)
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

      console.log("Respuesta categoría:", response)

      if (response.success && response.data) {
        const savedCategoria = response.data

        if (editingCategoria) {
          setCategorias(categorias.map((cat) => (cat.id === editingCategoria.id ? savedCategoria : cat)))
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
      alert("Error al guardar categoría: " + error)
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

  if (showForm) {
    return (
      <div className="categoria-form-container">
        <div className="form-header">
          <h1 className="section-title">{editingCategoria ? "Editar Categoría" : "Crear Nueva Categoría"}</h1>
        </div>

        <form onSubmit={handleSubmit} className="categoria-form">
          <div className="form-group">
            <label htmlFor="denominacion">
              Denominación <span className="required">*</span>
            </label>
            <input
              type="text"
              id="denominacion"
              name="denominacion"
              value={formData.denominacion}
              onChange={handleChange}
              className={errors.denominacion ? "error" : ""}
              placeholder="Ej: Cuerda, Viento, Percusión..."
            />
            {errors.denominacion && <span className="error-message">{errors.denominacion}</span>}
          </div>

          <div className="form-actions">
            <button type="button" onClick={handleCancel} className="btn btn-outline" disabled={isSubmitting}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : editingCategoria ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="categoria-admin-container">
      <div className="admin-header">
        <h1 className="section-title">Administración de Categorías</h1>
        <div className="admin-buttons">
          <button className="btn btn-outline" onClick={onBack}>
            ← Volver a Instrumentos
          </button>
          <button className="btn btn-primary" onClick={handleCreate}>
            Crear Nueva Categoría
          </button>
        </div>
      </div>

      <div className="admin-stats">
        <span>Total de categorías: {categorias.length}</span>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Denominación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((categoria) => (
              <tr key={categoria.id}>
                <td>{categoria.id}</td>
                <td className="table-name">{categoria.denominacion}</td>
                <td>
                  <div className="table-actions">
                    <button className="btn-action btn-edit" onClick={() => handleEdit(categoria)} title="Editar">
                      ✏️
                    </button>
                    <button
                      className="btn-action btn-delete"
                      onClick={() => handleDelete(categoria.id)}
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {categorias.length === 0 && (
          <div className="no-results">
            <p>No hay categorías registradas.</p>
          </div>
        )}
      </div>
    </div>
  )
}
