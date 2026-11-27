import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { toast } from "sonner"
import { beforeEach, describe, expect, it, vi } from "vitest"

import {
  addToCart,
  clearCart,
  getCart,
  getFavorites,
  removeFavorites,
} from "../data/localStore"
import { imageService, instrumentoService } from "../services/api"
import type { Instrumento } from "../types/Instrumento"
import { CartDrawer } from "./cart-drawer"

vi.mock("../services/api", () => ({
  instrumentoService: {
    getAllSimple: vi.fn(),
  },
  imageService: {
    getPrimary: vi.fn(),
    getImageUrl: (filename: string) => `/images/${filename}`,
  },
}))

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), info: vi.fn(), error: vi.fn() },
}))

const instrumentos: Instrumento[] = [
  {
    id: 11,
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
    id: 16,
    instrumento: "Saxofón Alto",
    marca: "Yamaha",
    modelo: "YAS-280",
    precio: 95000,
    costoEnvio: "500",
    cantidadVendida: 2,
    descripcion: "",
    idCategoria: 2,
    categoriaDenominacion: "Viento",
  },
]

function renderDrawer() {
  return render(<CartDrawer open onOpenChange={() => {}} />)
}

beforeEach(() => {
  window.localStorage.clear()
  removeFavorites(getFavorites())
  clearCart()
  vi.mocked(instrumentoService.getAllSimple).mockResolvedValue({
    success: true,
    data: instrumentos,
    content: instrumentos,
  })
  vi.mocked(imageService.getPrimary).mockResolvedValue({
    success: false,
    data: null,
  })
})

describe("CartDrawer", () => {
  it("muestra el estado vacío", async () => {
    renderDrawer()

    expect(await screen.findByText("Tu carrito está vacío")).toBeInTheDocument()
  })

  it("lista las líneas del carrito con precio y total", async () => {
    addToCart(11)
    renderDrawer()

    expect(await screen.findByText("Guitarra Acústica")).toBeInTheDocument()
    expect(screen.getByText("1")).toBeInTheDocument()
    expect(screen.getByText("Envío")).toBeInTheDocument()
    expect(screen.getByText("Gratis")).toBeInTheDocument()
    expect(screen.getAllByText("$25.000").length).toBeGreaterThanOrEqual(2)
  })

  it("incrementa, decrementa y quita líneas", async () => {
    const user = userEvent.setup()
    addToCart(11)
    renderDrawer()

    await screen.findByText("Guitarra Acústica")

    await user.click(
      screen.getByRole("button", {
        name: "Agregar una unidad de Guitarra Acústica",
      }),
    )
    expect(getCart()).toEqual([{ instrumentoId: 11, cantidad: 2 }])

    await user.click(
      screen.getByRole("button", {
        name: "Quitar una unidad de Guitarra Acústica",
      }),
    )
    expect(getCart()).toEqual([{ instrumentoId: 11, cantidad: 1 }])

    await user.click(
      screen.getByRole("button", {
        name: "Eliminar Guitarra Acústica del carrito",
      }),
    )
    expect(getCart()).toEqual([])
    expect(await screen.findByText("Tu carrito está vacío")).toBeInTheDocument()
  })

  it("informa que la compra no está implementada", async () => {
    const user = userEvent.setup()
    addToCart(11)
    renderDrawer()

    await screen.findByText("Guitarra Acústica")
    await user.click(screen.getByRole("button", { name: "Confirmar compra" }))

    expect(toast.info).toHaveBeenCalledWith("La compra no está implementada")
  })

  it("permite quitar productos que ya no están disponibles", async () => {
    const user = userEvent.setup()
    addToCart(999)
    renderDrawer()

    expect(
      await screen.findByText(
        "Un producto del carrito ya no está disponible.",
      ),
    ).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Quitar del carrito" }))

    expect(getCart()).toEqual([])
    expect(toast.info).toHaveBeenCalledWith(
      "Productos no disponibles eliminados del carrito",
    )
  })
})
