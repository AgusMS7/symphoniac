import { readJson, STORAGE_KEYS, writeJson } from "./storage"

export interface CartItem {
  instrumentoId: number
  cantidad: number
}

export interface LocalOrder {
  id: number
  fecha: string
  total: number
  items: CartItem[]
}

type Listener = () => void

const listeners = new Set<Listener>()

let favoritesCache: number[] | null = null
let cartCache: CartItem[] | null = null
let ordersCache: LocalOrder[] | null = null

function emit(): void {
  listeners.forEach((listener) => listener())
}

/** Suscripción única para favoritos, carrito y pedidos. */
export function subscribe(listener: Listener): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function loadFavorites(): number[] {
  const stored = readJson<number[]>(STORAGE_KEYS.favorites, [])
  if (!Array.isArray(stored)) return []
  return stored.filter((id) => typeof id === "number")
}

function loadCart(): CartItem[] {
  const stored = readJson<CartItem[]>(STORAGE_KEYS.cart, [])
  if (!Array.isArray(stored)) return []

  return stored
    .filter((item) => item && typeof item.instrumentoId === "number")
    .map((item) => ({
      instrumentoId: item.instrumentoId,
      cantidad: Math.max(1, Math.floor(Number(item.cantidad) || 1)),
    }))
}

function loadOrders(): LocalOrder[] {
  const stored = readJson<LocalOrder[]>(STORAGE_KEYS.orders, [])
  return Array.isArray(stored) ? stored : []
}

export function getFavorites(): number[] {
  if (favoritesCache === null) favoritesCache = loadFavorites()
  return favoritesCache
}

export function toggleFavorite(instrumentoId: number): void {
  const favorites = getFavorites()
  const next = favorites.includes(instrumentoId)
    ? favorites.filter((id) => id !== instrumentoId)
    : [...favorites, instrumentoId]

  favoritesCache = next
  writeJson(STORAGE_KEYS.favorites, next)
  emit()
}

export function removeFavorites(ids: number[]): void {
  const favorites = getFavorites()
  const next = favorites.filter((id) => !ids.includes(id))
  if (next.length === favorites.length) return

  favoritesCache = next
  writeJson(STORAGE_KEYS.favorites, next)
  emit()
}

export function getCart(): CartItem[] {
  if (cartCache === null) cartCache = loadCart()
  return cartCache
}

function persistCart(cart: CartItem[]): void {
  cartCache = cart
  writeJson(STORAGE_KEYS.cart, cart)
  emit()
}

export function addToCart(instrumentoId: number): void {
  const cart = getCart()
  const existing = cart.find((item) => item.instrumentoId === instrumentoId)

  if (existing) {
    persistCart(
      cart.map((item) =>
        item.instrumentoId === instrumentoId
          ? { ...item, cantidad: item.cantidad + 1 }
          : item,
      ),
    )
    return
  }

  persistCart([...cart, { instrumentoId, cantidad: 1 }])
}

export function incrementCartItem(instrumentoId: number): void {
  addToCart(instrumentoId)
}

export function decrementCartItem(instrumentoId: number): void {
  const cart = getCart()
  const existing = cart.find((item) => item.instrumentoId === instrumentoId)
  if (!existing) return

  if (existing.cantidad <= 1) {
    persistCart(cart.filter((item) => item.instrumentoId !== instrumentoId))
    return
  }

  persistCart(
    cart.map((item) =>
      item.instrumentoId === instrumentoId
        ? { ...item, cantidad: item.cantidad - 1 }
        : item,
    ),
  )
}

export function removeFromCart(instrumentoId: number): void {
  persistCart(getCart().filter((item) => item.instrumentoId !== instrumentoId))
}

export function removeCartItems(ids: number[]): void {
  const cart = getCart()
  const next = cart.filter((item) => !ids.includes(item.instrumentoId))
  if (next.length === cart.length) return

  persistCart(next)
}

export function clearCart(): void {
  persistCart([])
}

/**
 * El backend guarda `costoEnvio` como string ("G", "P", "2000", "0").
 * Se cobra una sola vez por línea del carrito, igual que el envío real.
 */
export function parseShipping(costoEnvio: string): number {
  if (costoEnvio === "G" || costoEnvio === "P") return 0
  const value = Number(costoEnvio)
  return Number.isFinite(value) && value > 0 ? value : 0
}

export function getOrders(): LocalOrder[] {
  if (ordersCache === null) ordersCache = loadOrders()
  return ordersCache
}

export function writeOrders(orders: LocalOrder[]): void {
  ordersCache = orders
  writeJson(STORAGE_KEYS.orders, orders)
  emit()
}
