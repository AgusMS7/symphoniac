import { expect, test } from "@playwright/test"

test.describe("fallback de imágenes", () => {
  test("muestra la etiqueta de referencia cuando la imagen no existe", async ({
    page,
  }) => {
    await page.goto("/instrumento/11")

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Guitarra Acústica Yamaha",
      }),
    ).toBeVisible()

    // La imagen del seed no existe: el onError debe caer al placeholder.
    await expect(page.getByText("Imagen de referencia")).toBeVisible()
    await expect(
      page.getByRole("img", { name: "Guitarra Acústica Yamaha" }),
    ).toHaveAttribute("src", "/site/placeholder-instrument.jpg")
  })
})
