package com.symphoniac.config;

import java.io.IOException;
import java.util.Set;

import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * En el perfil "demo" la API es de solo lectura: cualquier intento de
 * escritura sobre /api/** responde 405. La demo guarda sus cambios en el
 * navegador, nunca en el backend.
 */
@Component
@Profile("demo")
public class DemoReadOnlyFilter extends OncePerRequestFilter {

    private static final Set<String> SAFE_METHODS = Set.of("GET", "HEAD", "OPTIONS");
    private static final String DEMO_READ_ONLY_MESSAGE =
            "{\"success\":false,\"message\":\"Modo demo: solo lectura\",\"data\":null}";

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        String path = request.getRequestURI();
        boolean apiPath = path.equals("/api") || path.startsWith("/api/");

        if (apiPath && !SAFE_METHODS.contains(request.getMethod())) {
            response.setStatus(HttpStatus.METHOD_NOT_ALLOWED.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(DEMO_READ_ONLY_MESSAGE);
            return;
        }

        filterChain.doFilter(request, response);
    }
}
