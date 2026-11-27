# Arquitectura

Symphoniac es un monorepo full-stack: una SPA en React, una API REST en Spring
Boot y PostgreSQL 17, orquestados con Docker Compose. Este documento describe las
capas, el flujo de una request y el modelo de datos. El contrato de la API está
en [api.md](api.md); las variables y perfiles, en
[configuration.md](configuration.md).

## Vista general

```text
navegador
   |
   | http://localhost:8081
   v
nginx (contenedor frontend:8080)
   |-- /api/*    -> proxy -> backend:3001 -> JPA -> PostgreSQL:5432
   |-- /images/* -> proxy -> backend:3001 (uploads + classpath)
   +-- /*        -> SPA (index.html + assets)
```

En desarrollo híbrido, Vite corre en el host y proxya `/api` e `/images` a
`http://localhost:3001`; PostgreSQL puede correr en Docker o en el host. En
Docker, el backend y la base no publican puertos al host: solo se resuelven en la
red interna de Compose.

## Capas

| Capa | Ubicación | Responsabilidad |
|---|---|---|
| Presentación | `frontend/src/pages`, `components` | Rutas, UI, formularios, carrito y panel |
| Acceso a datos | `frontend/src/services/api.ts`, `data/` | Fachada, selector remoto/demo, overlay local |
| API | `backend/src/main/java/com/symphoniac/controller` | Endpoints REST y validación de entrada |
| Negocio | `service/` | Reglas, transacciones y conversión a DTO |
| Persistencia | `repository/`, `model/` | Spring Data JPA y entidades |
| Datos | `backend/db/schema.sql`, `seed.sql` | Esquema y datos reproducibles |
| Infraestructura | `docker-compose.yml`, Dockerfiles, `nginx.conf` | Red, build, proxy y healthchecks |

## Frontend

### Rutas

| Ruta | Página | Rol |
|---|---|---|
| `/` | `Home` | Hero, marquesina de marcas, destacados y números |
| `/productos` | `Productos` | Catálogo, búsqueda, filtro, orden y paginación |
| `/instrumento/:id` | `DetalleInstrumento` | Ficha, galería, categoría y acciones |
| `/donde-estamos` | `DondeEstamos` | Showroom, mapa y contacto |
| `/admin` | `Admin` | CRUD de instrumentos y categorías |

Las rutas se cargan con `lazy` y `Suspense`; el `AppShell` aporta navbar, footer,
skip link, spotlight y transición de página.

### Data layer

`services/api.ts` es la fachada pública: exporta `instrumentoService`,
`categoriaService` e `imageService` desde `data/backend.ts`. Ese selector elige
uno de dos backends según `VITE_DEMO`:

- `remoteBackend`: `fetch` contra `VITE_API_URL` (default `/api`) y
  `VITE_IMAGES_URL` (default `/images`). `getImageUrl` deja intactas las rutas
  locales (`/site/instruments/...`) y las URLs absolutas.
- `demoBackend`: intenta leer el catálogo remoto y aplica un overlay de
  escrituras en `localStorage`. Si el backend responde, cachea la base y sigue
  refrescándola en segundo plano cada 15 segundos. Si no responde en 8 segundos
  o falla por red, HTTP o JSON inválido, devuelve `data/demoSnapshot.json`
  memoizado en memoria y reintenta cada 15 segundos. El snapshot nunca se
  escribe en `localStorage`. Cuando el backend vuelve, `demoBackend` escribe el
  cache, limpia el snapshot y emite `emitCatalogUpdated()` para que las páginas
  se refresquen.

Claves del overlay: `symphoniac:v1:overlay:instrumentos`,
`symphoniac:v1:overlay:categorias`, `symphoniac:v1:meta`,
`symphoniac:v1:favorites`, `symphoniac:v1:cart`, `symphoniac:v1:orders` y
`symphoniac:v1:cache:catalogo`. Los IDs locales son negativos para no colisionar
con los del backend. El cache muestra el catálogo al instante y se refresca en
segundo plano cada 15 segundos.

El snapshot vive en `frontend/src/data/demoSnapshot.json` (30 instrumentos y 5
categorías) y sus imágenes en `frontend/public/site/instruments/`, generadas a
partir de `backend/db/seed.sql` y `backend/src/main/resources/static/images/`.
La UI usa `DataLoading` mientras espera y registra en consola si cargó desde el
backend o desde el snapshot.

### Estado local

Favoritos y carrito viven en `localStore.ts` con `useSyncExternalStore`. El
carrito calcula subtotal, envío y total; el envío se cobra una vez por línea y
`"G"`/`"P"` se interpretan como sin costo. El botón de compra informa que la
demo no procesa pagos. El panel de administración usa el mismo overlay para
crear, editar y borrar instrumentos y categorías.

## Backend

### Capas y flujo

```text
HTTP -> controller -> service -> repository -> PostgreSQL
                 \-> DTO <- conversión
```

