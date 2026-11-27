import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import type { Categoria, Instrumento } from "../types/Instrumento"
import { STORAGE_KEYS } from "./storage"

const remote = vi.hoisted(() => ({
  getAllSimple: vi.fn(),
  getCategorias: vi.fn(),
  getByInstrumento: vi.fn(),
  getPrimary: vi.fn(),
  upload: vi.fn(),
  deleteImage: vi.fn(),
  setPrimary: vi.fn(),
  getImageUrl: vi.fn((filename: string) => `/images/${filename}`),
}))

vi.mock("./remoteBackend", () => ({
  remoteBackend: {
    instrumentoService: { getAllSimple: remote.getAllSimple },
    categoriaService: { getAll: remote.getCategorias },
    imageService: {
      getByInstrumento: remote.getByInstrumento,
      getPrimary: remote.getPrimary,
      upload: remote.upload,
      delete: remote.deleteImage,
      setPrimary: remote.setPrimary,
      getImageUrl: remote.getImageUrl,
    },
  },
}))

const categorias: Categoria[] = [
  { id: 1, denominacion: "Cuerda" },
  { id: 2, denominacion: "Viento" },
]

const instrumentos: Instrumento[] = [
  {
    id: 1,
    instrumento: "Guitarra Acústica",
    marca: "Yamaha",
    modelo: "FG800",
    precio: 25000,
    costoEnvio: "G",
    cantidadVendida: 15,
    descripcion: "",
    idCategoria: 1,
    categoriaDenominacion: "Cuerda",
  },
  {
    id: 2,
    instrumento: "Flauta Traversa",
    marca: "Pearl",
    modelo: "PF-525E",
    precio: 32000,
    costoEnvio: "300",
    cantidadVendida: 9,
    descripcion: "",
    idCategoria: 2,
    categoriaDenominacion: "Viento",
  },
]

async function loadDemo() {
  vi.resetModules()
  const localStore = await import("./localStore")
  const { demoBackend } = await import("./demoBackend")
  return { demoBackend, localStore }
}

function primeRemote() {
  remote.getAllSimple.mockResolvedValue({
    success: true,
    data: instrumentos,
    content: instrumentos,
  })
  remote.getCategorias.mockResolvedValue({ success: true, data: categorias })
}

beforeEach(() => {
  window.localStorage.clear()
  vi.clearAllMocks()
  primeRemote()
})

afterEach(async () => {
  // Los tests de fallback usan timers falsos; se restauran antes de esperar.
  vi.useRealTimers()
  // Deja correr el refresh en segundo plano antes de limpiar el storage.
  await new Promise((resolve) => setTimeout(resolve, 0))
  window.localStorage.clear()
})

describe("catálogo en demo", () => {
  it("getAllSimple devuelve el catálogo remoto fusionado", async () => {
    const { demoBackend } = await loadDemo()

    const result = await demoBackend.instrumentoService.getAllSimple()

    expect(result.data).toHaveLength(2)
    expect(result.data?.[0].instrumento).toBe("Guitarra Acústica")
    expect(remote.getAllSimple).toHaveBeenCalled()
  })

  it("getAll pagina el catálogo fusionado", async () => {
    const { demoBackend } = await loadDemo()

    const result = await demoBackend.instrumentoService.getAll(0, 1)

    expect(result.content).toHaveLength(1)
    expect(result.totalElements).toBe(2)
    expect(result.totalPages).toBe(2)
  })

  it("getById encuentra y no encuentra instrumentos", async () => {
    const { demoBackend } = await loadDemo()

    const found = await demoBackend.instrumentoService.getById(1)
    const missing = await demoBackend.instrumentoService.getById(999)

    expect(found.success).toBe(true)
    expect(found.data?.instrumento).toBe("Guitarra Acústica")
    expect(missing.success).toBe(false)
  })

  it("search filtra por nombre sin distinguir mayúsculas", async () => {
    const { demoBackend } = await loadDemo()

    const result = await demoBackend.instrumentoService.search("guitarra")

    expect(result.data?.map((i) => i.id)).toEqual([1])
  })

  it("getByCategoria filtra por categoría", async () => {
    const { demoBackend } = await loadDemo()

    const result = await demoBackend.instrumentoService.getByCategoria(2)

    expect(result.data?.map((i) => i.id)).toEqual([2])
  })
})

