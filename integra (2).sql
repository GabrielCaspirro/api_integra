-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 29/09/2025 às 00:22
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `integra`
--
CREATE DATABASE IF NOT EXISTS `integra` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `integra`;

-- --------------------------------------------------------

--
-- Estrutura para tabela `administrador`
--

CREATE TABLE `administrador` (
  `id_administrador` int(11) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `data_cadastro` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `aluno`
--

CREATE TABLE `aluno` (
  `id_aluno` int(11) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `data_cadastro` timestamp NOT NULL DEFAULT current_timestamp(),
  `curso` varchar(100) DEFAULT NULL,
  `rm` varchar(20) DEFAULT NULL,
  `modulo_ano` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `aluno`
--

INSERT INTO `aluno` (`id_aluno`, `nome`, `email`, `senha`, `telefone`, `data_cadastro`, `curso`, `rm`, `modulo_ano`) VALUES
(1, 'Ana Clara', 'aanaclarasilvaxavierr@gmail.com', '$2b$10$gOSzSzfeDDglpVg7X920euUCWn/nddseLmI3JhitkwRJ6LwM2fbji', NULL, '2025-09-06 22:29:26', NULL, '23222', NULL),
(2, 'Diego', 'diegodf_82@yahoo.com.br', '$2b$10$5rMMPK6Pfa2oERETVvbTMed5pT2sEtc25EquSYjmhga9qdHiw.O.i', NULL, '2025-09-07 00:11:46', NULL, '23222', NULL),
(3, 'Gabriel', 'gabriel.demarchi@etec.sp.gov.br', '$2b$10$1ozGwQPu3tApqP/gQ79MluMUByzuSeT93QG2MbS0pW39koHggJ8i6', NULL, '2025-09-07 00:25:54', NULL, '23223', NULL),
(5, 'Catarina Nina', 'gabriel.demarcho@etec.sp.gov.br', '$2b$10$iqxu8Li/JP2cpPbRA5Hbtec3xRUltgHIl2p5bV8wWJ3yUvIZxTV36', NULL, '2025-09-08 02:35:17', NULL, '23223', NULL);

-- --------------------------------------------------------

--
-- Estrutura para tabela `coordenador`
--

CREATE TABLE `coordenador` (
  `id_coordenador` int(11) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `data_cadastro` timestamp NOT NULL DEFAULT current_timestamp(),
  `matricula` varchar(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `coordenador`
--

INSERT INTO `coordenador` (`id_coordenador`, `nome`, `email`, `senha`, `telefone`, `data_cadastro`, `matricula`) VALUES
(1, 'Evanilson Fabrega', 'evan@email.com', '$2b$10$pYxBabdxxv9D2IZHSnFxWuG4pKn9rOBLdCGZTB8ewhuXJMGE2mDYy', NULL, '2025-09-07 01:19:42', '1004'),
(2, 'Evanilson Fabrega 2', 'evan@etec.sp.gov.br', '$2b$10$zgoqxoO4PEBctF21uk78FuMx2U2LLwdIYUkj9AO/5WTm7s1hwwSoO', NULL, '2025-09-07 01:20:24', '1005');

-- --------------------------------------------------------

--
-- Estrutura para tabela `coordenador_instituicao`
--

CREATE TABLE `coordenador_instituicao` (
  `id` int(11) NOT NULL,
  `id_coordenador` int(11) NOT NULL,
  `id_instituicao` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `empresa`
--

CREATE TABLE `empresa` (
  `id_empresa` int(11) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `data_cadastro` timestamp NOT NULL DEFAULT current_timestamp(),
  `setor` varchar(100) DEFAULT NULL,
  `cnpj` varchar(18) NOT NULL,
  `id_endereco` int(11) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `empresa`
--

INSERT INTO `empresa` (`id_empresa`, `nome`, `email`, `senha`, `telefone`, `data_cadastro`, `setor`, `cnpj`, `id_endereco`, `logo`) VALUES
(12, 'TechPlusPlus 6 Ltda', 'contato222@techplusplus6.com.br', '$2b$10$xWrh3ZLKFRw4yCG76X5N9ODLYpb.6ZPHNH7jYZRgnSADOlQRnQNb6', '(11) 4022-8922', '2025-09-06 21:20:33', 'Tecnologia', '12.345.228/0001-90', 17, NULL),
(13, 'Comaia', 'aanaclarasilvaxavierr@gmail.com', '$2b$10$waBVTC1BuKuj9taFziXmlehFDRSxxnSBbc1lpIQiCnNC38D0k87fu', '(11) 4021-8922', '2025-09-06 22:28:22', 'Tecnologia', '12.345.228/1101-90', 18, NULL),
(14, 'Comaia 2', 'gabriel.gcd08@gmail.com', '$2b$10$1xurroXCSYnvaZ4je9MzNOtcL7ybChd/JVTfRMrelMIbhVPMfiOOu', '(11) 4021-8922', '2025-09-07 01:17:31', 'Tecnologia', '12.345.228/1121-90', 21, NULL),
(29, 'Empresa de Teste', 'empresadeteste@email.com', '$2b$10$9eKb4LNW4gwWT/3zE8aRKuTeI3Ohqa2osKhEIFNr73eV3GxkKUhUW', NULL, '2025-09-23 13:50:27', 'Consultoria Empresarial', '10.100.111/1111-00', 45, 'uploads/empresas/1758635420028-184442694.jpg'),
(30, 'Empresa Joao', 'joaopedromorangoni@gmail.com', '$2b$10$nhWTYnXLpN7zDHpniMmaGePzMQkvSQEvGdg9I0wfIBixkoSyLZ8Si', NULL, '2025-09-23 15:26:29', 'Construção Civil', '11.111.111/1111-11', 46, 'uploads/empresas/1758641187980-612072156.jpg');

-- --------------------------------------------------------

--
-- Estrutura para tabela `endereco`
--

CREATE TABLE `endereco` (
  `id_endereco` int(11) NOT NULL,
  `rua` varchar(255) DEFAULT NULL,
  `numero` varchar(10) DEFAULT NULL,
  `bairro` varchar(100) DEFAULT NULL,
  `cidade` varchar(100) DEFAULT NULL,
  `estado` char(2) DEFAULT NULL,
  `cep` varchar(9) DEFAULT NULL,
  `complemento` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `endereco`
--

INSERT INTO `endereco` (`id_endereco`, `rua`, `numero`, `bairro`, `cidade`, `estado`, `cep`, `complemento`) VALUES
(4, NULL, NULL, 'Ponte Seca', 'Ribeirão Pires', 'Sã', '09412-350', '(Jd Valentina)'),
(5, 'Rua Ana Lacivita Amaral', '332', 'Ponte Seca', 'Ribeirão Pires', 'SP', '09412-350', '(Jd Valentina)'),
(6, 'Praça da Sé', NULL, 'Sé', 'São Paulo', 'SP', '01001-000', 'lado ímpar'),
(7, 'Rua Filipe de Oliveira', NULL, 'Sé', 'São Paulo', 'SP', '01001-010', ''),
(8, 'Rua Ana Lacivita Amaral', NULL, 'Ponte Seca', 'Ribeirão Pires', 'SP', '09412-350', '(Jd Valentina)'),
(9, 'Rua Ana Lacivita Amaral', NULL, 'Ponte Seca', 'Ribeirão Pires', 'SP', '09412-350', '(Jd Valentina)'),
(10, 'Rua Ana Lacivita Amaral', NULL, 'Ponte Seca', 'Ribeirão Pires', 'SP', '09412-350', '(Jd Valentina)'),
(11, 'Rua Ana Lacivita Amaral', NULL, 'Ponte Seca', 'Ribeirão Pires', 'SP', '09412-350', '(Jd Valentina)'),
(12, 'Rua Ana Lacivita Amaral', NULL, 'Ponte Seca', 'Ribeirão Pires', 'SP', '09412-350', '(Jd Valentina)'),
(13, 'Rua Ana Lacivita Amaral', NULL, 'Ponte Seca', 'Ribeirão Pires', 'SP', '09412-350', '(Jd Valentina)'),
(14, 'Rua Ana Lacivita Amaral', NULL, 'Ponte Seca', 'Ribeirão Pires', 'SP', '09412-350', '(Jd Valentina)'),
(15, 'Rua Ana Lacivita Amaral', NULL, 'Ponte Seca', 'Ribeirão Pires', 'SP', '09412-350', '(Jd Valentina)'),
(16, 'Rua Ana Lacivita Amaral', NULL, 'Ponte Seca', 'Ribeirão Pires', 'SP', '09412-350', '(Jd Valentina)'),
(17, 'Rua Ana Lacivita Amaral', NULL, 'Ponte Seca', 'Ribeirão Pires', 'SP', '09412-350', '(Jd Valentina)'),
(18, 'Rua Ana Lacivita Amaral', NULL, 'Ponte Seca', 'Ribeirão Pires', 'SP', '09412-350', '(Jd Valentina)'),
(19, 'Rua Bélgica', NULL, 'Centro', 'Ribeirão Pires', 'SP', '09402-060', '(Vl Dionisi)'),
(20, 'Rua Bélgica', NULL, 'Centro', 'Ribeirão Pires', 'SP', '09402-060', '(Vl Dionisi)'),
(21, 'Rua Ana Lacivita Amaral', NULL, 'Ponte Seca', 'Ribeirão Pires', 'SP', '09412-350', '(Jd Valentina)'),
(22, 'Rua Ana Lacivita Amaral', NULL, 'Ponte Seca', 'Ribeirão Pires', 'SP', '09412-350', '(Jd Valentina)'),
(23, 'Rua Ana Lacivita Amaral', NULL, 'Ponte Seca', 'Ribeirão Pires', 'SP', '09412-350', '(Jd Valentina)'),
(24, 'Rua Ana Lacivita Amaral', NULL, 'Ponte Seca', 'Ribeirão Pires', 'SP', '09412-350', '(Jd Valentina)'),
(25, 'Rua Ana Lacivita Amaral', NULL, 'Ponte Seca', 'Ribeirão Pires', 'SP', '09412-350', '(Jd Valentina)'),
(26, 'Rua Ana Lacivita Amaral', NULL, 'Ponte Seca', 'Ribeirão Pires', 'SP', '09412-350', '(Jd Valentina)'),
(27, 'Rua Ana Lacivita Amaral', NULL, 'Ponte Seca', 'Ribeirão Pires', 'SP', '09412-350', '(Jd Valentina)'),
(28, 'Rua Ana Lacivita Amaral', NULL, 'Ponte Seca', 'Ribeirão Pires', 'SP', '09412-350', '(Jd Valentina)'),
(29, 'Rua Ana Lacivita Amaral', NULL, 'Ponte Seca', 'Ribeirão Pires', 'SP', '09412-350', '(Jd Valentina)'),
(30, 'Rua Ana Lacivita Amaral', NULL, 'Ponte Seca', 'Ribeirão Pires', 'SP', '09412-350', '(Jd Valentina)'),
(31, 'Rua Ana Lacivita Amaral', NULL, 'Ponte Seca', 'Ribeirão Pires', 'SP', '09412-350', '(Jd Valentina)'),
(32, 'Rua Ana Lacivita Amaral', NULL, 'Ponte Seca', 'Ribeirão Pires', 'SP', '09412-350', '(Jd Valentina)'),
(33, 'Rua Ana Lacivita Amaral', NULL, 'Ponte Seca', 'Ribeirão Pires', 'SP', '09412-350', '(Jd Valentina)'),
(34, 'Rua Ana Lacivita Amaral', NULL, 'Ponte Seca', 'Ribeirão Pires', 'SP', '09412-350', '(Jd Valentina)'),
(35, 'Rua Ana Lacivita Amaral', NULL, 'Ponte Seca', 'Ribeirão Pires', 'SP', '09412-350', '(Jd Valentina)'),
(36, 'Rua Ana Lacivita Amaral', NULL, 'Ponte Seca', 'Ribeirão Pires', 'SP', '09412350', '(Jd Valentina)'),
(37, 'Rua Ana Lacivita Amaral', NULL, 'Ponte Seca', 'Ribeirão Pires', 'SP', '09412-350', '(Jd Valentina)'),
(38, 'Rua Ana Lacivita Amaral', NULL, 'Ponte Seca', 'Ribeirão Pires', 'SP', '09412-350', '(Jd Valentina)'),
(39, 'Rua Ana Lacivita Amaral', NULL, 'Ponte Seca', 'Ribeirão Pires', 'SP', '09412350', '(Jd Valentina)'),
(40, 'Rua Ana Lacivita Amaral', NULL, 'Ponte Seca', 'Ribeirão Pires', 'SP', '09412350', '(Jd Valentina)'),
(41, 'Rua Ana Lacivita Amaral', NULL, 'Ponte Seca', 'Ribeirão Pires', 'SP', '09412-350', '(Jd Valentina)'),
(42, 'Rua Ana Lacivita Amaral', NULL, 'Ponte Seca', 'Ribeirão Pires', 'SP', '09412-350', '(Jd Valentina)'),
(43, 'Rua Ana Lacivita Amaral', NULL, 'Ponte Seca', 'Ribeirão Pires', 'SP', '09412-350', '(Jd Valentina)'),
(44, 'Rua Ana Lacivita Amaral', NULL, 'Ponte Seca', 'Ribeirão Pires', 'SP', '09412350', '(Jd Valentina)'),
(45, 'Rua Santa Yolanda', NULL, 'Demarchi', 'São Bernardo do Campo', 'SP', '09820-230', '(Vl Sta Angelina)'),
(46, 'Rua Santa Yolanda', NULL, 'Demarchi', 'São Bernardo do Campo', 'SP', '09820-230', '(Vl Sta Angelina)');

-- --------------------------------------------------------

--
-- Estrutura para tabela `evento`
--

CREATE TABLE `evento` (
  `id` int(11) NOT NULL,
  `nome` varchar(255) DEFAULT NULL,
  `descricao` text DEFAULT NULL,
  `data` date DEFAULT NULL,
  `tipo` enum('palestra','visita_tecnica') DEFAULT NULL,
  `id_empresa` int(11) DEFAULT NULL,
  `id_palestrante` int(11) DEFAULT NULL,
  `id_endereco` int(11) DEFAULT NULL,
  `status` enum('Pendente','Aprovada','Concluída','Cancelado') DEFAULT NULL,
  `valor` decimal(7,2) DEFAULT NULL,
  `opcoes_horarios` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`opcoes_horarios`)),
  `periodo_escolhido` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `evento`
--

INSERT INTO `evento` (`id`, `nome`, `descricao`, `data`, `tipo`, `id_empresa`, `id_palestrante`, `id_endereco`, `status`, `valor`, `opcoes_horarios`, `periodo_escolhido`) VALUES
(1, 'Visita Técnica à Indústria Automotiva 2', 'Uma experiência prática para conhecer os processos de produção e inovação da indústria automotiva.', '2025-03-03', 'visita_tecnica', NULL, NULL, 9, 'Pendente', 10.00, NULL, NULL),
(2, 'Palestra sobre Indústria Automotiva', 'Uma experiência prática para conhecer os processos de produção e inovação da indústria automotiva.', '2025-03-03', 'palestra', NULL, NULL, 10, 'Pendente', 10.00, NULL, NULL),
(3, 'aaa', 'aaaaa', '2025-09-11', 'palestra', NULL, NULL, 36, 'Pendente', 100.00, NULL, NULL),
(4, 'Mais uma visita', 'aaaa', '2025-09-19', 'visita_tecnica', NULL, NULL, 39, 'Pendente', 10.00, NULL, NULL),
(5, 'teste', '111', '2025-09-11', 'visita_tecnica', NULL, NULL, 40, 'Pendente', 15.00, NULL, NULL),
(6, 'teste 4444', 'aaaaa', '2025-09-25', 'visita_tecnica', NULL, NULL, 44, 'Pendente', 10.00, NULL, NULL);

-- --------------------------------------------------------

--
-- Estrutura para tabela `evento_coordenador`
--

CREATE TABLE `evento_coordenador` (
  `id` int(11) NOT NULL,
  `id_evento` int(11) NOT NULL,
  `id_coordenador` int(11) NOT NULL,
  `status` enum('Pendente','Aceito','Recusado') DEFAULT 'Pendente',
  `data_decisao` timestamp NULL DEFAULT NULL,
  `observacao` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `evento_palestrante`
--

CREATE TABLE `evento_palestrante` (
  `id` int(11) NOT NULL,
  `id_evento` int(11) DEFAULT NULL,
  `id_palestrante` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `evento_participante`
--

CREATE TABLE `evento_participante` (
  `id` int(11) NOT NULL,
  `id_evento` int(11) NOT NULL,
  `participante_tipo` enum('aluno','empresa') NOT NULL,
  `participante_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `feedback`
--

CREATE TABLE `feedback` (
  `id` int(11) NOT NULL,
  `id_evento` int(11) NOT NULL,
  `id_aluno` int(11) NOT NULL,
  `id_palestrante` int(11) DEFAULT NULL,
  `nota` int(11) DEFAULT NULL,
  `comentario` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `instituicao`
--

CREATE TABLE `instituicao` (
  `id` int(11) NOT NULL,
  `nome` varchar(255) DEFAULT NULL,
  `id_endereco` int(11) DEFAULT NULL,
  `tipo` enum('ETEC','FATEC') DEFAULT NULL,
  `cod_instituicao` varchar(3) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `senha` varchar(255) DEFAULT NULL,
  `telefone` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `instituicao`
--

INSERT INTO `instituicao` (`id`, `nome`, `id_endereco`, `tipo`, `cod_instituicao`, `email`, `senha`, `telefone`) VALUES
(1, 'ETEC Profa Maria Cristina Medeiros', 19, 'ETEC', '141', 'gabriel.gcd08@gmail.com', '$2b$10$Z5yCwg4GbzGn8nVhRE/F8uc9k0BShpdZag30Ky.pDDs.xVTMFhPLK', '(11) 4021-8921'),
(2, 'ETEC Profa Maria Cristina Medeiros', 20, 'ETEC', '141', 'gabriel.demarchi@etec.sp.gov.br', '$2b$10$YAQoJ0/v5snqF2u7eWe1oOMQNBV34gIpHShNGePIJeRa0IQum56Dy', '(11) 4021-8921'),
(4, 'ETEC sei lá', 25, 'ETEC', '141', 'e@etec.sp.gov.br', '$2b$10$l3puzXOqVz3lhDvqBldZ8uvCXNoVYerVu.77QL4YoZWGfabAmX4NC', '(99) 9999-9999'),
(5, 'Etec Mario', 41, 'ETEC', '134', 'gm.dasilva007@gmail.com', '$2b$10$aY8oZo5A6y4nWbF.CFCtWeEc9EG82eHWhVz8NE73.9X8zoHpQadh2', '(11) 99999-9999'),
(6, 'Etec Mario 2', 42, 'ETEC', '133', 'guilherme.silva2558@etec.sp.gov.br', '$2b$10$50qQWWMa9ykrXxWVmH90SOJI1slFERMdsw5sVe.1CFbiYRvK8NO/W', '(11) 99999-9999'),
(7, 'teste 3', 43, 'ETEC', '131', 'teste2222@etec.sp.gov.br', '$2b$10$OBCAw.wZBe3pXAQpmbvgL.jlzOHlVXiAiC.86SaI7Ov2QfSfQB132', '(99) 99999-9999');

-- --------------------------------------------------------

--
-- Estrutura para tabela `log_evento`
--

CREATE TABLE `log_evento` (
  `id` int(11) NOT NULL,
  `id_evento` int(11) DEFAULT NULL,
  `data_hora` datetime DEFAULT NULL,
  `acao` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `palestrante`
--

CREATE TABLE `palestrante` (
  `id` int(11) NOT NULL,
  `nome` varchar(255) DEFAULT NULL,
  `especialidade` varchar(255) DEFAULT NULL,
  `email` varchar(200) DEFAULT NULL,
  `senha` varchar(200) DEFAULT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `id_empresa` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `palestrante`
--

INSERT INTO `palestrante` (`id`, `nome`, `especialidade`, `email`, `senha`, `telefone`, `bio`, `id_empresa`) VALUES
(11, 'Gabriel Caspirro Demarchi', 'Tecnologia', 'gabriel.gcd08@gmail.com', '$2b$10$0D.9gwbYKrG718R7EAXlC.PXy9e0IVJtIyNjGsXhX8kgCZXx/U2JC', '(99) 99999-9999', NULL, NULL),
(12, 'Gabriel Caspirro Demarchi 2', 'Marketing', 'gabriel@email.com', '$2b$10$Jsgfd1NIik.7aOMYaMngbeDLjD8fYdkcvXtUWuTHkNd.h70f29xAq', '(99) 99991-9999', NULL, NULL),
(13, 'teste', 'Marketing', 'teste@email.com', '$2b$10$sPFfDAi1s7owtaiFJiEBVOiiTeQLx4yU18EDatEnPEaxlyld1Hf9a', '(11) 91111-1121', NULL, NULL),
(14, 'teste22', 'Marketing', 'aaa08@gmail.com', '$2b$10$tiOqeYoufdAK9jB8d92U5eot.tG/iSjKNtRX/59x5ObQZlcmrZNCq', '(11) 99999-9999', NULL, NULL);

-- --------------------------------------------------------

--
-- Estrutura para tabela `solicitacao_palestrante`
--

CREATE TABLE `solicitacao_palestrante` (
  `id` int(11) NOT NULL,
  `id_empresa` int(11) NOT NULL,
  `id_palestrante` int(11) NOT NULL,
  `status` enum('Pendente','Aceito','Recusado') DEFAULT 'Pendente',
  `data_solicitacao` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `administrador`
--
ALTER TABLE `administrador`
  ADD PRIMARY KEY (`id_administrador`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Índices de tabela `aluno`
--
ALTER TABLE `aluno`
  ADD PRIMARY KEY (`id_aluno`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Índices de tabela `coordenador`
--
ALTER TABLE `coordenador`
  ADD PRIMARY KEY (`id_coordenador`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Índices de tabela `coordenador_instituicao`
--
ALTER TABLE `coordenador_instituicao`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id_coordenador` (`id_coordenador`,`id_instituicao`),
  ADD KEY `id_instituicao` (`id_instituicao`);

--
-- Índices de tabela `empresa`
--
ALTER TABLE `empresa`
  ADD PRIMARY KEY (`id_empresa`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `cnpj` (`cnpj`),
  ADD KEY `fk_empresa_endereco` (`id_endereco`);

--
-- Índices de tabela `endereco`
--
ALTER TABLE `endereco`
  ADD PRIMARY KEY (`id_endereco`);

--
-- Índices de tabela `evento`
--
ALTER TABLE `evento`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_evento_endereco` (`id_endereco`),
  ADD KEY `fk_evento_empresa` (`id_empresa`),
  ADD KEY `fk_evento_palestrante` (`id_palestrante`);

--
-- Índices de tabela `evento_coordenador`
--
ALTER TABLE `evento_coordenador`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_eec_evento` (`id_evento`),
  ADD KEY `fk_eec_coordenador` (`id_coordenador`);

--
-- Índices de tabela `evento_palestrante`
--
ALTER TABLE `evento_palestrante`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_evento` (`id_evento`),
  ADD KEY `id_palestrante` (`id_palestrante`);

--
-- Índices de tabela `evento_participante`
--
ALTER TABLE `evento_participante`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_evento` (`id_evento`);

--
-- Índices de tabela `feedback`
--
ALTER TABLE `feedback`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_evento` (`id_evento`),
  ADD KEY `id_aluno` (`id_aluno`),
  ADD KEY `id_palestrante` (`id_palestrante`);

--
-- Índices de tabela `instituicao`
--
ALTER TABLE `instituicao`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_instituicao_endereco` (`id_endereco`);

--
-- Índices de tabela `log_evento`
--
ALTER TABLE `log_evento`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_evento` (`id_evento`);

--
-- Índices de tabela `palestrante`
--
ALTER TABLE `palestrante`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_palestrante_empresa` (`id_empresa`);

--
-- Índices de tabela `solicitacao_palestrante`
--
ALTER TABLE `solicitacao_palestrante`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_empresa` (`id_empresa`),
  ADD KEY `id_palestrante` (`id_palestrante`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `administrador`
--
ALTER TABLE `administrador`
  MODIFY `id_administrador` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `aluno`
--
ALTER TABLE `aluno`
  MODIFY `id_aluno` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de tabela `coordenador`
--
ALTER TABLE `coordenador`
  MODIFY `id_coordenador` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `coordenador_instituicao`
--
ALTER TABLE `coordenador_instituicao`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `empresa`
--
ALTER TABLE `empresa`
  MODIFY `id_empresa` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT de tabela `endereco`
--
ALTER TABLE `endereco`
  MODIFY `id_endereco` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT de tabela `evento`
--
ALTER TABLE `evento`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de tabela `evento_coordenador`
--
ALTER TABLE `evento_coordenador`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `evento_palestrante`
--
ALTER TABLE `evento_palestrante`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `evento_participante`
--
ALTER TABLE `evento_participante`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `feedback`
--
ALTER TABLE `feedback`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `instituicao`
--
ALTER TABLE `instituicao`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de tabela `log_evento`
--
ALTER TABLE `log_evento`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `palestrante`
--
ALTER TABLE `palestrante`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de tabela `solicitacao_palestrante`
--
ALTER TABLE `solicitacao_palestrante`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `coordenador_instituicao`
--
ALTER TABLE `coordenador_instituicao`
  ADD CONSTRAINT `coordenador_instituicao_ibfk_1` FOREIGN KEY (`id_coordenador`) REFERENCES `coordenador` (`id_coordenador`) ON DELETE CASCADE,
  ADD CONSTRAINT `coordenador_instituicao_ibfk_2` FOREIGN KEY (`id_instituicao`) REFERENCES `instituicao` (`id`) ON DELETE CASCADE;

--
-- Restrições para tabelas `empresa`
--
ALTER TABLE `empresa`
  ADD CONSTRAINT `fk_empresa_endereco` FOREIGN KEY (`id_endereco`) REFERENCES `endereco` (`id_endereco`) ON DELETE SET NULL;

--
-- Restrições para tabelas `evento`
--
ALTER TABLE `evento`
  ADD CONSTRAINT `fk_evento_empresa` FOREIGN KEY (`id_empresa`) REFERENCES `empresa` (`id_empresa`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_evento_endereco` FOREIGN KEY (`id_endereco`) REFERENCES `endereco` (`id_endereco`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_evento_palestrante` FOREIGN KEY (`id_palestrante`) REFERENCES `palestrante` (`id`) ON DELETE SET NULL;

--
-- Restrições para tabelas `evento_coordenador`
--
ALTER TABLE `evento_coordenador`
  ADD CONSTRAINT `fk_eec_coordenador` FOREIGN KEY (`id_coordenador`) REFERENCES `coordenador` (`id_coordenador`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_eec_evento` FOREIGN KEY (`id_evento`) REFERENCES `evento` (`id`) ON DELETE CASCADE;

--
-- Restrições para tabelas `evento_palestrante`
--
ALTER TABLE `evento_palestrante`
  ADD CONSTRAINT `evento_palestrante_ibfk_1` FOREIGN KEY (`id_evento`) REFERENCES `evento` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `evento_palestrante_ibfk_2` FOREIGN KEY (`id_palestrante`) REFERENCES `palestrante` (`id`) ON DELETE CASCADE;

--
-- Restrições para tabelas `evento_participante`
--
ALTER TABLE `evento_participante`
  ADD CONSTRAINT `evento_participante_ibfk_1` FOREIGN KEY (`id_evento`) REFERENCES `evento` (`id`) ON DELETE CASCADE;

--
-- Restrições para tabelas `feedback`
--
ALTER TABLE `feedback`
  ADD CONSTRAINT `feedback_ibfk_1` FOREIGN KEY (`id_evento`) REFERENCES `evento` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `feedback_ibfk_2` FOREIGN KEY (`id_aluno`) REFERENCES `aluno` (`id_aluno`) ON DELETE CASCADE,
  ADD CONSTRAINT `feedback_ibfk_3` FOREIGN KEY (`id_palestrante`) REFERENCES `palestrante` (`id`) ON DELETE SET NULL;

--
-- Restrições para tabelas `instituicao`
--
ALTER TABLE `instituicao`
  ADD CONSTRAINT `fk_instituicao_endereco` FOREIGN KEY (`id_endereco`) REFERENCES `endereco` (`id_endereco`) ON DELETE SET NULL;

--
-- Restrições para tabelas `log_evento`
--
ALTER TABLE `log_evento`
  ADD CONSTRAINT `log_evento_ibfk_1` FOREIGN KEY (`id_evento`) REFERENCES `evento` (`id`) ON DELETE CASCADE;

--
-- Restrições para tabelas `palestrante`
--
ALTER TABLE `palestrante`
  ADD CONSTRAINT `fk_palestrante_empresa` FOREIGN KEY (`id_empresa`) REFERENCES `empresa` (`id_empresa`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Restrições para tabelas `solicitacao_palestrante`
--
ALTER TABLE `solicitacao_palestrante`
  ADD CONSTRAINT `solicitacao_palestrante_ibfk_1` FOREIGN KEY (`id_empresa`) REFERENCES `empresa` (`id_empresa`) ON DELETE CASCADE,
  ADD CONSTRAINT `solicitacao_palestrante_ibfk_2` FOREIGN KEY (`id_palestrante`) REFERENCES `palestrante` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
