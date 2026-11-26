import type React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppShell } from "./components/layout/app-shell";
import { ScrollToTop } from "./components/ScrollToTop";
import { Toaster } from "./components/ui/sonner";
import { Home } from "./pages/Home";
import { Productos } from "./pages/Productos";
import { DetalleInstrumento } from "./pages/DetalleInstrumento";
import { DondeEstamos } from "./pages/DondeEstamos";
import { Admin } from "./pages/Admin";

const App: React.FC = () => {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <ScrollToTop />
      <AppShell>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/instrumento/:id" element={<DetalleInstrumento />} />
          <Route path="/donde-estamos" element={<DondeEstamos />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </AppShell>
      <Toaster />
    </Router>
  );
};

export default App;
