package com.symphoniac.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.symphoniac.dto.InstrumentoDTO;
import com.symphoniac.exception.BusinessException;
import com.symphoniac.exception.ResourceNotFoundException;
import com.symphoniac.model.Categoria;
import com.symphoniac.model.Instrumento;
import com.symphoniac.repository.CategoriaRepository;
import com.symphoniac.repository.InstrumentoRepository;

@Service
@Transactional(readOnly = true)
public class InstrumentoService {

    private static final Logger logger = LoggerFactory.getLogger(InstrumentoService.class);

    private final InstrumentoRepository instrumentoRepository;
    private final CategoriaRepository categoriaRepository;
    private final ProductImageService productImageService;

    public InstrumentoService(InstrumentoRepository instrumentoRepository,
                              CategoriaRepository categoriaRepository,
                              ProductImageService productImageService) {
        this.instrumentoRepository = instrumentoRepository;
        this.categoriaRepository = categoriaRepository;
        this.productImageService = productImageService;
    }

    public List<InstrumentoDTO> findAll() {
        try {
            logger.debug("Obteniendo todos los instrumentos");
            List<Instrumento> instrumentos = instrumentoRepository.findAll();
            return instrumentos.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Error al obtener instrumentos: {}", e.getMessage(), e);
            throw new RuntimeException("Error al obtener instrumentos: " + e.getMessage(), e);
        }
    }

    public Page<InstrumentoDTO> findAllPaginated(Pageable pageable) {
        try {
            logger.debug("Obteniendo instrumentos paginados - Página: {}, Tamaño: {}", 
                        pageable.getPageNumber(), pageable.getPageSize());
            
            Page<Instrumento> instrumentosPage = instrumentoRepository.findAll(pageable);
            List<InstrumentoDTO> instrumentosDTO = instrumentosPage.getContent().stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
            
            return new PageImpl<>(instrumentosDTO, pageable, instrumentosPage.getTotalElements());
        } catch (Exception e) {
            logger.error("Error al obtener instrumentos paginados: {}", e.getMessage(), e);
            throw new RuntimeException("Error al obtener instrumentos paginados: " + e.getMessage(), e);
        }
    }

    public Optional<InstrumentoDTO> findById(Long id) {
        try {
            logger.debug("Buscando instrumento por ID: {}", id);
            return instrumentoRepository.findById(id)
                    .map(this::convertToDTO);
        } catch (Exception e) {
            logger.error("Error al obtener instrumento por ID {}: {}", id, e.getMessage(), e);
            throw new RuntimeException("Error al obtener instrumento por ID: " + e.getMessage(), e);
        }
    }

    @Transactional
    public InstrumentoDTO save(Instrumento instrumento) {
        try {
            logger.debug("Guardando instrumento: {}", instrumento.getInstrumento());

            // El frontend envia la relacion categoria:{id}; idCategoria es la columna
            // escribible que realmente persiste el vinculo. Normalizamos ambos campos.
            Long categoriaId = null;
            if (instrumento.getCategoria() != null) {
                categoriaId = instrumento.getCategoria().getId();
            }
            if (categoriaId == null) {
                categoriaId = instrumento.getIdCategoria();
            }

            if (categoriaId != null) {
                Long finalCategoriaId = categoriaId;
                Categoria categoria = categoriaRepository.findById(categoriaId)
                        .orElseThrow(() -> new BusinessException(
                                "Categoría no encontrada con ID: " + finalCategoriaId));
                instrumento.setCategoria(categoria);
                instrumento.setIdCategoria(categoriaId);
            }

            Instrumento savedInstrumento = instrumentoRepository.save(instrumento);
            logger.info("Instrumento guardado exitosamente con ID: {}", savedInstrumento.getId());
            
            return convertToDTO(savedInstrumento);
        } catch (RuntimeException e) {
            throw e; // Re-lanzar runtime exceptions sin envolver (p. ej. BusinessException)
        } catch (Exception e) {
            logger.error("Error al guardar instrumento: {}", e.getMessage(), e);
            throw new RuntimeException("Error al guardar instrumento: " + e.getMessage(), e);
        }
    }

    @Transactional
    public void deleteById(Long id) {
        try {
            logger.debug("Eliminando instrumento ID: {}", id);
            
            if (!instrumentoRepository.existsById(id)) {
                throw new ResourceNotFoundException("Instrumento no encontrado con ID: " + id);
            }
            
            // Eliminar imágenes asociadas
            productImageService.deleteImagesByInstrumento(id);
            
            // Eliminar instrumento
            instrumentoRepository.deleteById(id);
            logger.info("Instrumento eliminado exitosamente: {}", id);
            
        } catch (RuntimeException e) {
            throw e; // Re-lanzar excepciones de negocio
        } catch (Exception e) {
            logger.error("Error al eliminar instrumento {}: {}", id, e.getMessage(), e);
            throw new RuntimeException("Error al eliminar instrumento: " + e.getMessage(), e);
        }
    }

    public boolean existsById(Long id) {
        try {
            return instrumentoRepository.existsById(id);
        } catch (Exception e) {
            logger.error("Error al verificar existencia del instrumento {}: {}", id, e.getMessage(), e);
            throw new RuntimeException("Error al verificar existencia del instrumento: " + e.getMessage(), e);
        }
    }

    public List<InstrumentoDTO> findByCategoriaId(Long categoriaId) {
        try {
            logger.debug("Filtrando instrumentos por categoría ID: {}", categoriaId);
            List<Instrumento> instrumentos = instrumentoRepository.findByIdCategoria(categoriaId);
            return instrumentos.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Error al filtrar instrumentos por categoría {}: {}", categoriaId, e.getMessage(), e);
            throw new RuntimeException("Error al filtrar instrumentos por categoría: " + e.getMessage(), e);
        }
    }

    public List<InstrumentoDTO> findByInstrumentoContainingIgnoreCase(String nombre) {
        try {
            logger.debug("Buscando instrumentos por nombre: {}", nombre);
            List<Instrumento> instrumentos = instrumentoRepository.findByInstrumentoContainingIgnoreCase(nombre);
            return instrumentos.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Error al buscar instrumentos por nombre '{}': {}", nombre, e.getMessage(), e);
            throw new RuntimeException("Error al buscar instrumentos por nombre: " + e.getMessage(), e);
        }
    }

    private InstrumentoDTO convertToDTO(Instrumento instrumento) {
        if (instrumento == null) {
            return null;
        }
        
        return InstrumentoDTO.fromEntity(instrumento);
    }
}
