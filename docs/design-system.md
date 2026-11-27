# Design system — Symphoniac

> Documento de referencia de la UI de producción. La fuente única de tokens es
> `frontend/src/index.css`; este archivo explica cómo se usan y qué decisiones
> hay detrás. Si hay divergencia, manda el CSS y hay que actualizar este doc.

## Estado de aprobación

La dirección B · Escenario fue aprobada por el usuario (2026-11-26); el registro
en la ficha y en `decisions.md` lo hace el analyst en el post-merge. La
combinación tipográfica (Bricolage Grotesque + IBM Plex Mono + Inter), la paleta
actual y los assets Unsplash también están aprobados por el usuario. Este
documento describe la identidad implementada; no la cambia.

## Principios

- **Escenario, no vidriera genérica.** Fondo profundo, luz naranja puntual,
  tipografía editorial y metadatos técnicos. La UI tiene que sentirse como una
  tienda de instrumentos con criterio, no como una plantilla de shadcn.
- **Contraste y jerarquía antes que decoración.** Superficies, bordes y escala
  tipográfica ordenan; el naranja se reserva para acción, precio y foco.
- **Movimiento al servicio de la lectura.** Transiciones cortas, revelados
  suaves y nada que bloquee la interacción. Todo respeta
  `prefers-reduced-motion`.
- **Mobile first y contenido real.** El layout se prueba desde 360 px; los
  estados vacíos, de carga y error son parte del sistema, no un parche.
- **Accesibilidad verificable.** Foco visible, labels, nombres accesibles,
  contraste AA en texto y errores anunciados.
- **Base abierta.** shadcn/ui (Radix) + Tailwind v4 + bloques free de
  shadcnspace. Sin componentes Pro, sin fuentes ni assets sin licencia.

## Dirección visual

La dirección elegida es **B · Escenario**, con los acentos mono que aportaba la
dirección C. En producción se traduce en:

- fondo casi negro con superficies apenas más claras;
- naranja `#ff7f32` como única luz de acción;
- display Bricolage Grotesque para titulares;
- IBM Plex Mono para metadatos, etiquetas, numeración y detalles técnicos;
- Inter para lectura y controles;
- una grilla/grano/spotlight muy sutiles, solo como atmósfera;
- bordes finos y radios contenidos; sin modo claro.

La ruta `/design-preview` es temporal y no define el sistema final. La dirección
A (serif Fraunces) y la C (geometría más recta) no se usan en producción.

## Tokens

### Tipografía

Definidos en `@theme` de `frontend/src/index.css`:

| Token | Valor | Uso |
|---|---|---|
| `--font-sans` | `"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif` | cuerpo, labels, controles |
| `--font-display` | `"Bricolage Grotesque", "Inter", sans-serif` | titulares, precios, nombres de producto |
| `--font-heading` | `var(--font-display)` | alias para primitivas shadcn |
| `--font-mono` | `"IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, monospace` | metadatos, tracking, numeración, detalles |

### Color

Paleta única, sin modo claro. `color-scheme: dark` y la clase `.dark` activan
los variants oscuros de shadcn.

| Token | Valor | Uso |
|---|---|---|
| `--background` | `#09090c` | fondo de página |
| `--foreground` | `#f7f7fb` | texto principal |
| `--card` | `#121218` | tarjetas y paneles |
| `--card-foreground` | `#f7f7fb` | texto sobre tarjeta |
| `--popover` | `#14141a` | menús, selects, sheets |
| `--popover-foreground` | `#f7f7fb` | texto sobre popover |
| `--primary` | `#ff7f32` | CTA, foco, precio, acento |
| `--primary-foreground` | `#0f0f0f` | texto sobre naranja |
| `--secondary` | `#b87333` | cobre de apoyo, uso puntual |
| `--secondary-foreground` | `#0f0f0f` | texto sobre cobre |
| `--muted` | `#1a1a22` | superficies apagadas, skeletons |
| `--muted-foreground` | `#a3a3b2` | texto secundario y metadatos |
| `--accent` | `#1a1a22` | hover/estado de controles |
| `--accent-foreground` | `#f7f7fb` | texto sobre accent |
| `--destructive` | `#ef4444` | errores y acciones destructivas |
| `--success` | `#10b981` | confirmaciones |
| `--warning` | `#f59e0b` | advertencias |
| `--border` | `#2a2a35` | bordes de componentes |
| `--input` | `#2a2a35` | borde de campos |
| `--ring` | `#ff7f32` | anillo de foco |
| `--radius` | `0.75rem` | radio base de 12 px |

