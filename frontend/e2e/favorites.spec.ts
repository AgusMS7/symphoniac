import { expect, test } from "@playwright/test"

test.describe("favoritos", () => {
  test("marca un favorito, lo filtra y persiste al recargar", async ({
    page,
  }) => {
    await page.goto("/productos")

    await expect(
      page.getByText("Mostrando 10 de 30 instrumentos"),
    ).toBeVisible()

    await page
      .getByRole("button", { name: /Agregar .* a favoritos/ })
      .first()
      .click()

    await expect(
      page.getByRole("link", { name: "Favoritos (1)" }),
    ).toBeVisible()

    await page.getByRole("link", { name: "Favoritos (1)" }).click()

    await expect(page).toHaveURL(/\/productos\?favoritos=1/)
    await expect(page.getByText("Mostrando favoritos")).toBeVisible()
    await expect(page.getByRole("article")).toHaveCount(1)

    await page.reload()

    await expect(page.getByText("Mostrando favoritos")).toBeVisible()
    await expect(page.getByRole("article")).toHaveCount(1)
  })
})
