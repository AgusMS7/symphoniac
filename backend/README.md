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

\`\`\`bash
# Verificar Java
java -version  # Debe ser 17 o superior

# Verificar Maven
mvn -version   # Debe ser 3.6 o superior

# Verificar PostgreSQL
psql --version # Debe ser 12 o superior
\`\`\`

### 1. Configurar Base de Datos

\`\`\`bash
# Crear base de datos
psql -U postgres -f scripts/01-crear-bd.sql

# Crear tablas principales
psql -U postgres -d symphoniac -f scripts/02-crear-tablas.sql

# Insertar datos iniciales
psql -U postgres -d symphoniac -f scripts/03-insertar-datos-json.sql
psql -U postgres -d symphoniac -f scripts/04-datos-adicionales.sql

# Crear tablas de pedidos
psql -U postgres -d symphoniac -f scripts/09-datos-prueba-pedidos-final.sql

# Verificar instalación
psql -U postgres -d symphoniac -f scripts/10-verificar-todo.sql
\`\`\`

### 2. Configurar Aplicación

\`\`\`bash
# Clonar repositorio
git clone <url-del-repositorio>
cd instrumentos-back-spring

# Configurar application.properties
# Las credenciales por defecto son:
# - Usuario: postgres
# - Contraseña: postgres (cambiar según tu configuración)
# - Puerto: 5432
# - Base de datos: symphoniac
# - Puerto del servidor: 3001
\`\`\`

### 3. Compilar y Ejecutar

\`\`\`bash
# Compilar proyecto
mvn clean compile

# Ejecutar aplicación
mvn spring-boot:run

# O ejecutar JAR compilado
mvn clean package
java -jar target/instrumentos-back-spring-1.0.0.jar
\`\`\`

### 4. Verificar Funcionamiento

\`\`\`bash
# Probar endpoint básico
curl http://localhost:3001/api/instrumentos

# Ejecutar tests completos
bash test-api-completo.sh
\`\`\`

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
bash test-api-completo.sh

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

## 📁 Estructura del Proyecto

\`\`\`
src/
├── main/
│   ├── java/com/symphoniac/
│   │   ├── config/          # Configuraciones (CORS, Web)
│   │   │   └── WebConfig.java
│   │   ├── controller/      # Controladores REST
│   │   │   ├── CategoriaController.java
│   │   │   ├── InstrumentoController.java
│   │   │   ├── PedidoController.java
│   │   │   ├── ImageController.java
│   │   │   └── HomeController.java
│   │   ├── dto/            # Data Transfer Objects
│   │   │   ├── InstrumentoDTO.java
│   │   │   ├── PedidoDTO.java
│   │   │   ├── PedidoDetalleDTO.java
│   │   │   ├── CrearPedidoRequest.java
│   │   │   ├── ItemCarritoDTO.java
│   │   │   ├── ProductImageDTO.java
│   │   │   └── ApiResponse.java
│   │   ├── exception/      # Manejo de excepciones
│   │   │   └── GlobalExceptionHandler.java
│   │   ├── model/          # Entidades JPA
│   │   │   ├── Instrumento.java
│   │   │   ├── Categoria.java
│   │   │   ├── Pedido.java
│   │   │   ├── PedidoDetalle.java
│   │   │   └── ProductImage.java
│   │   ├── repository/     # Repositorios JPA
│   │   │   ├── InstrumentoRepository.java
│   │   │   ├── CategoriaRepository.java
│   │   │   ├── PedidoRepository.java
│   │   │   ├── PedidoDetalleRepository.java
│   │   │   └── ProductImageRepository.java
│   │   ├── service/        # Lógica de negocio
│   │   │   ├── InstrumentoService.java
│   │   │   ├── CategoriaService.java
│   │   │   ├── PedidoService.java
│   │   │   └── ProductImageService.java
│   │   └── InstrumentosSandovalApplication.java
│   └── resources/
│       ├── application.properties
│       └── static/images/  # Directorio de imágenes
├── test/                   # Tests unitarios
├── scripts/               # Scripts SQL
│   ├── 01-crear-bd.sql
│   ├── 02-crear-tablas.sql
│   ├── 03-insertar-datos-json.sql
│   ├── 04-datos-adicionales.sql
│   ├── 05-verificar-datos.sql
│   ├── 09-datos-prueba-pedidos-final.sql
│   └── 10-verificar-todo.sql
├── public/images/         # Directorio público de imágenes
├── test-api-completo.sh   # Script de testing completo
└── target/               # Archivos compilados
\`\`\`

## 🔧 Configuración

### application.properties
\`\`\`properties
# Base de datos PostgreSQL
spring.datasource.url=jdbc:postgresql://localhost:5432/symphoniac
spring.datasource.username=postgres
spring.datasource.password=postgres
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# Servidor - Puerto 3001
server.port=3001

# Logging
logging.level.com.instrumentos=DEBUG
logging.level.org.springframework.web=DEBUG

# Archivos
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
\`\`\`

## 🚨 Notas Importantes

1. **Puerto del servidor**: La aplicación corre en el puerto **3001** para evitar conflictos
2. **Base de datos**: Requiere PostgreSQL con la base de datos `symphoniac`
3. **Imágenes**: Se almacenan en `public/images/` y `src/main/resources/static/images/`
4. **CORS**: Configurado para permitir localhost en cualquier puerto
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