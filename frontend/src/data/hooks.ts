import { useEffect, useRef, useSyncExternalStore } from "react"

import { IS_DEMO } from "./config"
import { subscribeCatalogUpdated } from "./events"
import {
  getCart,
  getFavorites,
  getOrders,
  subscribe,
  type CartItem,
  type LocalOrder,
} from "./localStore"

export function useIsDemo(): boolean {
  return IS_DEMO
}

export function useFavorites(): number[] {
  return useSyncExternalStore(subscribe, getFavorites, getFavorites)
}

export function useCart(): CartItem[] {
  return useSyncExternalStore(subscribe, getCart, getCart)
}

export function useOrders(): LocalOrder[] {
  return useSyncExternalStore(subscribe, getOrders, getOrders)
}

/** Ejecuta el callback cuando el catálogo remoto cambió en segundo plano. */
export function useCatalogUpdated(callback: () => void): void {
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => subscribeCatalogUpdated(() => callbackRef.current()), [])
}
