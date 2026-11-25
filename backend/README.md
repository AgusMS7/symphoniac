# 🎵 Sistema de Instrumentos Musicales - Backend API

Una API REST completa desarrollada con **Spring Boot 3** para la gestión integral de instrumentos musicales, categorías, imágenes y **sistema de pedidos**.

## 📋 Características Implementadas

- ✅ **CRUD completo** de instrumentos, categorías y **pedidos**
- ✅ **Sistema de imágenes** con upload y gestión avanzada
- ✅ **Sistema de pedidos** con múltiples instrumentos por pedido
- ✅ **Paginación y ordenamiento** para instrumentos
- ✅ **Búsqueda** por nombre de instrumento y categoría
- ✅ **Búsqueda de pedidos** por fecha
- ✅ **Validaciones** robustas de datos y relaciones
- ✅ **Manejo de errores** estructurado con códigos HTTP apropiados
- ✅ **Logging** detallado para debugging y monitoreo
- ✅ **CORS** configurado para desarrollo frontend
- ✅ **Base de datos PostgreSQL** con relaciones optimizadas

## 🛠️ Tecnologías Utilizadas

- **Java 17+**
- **Spring Boot 3.5.3**
- **Spring Data JPA**
- **PostgreSQL 17+**
- **Maven 3.6+**
- **Hibernate 6.6+**
- **Jackson** para serialización JSON
- **SLF4J + Logback** para logging
- **HikariCP** para pool de conexiones

## 🚀 Instalación y Configuración

### Prerrequisitos

```bash
# Verificar Java
java -version  # Debe ser 17 o superior

# Verificar Maven
mvn -version   # Debe ser 3.6 o superior

# Verificar PostgreSQL
psql --version # Debe ser 12 o superior
```

### 1. Configurar Base de Datos

El esquema y los datos reproducibles están en `backend/db/schema.sql` y
`backend/db/seed.sql`, sobre la base `symphoniac`.

**Con Docker** (recomendado): desde la raíz del monorepo,

```bash
docker compose up -d
```

`docker compose` crea la base `symphoniac` y aplica `backend/db/*.sql` como init.
No hace falta ejecutar `psql` después: `schema.sql` no usa `IF NOT EXISTS` y
volver a aplicarlo fallaría con "relation already exists".

**Con un PostgreSQL local sin init automático**:

```bash
createdb -h 127.0.0.1 -U postgres symphoniac
psql -h 127.0.0.1 -U postgres -d symphoniac -f backend/db/schema.sql
psql -h 127.0.0.1 -U postgres -d symphoniac -f backend/db/seed.sql
```

Los scripts históricos 01-08 se conservan en `backend/scripts/legacy/` solo como
referencia (no son setup); ver `backend/scripts/legacy/README.md`. Los scripts 09
y 10 no existen.

### 2. Configurar Aplicación

```bash
git clone <url-del-repositorio>
# desde la raíz del repositorio clonado
cd backend
```

La conexión y el resto de la configuración se toman de variables de entorno
(ver `backend/.env.example`): `DB_URL`, `DB_USER`, `DB_PASSWORD`, `PORT`,
`CORS_ALLOWED_ORIGINS` y `UPLOAD_DIR`. No se versionan valores reales.

### 3. Compilar y Ejecutar

```bash
# Compilar
./mvnw clean package

# Ejecutar
./mvnw spring-boot:run

# O ejecutar el JAR compilado
java -jar target/symphoniac-backend-0.0.1-SNAPSHOT.jar
```

En Windows usar `.\mvnw.cmd` en lugar de `./mvnw`.

### 4. Verificar Funcionamiento

```bash
# Probar endpoint básico
curl http://localhost:3001/api/instrumentos

# Ejecutar tests completos
bash test-api.sh
```

## 📡 Endpoints de la API

