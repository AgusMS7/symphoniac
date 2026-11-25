import { imageService } from "../services/api";
import type { ProductImage } from "../types/Instrumento";

/**
 * Obtiene la URL de una imagen con fallbacks apropiados
 */
export const getImageUrl = (
  primaryImage?: ProductImage | null,
  legacyImage?: string | null,
  fallbackUrl: string = "/icons/no-image.svg",
): string => {
  // Prioridad 1: Imagen principal del nuevo sistema
  if (primaryImage && primaryImage.imageUrl) {
    return imageService.getImageUrl(primaryImage.imageUrl);
  }

  // Prioridad 2: Campo imagen legacy
  if (legacyImage && legacyImage.trim() !== "") {
    return imageService.getImageUrl(legacyImage);
  }

  // Fallback: imagen por defecto
  return fallbackUrl;
};

/**
 * Maneja errores de carga de imágenes de manera consistente
 */
export const handleImageError = (
  event: React.SyntheticEvent<HTMLImageElement>,
  instrumentoId?: number,
  fallbackUrl: string = "/icons/no-image.svg",
) => {
  const target = event.currentTarget;

  // Evitar loops infinitos de error
  if (target.src !== fallbackUrl) {
    target.src = fallbackUrl;
  }
};

/**
 * Carga imagen principal con manejo de errores mejorado
 */
export const loadPrimaryImageSafely = async (
  instrumentoId: number,
  onSuccess: (image: ProductImage) => void,
  onComplete?: () => void,
): Promise<void> => {
  try {
    const response = await imageService.getPrimary(instrumentoId);

    if (response.success && response.data) {
      onSuccess(response.data);
    } else {
      // No hay imagen principal configurada, esto es normal
    }
  } catch (error) {
    // Error de conexión o servidor, registrar silenciosamente
  } finally {
    onComplete?.();
  }
};

/**
 * Obtiene alt text apropiado para una imagen
 */
export const getImageAltText = (
  primaryImage?: ProductImage | null,
  instrumentName?: string,
  fallback: string = "Imagen del instrumento",
): string => {
  if (primaryImage && primaryImage.altText) {
    return primaryImage.altText;
  }

  if (instrumentName) {
    return `Imagen de ${instrumentName}`;
  }

  return fallback;
};
