import { lazy, StrictMode, Suspense } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "./App.tsx"
import "./index.css"

// Ruta temporal de la Fase 6: se elimina antes de cerrar el proyecto.
const DesignPreview = lazy(() =>
  import("./pages/DesignPreview.tsx").then((module) => ({
    default: module.DesignPreview,
  })),
)

const root = createRoot(document.getElementById("root")!)

if (window.location.pathname === "/design-preview") {
  root.render(
    <StrictMode>
      <BrowserRouter>
        <Suspense fallback={<div className="min-h-screen bg-background" />}>
          <DesignPreview />
        </Suspense>
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
