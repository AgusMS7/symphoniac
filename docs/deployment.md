# Despliegue

> **Estado: planificado.** Este documento describe el deploy previsto para la
> Fase 9 del proyecto. No hay URL pública verificada todavía y nada de lo que
> sigue debe leerse como un hecho consumado. La verificación real, con URLs y
> resultados, se agrega al cerrar esa fase.

## Objetivo

Publicar una demo de solo lectura con tres servicios:

| Pieza | Plataforma | Rol |
|---|---|---|
| Base de datos | Neon (PostgreSQL) | Datos del catálogo |
| Backend | Render (Docker) | API Spring Boot |
| Frontend | Vercel (Vite) | SPA estática |

El frontend queda en un dominio distinto del backend, así que CORS y las URLs
absolutas de API e imágenes son parte central del plan.

## Neon

Plan:

1. Crear un proyecto y una base `symphoniac`.
2. Aplicar `backend/db/schema.sql` y `backend/db/seed.sql` con el SQL editor o
   `psql`. El backend usa `ddl-auto=validate` y no crea tablas.
3. Usar la cadena de conexión con `sslmode=require`.
4. Para runtime con pooling, usar la cadena pooled de Neon y verificar el límite
   de conexiones del plan.
5. Guardar `DB_URL`, `DB_USER` y `DB_PASSWORD` como variables del backend, nunca
   en el repo.

Caveats a verificar en Fase 9:

- El plan free suspende la base por inactividad; el primer acceso puede tardar.
- La cadena directa y la pooled no son intercambiables sin probar.
- El seed es de demo; no hay migraciones incrementales.
- Conviene un backup o un dump antes de cambios de esquema.

## Render

Plan:

1. Crear un Web Service desde el repositorio, con `backend/Dockerfile`.
2. Configurar `DB_URL`, `DB_USER`, `DB_PASSWORD`, `PORT`,
   `CORS_ALLOWED_ORIGINS`, `UPLOAD_DIR` y `SPRING_PROFILES_ACTIVE=demo`.
3. Health check: `GET /api/instrumentos` (200).
4. Verificar que el contenedor arranque con el esquema ya aplicado en Neon.

Caveats:

- El plan free duerme el servicio; el cold start es aceptado y no se usa
  keep-warm.
- El filesystem es efímero: un upload se pierde en un redeploy. La demo ya
  deshabilita la subida, así que no es un requisito funcional; si se quisiera
  persistir, haría falta un disco o almacenamiento externo.
- El contenedor corre como usuario no root y escucha en `PORT`.
- Revisar memoria y tiempo de build del plan free.

## Cold start, snapshot y logs

El backend free se suspende por inactividad y el primer request puede tardar
hasta ~60 segundos. El frontend espera 8 segundos; si la API no responde, usa el
snapshot estático de `frontend/src/data/demoSnapshot.json` (30 instrumentos y 5
categorías) y sus imágenes en `frontend/public/site/instruments/`. El snapshot
no se guarda en `localStorage` y se reemplaza automáticamente cuando el backend
conecta.

Logs esperables en la consola del navegador:

- `[symphoniac] Catálogo cargado desde el backend`: la API respondió.
- `[symphoniac] Backend no disponible; usando snapshot estático`: se activó el
  fallback tras 8 segundos o por error de red/HTTP/JSON.
- `[symphoniac] Backend conectado; catálogo actualizado desde el backend`: el
  backend despertó y reemplazó el snapshot.
- `[symphoniac] Error al conectar con el backend`: detalle del fallo; los
  reintentos siguen cada 15 segundos mientras se muestra el snapshot.

## Vercel

Plan:

1. Importar el repo y configurar el root en `frontend`.
2. Framework: Vite. Build: `npm run build`. Output: `dist`.
3. Variables de entorno de build:
   - `VITE_API_URL=https://<backend>/api`
   - `VITE_IMAGES_URL=https://<backend>/images`
   - `VITE_DEMO=true`
4. El rewrite de SPA ya está versionado en `frontend/vercel.json` para que
   `/productos`, `/admin` y `/instrumento/:id` no devuelvan 404 al refrescar:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

5. Redeployar después de cambiar cualquier `VITE_*`: se hornean en el bundle.

Caveats:

- Sin rewrite, un refresh en una ruta interna devuelve 404.
- `VITE_DEMO=true` es lo que activa el overlay local; si falta, la demo intenta
  escribir contra el backend y recibe 405.
- El frontend estático no tiene SSR ni SEO de contenido; no es el objetivo.

## CORS

`CORS_ALLOWED_ORIGINS` del backend debe incluir el origen exacto de Vercel
(por ejemplo, `https://<proyecto>.vercel.app`) y, si se agrega un dominio propio,
también ese. `WebConfig` habilita credenciales, así que no se puede usar `*`.
El origen de preview de Vercel cambia por deploy; si se prueba una preview, hay
que agregarla o usar el dominio estable.

## Límites de los planes free

| Servicio | Límite esperado | Impacto |
|---|---|---|
| Neon free | Suspensión por inactividad, conexiones limitadas | Primer request lento; cuidar el pool |
| Render free | Suspensión por inactividad, CPU/memoria acotadas | Cold start; sin keep-warm |
| Vercel Hobby | Builds y bandwidth acotados | Suficiente para una demo de portfolio |

Los valores exactos se confirman en Fase 9. No se promete disponibilidad ni
rendimiento de producción.

## Rollback

- **Vercel:** promover un deployment anterior desde el panel.
- **Render:** volver a un deploy anterior de la imagen o al commit previo.
- **Neon:** restaurar desde un backup o aplicar un dump previo; el esquema y el
  seed están versionados en `backend/db/`.
- Después de un rollback, verificar health, `GET /api/instrumentos` (30),
  `/images/<archivo>` (200), CORS y refresh de una ruta interna.

## Checklist de Fase 9

- [ ] Neon creado; `schema.sql` y `seed.sql` aplicados.
- [ ] Backend en Render con variables y perfil `demo`.
- [ ] `GET https://<backend>/api/instrumentos` responde 200 con 30.
- [ ] `GET https://<backend>/images/acoustic-guitar.jpg` responde 200.
- [ ] Frontend en Vercel con `VITE_*` absolutas y `VITE_DEMO=true`.
- [ ] CORS permite el origen de Vercel.
- [ ] Refresh de `/productos` y `/admin` no da 404.
- [ ] Escritura directa a la API responde 405.
- [ ] Chip "Demo" visible y cambios guardados en `localStorage`.
- [ ] URL pública agregada al README y a la ficha del proyecto.
- [ ] Capturas o smoke test del deploy real.

Hasta que este checklist esté verificado, el README no debe incluir un link de
demo. Ver [configuration.md](configuration.md) para las variables y
[troubleshooting.md](troubleshooting.md) para los errores esperables.
