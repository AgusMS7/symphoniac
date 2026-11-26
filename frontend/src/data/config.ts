/**
 * Cuando VITE_DEMO=true la aplicación usa el backend local en memoria
 * (localStorage) y el catálogo real del backend solo como base de lectura.
 */
export const IS_DEMO = import.meta.env.VITE_DEMO === "true"
