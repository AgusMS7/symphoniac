import type {
  Categoria,
  Instrumento,
  PaginatedServiceResponse,
  ProductImage,
  ServiceResponse,
} from "../types/Instrumento"
import { emitCatalogUpdated } from "./events"
import { removeCartItems, removeFavorites } from "./localStore"
import {
  getNextLocalId,
  mergeCatalog,
  readCache,
  readOverlayCategorias,
  readOverlayInstrumentos,
  writeCache,
  writeOverlayCategorias,
  writeOverlayInstrumentos,
  type CatalogBase,
} from "./overlay"
import { remoteBackend } from "./remoteBackend"
import type {
  CategoriaService,
  DataBackend,
  ImageService,
  InstrumentoService,
} from "./types"

const REFRESH_INTERVAL_MS = 15_000

let baseInFlight: Promise<CatalogBase> | null = null
let refreshInFlight: Promise<void> | null = null
let lastRefreshAt = 0

interface InstrumentoPayload {
  instrumento?: string
  marca?: string
  modelo?: string
  imagen?: string | null
  precio?: number
  costoEnvio?: string
  cantidadVendida?: number
  descripcion?: string
  categoria?: { id?: number }
  idCategoria?: number
}

function parseInstrumentoPayload(value: unknown): InstrumentoPayload {
  if (typeof value !== "object" || value === null) return {}
  return value as InstrumentoPayload
}

async function fetchBaseFromRemote(): Promise<CatalogBase> {
  const [instrumentosRes, categoriasRes] = await Promise.all([
    remoteBackend.instrumentoService.getAllSimple(),
    remoteBackend.categoriaService.getAll(),
  ])

  let instrumentos: Instrumento[] = []
  if (Array.isArray(instrumentosRes)) {
    instrumentos = instrumentosRes
  } else if (Array.isArray(instrumentosRes.data)) {
    instrumentos = instrumentosRes.data
  } else if (Array.isArray(instrumentosRes.content)) {
    instrumentos = instrumentosRes.content
  }

  let categorias: Categoria[] = []
  if (Array.isArray(categoriasRes)) {
    categorias = categoriasRes
  } else if (Array.isArray(categoriasRes.data)) {
    categorias = categoriasRes.data
  }

  return { instrumentos, categorias }
}

function loadBase(): Promise<CatalogBase> {
  if (!baseInFlight) {
    baseInFlight = fetchBaseFromRemote().finally(() => {
      baseInFlight = null
    })
  }
  return baseInFlight
}

function refreshInBackground(): void {
  if (refreshInFlight) return
  if (Date.now() - lastRefreshAt < REFRESH_INTERVAL_MS) return

  refreshInFlight = (async () => {
    try {
      const base = await fetchBaseFromRemote()
      const previous = readCache()
      const changed =
        !previous || JSON.stringify(previous) !== JSON.stringify(base)

      writeCache(base)
      lastRefreshAt = Date.now()

      if (changed) emitCatalogUpdated()
    } catch (error) {
      console.error("No se pudo refrescar el catálogo remoto", error)
    } finally {
      refreshInFlight = null
    }
  })()
}

async function getBase(): Promise<CatalogBase> {
  const cached = readCache()
  if (cached) {
    // Se muestra la copia inmediatamente y se refresca en segundo plano.
    refreshInBackground()
    return cached
  }

  const base = await loadBase()
  writeCache(base)
  lastRefreshAt = Date.now()
  return base
}

async function getMergedCatalog(): Promise<CatalogBase> {
  return mergeCatalog(await getBase())
}

function resolveCategoria(
  payloadCategoria: { id?: number } | undefined,
  categorias: Categoria[],
  fallbackId?: number,
): Categoria | null {
  const id = payloadCategoria?.id ?? fallbackId
  if (id == null) return null
  return categorias.find((categoria) => categoria.id === id) ?? null
}

function toList(
  content: Instrumento[],
): PaginatedServiceResponse<Instrumento> {
  return {
    success: true,
    message: "OK",
    data: content,
    content,
    totalElements: content.length,
    totalPages: 1,
    size: content.length,
    number: 0,
  }
}

function toPage(
  content: Instrumento[],
  page: number,
  size: number,
): PaginatedServiceResponse<Instrumento> {
  const safeSize = size > 0 ? size : 10
  const start = page * safeSize
  const pageContent = content.slice(start, start + safeSize)

  return {
    success: true,
    message: "OK",
    data: pageContent,
    content: pageContent,
    totalElements: content.length,
    totalPages: Math.ceil(content.length / safeSize),
    size: safeSize,
    number: page,
  }
}

