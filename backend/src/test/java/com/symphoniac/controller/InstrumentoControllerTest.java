package com.symphoniac.controller;

import static org.hamcrest.Matchers.containsString;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.symphoniac.exception.BusinessException;
import com.symphoniac.service.InstrumentoService;

/**
 * Verifica que el controller re-lance BusinessException y que
 * GlobalExceptionHandler la traduzca a 400 {success:false}.
 */
@WebMvcTest(InstrumentoController.class)
class InstrumentoControllerTest {

    private static final String PAYLOAD = """
            {
              "instrumento": "Guitarra",
              "marca": "Yamaha",
              "modelo": "FG800",
              "precio": 25000,
              "categoria": { "id": 999 }
            }
            """;

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private InstrumentoService instrumentoService;

    @Test
    void createDevuelve400CuandoLaCategoriaNoExiste() throws Exception {
        when(instrumentoService.save(any())).thenThrow(
                new BusinessException("Categoria no encontrada con ID: 999"));

        mockMvc.perform(post("/api/instrumentos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(PAYLOAD))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message", containsString("999")));
    }

    @Test
    void updateDevuelve400CuandoLaCategoriaNoExiste() throws Exception {
        when(instrumentoService.existsById(1L)).thenReturn(true);
        when(instrumentoService.save(any())).thenThrow(
                new BusinessException("Categoria no encontrada con ID: 999"));

        mockMvc.perform(put("/api/instrumentos/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(PAYLOAD))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message", containsString("999")));
    }
}
