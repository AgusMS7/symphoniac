import { afterEach, describe, expect, it, vi } from "vitest"

import {
  clearDemoData,
  readJson,
  STORAGE_KEYS,
  STORAGE_PREFIX,
  writeJson,
} from "./storage"

afterEach(() => {
  window.localStorage.clear()
  vi.restoreAllMocks()
})

describe("STORAGE_KEYS", () => {
  it("agrupa todas las claves bajo el prefijo versionado", () => {
    expect(STORAGE_PREFIX).toBe("symphoniac:")
    Object.values(STORAGE_KEYS).forEach((key) => {
      expect(key.startsWith("symphoniac:v1:")).toBe(true)
    })
  })
})

describe("readJson / writeJson", () => {
  it("devuelve el fallback cuando la clave no existe", () => {
    expect(readJson("symphoniac:v1:inexistente", { value: 1 })).toEqual({
      value: 1,
    })
  })

  it("hace round-trip de un objeto", () => {
    writeJson(STORAGE_KEYS.favorites, [1, 2, 3])
    expect(readJson(STORAGE_KEYS.favorites, [])).toEqual([1, 2, 3])
  })

  it("devuelve el fallback si el contenido no es JSON válido", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {})
    window.localStorage.setItem(STORAGE_KEYS.cart, "{no-es-json")

    expect(readJson(STORAGE_KEYS.cart, [])).toEqual([])
    expect(errorSpy).toHaveBeenCalled()
  })
})

describe("clearDemoData", () => {
  it("borra solo las claves de la demo y conserva el resto", () => {
    window.localStorage.setItem(STORAGE_KEYS.favorites, "[1]")
    window.localStorage.setItem(STORAGE_KEYS.cart, "[]")
    window.localStorage.setItem("otra-app:config", "valor")

    clearDemoData()

    expect(window.localStorage.getItem(STORAGE_KEYS.favorites)).toBeNull()
    expect(window.localStorage.getItem(STORAGE_KEYS.cart)).toBeNull()
    expect(window.localStorage.getItem("otra-app:config")).toBe("valor")
  })
})
