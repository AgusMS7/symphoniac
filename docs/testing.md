# Pruebas

## Cobertura

### Backend

- **Unitarios de servicio** (`InstrumentoServiceTest`, Mockito): resolución de la
  categoría desde la relación o desde `idCategoria`, y error de negocio cuando la
  categoría no existe.
- **Controller slice** (`@WebMvcTest`, `InstrumentoControllerTest`): `POST` y
  `PUT` devuelven `400` cuando la categoría no existe.
- **Integración** (`@SpringBootTest` + Testcontainers con `postgres:17`):
  `InstrumentoApiIntegrationTest` valida el esquema y el seed reales (30
  instrumentos, búsqueda, filtro por categoría, detalle, `404`, validación `400`,
  categorías e imágenes); `DemoReadOnlyIntegrationTest` valida el perfil demo
  (`405` en escrituras, lecturas e imágenes disponibles); `contextLoads` verifica
  el arranque del contexto.
- La base es efímera: `backend/db/schema.sql` y `backend/db/seed.sql` se copian
  al contenedor en cada corrida. No se toca ninguna base existente.

### Frontend

- **Unitarios**: `storage` (claves y serialización), `localStore`
  (favoritos/carrito/envío), `overlay` (fusión de cambios locales),
  `remoteBackend` (fetch mockeado), `demoBackend` (CRUD demo con
  `remoteBackend` mockeado), `backend` (selección demo/remote según `IS_DEMO`)
  e `imageUtils` (URL, alt, placeholder y carga segura).
- **Componentes** (Testing Library + jsdom): `InstrumentoCard`, `cart-drawer`
  (estado vacío, líneas, envío gratis y con costo, total y acciones) e
  `InstrumentoForm` (validación, precarga y payload de alta/edición).

### E2E

Playwright contra el stack demo (`docker compose`, `VITE_DEMO=true`) en
`http://localhost:8081`:

- catálogo: home, 30 instrumentos paginados, búsqueda y filtro por categoría;
- detalle y carrito: alta al carrito y checkout deshabilitado en demo;
- favoritos: marcar, filtrar por favoritos y persistencia al recargar;
- reset de la demo: borra favoritos y carrito y vuelve al catálogo del backend;
- admin: listado, alta local del formulario (overlay) y verificación de que el
  backend sigue con 30 instrumentos;
- fallback de una imagen inexistente del seed.

## Política anti-flaky

- Sin sleeps ni timeouts fijos en los tests: se espera el estado visible con el
  auto-wait de Playwright (URL, headings, badges, conteos de filas/artículos).
- El único polling acotado es el del CI para levantar el stack: reintenta
  frontend/API hasta 60 veces con 5 s entre intentos y falla mostrando los logs
  si no responde.
- Reintentos solo en CI (`retries: 2`) y workers acotados (`workers: 2`); en
  local no hay reintentos.
- Datos semilla deterministas: 30 instrumentos, 10 por página y los conteos de
  búsqueda/filtro (4/5) son contrato del seed, no valores incidentales.
- `reducedMotion: "reduce"` en `playwright.config.ts` para estabilizar las
  animaciones de `motion/react`.
- Cada test E2E corre en un contexto limpio (localStorage vacío); el reset de la
  demo se cubre explícitamente.

## Comandos

Backend (requiere Docker para Testcontainers):

```bash
cd backend
./mvnw verify          # Windows: .\mvnw.cmd verify
```

Frontend:

```bash
cd frontend
npm ci
npm run lint
npm run test
npm run build
```

E2E (requiere el stack demo levantado):

```bash
docker compose up -d --build
cd frontend
npx playwright install chromium
npm run test:e2e
docker compose down -v
```

`E2E_BASE_URL` permite apuntar a otra URL; el default es
`http://localhost:8081`.

## CI

`.github/workflows/ci.yml` corre en push a `main` y en pull requests:

| Job | Qué ejecuta |
|---|---|
| `backend` | JDK 17 (Temurin), cache Maven y `sh ./mvnw -B verify` |
| `frontend` | Node 22, cache npm, `npm ci`, `npm audit --audit-level=high`, lint, tests y build |
| `e2e` | Node 22, cache npm, cache de browsers de Playwright (`~/.cache/ms-playwright`), Chromium, `docker compose build`, `docker compose up -d`, espera de frontend/API y `npm run test:e2e`; sube `playwright-report` y baja el stack siempre |

El workflow declara `permissions: contents: read` a nivel global. No hay un job
`docker` separado: la decisión Opción C deja el build de imágenes como pasos
explícitos dentro de `e2e` (`docker compose build` y luego `docker compose up -d`),
así que `e2e` es el gate de Docker.

El job `e2e` depende de `backend` y `frontend`. Para bloquear el merge, los tres
jobs deben marcarse como requeridos en la protección de rama del repositorio.

## Huecos

- Sin regresión visual ni comparación de capturas.
- El CRUD de escritura contra el backend no se prueba en E2E: el stack de CI
  levanta el perfil demo, de solo lectura. El alta del admin se verifica solo en
  el overlay local, con el backend intacto (30 instrumentos).
- Sin E2E de subida o eliminación de imágenes (requiere modo no demo y
  almacenamiento).
- Sin umbral de cobertura ni reporte de coverage.
- El contrato de categorías (DTO con `instrumentos`) queda fuera del alcance de
  esta fase.
- 20 de las 30 imágenes del seed no existen: el fallback está cubierto, no la
  carga real de esas imágenes.