También existen `--chart-1..5` y los tokens `--sidebar-*` para las primitivas
que los consumen; no son una paleta paralela, sino variantes de los mismos
valores.

### Radios

Derivados de `--radius` en `@theme inline`:

| Clase | Cálculo | Valor |
|---|---|---|
| `rounded-sm` | `0.6 × 12px` | 7.2 px |
| `rounded-md` | `0.8 × 12px` | 9.6 px |
| `rounded-lg` | `12px` | 12 px |
| `rounded-xl` | `1.4 × 12px` | 16.8 px |
| `rounded-2xl` | `1.8 × 12px` | 21.6 px |
| `rounded-3xl` | `2.2 × 12px` | 26.4 px |
| `rounded-4xl` | `2.6 × 12px` | 31.2 px |

Uso observado: `rounded-full` para botones, badges y paginación; `rounded-2xl`
para cards e imágenes; `rounded-xl` para campos, paneles y filas del carrito.

### Sombras

No hay tokens propios de sombra. La profundidad se construye con superficies,
bordes y `backdrop-blur`; las primitivas usan las sombras de Tailwind:

- `shadow-sm`: tab activo.
- `shadow-md`: popover, select y navigation menu.
- `shadow-lg`: sheet/drawer, barra sticky de compra y botón de volver arriba.

El `box-shadow` de `.dp-frame` pertenece solo a `/design-preview` y no es parte
del sistema de producción.

### Helpers CSS

- `.grain-overlay`: textura de ruido sutil, usada en el hero con opacidad baja.
- `.hero-stage` / `.hero-spotlight`: variables y gradiente radial para el
  spotlight del hero.
- `.ambient-stage` / `.ambient-spotlight`: spotlight fijo del shell.
- `@media (prefers-reduced-motion: reduce)`: desactiva scroll suave, animaciones
  y transiciones globales.

## Tipografía

### Roles

- **Display**: Bricolage Grotesque. Titulares de página, hero, precios y nombres
  de producto. Se importa en 400, 600 y 700; el uso dominante es 600.
- **Cuerpo**: Inter 300–800. Descripciones, labels, botones y navegación.
- **Mono**: IBM Plex Mono 400–600. Prefijos (`Administración`), categorías,
  numeración, tracking, detalles técnicos y metadatos.

### Escala observada

| Nivel | Clases de referencia | Ejemplo |
|---|---|---|
| Hero | `text-5xl sm:text-6xl lg:text-8xl`, `leading-[0.9]`, `tracking-[-0.04em]` | titular del hero |
| Título de página | `text-3xl sm:text-4xl`, `tracking-tight` | Admin, Productos |
| Sección | `text-2xl sm:text-3xl`, `leading-tight` | secciones de Home |
| Card | `text-lg` / `text-xl`, `leading-tight` | producto, carrito |
| Cuerpo | `text-sm` / `text-base`, `leading-relaxed` | descripciones |
| Metadato | `text-[9px]` / `text-[10px]`, `uppercase`, `tracking-[0.14em..0.3em]` | categorías, IDs, labels |
| Botón | `text-sm`; `text-xs` en acciones compactas | CTA, paginación |

La escala no es una lista cerrada: se usan utilidades de Tailwind y los tokens
de familia. Para cambios globales de familia, editar `index.css`, no los
componentes.

### Carga de fuentes