### Base URL
\`\`\`
http://localhost:3001/api
\`\`\`

### 🎸 Instrumentos

| Método | Endpoint | Descripción | Implementado |
|--------|----------|-------------|--------------|
| GET | `/instrumentos` | Obtener todos los instrumentos | ✅ |
| GET | `/instrumentos?paginated=true&page=0&size=10&sortBy=precio&sortDir=desc` | Obtener con paginación y ordenamiento | ✅ |
| GET | `/instrumentos/{id}` | Obtener instrumento por ID | ✅ |
| POST | `/instrumentos` | Crear nuevo instrumento | ✅ |
| PUT | `/instrumentos/{id}` | Actualizar instrumento | ✅ |
| DELETE | `/instrumentos/{id}` | Eliminar instrumento | ✅ |
| GET | `/instrumentos/categoria/{categoriaId}` | Filtrar por categoría | ✅ |
| GET | `/instrumentos/buscar?nombre={nombre}` | Buscar por nombre | ✅ |

### 🗂️ Categorías

| Método | Endpoint | Descripción | Implementado |
|--------|----------|-------------|--------------|
| GET | `/categorias` | Obtener todas las categorías | ✅ |
| GET | `/categorias/{id}` | Obtener categoría por ID | ✅ |
| POST | `/categorias` | Crear nueva categoría | ✅ |
| PUT | `/categorias/{id}` | Actualizar categoría | ✅ |
| DELETE | `/categorias/{id}` | Eliminar categoría | ✅ |

### 🛒 Pedidos

| Método | Endpoint | Descripción | Implementado |
|--------|----------|-------------|--------------|
| GET | `/pedidos` | Obtener todos los pedidos | ✅ |
| GET | `/pedidos/{id}` | Obtener pedido por ID | ✅ |
| POST | `/pedidos` | Crear nuevo pedido | ✅ |
| DELETE | `/pedidos/{id}` | Eliminar pedido | ✅ |
| GET | `/pedidos/fecha?fecha={yyyy-MM-dd}` | Buscar pedidos por fecha | ✅ |

### 🖼️ Imágenes

| Método | Endpoint | Descripción | Implementado |
|--------|----------|-------------|--------------|
| POST | `/images/upload/{instrumentoId}` | Subir imagen | ✅ |
| GET | `/images/{filename}` | Obtener archivo de imagen | ✅ |
| GET | `/images/instrumento/{instrumentoId}` | Obtener imágenes de instrumento | ✅ |
| GET | `/images/instrumento/{instrumentoId}/primary` | Obtener imagen principal | ✅ |
| PUT | `/images/{imageId}/primary` | Establecer como principal | ✅ |
| DELETE | `/images/{imageId}` | Eliminar imagen | ✅ |

## 📝 Ejemplos de Uso

### Crear Instrumento

\`\`\`bash
curl -X POST "http://localhost:3001/api/instrumentos" \
  -H "Content-Type: application/json" \
  -d '{
    "instrumento": "Guitarra Acústica Yamaha",
    "marca": "Yamaha",
    "modelo": "FG800",
    "precio": 15000.00,
    "costoEnvio": "G",
    "cantidadVendida": 0,
    "descripcion": "Guitarra acústica ideal para principiantes",
    "idCategoria": 1
  }'
\`\`\`

### Crear Pedido

\`\`\`bash
curl -X POST "http://localhost:3001/api/pedidos" \
  -H "Content-Type: application/json" \
  -d '{
    "instrumentos": [
      {
        "instrumentoId": 1,
        "cantidad": 2
      },
      {
        "instrumentoId": 3,
        "cantidad": 1
      }
    ]
  }'
\`\`\`

### Subir Imagen

\`\`\`bash
curl -X POST "http://localhost:3001/api/images/upload/1" \
  -F "file=@guitarra.jpg" \
  -F "altText=Guitarra Yamaha FG800" \
  -F "isPrimary=true"
\`\`\`

### Búsquedas y Filtros

\`\`\`bash
# Buscar por nombre
curl "http://localhost:3001/api/instrumentos/buscar?nombre=guitarra"

# Filtrar por categoría
curl "http://localhost:3001/api/instrumentos/categoria/1"

# Obtener con paginación y ordenamiento
curl "http://localhost:3001/api/instrumentos?paginated=true&page=0&size=5&sortBy=precio&sortDir=desc"

# Buscar pedidos por fecha
curl "http://localhost:3001/api/pedidos/fecha?fecha=2024-01-15"
\`\`\`

### Parámetros de Paginación

\`\`\`bash
# Parámetros disponibles para /instrumentos:
# - paginated: true/false (default: false)
# - page: número de página (default: 0)
# - size: elementos por página (default: 10)
# - sortBy: campo para ordenar (default: "id")
# - sortDir: dirección del orden "asc"/"desc" (default: "asc")

# Ejemplo completo:
curl "http://localhost:3001/api/instrumentos?paginated=true&page=1&size=5&sortBy=precio&sortDir=desc"
\`\`\`

## 🗄️ Estructura de Base de Datos

### Tabla: categoria_instrumento
\`\`\`sql
CREATE TABLE categoria_instrumento (
    id BIGSERIAL PRIMARY KEY,
    denominacion VARCHAR(100) NOT NULL UNIQUE
);
\`\`\`

### Tabla: instrumento
\`\`\`sql
CREATE TABLE instrumento (
    id BIGSERIAL PRIMARY KEY,
    instrumento VARCHAR(255) NOT NULL,
    marca VARCHAR(100) NOT NULL,
    modelo VARCHAR(100) NOT NULL,
    imagen VARCHAR(255) DEFAULT '',
    precio DECIMAL(10,2) NOT NULL,
    costo_envio VARCHAR(10) DEFAULT '0',
    cantidadvendida INTEGER DEFAULT 0,
    descripcion TEXT DEFAULT '',
    id_categoria BIGINT,
    cantidad_vendida INTEGER DEFAULT 0,
    FOREIGN KEY (id_categoria) REFERENCES categoria_instrumento(id)
);
\`\`\`

### Tabla: pedido
\`\`\`sql
CREATE TABLE pedido (
    id BIGSERIAL PRIMARY KEY,
    fecha_pedido DATE NOT NULL,
    total_pedido DECIMAL(10,2) NOT NULL
);
\`\`\`

### Tabla: pedido_detalle
\`\`\`sql
CREATE TABLE pedido_detalle (
    id BIGSERIAL PRIMARY KEY,
    pedido_id BIGINT NOT NULL,
    instrumento_id BIGINT NOT NULL,
    cantidad INTEGER NOT NULL,
    FOREIGN KEY (pedido_id) REFERENCES pedido(id) ON DELETE CASCADE,
    FOREIGN KEY (instrumento_id) REFERENCES instrumento(id) ON DELETE CASCADE
);
\`\`\`

### Tabla: product_images
\`\`\`sql
CREATE TABLE product_images (
    id BIGSERIAL PRIMARY KEY,
    instrumento_id BIGINT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (instrumento_id) REFERENCES instrumento(id) ON DELETE CASCADE
);
\`\`\`

## 📊 Formato de Respuestas

### Respuesta Exitosa (Lista Simple)
\`\`\`json
{
  "success": true,
  "message": "Instrumentos obtenidos exitosamente",
  "data": [
    {
      "id": 1,
      "instrumento": "Guitarra Acústica",
      "marca": "Yamaha",
      "modelo": "FG800",
      "precio": 15000.00,
      "costoEnvio": "G",
      "cantidadVendida": 5,
      "descripcion": "Guitarra acústica ideal para principiantes",
      "categoriaDenominacion": "Cuerda",
      "imagenes": []
    }
  ]
}
\`\`\`

### Respuesta Paginada
\`\`\`json
{
  "content": [
    {
      "id": 1,
      "instrumento": "Guitarra Acústica",
      "marca": "Yamaha",
      "precio": 15000.00,
      "categoriaDenominacion": "Cuerda"
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 10,
    "sort": {
      "sorted": true,
      "ascending": false
    }
  },
  "totalElements": 25,
  "totalPages": 3,
  "first": true,
  "last": false,
  "numberOfElements": 10
}
\`\`\`

### Respuesta de Pedido
\`\`\`json
{
  "success": true,
  "message": "Pedido creado exitosamente",
  "data": {
    "id": 1,
    "fechaPedido": "2024-01-15",
    "totalPedido": 45000.00,
    "detalles": [
      {
        "id": 1,
        "instrumentoId": 1,
        "cantidad": 2,
        "instrumento": "Guitarra Acústica Yamaha"
      }
    ]
  }
}
\`\`\`

### Respuesta de Error
\`\`\`json
{
  "success": false,
  "message": "Descripción del error",
  "data": null
}
\`\`\`

## 🧪 Testing Completo

### Ejecutar Tests Automatizados
\`\`\`bash
# Ejecutar script de testing completo
bash test-api.sh

# Tests incluidos:
# ✅ CRUD de categorías (5 tests)
# ✅ CRUD de instrumentos (8 tests)
# ✅ CRUD de pedidos (5 tests)
# ✅ Sistema de imágenes (4 tests)
# ✅ Validaciones y errores (4 tests)
# ✅ Limpieza de datos (5 tests)
# ✅ Total: 31 tests completos
\`\`\`

### Cobertura de Testing
- **Funcionalidad básica**: CRUD completo de todas las entidades
- **Relaciones**: Validación de foreign keys y cascadas
- **Paginación**: Tests de paginación y ordenamiento
- **Búsqueda**: Tests de filtrado y búsqueda
- **Validaciones**: Tests de datos inválidos y duplicados
- **Manejo de errores**: Tests de códigos HTTP apropiados
- **Limpieza**: Eliminación automática de datos de prueba

## Estructura del Proyecto

```
backend/
|-- src/
|   |-- main/
|   |   |-- java/com/symphoniac/
|   |   |   |-- SymphoniacApplication.java
|   |   |   |-- config/WebConfig.java
|   |   |   |-- controller/   (5 controllers REST)
|   |   |   |-- dto/          (7 DTOs)
|   |   |   |-- exception/GlobalExceptionHandler.java
|   |   |   |-- model/        (5 entidades JPA)
|   |   |   |-- repository/   (5 repositorios)
|   |   |   `-- service/      (4 servicios)
|   |   `-- resources/application.properties
|   `-- test/java/com/symphoniac/SymphoniacBackendApplicationTests.java
|-- db/
|   |-- schema.sql
|   `-- seed.sql
|-- scripts/legacy/           # scripts SQL historicos 01-08 (no setup)
|-- public/images/            # uploads en runtime (UPLOAD_DIR)
`-- test-api.sh               # smoke test manual
```

