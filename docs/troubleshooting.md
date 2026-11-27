# Resolución de problemas

Tabla de fallas frecuentes en local y en el deploy planificado. Antes de tocar
datos, recordá que `docker compose down -v` borra el volumen `pgdata` y los
uploads.

## Tabla síntoma / causa / solución

| Síntoma | Causa probable | Solución |
|---|---|---|
| `405` con `"Modo demo: solo lectura"` al guardar | Perfil `demo` activo; el backend bloquea escrituras | Es el comportamiento esperado. Para escrituras reales, levantar con `SPRING_PROFILES_ACTIVE=default` y `VITE_DEMO=false`, y reconstruir el frontend |
| Error de CORS en el navegador | El origen del frontend no está en `CORS_ALLOWED_ORIGINS` | Agregar el origen exacto (esquema, host y puerto) y reiniciar el backend. En Compose el default es `http://localhost:${FRONT_PORT:-8081}` |
| Imagen 404 y aparece "Imagen de referencia" | El nombre del seed no coincide con un archivo de `static/images/`, o el volumen se sembró con datos viejos | Verificar `seed.sql` contra la carpeta; `GET /images/<archivo>`; reconstruir el backend si cambiaste recursos; si el volumen ya estaba inicializado, recrearlo con `down -v` (destructivo) o actualizar la base |
| `relation "..." already exists` | Se ejecutó `schema.sql` sobre una base ya inicializada | No correr `schema.sql` a mano. Usar un volumen vacío o restaurar un dump; `ddl-auto=validate` no crea tablas |
| `port is already allocated` en 8081 | Otro proceso usa el puerto | Liberar el puerto o definir `FRONT_PORT=8082` y actualizar `CORS_ALLOWED_ORIGINS` |
| Testcontainers no arranca | Docker no está corriendo o el daemon no es accesible | Iniciar Docker Desktop; verificar `docker info`; correr `.\mvnw.cmd verify` con Docker activo |
| Refresh de `/productos` da 404 en Vercel | Falta el rewrite de SPA | Configurar `rewrites` de `/(.*)` a `/index.html` y redeployar |
| Uploads desaparecen tras un redeploy | Filesystem efímero de Render/Vercel; la demo además deshabilita uploads | En demo no se sube nada. Si se necesita persistencia, usar un disco o almacenamiento externo; en local el volumen `uploads` sobrevive a `down` pero no a `down -v` |
| El backend no conecta a la base | `DB_URL`, usuario o password incorrectos; la DB no está healthy | Revisar `docker compose ps` y `docker compose logs backend`; esperar el healthcheck; validar `DB_URL` |
| El frontend no encuentra la API | `VITE_API_URL` incorrecta o build args no aplicados | En Docker dejar `/api`; en Vercel usar la URL absoluta; reconstruir/redeployar tras cambiar `VITE_*` |
| `npm ci` falla por versión de Node | Vite 7 exige `^20.19.0 || >=22.12.0` | Usar Node 22 o superior; en CI ya está fijado |
| `mvnw` no ejecuta en Linux/macOS | Falta permiso de ejecución | `chmod +x mvnw` o `sh ./mvnw -B verify` |
| `/design-preview` no aparece en el router | Es una maqueta temporal montada por pathname | No es un bug; se retira en la fase de limpieza |

## Diagnóstico rápido

```bash
docker compose ps
docker compose logs --tail=120 backend
docker compose logs --tail=120 frontend
curl -i http://localhost:8081/api/instrumentos
curl -i http://localhost:8081/images/acoustic-guitar.jpg
curl -i -X POST http://localhost:8081/api/instrumentos \
  -H "Content-Type: application/json" -d '{}'
```

En Windows, para ver qué proceso ocupa un puerto:

```powershell
netstat -ano | findstr :8081
Get-Process -Id <PID>
```

## Base de datos

- `schema.sql` y `seed.sql` se ejecutan solo al crear el volumen.
- Si cambiás el seed y el volumen ya existe, la base no se actualiza sola.
- `docker compose down -v` es la vía destructiva para resembrar; no la uses si
  hay datos que conservar.
- Para inspeccionar sin modificar:

```bash
docker compose exec db psql -U "$DB_USER" -d symphoniac -c "select count(*) from instrumento;"
```

No ejecutes `schema.sql` ni `seed.sql` sobre una base existente sin revisar el
efecto: no son idempotentes.

## Tests

- Backend: requiere Docker para Testcontainers; el contenedor usa `postgres:17`.
- Frontend: `npm ci` antes de `npm run test`; Vitest corre en `jsdom`.
- E2E: requiere el stack en `http://localhost:8081`; Playwright usa Chromium.
- Si un E2E falla por una imagen, revisar que el archivo exista y que el test no
  dependa de un 404 del seed. El fallback se prueba interceptando la request.

Ver [configuration.md](configuration.md) para variables y
[known-limitations.md](known-limitations.md) para lo que queda fuera de alcance.
