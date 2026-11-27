--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: categoria_instrumento; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.categoria_instrumento VALUES (1, 'Cuerda');
INSERT INTO public.categoria_instrumento VALUES (2, 'Viento');
INSERT INTO public.categoria_instrumento VALUES (3, 'Percusión');
INSERT INTO public.categoria_instrumento VALUES (4, 'Teclado');
INSERT INTO public.categoria_instrumento VALUES (5, 'Electrónico');


--
-- Data for Name: instrumento; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.instrumento VALUES (6, 'Antiguo Piano Aleman Con Candelabros.', 'Neumeyer', 'Stratus', 'antique-upright-piano.jpg', 17000.00, '2000', 0, 'Buen dia! Sale a la venta este Piano Alemán Neumeyer con candelabros incluidos. Tiene una talla muy bonita en la madera. Una pieza de calidad.', 4, 0);
INSERT INTO public.instrumento VALUES (8, 'Teclado Organo Electronico Musical Instrumento 54 Teclas', 'GADNIC', 'T01', 'electronic-organ.jpg', 2250.00, 'G', 1375, 'Organo Electrónico GADNIC T01. Display de Led. 54 Teclas. 100 Timbres / 100 Ritmos. 4 1/2 octavas. 8 Percusiones. 8 Canciones de muestra. Grabación y reproducción. Entrada para Micrófono. Salida de Audio (Auriculares / Amplificador). Vibrato. Sustain Incluye Atril Apoya partitura y Micrófono. Dimensiones: 84,5 x 32,5 x 11 cm', 4, 0);
INSERT INTO public.instrumento VALUES (9, 'Instrumentos De Percusión Niños Set Musical Con Estuche', 'KNIGHT', 'LB17', 'percussion-set.jpg', 2700.00, '300', 15, 'Estas viendo un excelente y completísimo set de percusion para niños con estuche rígido, equipado con los instrumentos mas divertidos! De gran calidad y sonoridad. Ideal para jardines, escuelas primarias, musicoterapeutas o chicos que se quieran iniciar en la música de la mejor manera. Es un muy buen producto que garantiza entretenimiento en cualquier casa o reunión, ya que esta equipado para que varias personas al mismo tiempo estén tocando un instrumento.', 1, 0);
INSERT INTO public.instrumento VALUES (11, 'Guitarra Acústica Yamaha', 'Yamaha', 'FG800', 'acoustic-guitar.jpg', 25000.00, 'G', 15, 'Guitarra acústica de calidad profesional con tapa de abeto sólido', 1, 0);
INSERT INTO public.instrumento VALUES (12, 'Guitarra Eléctrica Fender', 'Fender', 'Stratocaster', 'electric-guitar.jpg', 45000.00, 'G', 8, 'Guitarra eléctrica clásica con pastillas single coil', 1, 0);
INSERT INTO public.instrumento VALUES (13, 'Bajo Eléctrico Fender', 'Fender', 'Precision Bass', 'electric-bass.jpg', 38000.00, 'G', 5, 'Bajo eléctrico de 4 cuerdas con sonido potente', 1, 0);
INSERT INTO public.instrumento VALUES (14, 'Violín Stentor', 'Stentor', 'Student I', 'violin.jpg', 18000.00, '500', 12, 'Violín 4/4 para estudiantes con arco y estuche incluidos', 1, 0);
INSERT INTO public.instrumento VALUES (15, 'Guitarra Clásica Criolla', 'Gracia', 'M5', 'classical-guitar.jpg', 8500.00, '400', 25, 'Guitarra criolla de estudio con cuerdas de nylon', 1, 0);
INSERT INTO public.instrumento VALUES (16, 'Saxofón Alto Yamaha', 'Yamaha', 'YAS-280', 'alto-saxophone.jpg', 95000.00, 'G', 2, 'Saxofón alto en Mi bemol, ideal para estudiantes avanzados', 2, 0);
INSERT INTO public.instrumento VALUES (17, 'Trompeta Bach', 'Bach', 'TR300H2', 'trumpet.jpg', 42000.00, 'G', 4, 'Trompeta en Si bemol con acabado lacado dorado', 2, 0);
INSERT INTO public.instrumento VALUES (18, 'Flauta Traversa Pearl', 'Pearl', 'PF-525E', 'flute.jpg', 32000.00, '300', 9, 'Flauta traversa plateada con mecanismo de platos abiertos', 2, 0);
INSERT INTO public.instrumento VALUES (19, 'Clarinete Buffet', 'Buffet', 'E11', 'clarinet.jpg', 55000.00, 'G', 3, 'Clarinete en Si bemol de madera de granadilla', 2, 0);
INSERT INTO public.instrumento VALUES (20, 'Armónica Hohner', 'Hohner', 'Special 20', 'harmonica.jpg', 3500.00, '200', 18, 'Armónica diatónica en Do mayor, ideal para blues', 2, 0);
INSERT INTO public.instrumento VALUES (21, 'Batería Pearl Export', 'Pearl', 'Export Series', 'drum-kit.jpg', 85000.00, 'G', 3, 'Batería completa de 5 piezas con platillos incluidos', 3, 0);
INSERT INTO public.instrumento VALUES (22, 'Cajón Peruano', 'Meinl', 'Headliner', 'cajon.jpg', 12000.00, '600', 8, 'Cajón peruano con snares internos y sonido profesional', 3, 0);
INSERT INTO public.instrumento VALUES (23, 'Bongos LP', 'Latin Percussion', 'Aspire', 'bongos.jpg', 15000.00, '500', 6, 'Bongos de madera con parches naturales', 3, 0);
INSERT INTO public.instrumento VALUES (24, 'Platillos Zildjian', 'Zildjian', 'A Custom', 'cymbals.jpg', 28000.00, 'G', 4, 'Set de platillos profesionales Hi-Hat 14" + Crash 16"', 3, 0);
INSERT INTO public.instrumento VALUES (25, 'Piano Digital Casio', 'Casio', 'CDP-S110', 'digital-piano.jpg', 55000.00, 'G', 7, 'Piano digital de 88 teclas con sonidos realistas', 4, 0);
INSERT INTO public.instrumento VALUES (26, 'Teclado Yamaha', 'Yamaha', 'PSR-E373', 'keyboard.jpg', 35000.00, 'G', 12, 'Teclado de 61 teclas con 622 voces y 205 estilos', 4, 0);
INSERT INTO public.instrumento VALUES (27, 'Piano Acústico Vertical', 'Kawai', 'K-15E', 'upright-piano.jpg', 180000.00, 'G', 1, 'Piano acústico vertical de 88 teclas con acabado negro', 4, 0);
INSERT INTO public.instrumento VALUES (28, 'Sintetizador Roland', 'Roland', 'JUNO-DS61', 'synthesizer.jpg', 75000.00, 'G', 6, 'Sintetizador de 61 teclas con múltiples sonidos y efectos', 5, 0);
INSERT INTO public.instrumento VALUES (29, 'Controlador MIDI', 'Akai', 'MPK Mini', 'midi-controller.jpg', 18000.00, '400', 10, 'Controlador MIDI de 25 teclas con pads y controles', 5, 0);
INSERT INTO public.instrumento VALUES (30, 'Interfaz de Audio', 'Focusrite', 'Scarlett 2i2', 'audio-interface.jpg', 22000.00, '350', 14, 'Interfaz de audio USB de 2 entradas y 2 salidas', 5, 0);
INSERT INTO public.instrumento VALUES (31, 'Mandolina Instrumento Musical Stagg Sunburst', 'Stagg', 'M20', 'mandolin.jpg', 2450.00, 'G', 28, 'Estas viendo una excelente mandolina de la marca Stagg, con un sonido muy dulce, tapa aros y fondo de tilo, y diapasón de palisandro. Es un instrumento acústico (no se enchufa) de cuerdas dobles (4 pares) con la caja ovalada y cóncava, y el mástil corto. Su utilización abarca variados ámbitos, desde rock, folk, country y ensambles experimentales.', 1, 0);
INSERT INTO public.instrumento VALUES (32, 'Pandereta Pandero Instrumento Musical', 'DyM ventas', '32 sonajas', 'tambourine.jpg', 325.00, '150', 10, '1 Pandereta - 32 sonajas metálicas. Más de 8 años vendiendo con 100 % de calificaciones POSITIVAS y clientes satisfechos !!', 3, 0);
INSERT INTO public.instrumento VALUES (5, 'Shekeres. Instrumento. Música. Artesanía.', 'Azalea Artesanías', 'Cuentas de madera', 'shekere.jpg', 850.00, '300', 5, 'Las calabazas utilizadas para nuestras artesanías son sembradas y cosechadas por nosotros, quienes seleccionamos el mejor fruto para garantizar la calidad del producto y ofrecerle algo creativo y original.', 3, 10);
INSERT INTO public.instrumento VALUES (40, 'Batería Musical Infantil Juguete Niño 9 Piezas Palillos', 'Bateria', 'Infantil', 'toy-drum-kit.jpg', 850.00, '250', 380, 'DESCRIPCIÓN: DE 1 A 3 AÑOS. EL SET INCLUYE 5 TAMBORES, PALILLOS Y EL PLATILLO TAL CUAL LAS FOTOS. SONIDOS REALISTAS Y FÁCIL DE MONTAR. MEDIDAS: 40X20X46 CM', 1, 0);
INSERT INTO public.instrumento VALUES (43, 'Triangulo Musical 24 Cm Percusion', 'LBP', '24', 'triangle.jpg', 260.00, '250', 3, 'Triangulo Musical de 24 Centímetros De Acero. ENVIOS POR CORREO O ENCOMIENDA: Se le deberán adicionar $40 en concepto de Despacho y el Costo del envío se abonará al recibir el producto en Terminal, Sucursal OCA o Domicilio', 3, 0);
INSERT INTO public.instrumento VALUES (44, 'Bar Chimes Lp Cortina Musical 72 Barras', 'FM', 'LATIN', 'bar-chimes.jpg', 2250.00, 'G', 2, 'BARCHIME CORTINA MUSICAL DE 25 BARRAS LATIN CUSTOM. Emitimos factura A y B', 3, 0);
INSERT INTO public.instrumento VALUES (47, 'Guitarra Ukelele Infantil Grande 60cm', 'GUITARRA', 'UKELELE', 'ukulele.jpg', 500.00, 'G', 5, 'Material: Plástico smil madera 4 Cuerdas longitud: 60cm, el mejor regalo para usted, su familia y amigos, adecuado para 3-18 años de edad', 1, 0);