`index.css` importa las tres familias desde Google Fonts con `display=swap`.
`PreviewFonts` de `/design-preview` agrega Fraunces solo para la maqueta A; no
afecta la UI de producción.

## Espaciado y layout

- Unidad base: **4 px** (escala de Tailwind). Valores frecuentes: `gap-1.5`
  (6 px), `gap-2` (8 px), `gap-3` (12 px), `gap-4` (16 px), `gap-6` (24 px),
  `gap-8` (32 px).
- Contenedor principal: `max-w-6xl` (1152 px) con `px-4`; el contenido no se
  estira más allá.
- Formularios: `max-w-4xl` (InstrumentoForm) y `max-w-2xl` (CategoriaAdmin).
- Drawer: `sm:max-w-md` (448 px).
- Hero destacado: `max-w-sm` (384 px).
- Padding de página: `px-4 py-10`; hero `pb-16 pt-14 sm:pt-20 lg:pb-24
  lg:pt-24`.
- Grillas: catálogo `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`; skeletons de
  catálogo llegan a `xl:grid-cols-4`; admin de instrumentos
  `sm:grid-cols-2 lg:grid-cols-3`.
- Separación: `gap-x-6 gap-y-10` en catálogo; `gap-4` en formularios y filtros.

## Color en uso

- **Fondo y superficies**: `bg-background` para página; `bg-card` para cards;
  `bg-popover` para overlays; `bg-muted` para zonas apagadas.
- **Naranja**: `text-primary` en precios, labels activos y foco; `bg-primary`
  en CTA; `ring-ring` en foco.
- **Cobre**: `secondary` se usa como apoyo, no como segundo CTA.
- **Semánticos**: `destructive` en errores y eliminación; `success` en
  confirmaciones; `warning` en advertencias. No se usan como decoración.
- **Bordes**: `border-border` en campos; `border-border/60` para separadores
  suaves; `border-white/15` sobre imágenes oscuras.
- **Gradientes**: solo fades hacia `background` y el spotlight radial; no hay
  gradientes ornamentales en la UI de producción.

### Contraste

Calculado con luminancia relativa WCAG 2.1 sobre los tokens actuales:

| Par | Ratio | Nivel |
|---|---|---|
| `foreground` sobre `background` | 18.61:1 | AAA |
| `muted-foreground` sobre `background` | 7.99:1 | AAA |
| `muted-foreground` sobre `card` | 7.50:1 | AAA |
| `primary` sobre `background` | 7.89:1 | AAA |
| `primary-foreground` sobre `primary` | 7.61:1 | AAA |
| `destructive` sobre `background` | 5.28:1 | AA |
| `success` sobre `background` | 7.84:1 | AAA |
| `warning` sobre `background` | 9.26:1 | AAA |

`border` sobre `background` da 1.40:1: no se usa como único indicador de estado;
los estados se refuerzan con texto, ícono, fondo o anillo de foco. Es una
medición de tokens, no una auditoría completa de todas las combinaciones.

## Motion

Se usa `motion/react` (paquete `motion`), no una librería nueva. Regla: animar
entrada/salida y jerarquía, nunca listas largas ni interacción bloqueante.

| Caso | Comportamiento |
|---|---|
| Transición de página | `opacity` 0→1, `y` 8→0, `0.3s`, `easeOut`; `useReducedMotion` |
| Hero | `opacity` + `y` 18, `0.5s`, `easeOut`, delays 0.05–0.2 |
| Cards | `whileInView` una vez, `0.5s`, stagger `index * 0.06` |
| Agregar al carrito | cambio de label, `0.18s` |
| Paginación | `0.2s`; barra de progreso con spring 220/28 |
| Sheet / drawer | `200ms ease-in-out`, slide + fade; overlay `100ms` |
| Marquee | CSS lineal infinito; `40s` por defecto, pausa en hover |
| Number ticker | `requestAnimationFrame`, cubic ease-out, `2s` por defecto |
| Spotlight | `120ms linear`; solo mouse y sin reduced motion |

