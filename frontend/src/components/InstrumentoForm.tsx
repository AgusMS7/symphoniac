import type React from "react"
import { useEffect, useRef, useState } from "react"
import { Check, Image, Trash2, Upload } from "lucide-react"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useIsDemo } from "../data/hooks"
import type { Categoria } from "../types/Categoria"
import type { Instrumento } from "../types/Instrumento"
import { imageService } from "../services/api"

interface InstrumentoFormProps {
  instrumento?: Instrumento | null
  categorias: Categoria[]
  onSubmit: (data: unknown) => Promise<unknown>
  onCancel: () => void
}

interface SubmitResponse {
  id?: number
  data?: { id?: number }
}

export const InstrumentoForm = ({
  instrumento,
  categorias,
  onSubmit,
  onCancel,
}: InstrumentoFormProps) => {
  const [formData, setFormData] = useState({
    instrumento: "",
    marca: "",
    modelo: "",
    imagen: "",
    precio: "",
    costoEnvio: "0",
    cantidadVendida: "0",
    descripcion: "",
    idCategoria: "",
  })

  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [envioGratis, setEnvioGratis] = useState(true)
  const [costoEnvioCustom, setCostoEnvioCustom] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [currentImageId, setCurrentImageId] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isDemo = useIsDemo()

  useEffect(() => {
    if (instrumento) {
      setFormData({
        instrumento: instrumento.instrumento || "",
        marca: instrumento.marca || "",
        modelo: instrumento.modelo || "",
        imagen: instrumento.imagen || "",
        precio: instrumento.precio?.toString() || "",
        costoEnvio: instrumento.costoEnvio || "0",
        cantidadVendida: instrumento.cantidadVendida?.toString() || "0",
        descripcion: instrumento.descripcion || "",
        idCategoria: instrumento.idCategoria?.toString() || "",
      })

      // Configurar envío
      if (instrumento.costoEnvio === "G" || instrumento.costoEnvio === "0") {
        setEnvioGratis(true)
        setCostoEnvioCustom("")
      } else {
        setEnvioGratis(false)
        setCostoEnvioCustom(instrumento.costoEnvio)
      }

      // Configurar preview de imagen - priorizar imagen principal del nuevo sistema
      loadImagePreview(instrumento.id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instrumento])

  const loadImagePreview = async (instrumentoId: number) => {
    try {
      // Intentar obtener la imagen principal del nuevo sistema
      const primaryResponse = await imageService.getPrimary(instrumentoId)
      if (primaryResponse.success && primaryResponse.data) {
        setImagePreview(imageService.getImageUrl(primaryResponse.data.imageUrl))
        setCurrentImageId(primaryResponse.data.id)
        return
      }
    } catch {
      // Error de conexión, intentar con imagen legacy
    }

    // Si no hay imagen principal, usar la imagen legacy
    if (instrumento?.imagen) {
      setImagePreview(imageService.getImageUrl(instrumento.imagen))
    }
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.instrumento.trim()) {
      newErrors.instrumento = "El nombre del instrumento es requerido"
    }

    if (!formData.marca.trim()) {
      newErrors.marca = "La marca es requerida"
    }

    if (!formData.modelo.trim()) {
      newErrors.modelo = "El modelo es requerido"
    }

    if (!formData.precio.trim()) {
      newErrors.precio = "El precio es requerido"
    } else if (isNaN(Number(formData.precio)) || Number(formData.precio) <= 0) {
      newErrors.precio = "El precio debe ser un número válido mayor a 0"
    }

    if (!formData.idCategoria) {
      newErrors.idCategoria = "Debe seleccionar una categoría"
    }

    if (
      !envioGratis &&
      (!costoEnvioCustom ||
        isNaN(Number(costoEnvioCustom)) ||
        Number(costoEnvioCustom) < 0)
    ) {
      newErrors.costoEnvio = "Debe ingresar un costo de envío válido"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith("image/")) {
        toast.error("Por favor selecciona un archivo de imagen válido")
        return
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("El archivo es demasiado grande. Máximo 5MB.")
        return
      }

      setSelectedFile(file)

      // Crear preview
      const reader = new FileReader()
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDeleteImage = async () => {
    if (!currentImageId) {
      // Si no hay imagen del nuevo sistema, solo limpiar preview
      setImagePreview(null)
      setSelectedFile(null)
      return
    }

    setIsDeleting(true)
    try {
      await imageService.delete(currentImageId)
      setImagePreview(null)
      setCurrentImageId(null)
      setSelectedFile(null)
    } catch (error) {
      console.error("Error eliminando imagen:", error)
      toast.error("Error al eliminar la imagen")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Determinar costo de envío
      const costoEnvioFinal = envioGratis ? "G" : costoEnvioCustom

      // Crear el objeto con la estructura exacta que espera la API Spring Boot
      const submitData = {
        instrumento: formData.instrumento,
        marca: formData.marca,
        modelo: formData.modelo,
        imagen: formData.imagen || null,
        precio: Number.parseFloat(formData.precio),
        costoEnvio: costoEnvioFinal,
        cantidadVendida: Number.parseInt(formData.cantidadVendida) || 0,
        descripcion: formData.descripcion || "",
        categoria: {
          id: Number.parseInt(formData.idCategoria),
        },
      }

      // Guardar el instrumento y obtener la respuesta
      const response = (await onSubmit(submitData)) as SubmitResponse

      // Obtener el ID del instrumento (puede venir de diferentes formas según la respuesta)
      let instrumentoId: number | null = null

      if (response?.data?.id) {
        instrumentoId = response.data.id
      } else if (response?.id) {
        instrumentoId = response.id
      } else if (instrumento?.id) {
        // Si estamos editando, usar el ID existente
        instrumentoId = instrumento.id
      }

      // Si hay una imagen seleccionada y tenemos un ID, subirla
      if (selectedFile && instrumentoId && !isDemo) {
        try {
          const uploadResponse = await imageService.upload(
            instrumentoId,
            selectedFile,
            formData.instrumento,
            true,
          )

          // Actualizar el preview con la nueva imagen subida
          if (uploadResponse.success && uploadResponse.data) {
            setImagePreview(
              imageService.getImageUrl(uploadResponse.data.imageUrl),
            )
            setCurrentImageId(uploadResponse.data.id)
          }
        } catch (imageError) {
          console.error("Error subiendo imagen:", imageError)
          toast.error(
            "El instrumento se guardó correctamente, pero hubo un error al subir la imagen. Puedes editarlo después para agregar la imagen.",
          )
        }
      }

      // Cerrar el formulario después de un guardado exitoso
      setTimeout(() => {
        onCancel() // Esto cierra el formulario y vuelve a la lista
      }, 1000)
    } catch (error) {
      console.error("Error en submit:", error)
      toast.error("Error al guardar el instrumento: " + error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleCategoriaChange = (value: string) => {
    setFormData((prev) => ({ ...prev, idCategoria: value }))
    if (errors.idCategoria) {
      setErrors((prev) => ({ ...prev, idCategoria: "" }))
    }
  }

  const handleEnvioChange = (esGratis: boolean) => {
    setEnvioGratis(esGratis)
    if (esGratis) {
      setCostoEnvioCustom("")
      setErrors((prev) => ({ ...prev, costoEnvio: "" }))
    }
  }

  const errorText = (key: string) =>
    errors[key] ? (
      <p className="text-xs text-destructive">{errors[key]}</p>
    ) : null

  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-10">
      <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
        {instrumento ? "Editar Instrumento" : "Crear Nuevo Instrumento"}
      </h1>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="instrumento">
              Instrumento <span className="text-destructive">*</span>
            </Label>
            <Input
              type="text"
              id="instrumento"
              name="instrumento"
              value={formData.instrumento}
              onChange={handleChange}
              aria-invalid={Boolean(errors.instrumento)}
              placeholder="Ej: Guitarra Acústica"
            />
            {errorText("instrumento")}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="marca">
              Marca <span className="text-destructive">*</span>
            </Label>
            <Input
              type="text"
              id="marca"
              name="marca"
              value={formData.marca}
              onChange={handleChange}
              aria-invalid={Boolean(errors.marca)}
              placeholder="Ej: Yamaha"
            />
            {errorText("marca")}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="modelo">
              Modelo <span className="text-destructive">*</span>
            </Label>
            <Input
              type="text"
              id="modelo"
              name="modelo"
              value={formData.modelo}
              onChange={handleChange}
              aria-invalid={Boolean(errors.modelo)}
              placeholder="Ej: FG800"
            />
            {errorText("modelo")}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="idCategoria">
              Categoría <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.idCategoria}
              onValueChange={handleCategoriaChange}
            >
              <SelectTrigger
                id="idCategoria"
                className="w-full"
                aria-invalid={Boolean(errors.idCategoria)}
              >
                <SelectValue placeholder="Seleccionar categoría" />
              </SelectTrigger>
              <SelectContent>
                {categorias.map((categoria) => (
                  <SelectItem key={categoria.id} value={categoria.id.toString()}>
                    {categoria.denominacion}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errorText("idCategoria")}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="precio">
              Precio <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                $
              </span>
              <Input
                type="number"
                id="precio"
                name="precio"
                value={formData.precio}
                onChange={handleChange}
                aria-invalid={Boolean(errors.precio)}
                placeholder="25000"
                min="0"
                step="0.01"
                className="pl-6"
              />
            </div>
            {errorText("precio")}
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Costo de Envío</span>
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="envioType"
                  className="size-4 accent-primary"
                  checked={envioGratis}
                  onChange={() => handleEnvioChange(true)}
                />
                Envío gratis
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="envioType"
                  className="size-4 accent-primary"
                  checked={!envioGratis}
                  onChange={() => handleEnvioChange(false)}
                />
                Con costo
              </label>
            </div>
            {!envioGratis && (
              <div className="relative mt-1">
                <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  $
                </span>
                <Input
                  type="number"
                  value={costoEnvioCustom}
                  onChange={(e) => setCostoEnvioCustom(e.target.value)}
                  aria-invalid={Boolean(errors.costoEnvio)}
                  placeholder="1500"
                  min="0"
                  className="pl-6"
                />
              </div>
            )}
            {errorText("costoEnvio")}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cantidadVendida">Cantidad Vendida</Label>
            <Input
              type="number"
              id="cantidadVendida"
              name="cantidadVendida"
              value={formData.cantidadVendida}
              onChange={handleChange}
              placeholder="0"
              min="0"
            />
          </div>

          <div className="flex flex-col gap-2 sm:col-span-2">
            <span className="text-sm font-medium">Imagen del Producto</span>
            <div className="flex flex-col gap-4 rounded-xl border border-border p-4 sm:flex-row">
              <div className="flex aspect-video w-full max-w-52 items-center justify-center overflow-hidden rounded-lg bg-muted sm:aspect-square">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Previsualización de la imagen del producto"
                    className="size-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1 text-muted-foreground">
                    <Image className="size-6" aria-hidden="true" />
                    <p className="text-xs">Sin imagen</p>
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col gap-2">
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isDemo}
                  >
                    <Upload aria-hidden="true" />
                    Seleccionar imagen
                  </Button>
                  {imagePreview &&
                    (currentImageId ? (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            type="button"
                            variant="destructive"
                            disabled={isDemo || isDeleting}
                          >
                            <Trash2 aria-hidden="true" />
                            {isDeleting ? "Eliminando..." : "Eliminar"}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Eliminar imagen</AlertDialogTitle>
                            <AlertDialogDescription>
                              ¿Estás seguro de que quieres eliminar esta imagen?
                              Esta acción no se puede deshacer.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              variant="destructive"
                              onClick={handleDeleteImage}
                            >
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    ) : (
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDeleteImage}
                        disabled={isDemo || isDeleting}
                      >
                        <Trash2 aria-hidden="true" />
                        Eliminar
                      </Button>
                    ))}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <p className="text-xs text-muted-foreground">
                  Formatos: JPG, PNG, GIF. Máximo 5MB.
                </p>
                {isDemo && (
                  <p className="text-xs text-muted-foreground">
                    Deshabilitado para Demo
                  </p>
                )}
                {selectedFile && (
                  <p className="flex items-center gap-1.5 text-xs text-primary">
                    <Check className="size-3.5" aria-hidden="true" />
                    Archivo seleccionado: {selectedFile.name}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="descripcion">Descripción</Label>
          <Textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            rows={4}
            placeholder="Descripción detallada del instrumento..."
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Guardando..."
              : instrumento
                ? "Actualizar"
                : "Crear"}
          </Button>
        </div>
      </form>
    </section>
  )
}
