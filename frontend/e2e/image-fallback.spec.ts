import { expect, test } from "@playwright/test"

test.describe("fallback de imágenes", () => {
  test("muestra la etiqueta de referencia cuando la imagen no existe", async ({
    page,
  }) => {
    // Fuerza un 404 para un archivo deliberadamente inexistente, sin depender
    // de que falte una imagen real del seed.
    await page.route("**/images/acoustic-guitar.jpg", (route) =>
      route.fulfill({ status: 404, body: "" }),
    )

    await page.goto("/instrumento/11")

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Guitarra Acústica Yamaha",
      }),
    ).toBeVisible()

    await expect(page.getByText("Imagen de referencia")).toBeVisible()
    await expect(
      page.getByRole("img", { name: "Guitarra Acústica Yamaha" }),
    ).toHaveAttribute("src", "/site/placeholder-instrument.jpg")
  })
})
