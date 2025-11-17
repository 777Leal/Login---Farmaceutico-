import os
import sys

print("=" * 60)
print("SISTEMA DE FARMÁCIA - SAEP")
print("=" * 60)

# Verificar se o banco de dados existe
db_path = os.path.join(os.path.dirname(__file__), 'saep_db.db')
if not os.path.exists(db_path):
    print("\n[ERRO] Banco de dados não encontrado!")
    print("Execute primeiro: python init_db.py")
    sys.exit(1)

print(f"\nBanco de dados encontrado: {db_path}")

# Verificar estrutura de pastas
templates_path = os.path.join(os.path.dirname(__file__), 'sistema', 'templates')
if not os.path.exists(templates_path):
    print(f"\n[ERRO] Pasta templates não encontrada em: {templates_path}")
    sys.exit(1)

# Verificar se os arquivos HTML existem
required_templates = ['login.html', 'dashboard.html', 'produtos.html', 'estoque.html']
missing = []
for template in required_templates:
    if not os.path.exists(os.path.join(templates_path, template)):
        missing.append(template)

if missing:
    print(f"\n[ERRO] Arquivos faltando: {', '.join(missing)}")
    sys.exit(1)

print(f"Templates encontrados: {templates_path}")
print("\nIniciando servidor...")
print("Acesse: http://localhost:5000")
print("Credenciais: joao/123456 ou maria/123456")
print("=" * 60)
print("\n")

# Iniciar o servidor
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'sistema'))
from app import app
app.run(debug=True, host='127.0.0.1', port=5000)