describe("CRUD de instrumentos en demo", () => {
  it("create asigna un ID negativo y lo persiste en el overlay", async () => {
    const { demoBackend } = await loadDemo()

    const created = await demoBackend.instrumentoService.create({
      instrumento: "  Nuevo Instrumento  ",
      marca: "Marca",
      modelo: "Modelo",
      precio: 1234,
      costoEnvio: "G",
      categoria: { id: 1 },
    })

    expect(created.success).toBe(true)
    expect(created.data?.id).toBe(-1)
    expect(created.data?.instrumento).toBe("Nuevo Instrumento")
    expect(created.data?.categoriaDenominacion).toBe("Cuerda")

    const all = await demoBackend.instrumentoService.getAllSimple()
    expect(all.data?.some((i) => i.id === -1)).toBe(true)
  })

  it("create falla si la categoría no existe", async () => {
    const { demoBackend } = await loadDemo()

    const created = await demoBackend.instrumentoService.create({
      instrumento: "X",
      categoria: { id: 99 },
    })

    expect(created.success).toBe(false)
    expect(created.message).toContain("Categoría")
  })

  it("update modifica campos y conserva el ID", async () => {
    const { demoBackend } = await loadDemo()

    const updated = await demoBackend.instrumentoService.update(1, {
      instrumento: "Guitarra Renombrada",
      precio: 30000,
    })

    expect(updated.success).toBe(true)
    expect(updated.data?.id).toBe(1)
    expect(updated.data?.instrumento).toBe("Guitarra Renombrada")
    expect(updated.data?.precio).toBe(30000)
  })

  it("update falla si el instrumento no existe", async () => {
    const { demoBackend } = await loadDemo()

    const updated = await demoBackend.instrumentoService.update(999, {
      instrumento: "X",
    })

    expect(updated.success).toBe(false)
  })

  it("delete elimina del overlay, favoritos y carrito", async () => {
    const { demoBackend, localStore } = await loadDemo()
    localStore.toggleFavorite(1)
    localStore.addToCart(1)

    const deleted = await demoBackend.instrumentoService.delete(1)

    expect(deleted.success).toBe(true)
    expect(localStore.getFavorites()).toEqual([])
    expect(localStore.getCart()).toEqual([])

    const all = await demoBackend.instrumentoService.getAllSimple()
    expect(all.data?.some((i) => i.id === 1)).toBe(false)
  })
})

describe("CRUD de categorías en demo", () => {
  it("create valida vacío y duplicados", async () => {
    const { demoBackend } = await loadDemo()

    const empty = await demoBackend.categoriaService.create({
      denominacion: "   ",
    })
    const duplicated = await demoBackend.categoriaService.create({
      denominacion: "cuerda",
    })

    expect(empty.success).toBe(false)
    expect(duplicated.success).toBe(false)
  })

  it("create válido persiste una categoría con ID negativo", async () => {
    const { demoBackend } = await loadDemo()

    const created = await demoBackend.categoriaService.create({
      denominacion: "Teclado",
    })

    expect(created.success).toBe(true)
    expect(created.data?.id).toBe(-1)

    const all = await demoBackend.categoriaService.getAll()
    expect(all.data?.some((c) => c.denominacion === "Teclado")).toBe(true)
  })

  it("update renombra la categoría y se refleja en los instrumentos", async () => {
    const { demoBackend } = await loadDemo()

    const updated = await demoBackend.categoriaService.update(1, {
      denominacion: "Cuerdas",
    })
    expect(updated.success).toBe(true)

    const all = await demoBackend.instrumentoService.getAllSimple()
    const guitarra = all.data?.find((i) => i.id === 1)
    expect(guitarra?.categoriaDenominacion).toBe("Cuerdas")
  })

  it("delete impide borrar categorías con instrumentos asociados", async () => {
    const { demoBackend } = await loadDemo()

    const deleted = await demoBackend.categoriaService.delete(1)

    expect(deleted.success).toBe(false)
    expect(deleted.message).toContain("instrumentos asociados")
  })
})

describe("imageService en demo", () => {
  it("deshabilita escrituras y delega lecturas al backend remoto", async () => {
    const { demoBackend } = await loadDemo()
    remote.getPrimary.mockResolvedValue({ success: false, data: null })

    await expect(
      demoBackend.imageService.upload(1, new File(["x"], "x.jpg")),
    ).resolves.toMatchObject({ success: false })
    await expect(demoBackend.imageService.delete(1)).resolves.toMatchObject({
      success: false,
    })
    await expect(demoBackend.imageService.setPrimary(1)).resolves.toMatchObject({
      success: false,
    })

    await demoBackend.imageService.getPrimary(1)
    expect(remote.getPrimary).toHaveBeenCalledWith(1)
    expect(demoBackend.imageService.getImageUrl("nro1.jpg")).toBe(
      "/images/nro1.jpg",
    )
  })
})

