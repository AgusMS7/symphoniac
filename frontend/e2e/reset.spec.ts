import { expect, test } from "@playwright/test"

const nombre = "Guitarra Acústica Yamaha"

test.describe("reset de la demo", () => {
  test("borra favoritos y carrito y vuelve al catálogo del backend", async ({
    page,
  }) => {
    await page.goto("/instrumento/11")

    await expect(
      page.getByRole("heading", { level: 1, name: nombre }),
    ).toBeVisible()

    await page
      .getByRole("button", { name: `Agregar ${nombre} al carrito` })
      .first()
      .click()
    await page
      .getByRole("button", { name: "Agregar a favoritos" })
      .first()
      .click()

    await expect(
      page.getByRole("button", { name: "Carrito (1)" }),
    ).toBeVisible()
    await expect(
      page.getByRole("link", { name: "Favoritos (1)" }),
    ).toBeVisible()

    await page
      .getByRole("button", { name: "Información sobre la demo" })
      .click()
    await page.getByRole("button", { name: "Borrar datos demo" }).click()

    await expect(
      page.getByRole("link", { name: "Favoritos (0)" }),
    ).toBeVisible()
    await expect(
      page.getByRole("button", { name: "Carrito (0)" }),
    ).toBeVisible()

    await page.goto("/productos?favoritos=1")

    await expect(
      page.getByText(/Todavía no marcaste instrumentos como favoritos/),
    ).toBeVisible()
  })
})