const instrumentoService: InstrumentoService = {
  getAll: async (page = 0, size = 10) => {
    const catalog = await getMergedCatalog()
    return toPage(catalog.instrumentos, page, size)
  },

  getAllSimple: async () => {
    const catalog = await getMergedCatalog()
    return toList(catalog.instrumentos)
  },

  getById: async (id) => {
    const catalog = await getMergedCatalog()
    const instrumento = catalog.instrumentos.find((item) => item.id === id)

    if (!instrumento) {
      return { success: false, message: "Instrumento no encontrado", data: null }
    }
    return { success: true, message: "Instrumento encontrado", data: instrumento }
  },

  create: async (payload) => {
    const data = parseInstrumentoPayload(payload)
    const catalog = await getMergedCatalog()
    const categoria = resolveCategoria(
      data.categoria,
      catalog.categorias,
      data.idCategoria,
    )

    if (!categoria) {
      return { success: false, message: "Categoría no encontrada", data: null }
    }

    const instrumento: Instrumento = {
      id: getNextLocalId(),
      instrumento: data.instrumento?.trim() ?? "",
      marca: data.marca?.trim() ?? "",
      modelo: data.modelo?.trim() ?? "",
      imagen: data.imagen ?? null,
      precio: Number(data.precio) || 0,
      costoEnvio: data.costoEnvio ?? "0",
      cantidadVendida: Math.max(
        0,
        Math.floor(Number(data.cantidadVendida) || 0),
      ),
      descripcion: data.descripcion ?? "",
      idCategoria: categoria.id,
      categoriaDenominacion: categoria.denominacion,
    }

    const overlay = readOverlayInstrumentos()
    overlay.upserts[String(instrumento.id)] = instrumento
    writeOverlayInstrumentos(overlay)
    emitCatalogUpdated()

    return {
      success: true,
      message: "Instrumento creado",
      data: instrumento,
    }
  },

  update: async (id, payload) => {
    const catalog = await getMergedCatalog()
    const current = catalog.instrumentos.find((item) => item.id === id)

    if (!current) {
      return { success: false, message: "Instrumento no encontrado", data: null }
    }

    const data = parseInstrumentoPayload(payload)
    const categoria = resolveCategoria(
      data.categoria,
      catalog.categorias,
      data.idCategoria ?? current.idCategoria,
    )

    if (!categoria) {
      return { success: false, message: "Categoría no encontrada", data: null }
    }

    const updated: Instrumento = {
      ...current,
      instrumento: data.instrumento?.trim() ?? current.instrumento,
      marca: data.marca?.trim() ?? current.marca,
      modelo: data.modelo?.trim() ?? current.modelo,
      imagen: data.imagen ?? current.imagen ?? null,
      precio: data.precio != null ? Number(data.precio) : current.precio,
      costoEnvio: data.costoEnvio ?? current.costoEnvio,
      cantidadVendida:
        data.cantidadVendida != null
          ? Math.max(0, Math.floor(Number(data.cantidadVendida)))
          : current.cantidadVendida,
      descripcion: data.descripcion ?? current.descripcion,
      idCategoria: categoria.id,
      categoriaDenominacion: categoria.denominacion,
    }

    const overlay = readOverlayInstrumentos()
    overlay.upserts[String(updated.id)] = updated
    writeOverlayInstrumentos(overlay)
    emitCatalogUpdated()

    return {
      success: true,
      message: "Instrumento actualizado",
      data: updated,
    }
  },

  delete: async (id) => {
    const catalog = await getMergedCatalog()
    const target = catalog.instrumentos.find((item) => item.id === id)

    if (!target) {
      return { success: false, message: "Instrumento no encontrado", data: null }
    }

    const overlay = readOverlayInstrumentos()
    delete overlay.upserts[String(id)]
    if (!overlay.deletes.includes(id)) overlay.deletes.push(id)
    writeOverlayInstrumentos(overlay)

    removeFavorites([id])
    removeCartItems([id])
    emitCatalogUpdated()

    return { success: true, message: "Instrumento eliminado", data: null }
  },

  getByCategoria: async (categoriaId) => {
    const catalog = await getMergedCatalog()
    return toList(
      catalog.instrumentos.filter(
        (instrumento) => instrumento.idCategoria === categoriaId,
      ),
    )
  },

  search: async (nombre) => {
    const catalog = await getMergedCatalog()
    const term = nombre.trim().toLowerCase()
    return toList(
      catalog.instrumentos.filter((instrumento) =>
        instrumento.instrumento.toLowerCase().includes(term),
      ),
    )
  },
}

