type Listener = () => void

const listeners = new Set<Listener>()

/** Avisa que el catálogo remoto cambió y conviene volver a consultarlo. */
export function emitCatalogUpdated(): void {
  listeners.forEach((listener) => listener())
}

export function subscribeCatalogUpdated(listener: Listener): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
