# Sistema de Gestão de Farmácia - Documentação Completa

## ENTREGA 01 - Requisitos Funcionais

### Requisitos de Autenticação
- **RF01**: O sistema deve permitir autenticação de usuários com username e senha
- **RF02**: O sistema deve informar o motivo de falha na autenticação
- **RF03**: O sistema deve permitir logout do usuário
- **RF04**: O sistema deve exibir o nome do usuário logado

### Requisitos de Cadastro de Produtos
- **RF05**: O sistema deve permitir o cadastro de produtos farmacêuticos
- **RF06**: O sistema deve armazenar: nome, descrição, lote, data de fabricação, data de validade, quantidade em estoque, estoque mínimo, preço, fabricante e controle especial
- **RF07**: O sistema deve listar todos os produtos cadastrados
- **RF08**: O sistema deve permitir busca de produtos por nome ou lote
- **RF09**: O sistema deve permitir edição de produtos existentes
- **RF10**: O sistema deve permitir exclusão de produtos
- **RF11**: O sistema deve validar os dados inseridos (datas, quantidades, campos obrigatórios)
- **RF12**: O sistema deve validar que data de validade seja posterior à data de fabricação

### Requisitos de Gestão de Estoque
- **RF13**: O sistema deve registrar movimentações de entrada e saída de produtos
- **RF14**: O sistema deve registrar: produto, tipo de movimentação, quantidade, data, usuário responsável e observação
- **RF15**: O sistema deve atualizar automaticamente a quantidade em estoque após cada movimentação
- **RF16**: O sistema deve validar se há estoque suficiente para saídas
- **RF17**: O sistema deve exibir histórico de movimentações
- **RF18**: O sistema deve listar produtos em ordem alfabética

### Requisitos de Alertas e Monitoramento
- **RF19**: O sistema deve emitir alerta quando o estoque estiver abaixo do mínimo
- **RF20**: O sistema deve emitir alerta quando a validade estiver próxima (30 dias)
- **RF21**: O sistema deve exibir produtos com estoque baixo no dashboard
- **RF22**: O sistema deve exibir produtos próximos ao vencimento no dashboard
- **RF23**: O sistema deve mostrar contadores de alertas na gestão de estoque

### Requisitos de Rastreabilidade
- **RF24**: O sistema deve manter histórico completo de todas as movimentações
- **RF25**: O sistema deve registrar qual usuário realizou cada movimentação
- **RF26**: O sistema deve permitir consulta de movimentações por produto
- **RF27**: O sistema deve identificar produtos de controle especial

## ENTREGA 02 - Diagrama Entidade Relacionamento (DER)

