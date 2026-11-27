import { expect, test } from "@playwright/test"

test.describe("catálogo", () => {
  test("la home carga el catálogo del backend", async ({ page }) => {
    await page.goto("/")

    await expect(
      page.getByRole("heading", { name: "Instrumentos destacados" }),
    ).toBeVisible()
    await expect(
      page.getByRole("heading", { name: "Instrumentos probados en vivo." }),
    ).toBeVisible()
  })

  test("lista los 30 instrumentos paginados de a 10", async ({ page }) => {
    await page.goto("/productos")

    await expect(
      page.getByRole("heading", { name: "Instrumentos" }),
    ).toBeVisible()
    await expect(
      page.getByText("Mostrando 10 de 30 instrumentos"),
    ).toBeVisible()
    await expect(page.getByRole("article")).toHaveCount(10)
  })

  test("busca por nombre", async ({ page }) => {
    await page.goto("/productos")
    await expect(
      page.getByText("Mostrando 10 de 30 instrumentos"),
    ).toBeVisible()

    await page.getByLabel("Buscar").fill("Guitarra")

    await expect(page.getByText("Mostrando 4 de 4 instrumentos")).toBeVisible()
    await expect(page.getByRole("article")).toHaveCount(4)
  })

  test("filtra por categoría", async ({ page }) => {
    await page.goto("/productos")
    await expect(
      page.getByText("Mostrando 10 de 30 instrumentos"),
    ).toBeVisible()

    await page.getByLabel("Filtrar por categoría").click()
    await page.getByRole("option", { name: "Viento" }).click()

    await expect(page.getByText("Mostrando 5 de 5 instrumentos")).toBeVisible()
    await expect(page.getByRole("article")).toHaveCount(5)
  })
})
