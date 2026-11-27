import type React from "react"
import { describe, expect, it, vi } from "vitest"

import { imageService } from "../services/api"
import type { ProductImage } from "../types/Instrumento"
import {
  getImageAltText,
  getImageUrl,
  handleImageError,
  loadPrimaryImageSafely,
} from "./imageUtils"

vi.mock("../services/api", () => ({
  imageService: {
    getImageUrl: (filename: string) => `/images/${filename}`,
    getPrimary: vi.fn(),
  },
}))

const primary: ProductImage = {
  id: 7,
  instrumentoId: 11,
  imageUrl: "guitarra.jpg",
  altText: "Guitarra acústica",
  isPrimary: true,
  createdAt: "2025-01-01T00:00:00Z",
}

describe("getImageUrl", () => {
  it("prioriza la imagen principal del nuevo sistema", () => {
    expect(getImageUrl(primary, "legacy.jpg")).toBe("/images/guitarra.jpg")
  })

  it("usa la imagen legacy cuando no hay principal", () => {
    expect(getImageUrl(null, "legacy.jpg")).toBe("/images/legacy.jpg")
  })

  it("ignora la imagen legacy vacía y devuelve el placeholder", () => {
    expect(getImageUrl(null, "   ")).toBe("/site/placeholder-instrument.jpg")
  })

  it("respeta un fallback personalizado", () => {
    expect(getImageUrl(null, null, "/custom.png")).toBe("/custom.png")
  })
})

describe("getImageAltText", () => {
  it("usa el altText de la imagen principal", () => {
    expect(getImageAltText(primary, "Guitarra")).toBe("Guitarra acústica")
  })

  it("compone el alt con el nombre del instrumento", () => {
    expect(getImageAltText(null, "Guitarra")).toBe("Imagen de Guitarra")
  })

  it("usa el fallback genérico sin datos", () => {
    expect(getImageAltText(null)).toBe("Imagen del instrumento")
  })
})

describe("handleImageError", () => {
  it("reemplaza el src roto por el placeholder", () => {
    const target = { src: "http://localhost/images/roto.jpg" }
    const event = { currentTarget: target } as unknown as React.SyntheticEvent<
      HTMLImageElement
    >

    handleImageError(event)

    expect(target.src).toBe("/site/placeholder-instrument.jpg")
  })

  it("no reasigna el src si ya es el placeholder (evita loops)", () => {
    const target = { src: "/site/placeholder-instrument.jpg" }
    const event = { currentTarget: target } as unknown as React.SyntheticEvent<
      HTMLImageElement
    >

    handleImageError(event)

    expect(target.src).toBe("/site/placeholder-instrument.jpg")
  })
})

describe("loadPrimaryImageSafely", () => {
  it("llama onSuccess y onComplete cuando hay imagen principal", async () => {
    const getPrimary = vi.mocked(imageService.getPrimary)
    getPrimary.mockResolvedValueOnce({ success: true, data: primary })
    const onSuccess = vi.fn()
    const onComplete = vi.fn()

    await loadPrimaryImageSafely(11, onSuccess, onComplete)

    expect(getPrimary).toHaveBeenCalledWith(11)
    expect(onSuccess).toHaveBeenCalledWith(primary)
    expect(onComplete).toHaveBeenCalled()
  })

  it("no llama onSuccess cuando no hay imagen, pero completa", async () => {
    vi.mocked(imageService.getPrimary).mockResolvedValueOnce({
      success: false,
      data: null,
    })
    const onSuccess = vi.fn()
    const onComplete = vi.fn()

    await loadPrimaryImageSafely(11, onSuccess, onComplete)

    expect(onSuccess).not.toHaveBeenCalled()
    expect(onComplete).toHaveBeenCalled()
  })

  it("traga los errores de red y completa igual", async () => {
    vi.mocked(imageService.getPrimary).mockRejectedValueOnce(new Error("boom"))
    const onSuccess = vi.fn()
    const onComplete = vi.fn()

    await expect(
      loadPrimaryImageSafely(11, onSuccess, onComplete),
    ).resolves.toBeUndefined()
    expect(onSuccess).not.toHaveBeenCalled()
    expect(onComplete).toHaveBeenCalled()
  })
})
