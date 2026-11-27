import { expect, test } from "@playwright/test"

test.describe("administración", () => {
  test("lista los instrumentos y abre el formulario de alta", async ({
    page,
  }) => {
    await page.goto("/admin")

    await expect(
      page.getByRole("heading", { name: "Instrumentos" }),
    ).toBeVisible()
    await expect(
      page.getByText("Mostrando 30 de 30 instrumentos"),
    ).toBeVisible()
    await expect(page.locator("table tbody tr")).toHaveCount(30)

    await page.getByRole("button", { name: "Crear instrumento" }).click()

    await expect(
      page.getByRole("heading", { name: "Crear instrumento" }),
    ).toBeVisible()
    await expect(page.getByLabel(/Instrumento/)).toBeVisible()

    await page.getByRole("button", { name: "Cancelar" }).click()

    await expect(
      page.getByRole("heading", { name: "Instrumentos" }),
    ).toBeVisible()
  })
})
