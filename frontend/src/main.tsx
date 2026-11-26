import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { DesignPreview } from "./pages/DesignPreview.tsx"
import App from "./App.tsx"
import "./index.css"

// Ruta temporal de la Fase 3: se elimina antes de cerrar el proyecto.
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
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
