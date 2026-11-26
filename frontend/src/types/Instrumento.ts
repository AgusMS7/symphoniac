export interface ProductImage {
  id: number
  instrumentoId: number
  imageUrl: string
  altText: string | null
  isPrimary: boolean
  createdAt: string
}

export interface Categoria {
  id: number
  denominacion: string
}

export interface Instrumento {
  id: number
  instrumento: string
  marca: string
  modelo: string
  precio: number
  costoEnvio: string
  cantidadVendida: number
  descripcion: string
  idCategoria: number
  categoriaDenominacion?: string
  categoria?: Categoria
  // Campo imagen legacy (puede seguir existiendo)
  imagen?: string | null
  // Nuevas propiedades para el sistema de imágenes
  images?: ProductImage[]
  primaryImage?: ProductImage | null
}

// Tipos para las respuestas de la API
export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface PaginatedResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

/**
 * Respuesta estándar de los servicios de datos. El backend responde
 * `{ success, message, data }`; los métodos de demo también usan esta forma.
 */
export interface ServiceResponse<T> {
  success?: boolean
  message?: string
  data?: T | null
  status?: number
  error?: unknown
}

/** Respuesta de listados que además puede traer la forma paginada de Spring. */
export interface PaginatedServiceResponse<T> extends ServiceResponse<T[]> {
  content?: T[]
  totalElements?: number
  totalPages?: number
  size?: number
  number?: number
}
