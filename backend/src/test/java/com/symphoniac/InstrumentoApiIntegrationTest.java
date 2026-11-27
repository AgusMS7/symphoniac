package com.symphoniac;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.everyItem;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

/**
 * Integración de la API de instrumentos contra PostgreSQL 17 con el esquema y
 * el seed reales. Cubre listado, búsqueda, filtro por categoría, detalle, 404,
 * validación de entrada y entrega de imágenes semilla.
 */
class InstrumentoApiIntegrationTest extends AbstractPostgresIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void listarDevuelveLosTreintaInstrumentosDelSeed() throws Exception {
        mockMvc.perform(get("/api/instrumentos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data", hasSize(30)));
    }

    @Test
    void buscarPorNombreDevuelveLasGuitarrasDelSeed() throws Exception {
        mockMvc.perform(get("/api/instrumentos/buscar").param("nombre", "Guitarra"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data", hasSize(4)))
                .andExpect(jsonPath("$.data[*].instrumento", everyItem(containsString("Guitarra"))));
    }

    @Test
    void filtrarPorCategoriaDevuelveSoloInstrumentosDeViento() throws Exception {
        mockMvc.perform(get("/api/instrumentos/categoria/2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data", hasSize(5)))
                .andExpect(jsonPath("$.data[*].categoriaDenominacion", everyItem(is("Viento"))));
    }

    @Test
    void detalleDevuelveElInstrumentoConSuCategoria() throws Exception {
        mockMvc.perform(get("/api/instrumentos/11"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.instrumento").value("Guitarra Acústica Yamaha"))
                .andExpect(jsonPath("$.data.idCategoria").value(1))
                .andExpect(jsonPath("$.data.categoriaDenominacion").value("Cuerda"));
    }

    @Test
    void detalleDeUnIdInexistenteDevuelve404() throws Exception {
        mockMvc.perform(get("/api/instrumentos/999999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Instrumento no encontrado"));
    }

    @Test
    void crearSinCamposObligatoriosDevuelve400ConErroresDeValidacion() throws Exception {
        mockMvc.perform(post("/api/instrumentos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.data.instrumento").exists())
                .andExpect(jsonPath("$.data.marca").exists())
                .andExpect(jsonPath("$.data.modelo").exists())
                .andExpect(jsonPath("$.data.precio").exists());
    }

    @Test
    void categoriasDevuelveSoloIdYDenominacion() throws Exception {
        mockMvc.perform(get("/api/categorias"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data", hasSize(5)))
                .andExpect(jsonPath("$.data[0].instrumentos").doesNotExist());
    }

    @Test
    void imagenSemillaExistenteDevuelve200() throws Exception {
        mockMvc.perform(get("/images/percussion-set.jpg"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.IMAGE_JPEG));
    }

    @Test
    void imagenInexistenteDevuelve404() throws Exception {
        mockMvc.perform(get("/images/does-not-exist.jpg"))
                .andExpect(status().isNotFound());
    }
}
