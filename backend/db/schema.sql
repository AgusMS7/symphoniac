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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: categoria_instrumento; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categoria_instrumento (
    id bigint NOT NULL,
    denominacion character varying(100) NOT NULL
);


--
-- Name: TABLE categoria_instrumento; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.categoria_instrumento IS 'Tabla que almacena las categorías de instrumentos';


--
-- Name: COLUMN categoria_instrumento.id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.categoria_instrumento.id IS 'Identificador único de la categoría';


--
-- Name: COLUMN categoria_instrumento.denominacion; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.categoria_instrumento.denominacion IS 'Nombre de la categoría';


--
-- Name: categoria_instrumento_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.categoria_instrumento_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: categoria_instrumento_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.categoria_instrumento_id_seq OWNED BY public.categoria_instrumento.id;


--
-- Name: instrumento; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.instrumento (
    id bigint NOT NULL,
    instrumento character varying(255) NOT NULL,
    marca character varying(100) NOT NULL,
    modelo character varying(100) NOT NULL,
    imagen character varying(255) DEFAULT ''::character varying,
    precio numeric(10,2) NOT NULL,
    costo_envio character varying(10) DEFAULT '0'::character varying,
    cantidadvendida integer DEFAULT 0,
    descripcion text DEFAULT ''::text,
    id_categoria bigint,
    cantidad_vendida integer DEFAULT 0
);


--
-- Name: TABLE instrumento; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.instrumento IS 'Tabla que almacena la información de los instrumentos musicales';


--
-- Name: COLUMN instrumento.id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.instrumento.id IS 'Identificador único del instrumento';


--
-- Name: COLUMN instrumento.instrumento; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.instrumento.instrumento IS 'Nombre del instrumento';


--
-- Name: COLUMN instrumento.marca; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.instrumento.marca IS 'Marca del instrumento';


--
-- Name: COLUMN instrumento.modelo; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.instrumento.modelo IS 'Modelo del instrumento';


--
-- Name: COLUMN instrumento.imagen; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.instrumento.imagen IS 'Nombre del archivo de imagen principal';


--
-- Name: COLUMN instrumento.precio; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.instrumento.precio IS 'Precio del instrumento';


--
-- Name: COLUMN instrumento.costo_envio; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.instrumento.costo_envio IS 'Costo de envío (G para gratis)';


--
-- Name: COLUMN instrumento.cantidadvendida; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.instrumento.cantidadvendida IS 'Cantidad de unidades vendidas';


--
-- Name: COLUMN instrumento.descripcion; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.instrumento.descripcion IS 'Descripción detallada del instrumento';


--
-- Name: COLUMN instrumento.id_categoria; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.instrumento.id_categoria IS 'Referencia a la categoría del instrumento';


--
-- Name: COLUMN instrumento.cantidad_vendida; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.instrumento.cantidad_vendida IS 'Cantidad de unidades vendidas';


--
-- Name: instrumento_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.instrumento_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: instrumento_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.instrumento_id_seq OWNED BY public.instrumento.id;


--
-- Name: pedido; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pedido (
    id bigint NOT NULL,
    fecha_pedido date NOT NULL,
    total_pedido numeric(10,2) NOT NULL
);


--
-- Name: pedido_detalle; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pedido_detalle (
    id bigint NOT NULL,
    pedido_id bigint NOT NULL,
    instrumento_id bigint NOT NULL,
    cantidad integer NOT NULL
);


--
-- Name: pedido_detalle_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.pedido_detalle_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: pedido_detalle_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.pedido_detalle_id_seq OWNED BY public.pedido_detalle.id;


--
-- Name: pedido_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.pedido_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: pedido_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.pedido_id_seq OWNED BY public.pedido.id;