`prefers-reduced-motion` se respeta en todos los componentes que usan
`motion/react`. Además, el CSS global reduce animaciones y transiciones a
`0.01ms` y desactiva `scroll-behavior: smooth`.

## Iconografía

- Única librería: `lucide-react`.
- Tamaños habituales: `size-3`, `size-3.5`, `size-4`, `size-5`, `size-6`.
- Iconos decorativos llevan `aria-hidden="true"`.
- Botones solo-icono llevan `aria-label` explícito.
- No se usan emojis ni icon fonts.

## Accesibilidad

- **Skip link** en `AppShell`: “Saltar al contenido”, visible al foco.
- **Foco**: `focus-visible` con `ring-3`/`ring-2` y `ring-ring`; nunca se elimina
  el foco sin reemplazo.
- **Navegación**: `aria-current="page"` en links activos; `aria-pressed` en
  favoritos y galería; `aria-expanded`/`aria-controls` en controles Radix.
- **Formularios**: `Label` asociado por `htmlFor`; `aria-invalid` en el campo;
  el mensaje tiene `id` y `role="alert"`; el campo lo referencia con
  `aria-describedby`. Cubierto en `InstrumentoForm` y `CategoriaAdmin`.
- **Carga**: el carrito usa `role="status"`, `aria-live="polite"` y
  `aria-busy="true"`; la paginación anuncia página; “Agregar al carrito” tiene
  `aria-live`.
- **Errores**: `ErrorScreen` para fallos de página; `role="alert"` en el error
  del carrito y en errores de formulario.
- **Teclado**: Sheet, Dialog, AlertDialog, Select y Popover usan Radix y
  conservan foco, Escape y navegación por teclado.
- **Imágenes**: alt descriptivo para producto; `alt=""` + `aria-hidden` para
  imágenes decorativas; placeholder con etiqueta “Imagen de referencia”.
- **Contraste**: pares principales AA/AAA; ver tabla arriba.
- **Reduced motion**: ver sección Motion.

## Breakpoints

Tailwind por defecto; no hay breakpoints custom:

| Breakpoint | Ancho | Uso |
|---|---|---|
| base | <640 px | una columna, navbar con Sheet, admin en cards |
| `sm` | 640 px | dos columnas de catálogo, filtros en dos columnas |
| `md` | 768 px | tabla de categorías visible; cards móviles ocultas |
| `lg` | 1024 px | navbar desktop, catálogo en tres columnas, hero en dos |
| `xl` | 1280 px | variantes de skeletons/admin en cuatro columnas |
| `2xl` | 1536 px | sin cambios de layout; el contenedor sigue en `max-w-6xl` |

QA objetivo de Fase 6: 360, 390, 768, 1024 y 1440 px en las cinco páginas,
admin, drawer y paginación.

## Estados

| Estado | Patrón |
|---|---|
| Carga | `Skeleton` (`animate-pulse rounded-md bg-muted`) en Home, Productos, Admin y carrito; carrito con `role="status"` |
| Vacío | “Tu carrito está vacío”, “Sin pedidos”, “No hay categorías registradas”, “No se encontraron instrumentos...” |
| Error | `ErrorScreen` con detalle técnico y reintento; error de carrito con `role="alert"` |
| Éxito | `toast.success` de Sonner; estado “Agregado” en el botón; formulario se cierra tras guardar |
| Deshabilitado | `disabled:opacity-50`, `disabled:pointer-events-none`; cursor no permitido |
| Hover | card con `scale-[1.03]` en imagen y borde de acento; botones con `hover:bg-*` |
| Foco | anillo visible de 2–3 px con `ring-ring` |
| Selección | tabs, paginación, favoritos y galería con `aria-current`/`aria-pressed` |

## Procedencia de componentes

Base: shadcn/ui con Radix, preset `radix-nova`, CSS variables, iconos Lucide.
Las primitivas viven en `frontend/src/components/ui/` y son MIT.

Bloques de shadcnspace usados y verificados como **free** (`meta.isPro: false`
en el registry, consultado 2026-11-26):

