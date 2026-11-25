package com.symphoniac;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SymphoniacApplication {

    private static final Logger logger = LoggerFactory.getLogger(SymphoniacApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(SymphoniacApplication.class, args);
        logger.info("Servidor Spring Boot iniciado en http://localhost:3001");
        logger.info("API disponible en http://localhost:3001/api/instrumentos");
        logger.info("Imagenes disponibles en http://localhost:3001/images/");
    }
}
