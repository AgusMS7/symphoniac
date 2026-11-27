# Tests

La suite cubre backend, frontend y flujo E2E. Los números vigentes son 22 tests
de backend, 89 de frontend y 9 E2E: 120 en total. Este documento explica qué
cubre cada capa, cómo correrla y qué queda afuera.

## Resumen

| Capa | Herramienta | Cantidad | Qué valida |
|---|---|---|---|
| Backend | JUnit + Mockito + MockMvc + Testcontainers | 22 | Contrato REST, persistencia real, validación y demo 405 |
| Frontend | Vitest + Testing Library + jsdom | 89 | Servicios, overlay, storage, componentes y fallback |
| E2E | Playwright (Chromium) | 9 | Catálogo, admin, detalle, carrito, favoritos, reset y fallback |

## Backend

Los tests de integración usan **Testcontainers** con `postgres:17` y copian
`backend/db/schema.sql` y `backend/db/seed.sql` al directorio de inicialización.
Así se valida el esquema real con `ddl-auto=validate`, no una aproximación con
H2. Cada clase levanta su propio contenedor.

| Clase | Tests | Foco |
|---|---|---|
| `SymphoniacBackendApplicationTests` | 1 | Carga de contexto |
| `InstrumentoServiceTest` | 4 | Normalización de categoría y `BusinessException` |
| `InstrumentoControllerTest` | 2 | `WebMvcTest`: error de negocio a 400 |
| `InstrumentoApiIntegrationTest` | 9 | Listado, búsqueda, filtro, detalle, 404, validación, categorías e imágenes |
| `DemoReadOnlyIntegrationTest` | 6 | Perfil `demo`: GET permitido y POST/PUT/DELETE con 405 |

Comandos:

```powershell
cd backend
.\mvnw.cmd verify
```

En Linux/macOS o CI:

```bash
cd backend
sh ./mvnw -B verify
```

Docker debe estar corriendo. Testcontainers descarga y arranca `postgres:17`; la
primera ejecución puede tardar.

## Frontend

Vitest corre con `jsdom` y Testing Library. Los tests viven junto al código
(`*.test.ts`, `*.test.tsx`) y cubren:

- `services/api` y el selector `data/backend.ts` (remoto vs demo).
- `data/remoteBackend.ts`, `data/demoBackend.ts`, `data/overlay.ts`,
  `data/localStore.ts` y `data/storage.ts`.
- `InstrumentoCard`, `cart-drawer` e `InstrumentoForm`.
- `utils/imageUtils.ts` y el fallback de imágenes.

Comandos:

```bash
cd frontend
npm ci
npm run test        # una corrida
npm run test:watch  # modo watch
```

El coverage no tiene umbral obligatorio. El objetivo es cubrir la lógica de
datos y los componentes con más riesgo, no perseguir un porcentaje.

## E2E

Playwright corre contra el stack demo en `http://localhost:8081`. La configuración
usa Chromium, `reducedMotion: "reduce"`, `trace` en el primer reintento y
screenshot solo en fallo. En CI hay 2 reintentos y 2 workers; localmente corre
sin reintentos.

| Archivo | Tests | Flujo |
|---|---|---|
| `catalog.spec.ts` | 4 | Home, 30 instrumentos paginados de a 10, búsqueda y filtro |
| `admin.spec.ts` | 1 | Lista, crea un instrumento local y verifica que el backend sigue con 30 |
| `detail-cart.spec.ts` | 1 | Detalle, agregar al carrito y checkout deshabilitado |
| `favorites.spec.ts` | 1 | Favorito, filtro y persistencia al recargar |
| `reset.spec.ts` | 1 | Borrar datos demo y volver al catálogo |
| `image-fallback.spec.ts` | 1 | 404 deliberado de una imagen y fallback al placeholder |

El fallback no depende de que falte una imagen real del seed: el test intercepta
la request de `acoustic-guitar.jpg` y responde 404. Así el seed puede estar
completo sin romper el caso.

```bash
docker compose up -d --build
cd frontend
npx playwright install chromium   # primera vez
npm run test:e2e
```

La URL se puede cambiar con `E2E_BASE_URL`.

## CI

`.github/workflows/ci.yml` tiene tres jobs:

1. **backend**: Java 17, `sh ./mvnw -B verify` (Testcontainers usa Docker del
   runner).
2. **frontend**: Node 22, `npm ci`, `npm audit --audit-level=high`, lint, tests y
   build.
3. **e2e**: Node 22, `npm ci`, instala Chromium, `docker compose build` y
   `up -d`, espera frontend/API, corre Playwright y sube el reporte; al final
   baja el stack con `down -v`.

El job E2E depende de backend y frontend. El PR debe quedar verde en los tres.

## Anti-flaky

- Seed determinista y Testcontainers por clase.
- Playwright con `reducedMotion` y contextos nuevos por test.
- El fallback usa un 404 explícito, no una imagen faltante del seed.
- Sin esperas arbitrarias: se usan expectativas de Playwright.
- Reintentos solo en CI; localmente un fallo se ve de inmediato.
- Sin regresión visual: comparar capturas con motion y fuentes sería frágil y no
  aporta al alcance.
- `forbidOnly` en CI evita que un `test.only` deje la suite incompleta.

## Huecos

- No hay umbral de cobertura ni reporte obligatorio.
- No hay regresión visual automatizada.
- Solo se prueba Chromium; no hay Safari/Firefox ni viewport mobile.
- No hay pruebas de carga, estrés ni concurrencia.
- No hay tests de autenticación porque no existe auth.
- No hay smoke test del deploy real; se verifica en Fase 9.
- No hay contrato OpenAPI ni tests de contrato entre frontend y backend.
- Algunos controllers y servicios no tienen unit tests propios; se cubren por
  integración.

Ver [configuration.md](configuration.md) para requisitos y
[troubleshooting.md](troubleshooting.md) para fallas de Testcontainers o del
stack E2E.
