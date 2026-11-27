import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppShell } from "./components/layout/app-shell";
import { ScrollToTop } from "./components/ScrollToTop";
import { Skeleton } from "./components/ui/skeleton";
import { Toaster } from "./components/ui/sonner";

const Home = lazy(() => import("./pages/Home"));
const Productos = lazy(() => import("./pages/Productos"));
const DetalleInstrumento = lazy(() => import("./pages/DetalleInstrumento"));
const DondeEstamos = lazy(() => import("./pages/DondeEstamos"));
const Admin = lazy(() => import("./pages/Admin"));

function PageSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <Skeleton className="h-6 w-32 rounded-full" />
      <Skeleton className="mt-4 h-10 w-64 rounded-xl" />
      <Skeleton className="mt-8 h-24 w-full rounded-2xl" />
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="aspect-[4/5] w-full rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

const App = () => {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <ScrollToTop />
      <AppShell>
        <Suspense fallback={<PageSkeleton />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/instrumento/:id" element={<DetalleInstrumento />} />
            <Route path="/donde-estamos" element={<DondeEstamos />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Suspense>
      </AppShell>
      <Toaster />
    </Router>
  );
};

export default App;
