import { existsSync } from "node:fs"
import path from "node:path"

import { describe, expect, it } from "vitest"

import snapshot from "./demoSnapshot.json"

const { instrumentos, categorias } = snapshot

describe("demoSnapshot", () => {
  it("tiene 30 instrumentos y 5 categorías", () => {
    expect(instrumentos).toHaveLength(30)
    expect(categorias).toHaveLength(5)
  })

  it("usa IDs únicos en instrumentos y categorías", () => {
    const instrumentoIds = instrumentos.map((instrumento) => instrumento.id)
    const categoriaIds = categorias.map((categoria) => categoria.id)

    expect(new Set(instrumentoIds).size).toBe(instrumentoIds.length)
    expect(new Set(categoriaIds).size).toBe(categoriaIds.length)
  })

  it("todas las imágenes son rutas locales existentes", () => {
    instrumentos.forEach((instrumento) => {
      expect(instrumento.imagen).toMatch(/^\/site\/instruments\/.+\.jpg$/)

      const filePath = path.join(process.cwd(), "public", instrumento.imagen)
      expect(existsSync(filePath), `Falta ${filePath}`).toBe(true)
    })
  })

  it("cada instrumento tiene la forma esperada y una categoría válida", () => {
    const categoriaIds = new Set(categorias.map((categoria) => categoria.id))

    instrumentos.forEach((instrumento) => {
      expect(typeof instrumento.id).toBe("number")
      expect(typeof instrumento.instrumento).toBe("string")
      expect(typeof instrumento.marca).toBe("string")
      expect(typeof instrumento.modelo).toBe("string")
      expect(typeof instrumento.precio).toBe("number")
      expect(typeof instrumento.costoEnvio).toBe("string")
      expect(typeof instrumento.cantidadVendida).toBe("number")
      expect(typeof instrumento.descripcion).toBe("string")
      expect(categoriaIds.has(instrumento.idCategoria)).toBe(true)
      expect(typeof instrumento.categoriaDenominacion).toBe("string")
      expect(instrumento.categoriaDenominacion.length).toBeGreaterThan(0)
    })
  })
})
