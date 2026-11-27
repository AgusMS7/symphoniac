import { expect, test } from "@playwright/test"

test.describe("administración", () => {
  test("lista, crea un instrumento local y no toca el backend", async ({
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

    await page.getByLabel(/Instrumento/).fill("Instrumento de prueba E2E")
    await page.getByLabel(/Marca/).fill("Marca E2E")
    await page.getByLabel(/Modelo/).fill("Modelo E2E")
    await page.getByLabel(/Precio/).fill("15000")

    await page.getByLabel(/Categoría/).click()
    await page.getByRole("option").first().click()

    await page.getByRole("button", { name: "Crear", exact: true }).click()

    await expect(
      page.getByRole("heading", { name: "Instrumentos" }),
    ).toBeVisible()
    await expect(page.locator("table tbody tr")).toHaveCount(31)

    const res = await page.request.get("/api/instrumentos")
    expect((await res.json()).data).toHaveLength(30)
  })
})
