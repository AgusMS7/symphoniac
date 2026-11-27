import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import type { ComponentProps } from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { imageService } from "../services/api"
import type { Categoria } from "../types/Categoria"
import type { Instrumento } from "../types/Instrumento"
import { InstrumentoForm } from "./InstrumentoForm"

vi.mock("../services/api", () => ({
  imageService: {
    getPrimary: vi.fn(),
    getImageUrl: (filename: string) => `/images/${filename}`,
    upload: vi.fn(),
    delete: vi.fn(),
  },
}))

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), info: vi.fn(), error: vi.fn() },
}))

const categorias: Categoria[] = [
  { id: 1, denominacion: "Cuerda" },
  { id: 2, denominacion: "Viento" },
]

const instrumento: Instrumento = {
  id: 11,
  instrumento: "Guitarra Acústica",
  marca: "Yamaha",
  modelo: "FG800",
  precio: 25000,
  costoEnvio: "G",
  cantidadVendida: 15,
  descripcion: "Guitarra de estudio",
  idCategoria: 1,
  categoriaDenominacion: "Cuerda",
  imagen: null,
}

function renderForm(props: Partial<ComponentProps<typeof InstrumentoForm>> = {}) {
  const onSubmit = vi.fn().mockResolvedValue({ success: true, data: { id: 11 } })
  const onCancel = vi.fn()

  render(
    <InstrumentoForm
      categorias={categorias}
      onSubmit={onSubmit}
      onCancel={onCancel}
      {...props}
    />,
  )

  return { onSubmit, onCancel }
}

beforeEach(() => {
  vi.mocked(imageService.getPrimary).mockResolvedValue({
    success: false,
    data: null,
  })
})

describe("InstrumentoForm (crear)", () => {
  it("valida los campos obligatorios vacíos", async () => {
    const user = userEvent.setup()
    renderForm()

    expect(
      screen.getByRole("heading", { name: "Crear instrumento" }),
    ).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Crear" }))

    expect(
      screen.getByText("El nombre del instrumento es requerido"),
    ).toBeInTheDocument()
    expect(screen.getByText("La marca es requerida")).toBeInTheDocument()
    expect(screen.getByText("El modelo es requerido")).toBeInTheDocument()
    expect(screen.getByText("El precio es requerido")).toBeInTheDocument()
    expect(
      screen.getByText("Debe seleccionar una categoría"),
    ).toBeInTheDocument()
    expect(screen.getAllByRole("alert")).toHaveLength(5)
  })

  it("rechaza precios no positivos", async () => {
    const user = userEvent.setup()
    renderForm()

    await user.type(screen.getByLabelText(/Instrumento/), "Guitarra")
    await user.type(screen.getByLabelText(/Marca/), "Yamaha")
    await user.type(screen.getByLabelText(/Modelo/), "FG800")
    await user.type(screen.getByLabelText(/Precio/), "0")
    await user.click(screen.getByRole("button", { name: "Crear" }))

    expect(
      screen.getByText("El precio debe ser un número válido mayor a 0"),
    ).toBeInTheDocument()
  })
})

describe("InstrumentoForm (editar)", () => {
  it("precarga los datos del instrumento", () => {
    renderForm({ instrumento })

    expect(
      screen.getByRole("heading", { name: "Editar instrumento" }),
    ).toBeInTheDocument()
    expect(screen.getByLabelText(/Instrumento/)).toHaveValue(
      "Guitarra Acústica",
    )
    expect(screen.getByLabelText(/Marca/)).toHaveValue("Yamaha")
    expect(screen.getByLabelText(/Modelo/)).toHaveValue("FG800")
    expect(screen.getByLabelText(/Precio/)).toHaveValue(25000)
    expect(screen.getByLabelText(/Cantidad Vendida/)).toHaveValue(15)
    expect(screen.getByLabelText(/Descripción/)).toHaveValue(
      "Guitarra de estudio",
    )
    expect(screen.getByRole("radio", { name: "Envío gratis" })).toBeChecked()
  })

  it("envía el payload con los tipos correctos", async () => {
    const user = userEvent.setup()
    const { onSubmit } = renderForm({ instrumento })

    await user.click(screen.getByRole("button", { name: "Actualizar" }))

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1))
    expect(onSubmit).toHaveBeenCalledWith({
      instrumento: "Guitarra Acústica",
      marca: "Yamaha",
      modelo: "FG800",
      imagen: null,
      precio: 25000,
      costoEnvio: "G",
      cantidadVendida: 15,
      descripcion: "Guitarra de estudio",
      categoria: { id: 1 },
    })
  })

  it("permite editar un envío con costo y exige un valor válido", async () => {
    const user = userEvent.setup()
    const conCosto: Instrumento = { ...instrumento, costoEnvio: "300" }
    const { onSubmit } = renderForm({ instrumento: conCosto })

    expect(screen.getByRole("radio", { name: "Con costo" })).toBeChecked()
    const costo = screen.getByLabelText("Costo de envío")
    expect(costo).toHaveValue(300)

    await user.clear(costo)
    await user.click(screen.getByRole("button", { name: "Actualizar" }))

    expect(
      screen.getByText("Debe ingresar un costo de envío válido"),
    ).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it("incluye el costo de envío personalizado al actualizar", async () => {
    const user = userEvent.setup()
    const conCosto: Instrumento = { ...instrumento, costoEnvio: "300" }
    const { onSubmit } = renderForm({ instrumento: conCosto })

    await user.click(screen.getByRole("button", { name: "Actualizar" }))

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1))
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ costoEnvio: "300" }),
    )
  })

  it("cancelar dispara onCancel", async () => {
    const user = userEvent.setup()
    const { onCancel } = renderForm({ instrumento })

    await user.click(screen.getByRole("button", { name: "Cancelar" }))

    expect(onCancel).toHaveBeenCalledTimes(1)
  })
})
