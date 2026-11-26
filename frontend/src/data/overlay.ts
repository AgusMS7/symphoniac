import type { Categoria, Instrumento } from "../types/Instrumento"
import { readJson, STORAGE_KEYS, writeJson } from "./storage"

export interface CatalogBase {
  instrumentos: Instrumento[]
  categorias: Categoria[]
}

interface OverlayInstrumentos {
  upserts: Record<string, Instrumento>
  deletes: number[]
}

interface OverlayCategorias {
  upserts: Record<string, Categoria>
  deletes: number[]
}

interface Meta {
  nextLocalId: number
}

interface CachedCatalog extends CatalogBase {
  cachedAt: string
}

export function readOverlayInstrumentos(): OverlayInstrumentos {
  const stored = readJson<Partial<OverlayInstrumentos>>(
    STORAGE_KEYS.overlayInstrumentos,
    {},
  )
  return {
    upserts:
      stored.upserts && typeof stored.upserts === "object"
        ? stored.upserts
        : {},
    deletes: Array.isArray(stored.deletes) ? stored.deletes : [],
  }
}

export function writeOverlayInstrumentos(overlay: OverlayInstrumentos): void {
  writeJson(STORAGE_KEYS.overlayInstrumentos, overlay)
}

export function readOverlayCategorias(): OverlayCategorias {
  const stored = readJson<Partial<OverlayCategorias>>(
    STORAGE_KEYS.overlayCategorias,
    {},
  )
  return {
    upserts:
      stored.upserts && typeof stored.upserts === "object"
        ? stored.upserts
        : {},
    deletes: Array.isArray(stored.deletes) ? stored.deletes : [],
  }
}

export function writeOverlayCategorias(overlay: OverlayCategorias): void {
  writeJson(STORAGE_KEYS.overlayCategorias, overlay)
}

/**
 * Devuelve el próximo ID local (negativo) y lo reserva en meta.
 * Los IDs negativos nunca colisionan con los IDs positivos del backend.
 */
export function getNextLocalId(): number {
  const meta = readJson<Partial<Meta>>(STORAGE_KEYS.meta, {})
  const current = typeof meta.nextLocalId === "number" ? meta.nextLocalId : -1
  writeJson(STORAGE_KEYS.meta, { ...meta, nextLocalId: current - 1 })
  return current
}

export function readCache(): CatalogBase | null {
  const stored = readJson<Partial<CachedCatalog>>(
    STORAGE_KEYS.cacheCatalogo,
    {},
  )
  if (!Array.isArray(stored.instrumentos) || !Array.isArray(stored.categorias)) {
    return null
  }
  return {
    instrumentos: stored.instrumentos,
    categorias: stored.categorias,
  }
}

export function writeCache(base: CatalogBase): void {
  const cached: CachedCatalog = { ...base, cachedAt: new Date().toISOString() }
  writeJson(STORAGE_KEYS.cacheCatalogo, cached)
}

/**
 * Aplica el overlay local sobre la base remota. Las categorías se ordenan por
 * denominación y la denominación de cada instrumento se recalcula para que un
 * rename de categoría se refleje sin tocar los instrumentos.
 */
export function mergeCatalog(base: CatalogBase): CatalogBase {
  const categoriaOverlay = readOverlayCategorias()
  const categoriasPorId = new Map<number, Categoria>()
  base.categorias.forEach((categoria) =>
    categoriasPorId.set(categoria.id, categoria),
  )
  categoriaOverlay.deletes.forEach((id) => categoriasPorId.delete(id))
  Object.values(categoriaOverlay.upserts).forEach((categoria) =>
    categoriasPorId.set(categoria.id, categoria),
  )
  const categorias = Array.from(categoriasPorId.values()).sort((a, b) =>
    a.denominacion.localeCompare(b.denominacion, "es", { sensitivity: "base" }),
  )

  const instrumentoOverlay = readOverlayInstrumentos()
  const instrumentosPorId = new Map<number, Instrumento>()
  base.instrumentos.forEach((instrumento) =>
    instrumentosPorId.set(instrumento.id, instrumento),
  )
  instrumentoOverlay.deletes.forEach((id) => instrumentosPorId.delete(id))
  Object.values(instrumentoOverlay.upserts).forEach((instrumento) =>
    instrumentosPorId.set(instrumento.id, instrumento),
  )

  const denominacionPorId = new Map(
    categorias.map((categoria) => [categoria.id, categoria.denominacion]),
  )
  const instrumentos = Array.from(instrumentosPorId.values()).map(
    (instrumento) => {
      if (instrumento.idCategoria == null) return instrumento
      const denominacion = denominacionPorId.get(instrumento.idCategoria)
      return denominacion
        ? { ...instrumento, categoriaDenominacion: denominacion }
        : instrumento
    },
  )

  return { instrumentos, categorias }
}
