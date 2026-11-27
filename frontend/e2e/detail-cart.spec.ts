import { expect, test } from "@playwright/test"

const nombre = "Guitarra Acústica Yamaha"

test.describe("detalle y carrito", () => {
  test("agrega al carrito y la compra está deshabilitada en demo", async ({
    page,
  }) => {
    await page.goto("/instrumento/11")

    await expect(
      page.getByRole("heading", { level: 1, name: nombre }),
    ).toBeVisible()
    await expect(
      page.getByText("Envío gratis a todo el país"),
    ).toBeVisible()

    await page
      .getByRole("button", { name: `Agregar ${nombre} al carrito` })
      .first()
      .click()
    await expect(
      page.getByRole("button", { name: "Agregado al carrito" }),
    ).toBeVisible()

    await page.getByRole("button", { name: "Carrito (1)" }).click()

    const drawer = page.getByRole("dialog")
    await expect(drawer.getByText("Carrito y pedidos")).toBeVisible()
    await expect(drawer.getByText(nombre)).toBeVisible()

    await drawer.getByRole("button", { name: "Confirmar compra" }).click()

    await expect(page.getByText("No disponible para demo")).toBeVisible()
  })
})