- `controller/`: `InstrumentoController`, `CategoriaController`,
  `PedidoController`, `ImageController`, `HomeController`.
- `service/`: `InstrumentoService`, `CategoriaService`, `PedidoService`,
  `ProductImageService`.
- `repository/`: cinco repositorios Spring Data JPA.
- `dto/`: `ApiResponse`, `InstrumentoDTO`, `ProductImageDTO`, `PedidoDTO`,
  `PedidoDetalleDTO`, `CrearPedidoRequest`, `ItemCarritoDTO`.
- `exception/`: `GlobalExceptionHandler`, `BusinessException`,
  `ResourceNotFoundException`.
- `config/`: `WebConfig` (CORS y recursos estáticos) y `DemoReadOnlyFilter`
  (perfil `demo`).

`InstrumentoService.save` normaliza `categoria:{id}` e `idCategoria` antes de
persistir; esto corrigió el bug que dejaba `id_categoria` en null. Las respuestas
de instrumentos se convierten a `InstrumentoDTO`; las categorías exponen solo
`id` y `denominacion` porque `Categoria.instrumentos` tiene `@JsonIgnore`.

### Configuración relevante

- `spring.jpa.hibernate.ddl-auto=validate`: el esquema no se genera solo.
- `spring.jpa.open-in-view=false`: las entidades no se serializan fuera de la
  transacción.
- `server.port=${PORT:3001}`.
- CORS configurable por `CORS_ALLOWED_ORIGINS`.
- Uploads en `UPLOAD_DIR`; semilla en `classpath:/static/images/`.
- Hikari con `minimum-idle=0` e `idle-timeout=60000`.

## Modelo de datos

Cinco tablas en `backend/db/schema.sql`:

| Tabla | Rol | Relaciones |
|---|---|---|
| `categoria_instrumento` | Categorías (Cuerda, Viento, Percusión, Teclado, Electrónico) | 1:N con `instrumento` |
| `instrumento` | Producto | N:1 con categoría; 1:N con imágenes y detalles |
| `product_images` | Imágenes por instrumento | N:1 con instrumento; `is_primary` |
| `pedido` | Cabecera de pedido | 1:N con `pedido_detalle` |
| `pedido_detalle` | Ítems del pedido | N:1 con pedido y con instrumento |

El esquema incluye índices por categoría, marca, precio, fecha y claves foráneas.
`seed.sql` carga 30 instrumentos, 30 imágenes y 5 categorías, más pedidos y
detalles de ejemplo.

### Deuda del modelo

- `instrumento` conserva las columnas duplicadas `cantidadvendida` y
  `cantidad_vendida` (mapeadas a `cantidadVendida` y `cantidadVendidaAlt`).
- El campo legacy `imagen` convive con `product_images`; el frontend prioriza
  la imagen principal y usa `imagen` como fallback.
- No hay migraciones versionadas: el esquema se aplica solo al inicializar un
  volumen vacío. Los scripts históricos viven en `backend/scripts/legacy/`.

## API y endpoints

La API expone 24 endpoints de negocio; el `GET /` de `HomeController` es un
endpoint de estado y no se cuenta en ese número. El detalle de cada contrato
está en [api.md](api.md).

| Recurso | Endpoints |
|---|---|
| Instrumentos | 7 |
| Categorías | 6 |
| Pedidos | 5 |
| Imágenes | 6 |
| Total | 24 |

## Imágenes

Hay dos ubicaciones:

- `backend/src/main/resources/static/images/`: imágenes de seed versionadas,
  servidas desde el classpath del JAR.
- `UPLOAD_DIR` (en Docker `/app/uploads`): archivos subidos en runtime.

`WebConfig` registra `/images/**` con dos `resourceLocations`:
`file:${UPLOAD_DIR}/` y `classpath:/static/images/`, con cache de 3600 segundos.
El frontend arma la URL con `VITE_IMAGES_URL` y cae a
`/site/placeholder-instrument.jpg` si la imagen no carga.

En el perfil `demo`, `DemoReadOnlyFilter` bloquea cualquier método no seguro
sobre `/api/**` con 405 y `application-demo.properties` deshabilita la subida
(`app.images.upload-enabled=false`). La demo no escribe archivos ni filas.

## Decisiones y deuda

- Nginx como único origen evita CORS en el navegador y simplifica el deploy.
- El perfil `demo` es una defensa de backend; el frontend guarda en el navegador.
- Los DTOs y el sobre `ApiResponse` mantienen estable el contrato.
- La paginación existe en el backend, pero el catálogo actual filtra, ordena y
  pagina en el cliente.
- Faltan migraciones formales, autenticación y un flujo de compra.
- `docs/deployment.md` describe el deploy planificado, no uno verificado.

Ver también [configuration.md](configuration.md),
[testing.md](testing.md) y [known-limitations.md](known-limitations.md).