| Bloque | Archivo local | Fuente | Estado | Adaptación |
|---|---|---|---|---|
| `hero-01` | `components/shadcn-space/blocks/hero-01/hero.tsx` | `https://shadcnspace.com/r/hero-01.json` | free | Reescrito con tokens, asset propio, spotlight, featured card y reduced motion; sin `@iconify/react` |
| `marquee` | `components/shadcn-space/animations/marquee.tsx` | `https://shadcnspace.com/r/marquee-01.json` (también incluido en `hero-01`) | free | Keyframes renombrados a `symphoniac-*`, pausa en hover y reduced motion |
| `number-ticker` | `components/shadcn-space/number-ticker/number-ticker.tsx` | `https://shadcnspace.com/r/number-ticker-01.json` | free | Agrega `useReducedMotion`; conserva count-up con `requestAnimationFrame` |

No se usa ningún bloque shadcnspace Pro. Si en el futuro se incorpora un bloque
nuevo, verificar `meta.isPro` antes de copiarlo y registrar la fuente acá.

Imágenes: `frontend/public/site/hero-stage.jpg` y
`placeholder-instrument.jpg` son de Unsplash; licencia y URLs en
`../frontend/public/site/CREDITS.md`.

## Rendimiento

Medición con `npm run build` el 2026-11-26. El “antes” se ejecutó desde
`origin/main` (`ac2782e`) en un directorio temporal, reutilizando el mismo
`node_modules`; el “después” es el build de esta rama.

| Medición | Módulos | JS entry | JS entry gzip | JS total emitido | CSS |
|---|---:|---:|---:|---:|---:|
| Antes (`origin/main`) | 2754 | 713.34 kB | 228.38 kB | 713.34 kB | 90.87 kB (14.44 kB gzip) |
| Después (Fase 6) | 2770 | 603.79 kB | 198.70 kB | 747.00 kB | 117.99 kB (18.21 kB gzip) |

El entry después es la suma de `index` + vendors:

| Chunk | Sin gzip | Gzip |
|---|---:|---:|
| `index` | 265.54 kB | 82.81 kB |
| `ui-vendor` | 180.01 kB | 61.12 kB |
| `motion-vendor` | 125.44 kB | 42.92 kB |
| `react-vendor` | 32.80 kB | 11.85 kB |
| **Entry total** | **603.79 kB** | **198.70 kB** |

Rutas lazy después: `Home` 39.77 kB, `Admin` 29.19 kB, `Productos` 10.59 kB,
`DetalleInstrumento` 10.45 kB, `DondeEstamos` 3.78 kB, más chunks chicos de
`InstrumentoCard`, `ErrorScreen`, `select` y `card`. `DesignPreview` (37.00 kB)
es temporal y se elimina en Fase 10.

Lectura: el entry inicial baja de 713.34 a 603.79 kB (−15.4%) y de 228.38 a
198.70 kB gzip (−13.0%). El total emitido sube a 747.00 kB porque se suman
motion y los bloques nuevos; el resto se carga bajo demanda. El chunk más
grande es `index` (265.54 kB), por debajo del umbral de 500 kB de Vite.

## Cómo evolucionar el sistema

1. Cambiar tokens globales en `frontend/src/index.css`; no hardcodear colores,
   familias ni radios en componentes.
2. Reutilizar primitivas de `components/ui/` y componentes de `components/shop/`
   antes de crear variantes.
3. Mantener los estados de carga, vacío, error y éxito en cada flujo nuevo.
4. Verificar foco, labels, contraste y reduced motion antes de cerrar un cambio.
5. Actualizar este documento si cambia un token, un breakpoint o la procedencia
   de un bloque.

## Referencias

- Tokens y tema: `frontend/src/index.css`
- Primitivas: `frontend/src/components/ui/`
- Layout: `frontend/src/components/layout/`
- Catálogo y tienda: `frontend/src/components/shop/`
- Créditos de imágenes: `frontend/public/site/CREDITS.md`