--
-- Name: product_images; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_images (
    id bigint NOT NULL,
    instrumento_id bigint NOT NULL,
    image_url character varying(500) NOT NULL,
    alt_text character varying(255),
    is_primary boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: TABLE product_images; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.product_images IS 'Tabla que almacena las imágenes de los instrumentos musicales';


--
-- Name: COLUMN product_images.id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.product_images.id IS 'Identificador único de la imagen';


--
-- Name: COLUMN product_images.instrumento_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.product_images.instrumento_id IS 'Referencia al instrumento';


--
-- Name: COLUMN product_images.image_url; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.product_images.image_url IS 'Nombre del archivo de imagen';


--
-- Name: COLUMN product_images.alt_text; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.product_images.alt_text IS 'Texto alternativo para la imagen';


--
-- Name: COLUMN product_images.is_primary; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.product_images.is_primary IS 'Indica si es la imagen principal del instrumento';


--
-- Name: COLUMN product_images.created_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.product_images.created_at IS 'Fecha y hora de creación del registro';


--
-- Name: product_images_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.product_images_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: product_images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.product_images_id_seq OWNED BY public.product_images.id;


--
-- Name: categoria_instrumento id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categoria_instrumento ALTER COLUMN id SET DEFAULT nextval('public.categoria_instrumento_id_seq'::regclass);


--
-- Name: instrumento id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.instrumento ALTER COLUMN id SET DEFAULT nextval('public.instrumento_id_seq'::regclass);


--
-- Name: pedido id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pedido ALTER COLUMN id SET DEFAULT nextval('public.pedido_id_seq'::regclass);


--
-- Name: pedido_detalle id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pedido_detalle ALTER COLUMN id SET DEFAULT nextval('public.pedido_detalle_id_seq'::regclass);


--
-- Name: product_images id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_images ALTER COLUMN id SET DEFAULT nextval('public.product_images_id_seq'::regclass);


--
-- Name: categoria_instrumento categoria_instrumento_denominacion_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categoria_instrumento
    ADD CONSTRAINT categoria_instrumento_denominacion_key UNIQUE (denominacion);


--
-- Name: categoria_instrumento categoria_instrumento_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categoria_instrumento
    ADD CONSTRAINT categoria_instrumento_pkey PRIMARY KEY (id);


--
-- Name: instrumento instrumento_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.instrumento
    ADD CONSTRAINT instrumento_pkey PRIMARY KEY (id);


--
-- Name: pedido_detalle pedido_detalle_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pedido_detalle
    ADD CONSTRAINT pedido_detalle_pkey PRIMARY KEY (id);


--
-- Name: pedido pedido_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pedido
    ADD CONSTRAINT pedido_pkey PRIMARY KEY (id);


--
-- Name: product_images product_images_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT product_images_pkey PRIMARY KEY (id);


--
-- Name: idx_instrumento_categoria; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_instrumento_categoria ON public.instrumento USING btree (id_categoria);


--
-- Name: idx_instrumento_marca; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_instrumento_marca ON public.instrumento USING btree (marca);


--
-- Name: idx_instrumento_precio; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_instrumento_precio ON public.instrumento USING btree (precio);


--
-- Name: idx_pedido_detalle_instrumento; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_pedido_detalle_instrumento ON public.pedido_detalle USING btree (instrumento_id);


--
-- Name: idx_pedido_detalle_pedido; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_pedido_detalle_pedido ON public.pedido_detalle USING btree (pedido_id);


--
-- Name: idx_pedido_fecha; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_pedido_fecha ON public.pedido USING btree (fecha_pedido);


--
-- Name: idx_product_images_instrumento; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_product_images_instrumento ON public.product_images USING btree (instrumento_id);


--
-- Name: idx_product_images_primary; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_product_images_primary ON public.product_images USING btree (is_primary);


--
-- Name: instrumento fk_instrumento_categoria; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.instrumento
    ADD CONSTRAINT fk_instrumento_categoria FOREIGN KEY (id_categoria) REFERENCES public.categoria_instrumento(id);


--
-- Name: product_images fk_product_images_instrumento; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT fk_product_images_instrumento FOREIGN KEY (instrumento_id) REFERENCES public.instrumento(id) ON DELETE CASCADE;


--
-- Name: pedido_detalle pedido_detalle_instrumento_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pedido_detalle
    ADD CONSTRAINT pedido_detalle_instrumento_id_fkey FOREIGN KEY (instrumento_id) REFERENCES public.instrumento(id) ON DELETE CASCADE;


--
-- Name: pedido_detalle pedido_detalle_pedido_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pedido_detalle
    ADD CONSTRAINT pedido_detalle_pedido_id_fkey FOREIGN KEY (pedido_id) REFERENCES public.pedido(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

