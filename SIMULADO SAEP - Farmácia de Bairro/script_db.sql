-- SAEP - Sistema de Gestão de Farmácia
-- Script de Criação e População do Banco de Dados
-- Database: saep_db

-- Tabela de Usuários
CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    senha VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    cargo VARCHAR(50),
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Fabricantes
CREATE TABLE IF NOT EXISTS fabricantes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(100) NOT NULL,
    cnpj VARCHAR(18) UNIQUE,
    telefone VARCHAR(20),
    email VARCHAR(100),
    endereco TEXT,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Produtos
CREATE TABLE IF NOT EXISTS produtos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(200) NOT NULL,
    descricao TEXT,
    lote VARCHAR(50) NOT NULL,
    data_fabricacao DATE NOT NULL,
    data_validade DATE NOT NULL,
    quantidade_estoque INTEGER NOT NULL DEFAULT 0,
    estoque_minimo INTEGER NOT NULL DEFAULT 10,
    preco DECIMAL(10, 2),
    fabricante_id INTEGER,
    controle_especial BOOLEAN DEFAULT 0,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fabricante_id) REFERENCES fabricantes(id)
);

-- Tabela de Movimentações
CREATE TABLE IF NOT EXISTS movimentacoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    produto_id INTEGER NOT NULL,
    tipo VARCHAR(10) NOT NULL CHECK(tipo IN ('entrada', 'saida')),
    quantidade INTEGER NOT NULL,
    data_movimentacao DATE NOT NULL,
    usuario_id INTEGER NOT NULL,
    observacao TEXT,
    data_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (produto_id) REFERENCES produtos(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- População do Banco de Dados

-- Inserir Usuários
INSERT INTO usuarios (nome, username, senha, email, cargo) VALUES
('João Silva', 'joao', '123456', 'joao@farmacia.com', 'Gerente'),
('Maria Santos', 'maria', '123456', 'maria@farmacia.com', 'Farmacêutica'),
('Pedro Oliveira', 'pedro', '123456', 'pedro@farmacia.com', 'Auxiliar');

-- Inserir Fabricantes
INSERT INTO fabricantes (nome, cnpj, telefone, email, endereco) VALUES
('EMS Pharma', '57.507.378/0001-01', '(11) 3456-7890', 'contato@ems.com.br', 'São Paulo, SP'),
('Medley Farmacêutica', '45.992.062/0001-65', '(21) 2345-6789', 'sac@medley.com.br', 'Rio de Janeiro, RJ'),
('Eurofarma Laboratórios', '61.190.096/0001-92', '(11) 5555-1234', 'atendimento@eurofarma.com.br', 'São Paulo, SP');

-- Inserir Produtos
INSERT INTO produtos (nome, descricao, lote, data_fabricacao, data_validade, quantidade_estoque, estoque_minimo, preco, fabricante_id, controle_especial) VALUES
('Dipirona 500mg', 'Analgésico e antipirético', 'L001234', '2024-01-15', '2026-01-15', 150, 50, 8.50, 1, 0),
('Paracetamol 750mg', 'Analgésico e antitérmico', 'L005678', '2024-02-10', '2026-02-10', 200, 60, 12.30, 2, 0),
('Amoxicilina 500mg', 'Antibiótico', 'L009012', '2024-03-05', '2025-03-05', 80, 40, 25.90, 3, 0),
('Losartana 50mg', 'Anti-hipertensivo', 'L003456', '2024-01-20', '2026-01-20', 120, 30, 18.75, 1, 0),
('Omeprazol 20mg', 'Inibidor de bomba de prótons', 'L007890', '2024-02-15', '2025-12-15', 90, 40, 22.40, 2, 0),
('Rivotril 2mg', 'Ansiolítico - Controle Especial', 'L002345', '2024-01-10', '2025-06-10', 30, 20, 45.80, 3, 1);

-- Inserir Movimentações
INSERT INTO movimentacoes (produto_id, tipo, quantidade, data_movimentacao, usuario_id, observacao) VALUES
(1, 'entrada', 100, '2024-01-20', 1, 'Compra inicial de estoque'),
(1, 'saida', 25, '2024-02-01', 2, 'Venda para cliente'),
(2, 'entrada', 150, '2024-02-15', 1, 'Reposição de estoque'),
(3, 'entrada', 50, '2024-03-10', 1, 'Compra de antibióticos'),
(3, 'saida', 15, '2024-03-15', 2, 'Venda com receita médica'),
(4, 'entrada', 80, '2024-01-25', 1, 'Estoque de medicamentos de uso contínuo');
