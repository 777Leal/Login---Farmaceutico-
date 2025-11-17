import sqlite3
import os

DATABASE = 'saep_db.db'

def init_database():
    # Remover banco existente se houver
    if os.path.exists(DATABASE):
        os.remove(DATABASE)
        print(f"Banco de dados existente removido.")
    
    # Criar novo banco e executar script
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    
    print("Criando banco de dados...")
    
    # Ler e executar o script SQL
    try:
        with open('script_db.sql', 'r', encoding='utf-8') as f:
            sql_script = f.read()
            cursor.executescript(sql_script)
        
        conn.commit()
        print(f"Banco de dados '{DATABASE}' criado e populado com sucesso!")
        
        # Verificar se os usuários foram criados
        cursor.execute("SELECT * FROM usuarios")
        usuarios = cursor.fetchall()
        print(f"\nUsuários criados: {len(usuarios)}")
        for usuario in usuarios:
            print(f"  - {usuario[1]} (username: {usuario[2]})")
            
    except Exception as e:
        print(f"Erro ao criar banco: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == '__main__':
    init_database()
