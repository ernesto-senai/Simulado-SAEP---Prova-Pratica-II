-- =========================================================
-- Simulado SAEP - Gerenciador de eventos
-- Banco de dados MySQL
-- =========================================================

DROP DATABASE IF EXISTS gerenciador_eventos;
CREATE DATABASE gerenciador_eventos
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE gerenciador_eventos;

-- Palestrante: nome e e-mail (e-mail não pode se repetir)
CREATE TABLE palestrante (
  id_palestrante INT AUTO_INCREMENT PRIMARY KEY,
  nome           VARCHAR(100) NOT NULL,
  email          VARCHAR(150) NOT NULL UNIQUE
);

-- Evento: nome, descrição, local e o palestrante vinculado (chave estrangeira)
CREATE TABLE evento (
  id_evento      INT AUTO_INCREMENT PRIMARY KEY,
  nome           VARCHAR(150) NOT NULL,
  descricao      VARCHAR(255) NOT NULL,
  local_evento   VARCHAR(150) NOT NULL,
  id_palestrante INT NOT NULL,
  CONSTRAINT fk_evento_palestrante
    FOREIGN KEY (id_palestrante) REFERENCES palestrante (id_palestrante)
);

-- Dados iniciais (os mesmos do protótipo)
INSERT INTO palestrante (nome, email) VALUES
  ('Isabel', 'isabel@email.com'),
  ('André',  'andre@email.com'),
  ('Rafael', 'rafael@email.com'),
  ('Maria',  'maria@email.com');

INSERT INTO evento (nome, descricao, local_evento, id_palestrante) VALUES
  ('Palestra setembro amarelo',  'Refletir sobre a saúde mental',  'Auditório 1',     1),
  ('Indústria 4.0',              'Como a indústria 4.0 funciona',  'Laboratório 3',   2),
  ('Computação em nuvem',        'Como a nuvem da AWS funciona',   'Sala 12',         3),
  ('Palestra mulheres na TI',    'Mercado de TI para mulheres',    'Auditório 2',     4);

-- =========================================================
-- Consultas para comprovar que os dados foram gravados
-- (rode depois de cada cadastro, edição ou exclusão)
-- =========================================================
-- SELECT * FROM palestrante;
-- SELECT * FROM evento;
--
-- SELECT e.id_evento, e.nome, e.descricao, e.local_evento, p.nome AS palestrante
-- FROM evento e
-- INNER JOIN palestrante p ON p.id_palestrante = e.id_palestrante;