## 🔧 Configuración

### application.properties

```properties
spring.application.name=symphoniac-backend

# Servidor
server.port=${PORT:3001}

# PostgreSQL
spring.datasource.url=${DB_URL:jdbc:postgresql://127.0.0.1:5432/symphoniac}
spring.datasource.username=${DB_USER:postgres}
spring.datasource.password=${DB_PASSWORD:}
spring.datasource.driver-class-name=org.postgresql.Driver

# Pool Hikari
spring.datasource.hikari.minimum-idle=0
spring.datasource.hikari.idle-timeout=60000

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.open-in-view=false

# Uploads
app.upload.dir=${UPLOAD_DIR:public/images}
spring.web.resources.static-locations=file:${app.upload.dir}/,classpath:/static/

# CORS (origenes permitidos separados por coma)
cors.allowed-origins=${CORS_ALLOWED_ORIGINS:http://localhost:3000,http://localhost:5173,http://127.0.0.1:3000,http://127.0.0.1:5173}

# Logging
logging.level.com.symphoniac=DEBUG
logging.level.org.springframework.web=DEBUG
```

## 🚨 Notas Importantes

1. **Puerto del servidor**: La aplicación corre en el puerto **3001** para evitar conflictos
2. **Base de datos**: Requiere PostgreSQL con la base de datos `symphoniac`
3. **Imágenes**: Se sirven desde el directorio de uploads configurable (`UPLOAD_DIR`, por defecto `public/images/`)
4. **CORS**: Orígenes configurables con `CORS_ALLOWED_ORIGINS` (separados por coma); por defecto `localhost:3000` y `localhost:5173`
5. **Paginación**: Solo disponible para instrumentos con el parámetro `paginated=true`
6. **Validaciones**: Todos los endpoints validan datos de entrada
7. **Transacciones**: Los pedidos se crean de forma transaccional
8. **Cascadas**: Eliminar un pedido elimina automáticamente sus detalles

## 🎯 Próximos Pasos Sugeridos

1. **Frontend**: Implementar interfaz de usuario con React/Angular/Vue
2. **Autenticación**: Agregar JWT para seguridad
3. **Cache**: Implementar Redis para mejorar rendimiento
4. **Documentación**: Agregar Swagger/OpenAPI
5. **Tests**: Ampliar cobertura de tests unitarios
6. **Docker**: Containerizar la aplicación
7. **CI/CD**: Configurar pipeline de despliegue

---

**Desarrollado por:** Agustín Sandoval  
**Institución:** Universidad Tecnológica Nacional - Facultad Regional Mendoza  
**Carrera:** Tecnicatura Universitaria en Programación  
**Materia:** Laboratorio de Computación 4  
**Año:** 2025
---