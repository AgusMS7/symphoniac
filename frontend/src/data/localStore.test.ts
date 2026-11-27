import { beforeEach, describe, expect, it, vi } from "vitest"

import { parseShipping } from "./localStore"
import { STORAGE_KEYS, writeJson } from "./storage"

type LocalStore = typeof import("./localStore")

async function loadStore(): Promise<LocalStore> {
  vi.resetModules()
  return import("./localStore")
}

beforeEach(() => {
  window.localStorage.clear()
  vi.resetModules()
})

describe("favoritos", () => {
  it("agrega y quita favoritos persistiendo el cambio", async () => {
    const store = await loadStore()

    store.toggleFavorite(11)
    expect(store.getFavorites()).toEqual([11])
    expect(
      JSON.parse(window.localStorage.getItem(STORAGE_KEYS.favorites) ?? "[]"),
    ).toEqual([11])

    store.toggleFavorite(11)
    expect(store.getFavorites()).toEqual([])
  })

  it("notifica a los suscriptores y permite desuscribirse", async () => {
    const store = await loadStore()
    const listener = vi.fn()
    const unsubscribe = store.subscribe(listener)

    store.toggleFavorite(1)
    expect(listener).toHaveBeenCalledTimes(1)

    unsubscribe()
    store.toggleFavorite(2)
    expect(listener).toHaveBeenCalledTimes(1)
  })

  it("removeFavorites quita IDs y no emite si no cambia nada", async () => {
    const store = await loadStore()
    const listener = vi.fn()
    store.subscribe(listener)
    store.toggleFavorite(1)
    store.toggleFavorite(2)
    listener.mockClear()

    store.removeFavorites([1])
    expect(store.getFavorites()).toEqual([2])
    expect(listener).toHaveBeenCalledTimes(1)

    store.removeFavorites([99])
    expect(listener).toHaveBeenCalledTimes(1)
  })

  it("descarta valores no numéricos guardados", async () => {
    writeJson(STORAGE_KEYS.favorites, [1, "x", null, 3])
    const store = await loadStore()

    expect(store.getFavorites()).toEqual([1, 3])
  })
})

describe("carrito", () => {
  it("agrega, incrementa y decrementa cantidades", async () => {
    const store = await loadStore()

    store.addToCart(11)
    expect(store.getCart()).toEqual([{ instrumentoId: 11, cantidad: 1 }])

    store.addToCart(11)
    expect(store.getCart()).toEqual([{ instrumentoId: 11, cantidad: 2 }])

    store.incrementCartItem(11)
    expect(store.getCart()).toEqual([{ instrumentoId: 11, cantidad: 3 }])

    store.decrementCartItem(11)
    expect(store.getCart()).toEqual([{ instrumentoId: 11, cantidad: 2 }])
  })

  it("quita la línea al decrementar desde 1", async () => {
    const store = await loadStore()
    store.addToCart(11)

    store.decrementCartItem(11)

    expect(store.getCart()).toEqual([])
  })

  it("no hace nada al decrementar un ítem ausente", async () => {
    const store = await loadStore()
    const listener = vi.fn()
    store.subscribe(listener)

    store.decrementCartItem(99)

    expect(store.getCart()).toEqual([])
    expect(listener).not.toHaveBeenCalled()
  })

  it("removeFromCart, removeCartItems y clearCart", async () => {
    const store = await loadStore()
    store.addToCart(1)
    store.addToCart(2)
    store.addToCart(3)

    store.removeFromCart(1)
    expect(store.getCart().map((i) => i.instrumentoId)).toEqual([2, 3])

    store.removeCartItems([2, 99])
    expect(store.getCart().map((i) => i.instrumentoId)).toEqual([3])

    store.clearCart()
    expect(store.getCart()).toEqual([])
  })

  it("normaliza cantidades inválidas y descarta ítems sin id", async () => {
    writeJson(STORAGE_KEYS.cart, [
      { instrumentoId: 1, cantidad: 0 },
      { instrumentoId: 2, cantidad: -4 },
      { instrumentoId: 3, cantidad: "3" },
      { cantidad: 5 },
      null,
    ])
    const store = await loadStore()

    expect(store.getCart()).toEqual([
      { instrumentoId: 1, cantidad: 1 },
      { instrumentoId: 2, cantidad: 1 },
      { instrumentoId: 3, cantidad: 3 },
    ])
  })
})

describe("parseShipping", () => {
  it.each([
    ["G", 0],
    ["P", 0],
    ["0", 0],
    ["2000", 2000],
    ["-5", 0],
    ["abc", 0],
    ["", 0],
  ])("interpreta %s como %s", (input, expected) => {
    expect(parseShipping(input)).toBe(expected)
  })
})