describe("fallback al snapshot estático", () => {
  it("usa el backend cuando responde y lo cachea", async () => {
    const info = vi.spyOn(console, "info").mockImplementation(() => {})
    const { demoBackend } = await loadDemo()

    const result = await demoBackend.instrumentoService.getAllSimple()

    expect(result.data).toHaveLength(2)
    expect(window.localStorage.getItem(STORAGE_KEYS.cacheCatalogo)).not.toBeNull()
    expect(info).toHaveBeenCalledWith(
      "[symphoniac] Catálogo cargado desde el backend",
      { instrumentos: 2, categorias: 2 },
    )
  })

  it("cae al snapshot si el backend no responde en 8 segundos", async () => {
    vi.useFakeTimers()
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    const error = vi.spyOn(console, "error").mockImplementation(() => {})

    remote.getAllSimple.mockReturnValue(new Promise(() => {}))
    remote.getCategorias.mockReturnValue(new Promise(() => {}))
    const { demoBackend } = await loadDemo()

    const request = demoBackend.instrumentoService.getAllSimple()
    await vi.advanceTimersByTimeAsync(8_000)
    const result = await request

    expect(result.data).toHaveLength(30)
    expect(window.localStorage.getItem(STORAGE_KEYS.cacheCatalogo)).toBeNull()
    expect(warn).toHaveBeenCalledWith(
      "[symphoniac] Backend no disponible; usando snapshot estático",
      { instrumentos: 30, categorias: 5 },
    )
    expect(error).toHaveBeenCalled()
  })

  it("cae al snapshot inmediatamente ante un error de red", async () => {
    vi.useFakeTimers()
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    const error = vi.spyOn(console, "error").mockImplementation(() => {})

    remote.getAllSimple.mockRejectedValue(new Error("network down"))
    remote.getCategorias.mockRejectedValue(new Error("network down"))
    const { demoBackend } = await loadDemo()

    const result = await demoBackend.instrumentoService.getAllSimple()

    expect(result.data).toHaveLength(30)
    expect(window.localStorage.getItem(STORAGE_KEYS.cacheCatalogo)).toBeNull()
    expect(warn).toHaveBeenCalledWith(
      "[symphoniac] Backend no disponible; usando snapshot estático",
      { instrumentos: 30, categorias: 5 },
    )
    expect(error).toHaveBeenCalled()
  })

  it("reemplaza el snapshot cuando el backend conecta después", async () => {
    vi.useFakeTimers()
    const info = vi.spyOn(console, "info").mockImplementation(() => {})
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    const error = vi.spyOn(console, "error").mockImplementation(() => {})

    let resolveInstrumentos:
      | ((value: {
          success: boolean
          data: Instrumento[]
          content: Instrumento[]
        }) => void)
      | undefined
    const instrumentosPromise = new Promise<{
      success: boolean
      data: Instrumento[]
      content: Instrumento[]
    }>((resolve) => {
      resolveInstrumentos = resolve
    })

    remote.getAllSimple.mockReturnValue(instrumentosPromise)
    remote.getCategorias.mockResolvedValue({ success: true, data: categorias })

    const { demoBackend } = await loadDemo()
    const { subscribeCatalogUpdated } = await import("./events")
    const listener = vi.fn()
    const unsubscribe = subscribeCatalogUpdated(listener)

    const request = demoBackend.instrumentoService.getAllSimple()
    await vi.advanceTimersByTimeAsync(8_000)
    const snapshotResult = await request

    expect(snapshotResult.data).toHaveLength(30)
    expect(window.localStorage.getItem(STORAGE_KEYS.cacheCatalogo)).toBeNull()

    resolveInstrumentos?.({
      success: true,
      data: instrumentos,
      content: instrumentos,
    })
    await vi.advanceTimersByTimeAsync(0)

    expect(window.localStorage.getItem(STORAGE_KEYS.cacheCatalogo)).not.toBeNull()
    expect(listener).toHaveBeenCalled()
    expect(info).toHaveBeenCalledWith(
      "[symphoniac] Backend conectado; catálogo actualizado desde el backend",
    )

    const backendResult = await demoBackend.instrumentoService.getAllSimple()
    expect(backendResult.data).toHaveLength(2)

    unsubscribe()
    expect(warn).toHaveBeenCalled()
    expect(error).toHaveBeenCalled()
  })
})
