# Sistema de diseño

La interfaz sigue la dirección **B · Escenario**: fondo nocturno, naranja como
única luz de acción, tipografía editorial y metadatos en mono. El objetivo es que
el catálogo se sienta como un escenario, no como una plantilla genérica.

La fuente única de tokens es `frontend/src/index.css`. Si un valor no está ahí,
no es un token del sistema.

## Principios

- **Oscuro por decisión.** No hay modo claro; la clase `.dark` activa los
  variants y `color-scheme: dark` fija el navegador.
- **Un solo acento.** El naranja `#ff7f32` marca acción, foco y precio. El resto
  es jerarquía de grises.
- **Contenido primero.** La imagen y el nombre del instrumento mandan; la
  decoración (spotlight, grano) no compite.
- **Movimiento con propósito.** Transiciones cortas, sin animar listas largas ni
  bloquear la interacción.
- **Accesibilidad como requisito.** Foco visible, contraste, labels, teclado y
  `prefers-reduced-motion`.

## Tokens

Definidos en `:root` de `frontend/src/index.css`.

| Token | Valor | Uso |
|---|---|---|
| `--background` | `#09090c` | Fondo base |
| `--foreground` | `#f7f7fb` | Texto principal |
| `--card` / `--popover` | `#121218` / `#14141a` | Superficies |
| `--primary` | `#ff7f32` | Acción, foco, precio |
| `--primary-foreground` | `#0f0f0f` | Texto sobre naranja |
| `--secondary` | `#b87333` | Acento cálido secundario |
| `--muted` / `--accent` | `#1a1a22` | Fondos suaves |
| `--muted-foreground` | `#a3a3b2` | Texto secundario |
| `--destructive` | `#ef4444` | Errores y acciones destructivas |
| `--success` | `#10b981` | Confirmaciones |
| `--warning` | `#f59e0b` | Advertencias |
| `--border` / `--input` | `#2a2a35` | Bordes y controles |
| `--ring` | `#ff7f32` | Anillo de foco |
| `--radius` | `0.75rem` | Radio base (12 px) |

Los radios derivados (`--radius-sm` a `--radius-4xl`) se calculan desde
`--radius`. Los colores de gráficos (`--chart-1` a `--chart-5`) reutilizan la
paleta.

## Tipografía

| Rol | Fuente | Token | Uso |
|---|---|---|---|
| Display | Bricolage Grotesque | `--font-display` | Títulos y precios |
| Cuerpo | Inter | `--font-sans` | Texto, formularios y navegación |
| Metadatos | IBM Plex Mono | `--font-mono` | Etiquetas, categorías, códigos |

Se cargan desde Google Fonts con `display=swap`. El tracking amplio en mayúsculas
y los tamaños chicos (9-10 px) se reservan para metadatos; el cuerpo usa tamaños
legibles. No se usa Geist.

## Color y contraste

La paleta es oscura y de bajo ruido: fondos casi negros, texto claro y naranja
para la acción. El texto principal y los metadatos se eligieron para cumplir
AA/AAA en sus tamaños; el naranja se usa con texto oscuro (`--primary-foreground`)
y no como texto largo sobre fondo. Las verificaciones de contraste se hicieron
sobre la paleta final de la Fase 6.

## Movimiento

- `motion/react` para transición de página, hero, cards, drawer y toasts.
- Duraciones cortas (0.3 s de página, 0.5 s de cards) y `easeOut`.
- `useReducedMotion` en los componentes que animan; con reducción se desactiva
  el desplazamiento y se mantiene el cambio de estado.
- CSS/Tailwind para hovers y transiciones simples.
- No se animan listas largas ni se bloquea la interacción con animaciones.
- `prefers-reduced-motion` global reduce animaciones y transiciones a 0.01 ms.

## Accesibilidad

- Skip link "Saltar al contenido" en `AppShell`.
- Foco visible con `focus-visible` y anillo `--ring`.
- Labels explícitos en formularios; errores con `aria-describedby` y
  `role="alert"`.
- Botones de favorito y carrito con `aria-pressed` y `aria-label` descriptivo.
- Imágenes con `alt`; las decorativas usan `alt=""` y `aria-hidden`.
- Navegación por teclado en menú, drawer, selects y diálogos (Radix/shadcn).
- Contraste y jerarquía de encabezados revisados.
- `prefers-reduced-motion` respetado.

## Breakpoints

Se usan los breakpoints de Tailwind:

| Prefijo | Ancho | Uso típico |
|---|---|---|
| `sm` | 640 px | Dos columnas de cards |
| `md` | 768 px | Navegación desktop; tabla de admin |
| `lg` | 1024 px | Grillas de detalle y hero |
| `xl` | 1280 px | Cuatro columnas en catálogo |
| `2xl` | 1536 px | Aire adicional |

El layout se verificó en 5 anchos. Las capturas del README son de escritorio
(1440 x 900); no hay set mobile. En mobile, la navegación usa un `Sheet` y las
tablas de admin se convierten en filas.

## Componentes

- **shadcn/ui** sobre Radix: button, card, input, select, dialog, alert-dialog,
  sheet, tabs, table, badge, skeleton, tooltip, popover, sonner, carousel,
  pagination, form y otros.
- **Layout**: `app-shell`, `navbar`, `footer`, `cart-drawer`, `ScrollToTop`.
- **Catálogo**: `InstrumentoCard`, `FiltroCategoria`, `CatalogPagination`,
  `FeaturedCarousel`, `BrandMarquee`.
- **Admin**: `Admin`, `InstrumentoForm`, `CategoriaAdmin`.
- **Hero**: bloque `hero-01` reescrito con tokens, spotlight y reduced motion.
- **Iconos**: `lucide-react`.
- **Toasts**: `sonner`.

Regla de composición: usar la primitiva shadcn si existe; componer solo el layout
cuando no haya una. No se usan bloques Pro de shadcnspace.

## Rendimiento

- Rutas lazy con `Suspense` y skeleton.
- `manualChunks` separa `react-vendor`, `motion-vendor` y `ui-vendor`.
- Imágenes de cards con `loading="lazy"`; el detalle carga una imagen principal.
- Imágenes de seed a 960 x 1200 (4:5), JPEG progresivo de calidad 80 y menos de
  150 KB por archivo, salvo la guitarra acústica a 800 x 1000 para bajar peso.
- Fuentes con `display=swap`.
- La medición vigente del bundle (fecha, entry y gzip) está en la sección
  "Números y evidencia" del [README](../README.md).

## Cómo evolucionar

1. Cambiar tokens en `frontend/src/index.css`; no hardcodear colores en
   componentes.
2. Si falta una primitiva, agregarla con shadcn/ui y documentar su uso.
3. Mantener el modo oscuro y el acento único; un tema claro requiere una
   decisión de producto y una revisión de contraste.
4. Revisar `prefers-reduced-motion` y foco en cada componente nuevo.
5. Medir el bundle y el peso de imágenes antes de sumar assets.
6. Actualizar este documento cuando cambie un token, una fuente o un patrón de
   interacción.

Ver [architecture.md](architecture.md) para la capa de UI y
[known-limitations.md](known-limitations.md) para lo que el sistema no cubre.
