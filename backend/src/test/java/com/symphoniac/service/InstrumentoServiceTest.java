package com.symphoniac.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.symphoniac.dto.InstrumentoDTO;
import com.symphoniac.exception.BusinessException;
import com.symphoniac.model.Categoria;
import com.symphoniac.model.Instrumento;
import com.symphoniac.repository.CategoriaRepository;
import com.symphoniac.repository.InstrumentoRepository;

@ExtendWith(MockitoExtension.class)
class InstrumentoServiceTest {

    @Mock
    private InstrumentoRepository instrumentoRepository;

    @Mock
    private CategoriaRepository categoriaRepository;

    @Mock
    private ProductImageService productImageService;

    @InjectMocks
    private InstrumentoService instrumentoService;

    private Instrumento buildInstrumento() {
        Instrumento instrumento = new Instrumento("Guitarra", "Yamaha", "FG800", new BigDecimal("25000"));
        instrumento.setId(11L);
        return instrumento;
    }

    @Test
    void saveResuelveCategoriaDesdeRelacionYPersisteIdCategoria() {
        Instrumento instrumento = buildInstrumento();
        Categoria categoria = new Categoria("Cuerda");
        categoria.setId(1L);
        instrumento.setCategoria(categoria);

        when(categoriaRepository.findById(1L)).thenReturn(Optional.of(categoria));
        when(instrumentoRepository.save(any(Instrumento.class))).thenAnswer(inv -> inv.getArgument(0));

        InstrumentoDTO dto = instrumentoService.save(instrumento);

        assertEquals(1L, instrumento.getIdCategoria());
        assertSame(categoria, instrumento.getCategoria());
        assertEquals(1L, dto.getIdCategoria());
        assertEquals("Cuerda", dto.getCategoriaDenominacion());
        verify(categoriaRepository).findById(1L);
    }

    @Test
    void saveUsaIdCategoriaCuandoNoVieneLaRelacion() {
        Instrumento instrumento = buildInstrumento();
        instrumento.setIdCategoria(2L);
        Categoria categoria = new Categoria("Viento");
        categoria.setId(2L);

        when(categoriaRepository.findById(2L)).thenReturn(Optional.of(categoria));
        when(instrumentoRepository.save(any(Instrumento.class))).thenAnswer(inv -> inv.getArgument(0));

        InstrumentoDTO dto = instrumentoService.save(instrumento);

        assertEquals(2L, instrumento.getIdCategoria());
        assertSame(categoria, instrumento.getCategoria());
        assertEquals(2L, dto.getIdCategoria());
        assertEquals("Viento", dto.getCategoriaDenominacion());
    }

    @Test
    void saveConCategoriaInexistenteLanzaBusinessException() {
        Instrumento instrumento = buildInstrumento();
        Categoria categoria = new Categoria();
        categoria.setId(999L);
        instrumento.setCategoria(categoria);

        when(categoriaRepository.findById(999L)).thenReturn(Optional.empty());

        BusinessException ex = assertThrows(BusinessException.class,
                () -> instrumentoService.save(instrumento));

        assertTrue(ex.getMessage().contains("999"));
        verify(instrumentoRepository, never()).save(any(Instrumento.class));
    }

    @Test
    void saveSinCategoriaNoBuscaCategoria() {
        Instrumento instrumento = buildInstrumento();

        when(instrumentoRepository.save(any(Instrumento.class))).thenAnswer(inv -> inv.getArgument(0));

        InstrumentoDTO dto = instrumentoService.save(instrumento);

        assertNull(dto.getIdCategoria());
        verifyNoInteractions(categoriaRepository);
    }
}
