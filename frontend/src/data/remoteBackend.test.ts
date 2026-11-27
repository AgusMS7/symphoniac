import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { remoteBackend } from "./remoteBackend"

function jsonResponse(
  body: unknown,
  init: { ok?: boolean; status?: number; statusText?: string } = {},
): Response {
  return {
    ok: init.ok ?? true,
    status: init.status ?? 200,
    statusText: init.statusText ?? "OK",
    json: async () => body,
  } as unknown as Response
}

let fetchMock: ReturnType<typeof vi.fn>

beforeEach(() => {
  fetchMock = vi.fn()
  vi.stubGlobal("fetch", fetchMock)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe("instrumentoService", () => {
  it("getAll arma la URL paginada por defecto", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ content: [] }))

    await remoteBackend.instrumentoService.getAll()

    const [url] = fetchMock.mock.calls[0]
    expect(url).toContain("/instrumentos?page=0&size=10&sort=id,asc")
  })

  it("getAll respeta página, tamaño y orden", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ content: [] }))

    await remoteBackend.instrumentoService.getAll(2, 5, "precio,desc")

    const [url] = fetchMock.mock.calls[0]
    expect(url).toContain("/instrumentos?page=2&size=5&sort=precio,desc")
  })

  it("lanza un error legible cuando la respuesta no es OK", async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse(null, { ok: false, status: 500, statusText: "Server Error" }),
    )

    await expect(remoteBackend.instrumentoService.getAll()).rejects.toThrow(
      "Error 500: Server Error",
    )
  })

  it("getById devuelve el JSON parseado", async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ success: true, data: { id: 11 } }),
    )

    const result = await remoteBackend.instrumentoService.getById(11)

    expect(result.data).toEqual({ id: 11 })
    expect(fetchMock.mock.calls[0][0]).toContain("/instrumentos/11")
  })

  it("create envía POST con JSON", async () => {
    const payload = { instrumento: "Guitarra" }
    fetchMock.mockResolvedValueOnce(jsonResponse({ success: true }))

    await remoteBackend.instrumentoService.create(payload)

    const [, options] = fetchMock.mock.calls[0]
    expect(options).toMatchObject({
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
  })

  it("search codifica el término de búsqueda", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ content: [] }))

    await remoteBackend.instrumentoService.search("Guitarra Acústica")

    const [url] = fetchMock.mock.calls[0]
    expect(url).toContain(`nombre=${encodeURIComponent("Guitarra Acústica")}`)
  })
})

describe("categoriaService", () => {
  it("getAll consulta el endpoint de categorías", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ success: true, data: [] }))

    await remoteBackend.categoriaService.getAll()

    expect(fetchMock.mock.calls[0][0]).toContain("/categorias")
  })
})

describe("imageService", () => {
  it("getPrimary devuelve no encontrado ante 404 sin lanzar", async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse(null, { ok: false, status: 404, statusText: "Not Found" }),
    )

    const result = await remoteBackend.imageService.getPrimary(11)

    expect(result).toEqual({
      success: false,
      message: "No se encontró imagen principal",
      data: null,
    })
  })

  it("getPrimary devuelve la imagen cuando existe", async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ success: true, data: { id: 1 } }),
    )

    const result = await remoteBackend.imageService.getPrimary(11)

    expect(result.data).toEqual({ id: 1 })
  })

  it("getImageUrl compone la ruta pública", () => {
    expect(remoteBackend.imageService.getImageUrl("nro1.jpg")).toBe(
      "/images/nro1.jpg",
    )
  })

  it("getImageUrl devuelve intacta una ruta local o absoluta", () => {
    expect(
      remoteBackend.imageService.getImageUrl("/site/instruments/x.jpg"),
    ).toBe("/site/instruments/x.jpg")
    expect(
      remoteBackend.imageService.getImageUrl(
        "https://cdn.example.com/x.jpg",
      ),
    ).toBe("https://cdn.example.com/x.jpg")
  })

  it("upload envía FormData con altText e isPrimary", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ success: true }))
    const file = new File(["contenido"], "foto.jpg", { type: "image/jpeg" });

    await remoteBackend.imageService.upload(11, file, "Guitarra", true)

    const [url, options] = fetchMock.mock.calls[0]
    expect(url).toContain("/images/upload/11")
    expect(options).toMatchObject({ method: "POST" })
    const formData = options.body as FormData
    expect(formData).toBeInstanceOf(FormData)
    expect(formData.get("altText")).toBe("Guitarra")
    expect(formData.get("isPrimary")).toBe("true")
    expect(formData.get("file")).toBeInstanceOf(File)
  })
})
