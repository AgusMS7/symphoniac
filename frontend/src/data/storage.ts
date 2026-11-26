export const STORAGE_PREFIX = "symphoniac:"

export const STORAGE_KEYS = {
  meta: `${STORAGE_PREFIX}v1:meta`,
  overlayInstrumentos: `${STORAGE_PREFIX}v1:overlay:instrumentos`,
  overlayCategorias: `${STORAGE_PREFIX}v1:overlay:categorias`,
  favorites: `${STORAGE_PREFIX}v1:favorites`,
  cart: `${STORAGE_PREFIX}v1:cart`,
  orders: `${STORAGE_PREFIX}v1:orders`,
  cacheCatalogo: `${STORAGE_PREFIX}v1:cache:catalogo`,
} as const

export function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback

  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch (error) {
    console.error(`No se pudo leer ${key} de localStorage`, error)
    return fallback
  }
}

export function writeJson(key: string, value: unknown): void {
  if (typeof window === "undefined") return

  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`No se pudo escribir ${key} en localStorage`, error)
  }
}

/** Borra todas las claves de la demo (prefijo symphoniac:). */
export function clearDemoData(): void {
  if (typeof window === "undefined") return

  const keys: string[] = []
  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index)
    if (key?.startsWith(STORAGE_PREFIX)) keys.push(key)
  }
  keys.forEach((key) => window.localStorage.removeItem(key))
}
