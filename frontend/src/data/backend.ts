import { IS_DEMO } from "./config"
import { demoBackend } from "./demoBackend"
import { remoteBackend } from "./remoteBackend"
import type { DataBackend } from "./types"

/**
 * Selector único de backend. En modo demo se usa el backend local con
 * overlay sobre el catálogo remoto; fuera de demo, el backend real.
 */
export const backend: DataBackend = IS_DEMO ? demoBackend : remoteBackend