--
-- Data for Name: pedido; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.pedido VALUES (9, '2025-06-27', 30000.00);
INSERT INTO public.pedido VALUES (13, '2025-06-27', 7200.00);
INSERT INTO public.pedido VALUES (14, '2025-09-15', 1700.00);
INSERT INTO public.pedido VALUES (15, '2025-09-15', 12000.00);
INSERT INTO public.pedido VALUES (16, '2025-09-15', 2700.00);
INSERT INTO public.pedido VALUES (17, '2025-09-15', 17000.00);
INSERT INTO public.pedido VALUES (18, '2025-09-16', 17000.00);
INSERT INTO public.pedido VALUES (19, '2025-09-16', 2250.00);
INSERT INTO public.pedido VALUES (20, '2025-09-16', 2700.00);
INSERT INTO public.pedido VALUES (21, '2025-09-16', 2700.00);
INSERT INTO public.pedido VALUES (22, '2025-09-16', 2700.00);
INSERT INTO public.pedido VALUES (23, '2025-09-16', 2700.00);
INSERT INTO public.pedido VALUES (24, '2025-09-16', 2700.00);
INSERT INTO public.pedido VALUES (25, '2025-09-16', 3500.00);
INSERT INTO public.pedido VALUES (26, '2025-09-16', 2250.00);
INSERT INTO public.pedido VALUES (27, '2025-09-16', 38000.00);
INSERT INTO public.pedido VALUES (28, '2025-09-16', 3500.00);
INSERT INTO public.pedido VALUES (29, '2025-09-16', 3500.00);
INSERT INTO public.pedido VALUES (30, '2025-09-16', 38000.00);
INSERT INTO public.pedido VALUES (31, '2025-09-16', 3500.00);
INSERT INTO public.pedido VALUES (32, '2025-09-16', 38000.00);
INSERT INTO public.pedido VALUES (33, '2025-09-16', 38000.00);
INSERT INTO public.pedido VALUES (34, '2025-09-16', 17000.00);
INSERT INTO public.pedido VALUES (35, '2025-09-16', 3500.00);
INSERT INTO public.pedido VALUES (36, '2025-09-16', 38000.00);
INSERT INTO public.pedido VALUES (37, '2025-09-16', 3500.00);
INSERT INTO public.pedido VALUES (38, '2025-09-16', 3500.00);
INSERT INTO public.pedido VALUES (39, '2025-09-16', 3500.00);
INSERT INTO public.pedido VALUES (40, '2025-09-16', 3500.00);
INSERT INTO public.pedido VALUES (41, '2025-09-16', 38000.00);
INSERT INTO public.pedido VALUES (42, '2025-09-16', 38000.00);
INSERT INTO public.pedido VALUES (43, '2025-09-16', 3500.00);
INSERT INTO public.pedido VALUES (44, '2025-09-16', 38000.00);
INSERT INTO public.pedido VALUES (45, '2025-09-16', 38000.00);
INSERT INTO public.pedido VALUES (46, '2025-09-16', 2250.00);
INSERT INTO public.pedido VALUES (47, '2025-09-16', 2250.00);
INSERT INTO public.pedido VALUES (48, '2025-09-16', 3500.00);
INSERT INTO public.pedido VALUES (49, '2025-09-16', 2250.00);


