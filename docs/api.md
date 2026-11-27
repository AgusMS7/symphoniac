# API

La API REST vive bajo `/api` y usa JSON. En Docker, Nginx expone el mismo origen
que la SPA; en desarrollo híbrido, Vite proxya `/api` al backend. La base de la
API se configura con `VITE_API_URL` (default `/api`).

Referencia de arquitectura y modelo: [architecture.md](architecture.md).
Variables y perfiles: [configuration.md](configuration.md).

## Sobre de respuesta

La mayoría de los endpoints responde:

```json
{
  "success": true,
  "message": "Instrumentos obtenidos exitosamente",
  "data": []
}
```

`ApiResponse<T>` tiene `success` (boolean), `message` (string) y `data` (T o
null). Las excepciones controladas usan el mismo sobre con `success: false`.

### Excepción: listado paginado

`GET /api/instrumentos?paginated=true` devuelve un `Page` de Spring, sin sobre:

```json
{
  "content": [],
  "totalElements": 30,
  "totalPages": 3,
  "size": 10,
  "number": 0
}
```

Sin `paginated=true` (default `false`), el mismo endpoint devuelve la lista
completa dentro de `ApiResponse.data`.

## Códigos y errores

| Código | Cuándo | Cuerpo |
|---|---|---|
| 200 | Lectura o actualización correcta | `ApiResponse` |
| 201 | Creación correcta | `ApiResponse` |
| 400 | Validación de Bean Validation | `success:false`, `data` con `{campo: mensaje}` |
| 400 | Regla de negocio (`BusinessException`) | `success:false`, `message` |
| 404 | Recurso inexistente | `success:false`, `message` |
| 405 | Escritura en perfil `demo` | `{"success":false,"message":"Modo demo: solo lectura","data":null}` |
| 500 | Error no controlado | `success:false`, `message` genérico |

`GlobalExceptionHandler` traduce validación, `ResourceNotFoundException`,
`BusinessException`, `NoResourceFoundException` y excepciones genéricas. Algunos
métodos de `InstrumentoController` capturan excepciones y responden 500 con un
mensaje propio; el sobre se mantiene.

## Validación

| Recurso | Campo | Regla |
|---|---|---|
| Instrumento | `instrumento`, `marca`, `modelo` | `@NotBlank` |
| Instrumento | `precio` | `@NotNull`, `@Positive` |
| Categoría | `denominacion` | `@NotBlank`, máximo 100 |
| Pedido | `instrumentos` | `@NotNull`, `@NotEmpty`, `@Valid` |
| Ítem | `instrumentoId` | `@NotNull` |
| Ítem | `cantidad` | `@NotNull`, `@Positive` |

Los errores de validación se agrupan por campo en `data`.

## Endpoints

### Instrumentos (7)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/instrumentos` | Lista; acepta `page`, `size`, `sortBy`, `sortDir`, `paginated` |
| GET | `/api/instrumentos/{id}` | Detalle por ID |
| POST | `/api/instrumentos` | Crea un instrumento |
| PUT | `/api/instrumentos/{id}` | Actualiza un instrumento |
| DELETE | `/api/instrumentos/{id}` | Elimina un instrumento |
| GET | `/api/instrumentos/categoria/{categoriaId}` | Filtra por categoría |
| GET | `/api/instrumentos/buscar?nombre=` | Busca por nombre (contiene, sin distinguir mayúsculas) |

Parámetros de paginación: `page` (default 0), `size` (default 10), `sortBy`
(default `id`), `sortDir` (default `asc`), `paginated` (default `false`). El
frontend actual pagina en el cliente y usa `getAllSimple`; la paginación de
servidor queda disponible como contrato.

### Categorías (6)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/categorias` | Lista ordenada por denominación |
| GET | `/api/categorias/{id}` | Detalle |
| POST | `/api/categorias` | Crea |
| PUT | `/api/categorias/{id}` | Actualiza |
| DELETE | `/api/categorias/{id}` | Elimina; falla si tiene instrumentos |
| GET | `/api/categorias/search?denominacion=` | Busca por denominación |

`Categoria` expone `id` y `denominacion`; `instrumentos` no se serializa
(`@JsonIgnore`).

### Pedidos (5)

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/pedidos` | Crea un pedido con `{instrumentos:[{instrumentoId,cantidad}]}` |
| GET | `/api/pedidos` | Lista pedidos con detalles |
| GET | `/api/pedidos/{id}` | Detalle |
| GET | `/api/pedidos/fecha?fecha=YYYY-MM-DD` | Pedidos de una fecha |
| DELETE | `/api/pedidos/{id}` | Elimina |

El pedido calcula el total con el precio actual de cada instrumento. El frontend
no crea pedidos: el carrito de la demo es local y el checkout está frenado.

### Imágenes (6)

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/images/upload/{instrumentoId}` | Sube una imagen (multipart) |
| GET | `/api/images/{filename}` | Devuelve un archivo de `UPLOAD_DIR` |
| GET | `/api/images/instrumento/{instrumentoId}` | Lista imágenes del instrumento |
| GET | `/api/images/instrumento/{instrumentoId}/primary` | Imagen principal o 404 |
| PUT | `/api/images/{imageId}/primary` | Marca una imagen como principal |
| DELETE | `/api/images/{imageId}` | Elimina una imagen |

### Health

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/` | Estado del backend y mapa de endpoints (no cuenta en los 24) |

## Imágenes: límites y entrega

- Tamaño máximo: 5 MB.
- Extensiones permitidas: `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`.
- Campos del multipart: `file` (obligatorio), `isPrimary` (default `false`),
  `altText` (opcional).
- El nombre en disco es un UUID con la extensión original.
- En el perfil `demo`, la subida responde 405 y la UI muestra
  "Deshabilitado para Demo".
- Las imágenes de seed se sirven por `/images/**` desde
  `classpath:/static/images/`; los uploads se sirven desde `UPLOAD_DIR`. El
  endpoint `/api/images/{filename}` resuelve `UPLOAD_DIR`, no el classpath.
- `Cache-Control: max-age=3600` en imágenes.

## CORS y cache

`WebConfig` habilita CORS solo para `/api/**`, con orígenes tomados de
`CORS_ALLOWED_ORIGINS` (separados por coma), métodos
`GET, POST, PUT, DELETE, OPTIONS`, headers `*`, credenciales y `maxAge=3600`.
En Docker el navegador usa el mismo origen y CORS no interviene; en deploy con
dominios separados hay que declarar el origen del frontend.

## Ejemplos

```bash
# Listado simple
curl http://localhost:8081/api/instrumentos

# Detalle
curl http://localhost:8081/api/instrumentos/11

# Búsqueda
curl "http://localhost:8081/api/instrumentos/buscar?nombre=Guitarra"

# Escritura en demo: 405
curl -i -X POST http://localhost:8081/api/instrumentos \
  -H "Content-Type: application/json" \
  -d '{"instrumento":"Demo","marca":"Demo","modelo":"Demo","precio":1}'
```

Para reproducir el 200 de escritura hay que levantar con el perfil `default` y
`VITE_DEMO=false`; ver [configuration.md](configuration.md).

## Límites conocidos del contrato

- La paginación de servidor no se usa desde el catálogo actual.
- Algunos métodos devuelven mensajes de error propios en vez de delegar en el
  handler global.
- No hay versionado de API ni documentación OpenAPI generada.
- La demo no permite escrituras; el contrato de escritura se prueba en local.

Ver [troubleshooting.md](troubleshooting.md) para errores frecuentes.
