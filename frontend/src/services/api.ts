import { backend } from "../data/backend"

/**
 * Fachada pública de datos. Las páginas y componentes siguen importando los
 * mismos servicios; el selector de backend decide si se usa el remoto o el
 * backend local de demo (localStorage + overlay sobre el catálogo remoto).
 */
export const instrumentoService = backend.instrumentoService
export const categoriaService = backend.categoriaService
export const imageService = backend.imageService
