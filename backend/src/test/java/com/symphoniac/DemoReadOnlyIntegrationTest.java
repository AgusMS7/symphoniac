package com.symphoniac;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

/**
 * El perfil {@code demo} activa {@link com.symphoniac.config.DemoReadOnlyFilter}:
 * las lecturas siguen funcionando y cualquier escritura sobre {@code /api/**}
 * responde 405. El backend de la demo es de solo lectura; el front guarda los
 * cambios en el navegador.
 */
@ActiveProfiles("demo")
class DemoReadOnlyIntegrationTest extends AbstractPostgresIntegrationTest {

    private static final String INSTRUMENTO_PAYLOAD = """
            {
              "instrumento": "Guitarra Demo",
              "marca": "Yamaha",
              "modelo": "FG800",
              "precio": 25000,
              "categoria": { "id": 1 }
            }
            """;

    @Autowired
    private MockMvc mockMvc;

    @Test
    void getSiguePermitido() throws Exception {
        mockMvc.perform(get("/api/instrumentos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data", hasSize(30)));
    }

    @Test
    void postQuedaBloqueadoCon405() throws Exception {
        mockMvc.perform(post("/api/instrumentos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(INSTRUMENTO_PAYLOAD))
                .andExpect(status().isMethodNotAllowed())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Modo demo: solo lectura"));
    }

    @Test
    void putQuedaBloqueadoCon405() throws Exception {
        mockMvc.perform(put("/api/instrumentos/11")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(INSTRUMENTO_PAYLOAD))
                .andExpect(status().isMethodNotAllowed())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void deleteQuedaBloqueadoCon405() throws Exception {
        mockMvc.perform(delete("/api/instrumentos/11"))
                .andExpect(status().isMethodNotAllowed())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void postDeCategoriasTambienQuedaBloqueado() throws Exception {
        mockMvc.perform(post("/api/categorias")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"denominacion\":\"Demo\"}"))
                .andExpect(status().isMethodNotAllowed())
                .andExpect(jsonPath("$.message").value("Modo demo: solo lectura"));
    }

    @Test
    void lasImagenesSiguenDisponiblesEnDemo() throws Exception {
        mockMvc.perform(get("/images/nro1.jpg"))
                .andExpect(status().isOk());
    }
}
