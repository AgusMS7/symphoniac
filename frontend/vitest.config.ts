import path from "node:path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vitest/config"

// Configuración de tests unitarios/de componentes. No reutiliza
// vite.config.ts para no cargar el plugin de Tailwind (innecesario en jsdom)
// y para mantener el build de producción aislado de la configuración de tests.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules", "dist", "e2e"],
    restoreMocks: true,
    clearMocks: true,
  },
})