--
-- Data for Name: pedido_detalle; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.pedido_detalle VALUES (9, 13, 9, 1);
INSERT INTO public.pedido_detalle VALUES (10, 13, 8, 2);
INSERT INTO public.pedido_detalle VALUES (11, 14, 40, 2);
INSERT INTO public.pedido_detalle VALUES (12, 15, 22, 1);
INSERT INTO public.pedido_detalle VALUES (13, 16, 9, 1);
INSERT INTO public.pedido_detalle VALUES (14, 17, 6, 1);
INSERT INTO public.pedido_detalle VALUES (15, 18, 6, 1);
INSERT INTO public.pedido_detalle VALUES (16, 19, 8, 1);
INSERT INTO public.pedido_detalle VALUES (17, 20, 9, 1);
INSERT INTO public.pedido_detalle VALUES (18, 21, 9, 1);
INSERT INTO public.pedido_detalle VALUES (19, 22, 9, 1);
INSERT INTO public.pedido_detalle VALUES (20, 23, 9, 1);
INSERT INTO public.pedido_detalle VALUES (21, 24, 9, 1);
INSERT INTO public.pedido_detalle VALUES (22, 25, 20, 1);
INSERT INTO public.pedido_detalle VALUES (23, 26, 44, 1);
INSERT INTO public.pedido_detalle VALUES (24, 27, 13, 1);
INSERT INTO public.pedido_detalle VALUES (25, 28, 20, 1);
INSERT INTO public.pedido_detalle VALUES (26, 29, 20, 1);
INSERT INTO public.pedido_detalle VALUES (27, 30, 13, 1);
INSERT INTO public.pedido_detalle VALUES (28, 31, 20, 1);
INSERT INTO public.pedido_detalle VALUES (29, 32, 13, 1);
INSERT INTO public.pedido_detalle VALUES (30, 33, 13, 1);
INSERT INTO public.pedido_detalle VALUES (31, 34, 6, 1);
INSERT INTO public.pedido_detalle VALUES (32, 35, 20, 1);
INSERT INTO public.pedido_detalle VALUES (33, 36, 13, 1);
INSERT INTO public.pedido_detalle VALUES (34, 37, 20, 1);
INSERT INTO public.pedido_detalle VALUES (35, 38, 20, 1);
INSERT INTO public.pedido_detalle VALUES (36, 39, 20, 1);
INSERT INTO public.pedido_detalle VALUES (37, 40, 20, 1);
INSERT INTO public.pedido_detalle VALUES (38, 41, 13, 1);
INSERT INTO public.pedido_detalle VALUES (39, 42, 13, 1);
INSERT INTO public.pedido_detalle VALUES (40, 43, 20, 1);
INSERT INTO public.pedido_detalle VALUES (41, 44, 13, 1);
INSERT INTO public.pedido_detalle VALUES (42, 45, 13, 1);
INSERT INTO public.pedido_detalle VALUES (43, 46, 44, 1);
INSERT INTO public.pedido_detalle VALUES (44, 47, 44, 1);
INSERT INTO public.pedido_detalle VALUES (45, 48, 20, 1);
INSERT INTO public.pedido_detalle VALUES (46, 49, 44, 1);


