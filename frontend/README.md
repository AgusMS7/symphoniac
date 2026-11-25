# symphoniac-frontend

Frontend de Symphoniac: catálogo con búsqueda y filtros, detalle de producto y
panel de administración. React 19 + Vite 7 + TypeScript 5.9.

## Requisitos

- Node.js `^20.19.0 || >=22.12.0` (requisito de Vite 7)

## Comandos

```bash
npm install     # instalar dependencias
npm run dev     # servidor de desarrollo (http://localhost:5173)
npm run build   # build de producción en dist/
npm run lint    # ESLint
```

## Proxy de desarrollo

`vite.config.ts` redirige `/api` y `/images` a `http://localhost:3001` (backend
Spring Boot), así el frontend consume la API sin problemas de CORS en desarrollo.

## Contexto

Monorepo: ver el [README raíz](../README.md) para el stack completo, la base de
datos y cómo correr backend + frontend. La documentación ampliada del frontend es
Fase 8.
