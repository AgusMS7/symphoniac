import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import type { Categoria, Instrumento } from "../types/Instrumento"
import {
  getNextLocalId,
  mergeCatalog,
  readCache,
  readOverlayInstrumentos,
  writeCache,
  writeOverlayCategorias,
  writeOverlayInstrumentos,
  type CatalogBase,
} from "./overlay"
import { STORAGE_KEYS, writeJson } from "./storage"

function instrumento(overrides: Partial<Instrumento> = {}): Instrumento {
  return {
    id: 1,
    instrumento: "Guitarra",
    marca: "Yamaha",
    modelo: "FG800",
    precio: 1000,
    costoEnvio: "G",
    cantidadVendida: 0,
    descripcion: "",
    idCategoria: 1,
    categoriaDenominacion: "Cuerda",
    ...overrides,
  }
}

beforeEach(() => {
  window.localStorage.clear()
  vi.resetModules()
})

afterEach(() => {
  window.localStorage.clear()
})

describe("getNextLocalId", () => {
  it("reserva IDs negativos decrecientes", () => {
    expect(getNextLocalId()).toBe(-1)
    expect(getNextLocalId()).toBe(-2)
    expect(getNextLocalId()).toBe(-3)
  })

  it("persiste el contador en meta", () => {
    getNextLocalId()
    const meta = JSON.parse(
      window.localStorage.getItem(STORAGE_KEYS.meta) ?? "{}",
    )
    expect(meta.nextLocalId).toBe(-2)
  })
})

describe("readOverlayInstrumentos", () => {
  it("devuelve un overlay vacío cuando no hay datos", () => {
    expect(readOverlayInstrumentos()).toEqual({ upserts: {}, deletes: [] })
  })

  it("normaliza un overlay incompleto", () => {
    writeJson(STORAGE_KEYS.overlayInstrumentos, { deletes: [3] })
    expect(readOverlayInstrumentos()).toEqual({ upserts: {}, deletes: [3] })
  })
})

describe("readCache / writeCache", () => {
  it("devuelve null si el cache está incompleto", () => {
    expect(readCache()).toBeNull()
    writeJson(STORAGE_KEYS.cacheCatalogo, { instrumentos: [] })
    expect(readCache()).toBeNull()
  })

  it("hace round-trip del catálogo", () => {
    const base: CatalogBase = {
      instrumentos: [instrumento()],
      categorias: [{ id: 1, denominacion: "Cuerda" }],
    }
    writeCache(base)

    const cached = readCache()
    expect(cached?.instrumentos).toHaveLength(1)
    expect(cached?.categorias).toEqual([{ id: 1, denominacion: "Cuerda" }])
  })
})

describe("mergeCatalog", () => {
  const base: CatalogBase = {
    categorias: [
      { id: 1, denominacion: "Cuerda" },
      { id: 2, denominacion: "Viento" },
    ],
    instrumentos: [
      instrumento({ id: 1, idCategoria: 1 }),
      instrumento({ id: 2, instrumento: "Flauta", idCategoria: 2 }),
    ],
  }

  it("aplica deletes y upserts de categorías ordenando por denominación", () => {
    writeOverlayCategorias({
      upserts: {
        "1": { id: 1, denominacion: "Cuerdas" } as Categoria,
        "-1": { id: -1, denominacion: "Teclado" } as Categoria,
      },
      deletes: [2],
    })

    const merged = mergeCatalog(base)

    expect(merged.categorias.map((c) => c.denominacion)).toEqual([
      "Cuerdas",
      "Teclado",
    ])
  })

  it("recalcula la denominación del instrumento al renombrar la categoría", () => {
    writeOverlayCategorias({
      upserts: { "1": { id: 1, denominacion: "Cuerdas" } },
      deletes: [],
    })

    const merged = mergeCatalog(base)
    const guitarra = merged.instrumentos.find((i) => i.id === 1)

    expect(guitarra?.categoriaDenominacion).toBe("Cuerdas")
  })

  it("aplica upserts y deletes de instrumentos", () => {
    writeOverlayInstrumentos({
      upserts: {
        "-1": instrumento({ id: -1, instrumento: "Nuevo", idCategoria: 1 }),
      },
      deletes: [2],
    })

    const merged = mergeCatalog(base)

    expect(merged.instrumentos.map((i) => i.id).sort((a, b) => a - b)).toEqual([
      -1, 1,
    ])
    expect(merged.instrumentos.some((i) => i.instrumento === "Nuevo")).toBe(
      true,
    )
  })

  it("deja el instrumento intacto si no tiene categoría", () => {
    const sinCategoria = instrumento({
      id: 9,
      idCategoria: undefined as unknown as number,
      categoriaDenominacion: undefined,
    })
    const merged = mergeCatalog({
      categorias: base.categorias,
      instrumentos: [sinCategoria],
    })

    expect(merged.instrumentos[0].categoriaDenominacion).toBeUndefined()
  })
})
