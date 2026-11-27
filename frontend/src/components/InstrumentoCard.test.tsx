import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import { toast } from "sonner"
import { beforeEach, describe, expect, it, vi } from "vitest"

import {
  clearCart,
  getCart,
  getFavorites,
  removeFavorites,
} from "../data/localStore"
import { STORAGE_KEYS } from "../data/storage"
import { imageService } from "../services/api"
import type { Instrumento } from "../types/Instrumento"
import { InstrumentoCard } from "./InstrumentoCard"

vi.mock("../services/api", () => ({
  imageService: {
    getImageUrl: (filename: string) => `/images/${filename}`,
    getPrimary: vi.fn(),
  },
}))

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), info: vi.fn(), error: vi.fn() },
}))

const instrumento: Instrumento = {
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
  imagen: "nro1.jpg",
}

function renderCard(overrides: Partial<Instrumento> = {}) {
  return render(
    <MemoryRouter>
      <InstrumentoCard instrumento={{ ...instrumento, ...overrides }} />
    </MemoryRouter>,
  )
}

beforeEach(() => {
  window.localStorage.clear()
  removeFavorites(getFavorites())
  clearCart()
  vi.mocked(imageService.getPrimary).mockResolvedValue({
    success: false,
    data: null,
  })
})

describe("InstrumentoCard", () => {
  it("muestra nombre, marca, precio y envío", () => {
    renderCard()

    expect(
      screen.getByRole("heading", { name: "Guitarra Acústica" }),
    ).toBeInTheDocument()
    expect(screen.getByText("Yamaha")).toBeInTheDocument()
    expect(screen.getByText("$25.000")).toBeInTheDocument()
    expect(screen.getByText("Envío gratis")).toBeInTheDocument()
    expect(screen.getByText("15 vendidos")).toBeInTheDocument()
    expect(screen.getByText("Cuerda")).toBeInTheDocument()
  })

  it("usa la imagen legacy cuando no hay imagen principal", () => {
    renderCard()

    expect(
      screen.getByRole("img", { name: "Imagen de Guitarra Acústica" }),
    ).toHaveAttribute("src", "/images/nro1.jpg")
  })

  it("muestra la etiqueta de imagen de referencia sin imagen", () => {
    renderCard({ imagen: null })

    expect(screen.getByText("Imagen de referencia")).toBeInTheDocument()
  })

  it("alterna favoritos y persiste el cambio", async () => {
    const user = userEvent.setup()
    renderCard()

    const favorite = screen.getByRole("button", {
      name: "Agregar Guitarra Acústica a favoritos",
    })
    expect(favorite).toHaveAttribute("aria-pressed", "false")

    await user.click(favorite)

    expect(
      screen.getByRole("button", {
        name: "Quitar Guitarra Acústica de favoritos",
      }),
    ).toHaveAttribute("aria-pressed", "true")
    expect(
      JSON.parse(window.localStorage.getItem(STORAGE_KEYS.favorites) ?? "[]"),
    ).toEqual([11])
  })

  it("agrega al carrito y avisa con un toast", async () => {
    const user = userEvent.setup()
    renderCard()

    await user.click(
      screen.getByRole("button", {
        name: "Agregar Guitarra Acústica al carrito",
      }),
    )

    expect(getCart()).toEqual([{ instrumentoId: 11, cantidad: 1 }])
    expect(toast.success).toHaveBeenCalledWith("Agregado al carrito")
    expect(
      screen.getByRole("button", { name: "Agregado al carrito" }),
    ).toBeInTheDocument()
  })
})
