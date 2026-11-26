import type {
  Categoria,
  Instrumento,
  PaginatedServiceResponse,
  ProductImage,
  ServiceResponse,
} from "../types/Instrumento"
import type {
  CategoriaService,
  DataBackend,
  ImageService,
  InstrumentoService,
} from "./types"

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "/api"
const IMAGES_BASE_URL = import.meta.env.VITE_IMAGES_URL ?? "/images"

async function readJson<T>(response: Response): Promise<T> {
  return (await response.json()) as T
}

function ensureOk(response: Response): void {
  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`)
  }
}

const instrumentoService: InstrumentoService = {
  getAll: async (page = 0, size = 10, sort = "id,asc") => {
    const response = await fetch(
      `${API_BASE_URL}/instrumentos?page=${page}&size=${size}&sort=${sort}`,
    )
    ensureOk(response)
    return readJson<PaginatedServiceResponse<Instrumento>>(response)
  },

  getAllSimple: async () => {
    const response = await fetch(`${API_BASE_URL}/instrumentos`)
    ensureOk(response)
    return readJson<PaginatedServiceResponse<Instrumento>>(response)
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/instrumentos/${id}`)
    ensureOk(response)
    return readJson<ServiceResponse<Instrumento>>(response)
  },

  create: async (instrumento) => {
    const response = await fetch(`${API_BASE_URL}/instrumentos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(instrumento),
    })
    ensureOk(response)
    return readJson<ServiceResponse<Instrumento>>(response)
  },

  update: async (id, instrumento) => {
    const response = await fetch(`${API_BASE_URL}/instrumentos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(instrumento),
    })
    ensureOk(response)
    return readJson<ServiceResponse<Instrumento>>(response)
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/instrumentos/${id}`, {
      method: "DELETE",
    })
    ensureOk(response)
    return readJson<ServiceResponse<null>>(response)
  },

  getByCategoria: async (categoriaId) => {
    const response = await fetch(
      `${API_BASE_URL}/instrumentos/categoria/${categoriaId}`,
    )
    ensureOk(response)
    return readJson<PaginatedServiceResponse<Instrumento>>(response)
  },

  search: async (nombre) => {
    const response = await fetch(
      `${API_BASE_URL}/instrumentos/buscar?nombre=${encodeURIComponent(nombre)}`,
    )
    ensureOk(response)
    return readJson<PaginatedServiceResponse<Instrumento>>(response)
  },
}

const categoriaService: CategoriaService = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/categorias`)
    ensureOk(response)
    return readJson<ServiceResponse<Categoria[]>>(response)
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/categorias/${id}`)
    ensureOk(response)
    return readJson<ServiceResponse<Categoria>>(response)
  },

  create: async (categoria) => {
    const response = await fetch(`${API_BASE_URL}/categorias`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(categoria),
    })
    ensureOk(response)
    return readJson<ServiceResponse<Categoria>>(response)
  },

  update: async (id, categoria) => {
    const response = await fetch(`${API_BASE_URL}/categorias/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(categoria),
    })
    ensureOk(response)
    return readJson<ServiceResponse<Categoria>>(response)
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/categorias/${id}`, {
      method: "DELETE",
    })
    ensureOk(response)
    return readJson<ServiceResponse<null>>(response)
  },
}

const imageService: ImageService = {
  upload: async (instrumentoId, file, altText = "", isPrimary = false) => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("altText", altText)
    formData.append("isPrimary", isPrimary.toString())

    const response = await fetch(
      `${API_BASE_URL}/images/upload/${instrumentoId}`,
      { method: "POST", body: formData },
    )
    ensureOk(response)
    return readJson<ServiceResponse<ProductImage>>(response)
  },

  getByInstrumento: async (instrumentoId) => {
    const response = await fetch(
      `${API_BASE_URL}/images/instrumento/${instrumentoId}`,
    )
    ensureOk(response)
    return readJson<ServiceResponse<ProductImage[]>>(response)
  },

  getPrimary: async (instrumentoId) => {
    const response = await fetch(
      `${API_BASE_URL}/images/instrumento/${instrumentoId}/primary`,
    )

    // Un 404 significa que el instrumento no tiene imagen principal.
    if (response.status === 404) {
      return {
        success: false,
        message: "No se encontró imagen principal",
        data: null,
      }
    }

    ensureOk(response)
    return readJson<ServiceResponse<ProductImage>>(response)
  },

  delete: async (imageId) => {
    const response = await fetch(`${API_BASE_URL}/images/${imageId}`, {
      method: "DELETE",
    })
    ensureOk(response)
    return readJson<ServiceResponse<null>>(response)
  },

  setPrimary: async (imageId) => {
    const response = await fetch(`${API_BASE_URL}/images/${imageId}/primary`, {
      method: "PUT",
    })
    ensureOk(response)
    return readJson<ServiceResponse<ProductImage>>(response)
  },

  getImageUrl: (filename) => `${IMAGES_BASE_URL}/${filename}`,
}

export const remoteBackend: DataBackend = {
  instrumentoService,
  categoriaService,
  imageService,
}
