# Scripts legacy (no usar)

Estos scripts SQL (01-08) son inconsistentes con el modelo JPA actual
(faltaban `product_images` y columnas con guion bajo). Se conservan solo
como referencia historica.

Usar en su lugar:
- `backend/db/schema.sql` (generado con `pg_dump --schema-only` desde `instrumentosdb`)
- `backend/db/seed.sql` (generado con `pg_dump --data-only --inserts`)

Base de datos objetivo: `symphoniac`.