const categoriaService: CategoriaService = {
  getAll: async () => {
    const catalog = await getMergedCatalog()
    return { success: true, message: "OK", data: catalog.categorias }
  },

  getById: async (id) => {
    const catalog = await getMergedCatalog()
    const categoria = catalog.categorias.find((item) => item.id === id)

    if (!categoria) {
      return { success: false, message: "Categoría no encontrada", data: null }
    }
    return { success: true, message: "Categoría encontrada", data: categoria }
  },

  create: async (categoria) => {
    const denominacion = categoria.denominacion.trim()
    if (!denominacion) {
      return {
        success: false,
        message: "La denominación es requerida",
        data: null,
      }
    }

    const catalog = await getMergedCatalog()
    const duplicated = catalog.categorias.some(
      (item) =>
        item.denominacion.toLowerCase() === denominacion.toLowerCase(),
    )
    if (duplicated) {
      return {
        success: false,
        message: "Ya existe una categoría con esa denominación",
        data: null,
      }
    }

    const created: Categoria = { id: getNextLocalId(), denominacion }
    const overlay = readOverlayCategorias()
    overlay.upserts[String(created.id)] = created
    writeOverlayCategorias(overlay)
    emitCatalogUpdated()

    return { success: true, message: "Categoría creada", data: created }
  },

  update: async (id, categoria) => {
    const denominacion = categoria.denominacion.trim()
    if (!denominacion) {
      return {
        success: false,
        message: "La denominación es requerida",
        data: null,
      }
    }

    const catalog = await getMergedCatalog()
    const current = catalog.categorias.find((item) => item.id === id)
    if (!current) {
      return { success: false, message: "Categoría no encontrada", data: null }
    }

    const duplicated = catalog.categorias.some(
      (item) =>
        item.id !== id &&
        item.denominacion.toLowerCase() === denominacion.toLowerCase(),
    )
    if (duplicated) {
      return {
        success: false,
        message: "Ya existe una categoría con esa denominación",
        data: null,
      }
    }

    const updated: Categoria = { ...current, denominacion }
    const overlay = readOverlayCategorias()
    overlay.upserts[String(updated.id)] = updated
    writeOverlayCategorias(overlay)
    // La denominación de los instrumentos se recalcula en mergeCatalog.
    emitCatalogUpdated()

    return {
      success: true,
      message: "Categoría actualizada",
      data: updated,
    }
  },

  delete: async (id) => {
    const catalog = await getMergedCatalog()
    const current = catalog.categorias.find((item) => item.id === id)
    if (!current) {
      return { success: false, message: "Categoría no encontrada", data: null }
    }

    const inUse = catalog.instrumentos.some(
      (instrumento) => instrumento.idCategoria === id,
    )
    if (inUse) {
      return {
        success: false,
        message: "No se puede eliminar una categoría con instrumentos asociados",
        data: null,
      }
    }

    const overlay = readOverlayCategorias()
    delete overlay.upserts[String(id)]
    if (!overlay.deletes.includes(id)) overlay.deletes.push(id)
    writeOverlayCategorias(overlay)
    emitCatalogUpdated()

    return { success: true, message: "Categoría eliminada", data: null }
  },
}

const imageService: ImageService = {
  upload: async (): Promise<ServiceResponse<ProductImage>> => ({
    success: false,
    message: "Deshabilitado para Demo",
    data: null,
  }),

  getByInstrumento: (instrumentoId) =>
    remoteBackend.imageService.getByInstrumento(instrumentoId),

  getPrimary: (instrumentoId) =>
    remoteBackend.imageService.getPrimary(instrumentoId),

  delete: async (): Promise<ServiceResponse<null>> => ({
    success: false,
    message: "Deshabilitado para Demo",
    data: null,
  }),

  setPrimary: async (): Promise<ServiceResponse<ProductImage>> => ({
    success: false,
    message: "Deshabilitado para Demo",
    data: null,
  }),

  getImageUrl: (filename) => remoteBackend.imageService.getImageUrl(filename),
}

export const demoBackend: DataBackend = {
  instrumentoService,
  categoriaService,
  imageService,
}
