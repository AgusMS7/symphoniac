import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { DesignPreview } from "./pages/DesignPreview.tsx"
import "./index.css"

// Ruta temporal de la Fase 3: se elimina antes de cerrar el proyecto.
// App se carga de forma diferida para que su App.css (reset sin capas)
// no anule las utilidades de Tailwind dentro del preview.
const root = createRoot(document.getElementById("root")!)

if (window.location.pathname === "/design-preview") {
  root.render(
    <StrictMode>
      <BrowserRouter>
        <DesignPreview />
      </BrowserRouter>
    </StrictMode>,
  )
} else {
  import("./App.tsx").then(({ default: App }) => {
    root.render(
      <StrictMode>
        <App />
      </StrictMode>,
    )
  })
}
