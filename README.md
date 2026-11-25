# Symphoniac

Tienda de instrumentos musicales: catálogo con búsqueda y filtros, detalle de
producto, panel de administración y API REST con imágenes y pedidos.

Monorepo con el frontend (React + Vite) y el backend (Spring Boot + PostgreSQL).

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | React 18, TypeScript 5, Vite 5, React Router 6 |
| Backend | Java 17, Spring Boot 3.5, Spring Data JPA, Bean Validation |
| Base de datos | PostgreSQL |
| Build | npm / Maven (wrapper incluido) |

## Estructura

```
symphoniac/
  frontend/   Aplicación React (Vite). Páginas: catálogo, detalle, admin, ubicación.
  backend/    API REST Spring Boot + scripts SQL en backend/scripts/.
  docker-compose.yml   PostgreSQL local.
```

## Requisitos

- Node.js 18+
- Java 17+
- PostgreSQL 14+ (o Docker)

## Cómo correrlo

1. **Base de datos** (opcional con Docker):

   ```bash
   docker compose up -d
   ```

   Luego aplicá el esquema y los datos de ejemplo:

   ```bash
   psql -h localhost -U postgres -d instrumentosdb -f backend/scripts/02-crear-tablas.sql
   psql -h localhost -U postgres -d instrumentosdb -f backend/scripts/03-insertar-datos-json.sql
   psql -h localhost -U postgres -d instrumentosdb -f backend/scripts/06-crear-tablas-pedidos.sql
   psql -h localhost -U postgres -d instrumentosdb -f backend/scripts/07-datos-prueba-pedidos.sql
   ```

2. **Backend** (puerto 3001):

   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```

3. **Frontend** (puerto 5173, con proxy `/api` y `/images` hacia el backend):

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Variables de entorno

El backend toma la conexión de `DB_URL`, `DB_USER` y `DB_PASSWORD` (ver
`backend/src/main/resources/application.properties`). No se versionan valores
reales; usá `.env.example` como referencia.

## API (resumen)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/instrumentos` | Listado (con paginación opcional) |
| GET | `/api/instrumentos/{id}` | Detalle |
| POST/PUT/DELETE | `/api/instrumentos/{id}` | Alta, edición y baja |
| GET | `/api/instrumentos/buscar?nombre=` | Búsqueda por nombre |
| GET | `/api/instrumentos/categoria/{id}` | Filtro por categoría |
| GET/POST/PUT/DELETE | `/api/categorias` | CRUD de categorías |
| GET/POST/DELETE | `/api/pedidos` | Pedidos |
| POST | `/api/images/upload/{instrumentoId}` | Subida de imágenes |

## Estado

- Catálogo, detalle, administración (CRUD + imágenes) y API: funcionales.
- Carrito: el botón existe en el detalle pero todavía no está conectado; el
  backend ya expone `/api/pedidos`.

## Origen

Proyecto desarrollado por Agustín Sandoval para Laboratorio de Computación 4
(UTN Facultad Regional Mendoza, 2025) y luego reorganizado como monorepo.