\`\`\`
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   USUARIOS      │         │   PRODUTOS      │         │  FABRICANTES    │
├─────────────────┤         ├─────────────────┤         ├─────────────────┤
│ id (PK)         │         │ id (PK)         │         │ id (PK)         │
│ nome            │         │ nome            │         │ nome            │
│ username        │    ┌────│ fabricante_id   │─────────│ cnpj            │
│ senha           │    │    │ descricao       │         │ telefone        │
│ email           │    │    │ lote            │         │ email           │
│ cargo           │    │    │ data_fabricacao │         │ endereco        │
│ data_criacao    │    │    │ data_validade   │         │ data_criacao    │
└─────────────────┘    │    │ quantidade_est. │         └─────────────────┘
        │              │    │ estoque_minimo  │
        │              │    │ preco           │
        │              │    │ controle_esp.   │
        │              │    │ data_criacao    │
        │              │    └─────────────────┘
        │              │            │
        │              │            │
        │              │    ┌─────────────────┐
        │              │    │ MOVIMENTACOES   │
        │              │    ├─────────────────┤
        │              │    │ id (PK)         │
        └──────────────┼────│ usuario_id (FK) │
                       └────│ produto_id (FK) │
                            │ tipo            │
                            │ quantidade      │
                            │ data_movim.     │
                            │ observacao      │
                            │ data_registro   │
                            └─────────────────┘

Legenda:
PK = Primary Key (Chave Primária)
FK = Foreign Key (Chave Estrangeira)
\`\`\`

## ENTREGA 03 - Script de Criação e População do Banco de Dados

O script SQL está disponível no arquivo `script_db.sql` e contém:
- Criação do banco de dados "saep_db"
- Criação de 4 tabelas: usuarios, fabricantes, produtos, movimentacoes
- População com 3 registros de usuários
- População com 3 registros de fabricantes
- População com 6 registros de produtos
- População com 6 registros de movimentações

## ENTREGA 08 - Descritivo de Casos de Teste de Software

### Ambiente de Teste
- **Sistema Operacional**: Windows 10/11, Linux ou macOS
- **Navegadores**: Chrome 120+, Firefox 120+, Edge 120+
- **Backend**: Python 3.8+ com Flask
- **Banco de Dados**: SQLite 3
- **Resolução**: 1366x768 mínimo

### Ferramentas de Teste
- **Testes Manuais**: Navegador web
- **Testes de API**: Postman ou Insomnia
- **Validação de Banco**: DB Browser for SQLite
- **Debug**: Chrome DevTools

### Casos de Teste

#### CT001 - Login com Credenciais Válidas
**Objetivo**: Verificar autenticação com credenciais corretas
**Pré-condição**: Sistema iniciado, usuário cadastrado
**Passos**:
1. Acessar página de login
2. Inserir username: "joao"
3. Inserir senha: "123456"
4. Clicar em "Entrar"
**Resultado Esperado**: Redirecionamento para dashboard, exibição do nome do usuário

#### CT002 - Login com Credenciais Inválidas
**Objetivo**: Verificar tratamento de credenciais incorretas
**Pré-condição**: Sistema iniciado
**Passos**:
1. Acessar página de login
2. Inserir username: "usuario_inexistente"
3. Inserir senha: "senha_errada"
4. Clicar em "Entrar"
**Resultado Esperado**: Mensagem "Usuário ou senha incorretos!", permanência na tela de login

#### CT003 - Cadastro de Novo Produto
**Objetivo**: Verificar cadastro de produto com dados válidos
**Pré-condição**: Usuário autenticado
**Passos**:
1. Acessar "Cadastro de Produtos"
2. Clicar em "+ Novo Produto"
3. Preencher todos os campos obrigatórios
4. Clicar em "Salvar"
**Resultado Esperado**: Mensagem de sucesso, produto aparece na listagem

#### CT004 - Validação de Data de Validade
**Objetivo**: Verificar validação de datas
**Pré-condição**: Modal de cadastro aberto
**Passos**:
1. Inserir data_fabricacao: "2024-06-01"
2. Inserir data_validade: "2024-05-01"
3. Clicar em "Salvar"
**Resultado Esperado**: Mensagem "A data de validade deve ser posterior à data de fabricação!"

#### CT005 - Busca de Produtos
**Objetivo**: Verificar funcionalidade de busca
**Pré-condição**: Produtos cadastrados
**Passos**:
1. Acessar "Cadastro de Produtos"
2. Digitar "Dipirona" no campo de busca
**Resultado Esperado**: Apenas produtos com "Dipirona" no nome são exibidos

#### CT006 - Edição de Produto
**Objetivo**: Verificar edição de produto existente
**Pré-condição**: Produto cadastrado
**Passos**:
1. Clicar em "Editar" em um produto
2. Modificar campo "preco"
3. Clicar em "Salvar"
**Resultado Esperado**: Mensagem de sucesso, preço atualizado na listagem

#### CT007 - Exclusão de Produto
**Objetivo**: Verificar exclusão de produto
**Pré-condição**: Produto cadastrado
**Passos**:
1. Clicar em "Excluir" em um produto
2. Confirmar exclusão
**Resultado Esperado**: Produto removido da listagem

#### CT008 - Movimentação de Entrada
**Objetivo**: Verificar registro de entrada no estoque
**Pré-condição**: Produto cadastrado
**Passos**:
1. Acessar "Gestão de Estoque"
2. Clicar em "+ Nova Movimentação"
3. Selecionar produto
4. Selecionar tipo "Entrada"
5. Inserir quantidade: 50
6. Inserir data
7. Clicar em "Registrar"
**Resultado Esperado**: Estoque do produto aumenta em 50 unidades

#### CT009 - Movimentação de Saída com Estoque Insuficiente
**Objetivo**: Verificar validação de estoque
**Pré-condição**: Produto com estoque de 10 unidades
**Passos**:
1. Criar movimentação de saída
2. Inserir quantidade: 20
3. Clicar em "Registrar"
**Resultado Esperado**: Mensagem "Estoque insuficiente!"

#### CT010 - Alerta de Estoque Mínimo
**Objetivo**: Verificar emissão de alerta
**Pré-condição**: Produto com estoque_minimo = 30
**Passos**:
1. Criar movimentação que reduza estoque para 25
2. Confirmar movimentação
**Resultado Esperado**: Alerta "Estoque abaixo do mínimo!" é exibido

#### CT011 - Dashboard - Exibição de Alertas
**Objetivo**: Verificar alertas no dashboard
**Pré-condição**: Produtos com estoque baixo e/ou vencimento próximo
**Passos**:
1. Acessar dashboard
**Resultado Esperado**: Alertas de estoque baixo e vencimento próximo são exibidos

#### CT012 - Logout
**Objetivo**: Verificar encerramento de sessão
**Pré-condição**: Usuário autenticado
**Passos**:
1. Clicar em "Sair"
**Resultado Esperado**: Redirecionamento para tela de login, sessão encerrada

## ENTREGA 09 - Lista de Requisitos de Infraestrutura

### Sistema Operacional
- **Desenvolvimento**: Windows 10/11, Linux (Ubuntu 20.04+), macOS 11+
- **Produção**: Linux (Ubuntu 20.04+ ou Debian 11+)

### Linguagem de Programação
- **Python**: 3.8 ou superior
- **JavaScript**: ES6+ (nativo do navegador)

### Framework Backend
- **Flask**: 2.3.0 ou superior
- **Werkzeug**: 2.3.0 ou superior

### Sistema Gerenciador de Banco de Dados (SGBD)
- **SQLite**: 3.35 ou superior
- **Alternativa para produção**: PostgreSQL 13+ ou MySQL 8+

### Dependências Python
\`\`\`
Flask==2.3.0
Werkzeug==2.3.0
\`\`\`

### Tecnologias Frontend
- **HTML5**: Estrutura das páginas
- **CSS3**: Estilização (sem frameworks externos)
- **JavaScript**: Vanilla JS (sem jQuery ou frameworks)

### Servidor Web
- **Desenvolvimento**: Flask development server (127.0.0.1:5000)
- **Produção**: Gunicorn + Nginx (recomendado)

### Requisitos de Hardware (Mínimos)
- **Processador**: 1 GHz ou superior
- **Memória RAM**: 2 GB
- **Espaço em Disco**: 500 MB
- **Conexão de Rede**: Não necessária para desenvolvimento local

### Navegadores Suportados
- Google Chrome 100+
- Mozilla Firefox 100+
- Microsoft Edge 100+
- Safari 14+

### Ferramentas de Desenvolvimento Recomendadas
- **VS Code**: Editor de código
- **Python Virtual Environment**: Isolamento de dependências
- **DB Browser for SQLite**: Gerenciamento visual do banco
- **Postman**: Testes de API

### Portas Utilizadas
- **5000**: Servidor Flask (desenvolvimento)
- **80/443**: Produção (HTTP/HTTPS)

### Considerações de Segurança
- Alterar `app.secret_key` antes de produção
- Implementar HTTPS em produção
- Utilizar hashing para senhas (recomendado bcrypt)
- Configurar CORS adequadamente
- Realizar backup regular do banco de dados

### Escalabilidade
Para ambientes de produção com maior carga:
- Migrar de SQLite para PostgreSQL ou MySQL
- Implementar cache (Redis)
- Usar servidor WSGI (Gunicorn com múltiplos workers)
- Implementar balanceamento de carga
\`\`\`

```text file="requirements.txt"
Flask==2.3.0
Werkzeug==2.3.0
