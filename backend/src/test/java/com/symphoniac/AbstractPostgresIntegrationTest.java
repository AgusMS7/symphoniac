package com.symphoniac;

import java.nio.file.Files;
import java.nio.file.Path;

import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.MountableFile;

/**
 * Base para los tests de integración contra PostgreSQL real.
 *
 * <p>Levanta un contenedor {@code postgres:17} e inicializa el esquema y el seed
 * reales de {@code backend/db/} copiándolos al directorio de init del
 * entrypoint. {@code spring.jpa.hibernate.ddl-auto=validate} valida el modelo
 * JPA contra ese esquema, así que los tests comprueban el contrato real y no
 * una aproximación con H2.</p>
 *
 * <p>El contenedor es estático y se comparte entre las clases de test que
 * extienden esta base (incluida la variante con perfil {@code demo}).</p>
 */
@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
abstract class AbstractPostgresIntegrationTest {

    private static final String SCHEMA_PATH = "/docker-entrypoint-initdb.d/01-schema.sql";
    private static final String SEED_PATH = "/docker-entrypoint-initdb.d/02-seed.sql";

    @Container
    static final PostgreSQLContainer<?> POSTGRES = new PostgreSQLContainer<>("postgres:17")
            .withDatabaseName("symphoniac")
            .withCopyFileToContainer(
                    MountableFile.forHostPath(resolveDbFile("schema.sql")),
                    SCHEMA_PATH)
            .withCopyFileToContainer(
                    MountableFile.forHostPath(resolveDbFile("seed.sql")),
                    SEED_PATH);

    /**
     * Fuerza la conexión al contenedor. {@code application.properties} define
     * {@code spring.datasource.url} explícita, que tiene prioridad sobre
     * {@code @ServiceConnection}; {@code @DynamicPropertySource} es la fuente de
     * mayor precedencia y garantiza que Hibernate use el PostgreSQL del
     * contenedor y no el de {@code 127.0.0.1:5432}.
     */
    @DynamicPropertySource
    static void datasourceProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", POSTGRES::getJdbcUrl);
        registry.add("spring.datasource.username", POSTGRES::getUsername);
        registry.add("spring.datasource.password", POSTGRES::getPassword);
    }

    private static Path resolveDbFile(String name) {
        Path fromModule = Path.of("db", name).toAbsolutePath();
        if (Files.exists(fromModule)) {
            return fromModule;
        }

        Path fromRepoRoot = Path.of("backend", "db", name).toAbsolutePath();
        if (Files.exists(fromRepoRoot)) {
            return fromRepoRoot;
        }

        throw new IllegalStateException(
                "No se encontró backend/db/" + name + " desde " + Path.of("").toAbsolutePath());
    }
}
