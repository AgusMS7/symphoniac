# Configuración

Symphoniac se levanta con Docker Compose o en modo híbrido con Node y Java en el
host. Este documento cubre requisitos, perfiles, variables, resolución
build-time/runtime y secretos. El deploy planificado está en
[deployment.md](deployment.md).

## Requisitos

| Modo | Requisitos |
|---|---|
| Docker completo | Docker Engine + Compose v2 |
| Híbrido | Docker (o PostgreSQL 17 local), Node `^20.19.0 || >=22.12.0`, Java 17+ |
| Tests backend | Docker (Testcontainers levanta `postgres:17`) |
| Tests E2E | Docker + Node + Chromium de Playwright |

En Docker completo no hacen falta Node, Java ni PostgreSQL en el host: la base,
el backend y el frontend corren en contenedores. El puerto público por defecto es
`8081`; la API (`3001`) y PostgreSQL (`5432`) no se publican al host.

## Perfiles

| Perfil | Backend | Frontend | Efecto |
|---|---|---|---|
| `default` | `SPRING_PROFILES_ACTIVE=default` | `VITE_DEMO=false` | Escrituras reales y subida de imágenes habilitadas |
| `demo` | `SPRING_PROFILES_ACTIVE=demo` | `VITE_DEMO=true` | Lectura real; escrituras 405; uploads deshabilitados |

`application-demo.properties` define `app.images.upload-enabled=false`.
`DemoReadOnlyFilter` (anotado `@Profile("demo")`) responde 405 a cualquier método
distinto de GET/HEAD/OPTIONS sobre `/api/**`.

Docker Compose usa `demo` por defecto:

```yaml
SPRING_PROFILES_ACTIVE: ${SPRING_PROFILES_ACTIVE:-demo}
VITE_DEMO: ${VITE_DEMO:-true}
```

Para levantar con escrituras reales en local, hay que cambiar ambos valores y
reconstruir el frontend (Vite hornea `VITE_DEMO` en el bundle):

```powershell
$env:SPRING_PROFILES_ACTIVE="default"
$env:VITE_DEMO="false"
docker compose up -d --build
```

No uses `default` contra una base con datos que no quieras modificar: el panel
queda abierto y las escrituras se persisten.

## Matriz de variables

| Variable | Dónde | Requerida | Default | Propósito |
|---|---|---|---|---|
| `DB_USER` | Compose/backend | Sí | `postgres` | Usuario de PostgreSQL |
| `DB_PASSWORD` | Compose/backend | Sí | — | Password de PostgreSQL |
| `DB_URL` | Backend | Sí | `jdbc:postgresql://127.0.0.1:5432/symphoniac` | Conexión JDBC |
| `PORT` | Backend | No | `3001` | Puerto del backend |
| `FRONT_PORT` | Compose | No | `8081` | Puerto del frontend en el host |
| `CORS_ALLOWED_ORIGINS` | Backend | No | `http://localhost:3000,http://localhost:5173,...` | Orígenes permitidos |
| `UPLOAD_DIR` | Backend | No | `public/images` | Directorio de uploads |
| `SPRING_PROFILES_ACTIVE` | Backend | No | `demo` en Compose | Perfil `demo` o `default` |
| `VITE_API_URL` | Frontend (build) | No | `/api` | Base de la API |
| `VITE_IMAGES_URL` | Frontend (build) | No | `/images` | Base de imágenes |
| `VITE_DEMO` | Frontend (build) | No | `true` en Compose | Selecciona el backend local |

En Docker, `docker-compose.yml` fija `DB_URL=jdbc:postgresql://db:5432/symphoniac`
y `UPLOAD_DIR=/app/uploads`. En el host, `application.properties` usa
`127.0.0.1:5432` y `public/images`.

Los `.env.example` documentan los nombres; los `.env` reales no se versionan.
Nunca pongas secretos en variables `VITE_*`: se incluyen en el JavaScript
público.

## Build-time vs runtime

| Tipo | Variables | Cuándo se resuelven |
|---|---|---|
| Build del frontend | `VITE_API_URL`, `VITE_IMAGES_URL`, `VITE_DEMO` | `npm run build` / build args de Docker |
| Runtime del backend | `DB_*`, `PORT`, `CORS_ALLOWED_ORIGINS`, `UPLOAD_DIR`, `SPRING_PROFILES_ACTIVE` | Al arrancar el contenedor o el proceso |
| Runtime de Compose | `DB_USER`, `DB_PASSWORD`, `FRONT_PORT` | `docker compose up` |

Cambiar una `VITE_*` exige reconstruir la imagen del frontend. En Vercel, se
configuran en Project Settings y se redeploya. Cambiar una variable del backend
solo requiere reiniciar el servicio.

## Modos de ejecución

### Docker completo

```bash
docker compose up -d --build
```

Abre `http://localhost:8081`. El esquema y el seed se aplican cuando el volumen
`pgdata` se inicializa por primera vez.

### Híbrido

1. Exponé los puertos internos de `db` y `backend` en `docker-compose.yml` (o usá
   un PostgreSQL local).
2. Copiá `backend/.env.example` a `backend/.env` y ajustá `DB_URL`, `DB_USER` y
   `DB_PASSWORD`.
3. Copiá `frontend/.env.example` a `frontend/.env.local` y ajustá
   `VITE_API_URL`/`VITE_IMAGES_URL` si hace falta.
4. Ejecutá `.\mvnw.cmd spring-boot:run` en `backend` y `npm run dev` en
   `frontend` (Vite en `5173`, proxy a `3001`).

### Deploy

Render + Neon + Vercel. Es un estado planificado, no verificado; ver
[deployment.md](deployment.md).

## Inicialización de la base

`docker-compose.yml` monta `backend/db/` en
`/docker-entrypoint-initdb.d`. PostgreSQL ejecuta `schema.sql` y `seed.sql` solo
si el volumen está vacío. Con `spring.jpa.hibernate.ddl-auto=validate`, el
backend no crea tablas: si el esquema no existe, falla al arrancar.

- No hay migraciones versionadas ni `IF NOT EXISTS` en `schema.sql`.
- No ejecutes `psql` con `schema.sql` sobre una base ya inicializada: fallará
  por objetos existentes.
- `docker compose down -v` borra `pgdata` y fuerza un seed limpio en el próximo
  `up`. Es destructivo: no lo uses sobre datos que quieras conservar.
- `backend/scripts/legacy/` contiene scripts históricos; no es el setup actual.

## Secretos

- `.env` y `.env.*` están ignorados, salvo `.env.example`.
- `DB_PASSWORD` debe ser una contraseña local generada; el default `postgres`
  de Compose es solo para desarrollo y no debe reutilizarse.
- No se commitean tokens, claves ni credenciales.
- En deploy, las variables se cargan en el panel de Render/Neon/Vercel.
- Si una credencial se expuso, se rota y se actualiza en el entorno; el historial
  del repo no se reescribe sin autorización.

## Comandos útiles

```bash
docker compose config --quiet
docker compose up -d --build
docker compose ps
docker compose logs -f backend
docker compose down          # conserva volúmenes
docker compose down -v       # borra pgdata y uploads (destructivo)
```

Ver [troubleshooting.md](troubleshooting.md) para fallas de arranque y
[testing.md](testing.md) para los comandos de test.
