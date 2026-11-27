# Límites conocidos

Symphoniac es una demo de portfolio, no un producto listo para operar. Esta es
la lista explícita de lo que no hace, para no confundir el alcance con una
promesa de producción.

## Autenticación y administración

- **No hay login ni autenticación.** La ruta `/admin` está abierta en local y no
  hay usuarios, roles ni sesiones.
- **El panel local es abierto.** En modo `default` cualquiera con acceso al
  entorno puede crear, editar y borrar datos.
- **La demo es de solo lectura.** El perfil `demo` responde 405 a escrituras y
  deshabilita la subida de imágenes. Los cambios del panel se guardan en
  `localStorage`, no en PostgreSQL.
- **No es un backoffice seguro.** No hay auditoría, permisos ni protección de
  datos de administración.

## Compra y pedidos

- **No hay checkout ni pagos.** El botón de compra informa "No disponible para
  demo"; no se procesan tarjetas ni pedidos.
- **Carrito y favoritos son locales.** Viven en `localStorage`; no se sincronizan
  entre dispositivos ni se envían al backend.
- **Los pedidos existen solo en la API.** `PedidoController` permite crear,
  listar y borrar pedidos, pero el frontend no crea pedidos ni muestra un flujo
  de compra. La pestaña "Mis pedidos" lee solo datos locales.
- **Sin stock real.** El catálogo es ficticio y no reserva unidades.

## Datos e imágenes

- **Imágenes de stock.** Las 30 imágenes de seed son fotografías de Pexels con
  licencia libre, no productos reales; los precios y marcas son ficticios. Ver
  [créditos](../backend/src/main/resources/static/images/CREDITS.md).
- **Sin email.** No se envían correos de confirmación, recuperación ni contacto.
  El formulario de contacto de la demo es informativo.
- **Sin i18n.** La interfaz está en español; no hay selector de idioma ni
  traducciones.
- **Uploads efímeros en deploy.** En local el volumen `uploads` persiste; en un
  deploy free el filesystem puede perderse en un redeploy. La demo deshabilita
  la subida, así que no es un flujo crítico.
- **Sin miniaturas ni pipeline de imágenes.** Se sirven los archivos tal como se
  guardan; no hay conversión, `Range` ni CDN propio.

## Búsqueda y catálogo

- **Búsqueda, filtro, orden y paginación en cliente.** La API tiene endpoints de
  búsqueda, filtro y paginación, pero el catálogo actual trae la lista completa y
  resuelve todo en el navegador.
- **30 instrumentos y 5 categorías.** No hay "miles de productos" ni pruebas de
  escala.
- **Sin SSR ni SEO de contenido.** Es una SPA; el HTML inicial no trae el
  catálogo.
- **Sin pruebas de carga.** No hay métricas de concurrencia ni de latencia bajo
  carga.

## Modelo y persistencia

- **Columnas duplicadas.** `instrumento` conserva `cantidadvendida` y
  `cantidad_vendida`; el campo legacy `imagen` convive con `product_images`.
- **Sin migraciones versionadas.** El esquema y el seed se aplican al inicializar
  un volumen vacío; no hay Flyway/Liquibase ni cambios incrementales.
- **Un solo backend.** No hay microservicios, colas ni workers.
- **Sin versionado de API ni OpenAPI generado.** El contrato se mantiene a mano
  en [api.md](api.md).

## Interfaz y calidad

- **Solo modo oscuro.** No hay tema claro.
- **Capturas de escritorio.** El diseño se verificó en breakpoints, pero las
  capturas del README son de escritorio; no hay set mobile.
- **Sin regresión visual automatizada.** Los E2E son funcionales; no comparan
  imágenes.
- **Sin cobertura mínima obligatoria.** Hay 120 tests, pero no un umbral de
  cobertura que bloquee el CI.
- **`/design-preview` es temporal.** Es una maqueta de la fase de diseño, no una
  ruta del producto; se retira en la limpieza final.

## Deploy

- **Sin URL pública todavía.** El deploy Render + Neon + Vercel está planificado
  y se verifica en la Fase 9. Ver [deployment.md](deployment.md).
- **Límites de planes free.** Cold start, suspensión por inactividad y
  conexiones acotadas; no hay keep-warm.
- **CORS y URLs absolutas.** Al separar frontend y backend, hay que configurar
  origen permitido y `VITE_API_URL`/`VITE_IMAGES_URL` en build.
- **Sin observabilidad de producción.** No hay métricas, tracing ni alertas.

## Qué haría falta para acercarse a producción

Autenticación y autorización, migraciones, backups y monitoreo, checkout y
pagos reales, gestión de stock, almacenamiento persistente de imágenes,
internacionalización, pruebas de carga, acuerdos de nivel de servicio y una
política de privacidad. Nada de eso está en el alcance actual.

Ver [architecture.md](architecture.md) para el diseño y
[testing.md](testing.md) para lo que sí está cubierto.
