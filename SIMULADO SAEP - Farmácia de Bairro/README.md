# Sistema de Gestão de Farmácia - SAEP

Sistema web completo para gestão de estoque de farmácia, desenvolvido como resposta ao desafio SAEP (Sistema de Avaliação da Educação Profissional).

## 📋 Funcionalidades

- ✅ Autenticação de usuários
- ✅ Cadastro completo de produtos farmacêuticos
- ✅ Gestão de estoque com entrada e saída
- ✅ Alertas automáticos de estoque baixo
- ✅ Alertas de produtos próximos ao vencimento (30 dias)
- ✅ Controle de lote e fabricante
- ✅ Histórico completo de movimentações
- ✅ Rastreabilidade de operações por usuário
- ✅ Interface responsiva e intuitiva

## 🚀 Como Executar

### Pré-requisitos

- Python 3.8 ou superior instalado
- VS Code (opcional, mas recomendado)

### Passo 1: Instalar Dependências

\`\`\`bash
pip install -r requirements.txt
\`\`\`

### Passo 2: Inicializar o Banco de Dados

\`\`\`bash
python init_db.py
\`\`\`

### Passo 3: Executar o Sistema

\`\`\`bash
python sistema/app.py
\`\`\`

### Passo 4: Acessar o Sistema

Abra seu navegador e acesse:
\`\`\`
http://localhost:5000
\`\`\`

## 👥 Usuários de Teste

- **Usuário**: joao | **Senha**: 123456
- **Usuário**: maria | **Senha**: 123456
- **Usuário**: pedro | **Senha**: 123456

## 📁 Estrutura do Projeto

\`\`\`
sistema-farmacia/
│
├── sistema/
│   ├── app.py                  # Aplicação Flask principal
│   ├── templates/              # Templates HTML
│   │   ├── login.html
│   │   ├── dashboard.html
│   │   ├── produtos.html
│   │   └── estoque.html
│   └── static/                 # Arquivos estáticos
│       ├── css/
│       │   └── style.css
│       └── js/
│           ├── login.js
│           ├── dashboard.js
│           ├── produtos.js
│           └── estoque.js
│
├── script_db.sql               # Script SQL do banco
├── init_db.py                  # Script de inicialização
├── documentacao.md             # Documentação completa
├── requirements.txt            # Dependências Python
└── README.md                   # Este arquivo
\`\`\`

## 🗄️ Banco de Dados

O sistema utiliza SQLite com as seguintes tabelas:

- **usuarios**: Controle de acesso
- **fabricantes**: Cadastro de fabricantes
- **produtos**: Estoque de produtos
- **movimentacoes**: Histórico de entrada/saída

## 🧪 Testes

Consulte o arquivo `documentacao.md` para casos de teste detalhados.

## 📚 Documentação

Toda a documentação técnica está disponível no arquivo `documentacao.md`, incluindo:

- Requisitos funcionais
- Diagrama Entidade-Relacionamento (DER)
- Casos de teste
- Requisitos de infraestrutura

## 🔒 Segurança

⚠️ **IMPORTANTE**: Este sistema é para fins educacionais/demonstração.

Para uso em produção:
- Alterar a `secret_key` do Flask
- Implementar hashing de senhas (bcrypt)
- Configurar HTTPS
- Migrar para PostgreSQL ou MySQL
- Implementar validações adicionais

## 📄 Licença

Projeto desenvolvido para o SAEP - Sistema de Avaliação da Educação Profissional.

## 👨‍💻 Desenvolvido por

Sistema desenvolvido como resposta ao desafio SAEP de Farmácia de Bairro.