# Symphoniac

> Tienda de instrumentos musicales: catálogo con búsqueda y filtros, detalle de
> producto, panel de administración y API REST con imágenes y pedidos.

Monorepo con el frontend (React + Vite) y el backend (Spring Boot + PostgreSQL).
Se levanta completo con Docker Compose; la aplicación queda en
`http://localhost:8081`.

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | React 19, TypeScript 5.9, Vite 7, React Router 6 |
| Backend | Java 17, Spring Boot 3.5.x, Spring Data JPA, Bean Validation |
| Base de datos | PostgreSQL 17+ |
| Orquestación | Docker Compose (DB + backend + frontend) |
| Build local | npm / Maven (wrapper incluido) |

## Estructura

```
symphoniac/
  frontend/   Aplicación React (Vite). Páginas: catálogo, detalle, admin, ubicación.
  backend/    API REST Spring Boot + SQL reproducible en backend/db/.
  docker-compose.yml   Levanta DB, backend y frontend.
```

## Requisitos

- Docker con Compose v2: camino recomendado, levanta todo el stack.
- Para desarrollo híbrido sin contenedores: Node.js `^20.19.0 || >=22.12.0` y
  Java 17+, además de exponer los puertos indicados más abajo.

## Cómo correrlo

El stack completo se levanta con un solo comando:

```bash
docker compose up -d --build
```

Abrí **`http://localhost:8081`**. El puerto del host lo define `FRONT_PORT`
(default `8081`). Verificación rápida: `curl http://localhost:8081/api/instrumentos`
responde `200`.

La base de datos y la API **no se publican en el host**: viven en la red interna
de Compose (`db:5432` y `backend:3001`). Eso evita conflictos con un PostgreSQL
local y reduce la superficie expuesta. El esquema y los datos se aplican una sola
vez, cuando el volumen se inicializa desde `backend/db/schema.sql` y
`backend/db/seed.sql`.

Para bajar y borrar los volúmenes (incluida la DB):

```bash
docker compose down -v
```

Después de `down -v`, la próxima inicialización vuelve a aplicar `schema.sql` y
`seed.sql`. No corras `psql` sobre esa base: `schema.sql` no usa `IF NOT EXISTS`
y volver a aplicarlo fallaría con "relation already exists".

### Desarrollo híbrido (opcional)

Si querés correr backend o frontend fuera de Docker, primero exponé en
`docker-compose.yml` el puerto interno que necesites (`5432:5432` para la DB,
`3001:3001` para la API) y después:

```bash
cd backend && ./mvnw spring-boot:run        # API en 3001
cd frontend && npm install && npm run dev   # front en 5173, proxy /api y /images
```

Sin esos mapeos, los procesos locales no pueden alcanzar `db` ni `backend`: esos
nombres solo resuelven dentro de la red de Compose.

## Variables de entorno

Solo nombres; los valores reales no se versionan.

| Archivo | Variable | Propósito |
|---|---|---|
| `.env` (raíz) | `DB_USER`, `DB_PASSWORD` | Usuario y password de PostgreSQL al crear el volumen |
| `.env` (raíz) | `FRONT_PORT` | Puerto del frontend en el host (default `8081`) |
| `backend/.env.example` | `DB_URL`, `DB_USER`, `DB_PASSWORD`, `PORT`, `CORS_ALLOWED_ORIGINS`, `UPLOAD_DIR` | Configuración del backend en desarrollo local |
| `frontend/.env.example` | `VITE_API_URL`, `VITE_IMAGES_URL` | Bases de API e imágenes; en Docker usan `/api` e `/images` |

Los `.env.example` están versionados; los `.env` reales, no.

## API

La API REST expone instrumentos, categorías, pedidos e imágenes.

| Recurso | Endpoints |
|---|---|
| Instrumentos | `GET /api/instrumentos` (paginación opcional) · `GET /api/instrumentos/{id}` · `POST /api/instrumentos` · `PUT /api/instrumentos/{id}` · `DELETE /api/instrumentos/{id}` · `GET /api/instrumentos/buscar?nombre=` · `GET /api/instrumentos/categoria/{id}` |
| Categorías | `GET /api/categorias` · `GET /api/categorias/{id}` · `GET /api/categorias/search?denominacion=` · `POST /api/categorias` · `PUT /api/categorias/{id}` · `DELETE /api/categorias/{id}` |
| Pedidos | `GET /api/pedidos` · `GET /api/pedidos/{id}` · `GET /api/pedidos/fecha?fecha=YYYY-MM-DD` · `POST /api/pedidos` · `DELETE /api/pedidos/{id}` |
| Imágenes | `POST /api/images/upload/{instrumentoId}` · `GET /api/images/{filename}` · `GET /api/images/instrumento/{instrumentoId}` · `GET /api/images/instrumento/{instrumentoId}/primary` · `PUT /api/images/{imageId}/primary` · `DELETE /api/images/{imageId}` |

Implementados en `backend/src/main/java/com/symphoniac/controller/`.

## Calidad

```bash
cd frontend && npm ci && npm run build && npm run lint   # frontend
cd backend && ./mvnw -DskipTests package                 # backend (Windows: .\mvnw.cmd)
```

Tests automáticos: un `contextLoads` en el backend; sin tests de frontend ni CI
todavía.

## Estado

- **Docker local:** el stack completo levanta con
  `docker compose up -d --build` y responde en `http://localhost:8081`. Sin
  deploy público.
- **Imágenes:** la galería, la imagen principal y la subida están implementadas.
  Los datos semilla cubren 10 de 30 referencias; las 20 restantes caen al
  placeholder `/icons/no-image.svg`. Se aceptan placeholders por ahora.
- **Carrito y favoritos:** los botones existen en el detalle pero no están
  conectados; el backend ya expone `/api/pedidos`.
- **Admin:** el panel está abierto, sin autenticación.

## Origen

Desarrollado por Agustín Sandoval como trabajo práctico de Laboratorio de
Computación 4 (UTN Facultad Regional Mendoza, 2025). La licencia no está
declarada en el repositorio.