--
-- Data for Name: product_images; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.product_images VALUES (5, 5, 'shekere.jpg', 'Imagen de Shekeres. Instrumento. Música. Artesanía.', true, '2025-06-25 16:11:33.614215');
INSERT INTO public.product_images VALUES (6, 6, 'antique-upright-piano.jpg', 'Imagen de Antiguo Piano Aleman Con Candelabros.', true, '2025-06-25 16:11:33.614215');
INSERT INTO public.product_images VALUES (8, 8, 'electronic-organ.jpg', 'Imagen de Teclado Organo Electronico Musical Instrumento 54 Teclas', true, '2025-06-25 16:11:33.614215');
INSERT INTO public.product_images VALUES (9, 9, 'percussion-set.jpg', 'Imagen de Instrumentos De Percusión Niños Set Musical Con Estuche', true, '2025-06-25 16:11:33.614215');
INSERT INTO public.product_images VALUES (11, 11, 'acoustic-guitar.jpg', 'Imagen de Guitarra Acústica Yamaha', true, '2025-06-25 16:11:33.614215');
INSERT INTO public.product_images VALUES (12, 12, 'electric-guitar.jpg', 'Imagen de Guitarra Eléctrica Fender', true, '2025-06-25 16:11:33.614215');
INSERT INTO public.product_images VALUES (13, 13, 'electric-bass.jpg', 'Imagen de Bajo Eléctrico Fender', true, '2025-06-25 16:11:33.614215');
INSERT INTO public.product_images VALUES (14, 14, 'violin.jpg', 'Imagen de Violín Stentor', true, '2025-06-25 16:11:33.614215');
INSERT INTO public.product_images VALUES (15, 15, 'classical-guitar.jpg', 'Imagen de Guitarra Clásica Criolla', true, '2025-06-25 16:11:33.614215');
INSERT INTO public.product_images VALUES (16, 16, 'alto-saxophone.jpg', 'Imagen de Saxofón Alto Yamaha', true, '2025-06-25 16:11:33.614215');
INSERT INTO public.product_images VALUES (17, 17, 'trumpet.jpg', 'Imagen de Trompeta Bach', true, '2025-06-25 16:11:33.614215');
INSERT INTO public.product_images VALUES (18, 18, 'flute.jpg', 'Imagen de Flauta Traversa Pearl', true, '2025-06-25 16:11:33.614215');
INSERT INTO public.product_images VALUES (19, 19, 'clarinet.jpg', 'Imagen de Clarinete Buffet', true, '2025-06-25 16:11:33.614215');
INSERT INTO public.product_images VALUES (20, 20, 'harmonica.jpg', 'Imagen de Armónica Hohner', true, '2025-06-25 16:11:33.614215');
INSERT INTO public.product_images VALUES (21, 21, 'drum-kit.jpg', 'Imagen de Batería Pearl Export', true, '2025-06-25 16:11:33.614215');
INSERT INTO public.product_images VALUES (22, 22, 'cajon.jpg', 'Imagen de Cajón Peruano', true, '2025-06-25 16:11:33.614215');
INSERT INTO public.product_images VALUES (23, 23, 'bongos.jpg', 'Imagen de Bongos LP', true, '2025-06-25 16:11:33.614215');
INSERT INTO public.product_images VALUES (24, 24, 'cymbals.jpg', 'Imagen de Platillos Zildjian', true, '2025-06-25 16:11:33.614215');
INSERT INTO public.product_images VALUES (25, 25, 'digital-piano.jpg', 'Imagen de Piano Digital Casio', true, '2025-06-25 16:11:33.614215');
INSERT INTO public.product_images VALUES (26, 26, 'keyboard.jpg', 'Imagen de Teclado Yamaha', true, '2025-06-25 16:11:33.614215');
INSERT INTO public.product_images VALUES (27, 27, 'upright-piano.jpg', 'Imagen de Piano Acústico Vertical', true, '2025-06-25 16:11:33.614215');
INSERT INTO public.product_images VALUES (28, 28, 'synthesizer.jpg', 'Imagen de Sintetizador Roland', true, '2025-06-25 16:11:33.614215');
INSERT INTO public.product_images VALUES (29, 29, 'midi-controller.jpg', 'Imagen de Controlador MIDI', true, '2025-06-25 16:11:33.614215');
INSERT INTO public.product_images VALUES (31, 31, 'mandolin.jpg', 'Imagen de Mandolina Instrumento Musical Stagg Sunburst', true, '2025-06-25 16:11:33.614215');
INSERT INTO public.product_images VALUES (32, 32, 'tambourine.jpg', 'Imagen de Pandereta Pandero Instrumento Musical', true, '2025-06-25 16:11:33.614215');
INSERT INTO public.product_images VALUES (40, 40, 'toy-drum-kit.jpg', 'Imagen de Batería Musical Infantil Juguete Niño 9 Piezas Palillos', true, '2025-06-25 16:11:33.614215');
INSERT INTO public.product_images VALUES (43, 43, 'triangle.jpg', 'Imagen de Triangulo Musical 24 Cm Percusion', true, '2025-06-25 16:11:33.614215');
INSERT INTO public.product_images VALUES (44, 44, 'bar-chimes.jpg', 'Imagen de Bar Chimes Lp Cortina Musical 72 Barras', true, '2025-06-25 16:11:33.614215');
INSERT INTO public.product_images VALUES (47, 47, 'ukulele.jpg', 'Imagen de Guitarra Ukelele Infantil Grande 60cm', true, '2025-06-25 16:11:33.614215');
INSERT INTO public.product_images VALUES (30, 30, 'audio-interface.jpg', 'Imagen de Interfaz de Audio', false, '2025-06-25 16:11:33.614215');


--
-- Name: categoria_instrumento_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.categoria_instrumento_id_seq', 29, true);


--
-- Name: instrumento_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.instrumento_id_seq', 68, true);


--
-- Name: pedido_detalle_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.pedido_detalle_id_seq', 46, true);


--
-- Name: pedido_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.pedido_id_seq', 49, true);


--
-- Name: product_images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.product_images_id_seq', 63, true);


--
-- PostgreSQL database dump complete
--

