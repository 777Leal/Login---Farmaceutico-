from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from functools import wraps
import sqlite3
from datetime import datetime, timedelta
import os

basedir = os.path.abspath(os.path.dirname(__file__))
template_dir = os.path.join(basedir, 'templates')
static_dir = os.path.join(basedir, 'static')

app = Flask(__name__, 
            template_folder=template_dir,
            static_folder=static_dir)
app.secret_key = 'chave_secreta_farmacia_2024'

# Database no diretório pai
DATABASE = os.path.join(os.path.dirname(basedir), 'saep_db.db')

def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

@app.route('/')
def index():
    if 'user_id' in session:
        return redirect(url_for('dashboard'))
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        print(f"[DEBUG] Tentativa de login - Usuário: {username}")
        
        conn = get_db()
        user = conn.execute('SELECT * FROM usuarios WHERE username = ? AND senha = ?', 
                           (username, password)).fetchone()
        conn.close()
        
        if user:
            session['user_id'] = user['id']
            session['username'] = user['nome']
            print(f"[DEBUG] Login bem-sucedido: {user['nome']}")
            return jsonify({'success': True, 'message': 'Login realizado com sucesso!'})
        else:
            print(f"[DEBUG] Login falhou para usuário: {username}")
            return jsonify({'success': False, 'message': 'Usuário ou senha incorretos!'}), 401
    
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))

@app.route('/dashboard')
@login_required
def dashboard():
    return render_template('dashboard.html', username=session.get('username'))

@app.route('/produtos')
@login_required
def produtos():
    return render_template('produtos.html', username=session.get('username'))

@app.route('/estoque')
@login_required
def estoque():
    return render_template('estoque.html', username=session.get('username'))

@app.route('/api/produtos', methods=['GET'])
@login_required
def get_produtos():
    conn = get_db()
    busca = request.args.get('busca', '')
    
    if busca:
        produtos = conn.execute('''
            SELECT p.*, f.nome as fabricante_nome 
            FROM produtos p 
            LEFT JOIN fabricantes f ON p.fabricante_id = f.id 
            WHERE p.nome LIKE ? OR p.lote LIKE ?
            ORDER BY p.nome
        ''', (f'%{busca}%', f'%{busca}%')).fetchall()
    else:
        produtos = conn.execute('''
            SELECT p.*, f.nome as fabricante_nome 
            FROM produtos p 
            LEFT JOIN fabricantes f ON p.fabricante_id = f.id 
            ORDER BY p.nome
        ''').fetchall()
    
    conn.close()
    return jsonify([dict(p) for p in produtos])

@app.route('/api/produtos', methods=['POST'])
@login_required
def add_produto():
    data = request.get_json()
    
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO produtos (nome, descricao, lote, data_fabricacao, data_validade, 
                                 quantidade_estoque, estoque_minimo, preco, fabricante_id, controle_especial)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (data['nome'], data['descricao'], data['lote'], data['data_fabricacao'],
              data['data_validade'], data['quantidade_estoque'], data['estoque_minimo'],
              data['preco'], data['fabricante_id'], data.get('controle_especial', 0)))
        conn.commit()
        produto_id = cursor.lastrowid
        conn.close()
        
        return jsonify({'success': True, 'message': 'Produto cadastrado com sucesso!', 'id': produto_id})
    except Exception as e:
        return jsonify({'success': False, 'message': f'Erro ao cadastrar produto: {str(e)}'}), 400

@app.route('/api/produtos/<int:id>', methods=['PUT'])
@login_required
def update_produto(id):
    data = request.get_json()
    
    try:
        conn = get_db()
        conn.execute('''
            UPDATE produtos 
            SET nome=?, descricao=?, lote=?, data_fabricacao=?, data_validade=?,
                quantidade_estoque=?, estoque_minimo=?, preco=?, fabricante_id=?, controle_especial=?
            WHERE id=?
        ''', (data['nome'], data['descricao'], data['lote'], data['data_fabricacao'],
              data['data_validade'], data['quantidade_estoque'], data['estoque_minimo'],
              data['preco'], data['fabricante_id'], data.get('controle_especial', 0), id))
        conn.commit()
        conn.close()
        
        return jsonify({'success': True, 'message': 'Produto atualizado com sucesso!'})
    except Exception as e:
        return jsonify({'success': False, 'message': f'Erro ao atualizar produto: {str(e)}'}), 400

@app.route('/api/produtos/<int:id>', methods=['DELETE'])
@login_required
def delete_produto(id):
    try:
        conn = get_db()
        conn.execute('DELETE FROM produtos WHERE id=?', (id,))
        conn.commit()
        conn.close()
        
        return jsonify({'success': True, 'message': 'Produto excluído com sucesso!'})
    except Exception as e:
        return jsonify({'success': False, 'message': f'Erro ao excluir produto: {str(e)}'}), 400

@app.route('/api/fabricantes', methods=['GET'])
@login_required
def get_fabricantes():
    conn = get_db()
    fabricantes = conn.execute('SELECT * FROM fabricantes ORDER BY nome').fetchall()
    conn.close()
    return jsonify([dict(f) for f in fabricantes])

@app.route('/api/movimentacoes', methods=['POST'])
@login_required
def add_movimentacao():
    data = request.get_json()
    
    try:
        conn = get_db()
        
        # Verificar produto
        produto = conn.execute('SELECT * FROM produtos WHERE id=?', (data['produto_id'],)).fetchone()
        if not produto:
            return jsonify({'success': False, 'message': 'Produto não encontrado!'}), 404
        
        # Calcular nova quantidade
        nova_quantidade = produto['quantidade_estoque']
        if data['tipo'] == 'entrada':
            nova_quantidade += data['quantidade']
        else:
            if nova_quantidade < data['quantidade']:
                return jsonify({'success': False, 'message': 'Estoque insuficiente!'}), 400
            nova_quantidade -= data['quantidade']
        
        # Registrar movimentação
        conn.execute('''
            INSERT INTO movimentacoes (produto_id, tipo, quantidade, data_movimentacao, usuario_id, observacao)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (data['produto_id'], data['tipo'], data['quantidade'], 
              data['data_movimentacao'], session['user_id'], data.get('observacao', '')))
        
        # Atualizar estoque
        conn.execute('UPDATE produtos SET quantidade_estoque=? WHERE id=?', 
                    (nova_quantidade, data['produto_id']))
        
        conn.commit()
        
        # Verificar alerta de estoque mínimo
        alerta = ''
        if nova_quantidade < produto['estoque_minimo']:
            alerta = f'ATENÇÃO: Estoque abaixo do mínimo! Atual: {nova_quantidade}, Mínimo: {produto["estoque_minimo"]}'
        
        conn.close()
        
        return jsonify({
            'success': True, 
            'message': 'Movimentação registrada com sucesso!',
            'alerta': alerta,
            'nova_quantidade': nova_quantidade
        })
    except Exception as e:
        return jsonify({'success': False, 'message': f'Erro ao registrar movimentação: {str(e)}'}), 400

@app.route('/api/movimentacoes', methods=['GET'])
@login_required
def get_movimentacoes():
    conn = get_db()
    movimentacoes = conn.execute('''
        SELECT m.*, p.nome as produto_nome, u.nome as usuario_nome
        FROM movimentacoes m
        LEFT JOIN produtos p ON m.produto_id = p.id
        LEFT JOIN usuarios u ON m.usuario_id = u.id
        ORDER BY m.data_movimentacao DESC
        LIMIT 50
    ''').fetchall()
    conn.close()
    return jsonify([dict(m) for m in movimentacoes])

@app.route('/api/alertas', methods=['GET'])
@login_required
def get_alertas():
    conn = get_db()
    
    # Produtos com estoque baixo
    estoque_baixo = conn.execute('''
        SELECT * FROM produtos 
        WHERE quantidade_estoque < estoque_minimo
        ORDER BY nome
    ''').fetchall()
    
    # Produtos próximos ao vencimento (30 dias)
    data_limite = (datetime.now() + timedelta(days=30)).strftime('%Y-%m-%d')
    vencimento_proximo = conn.execute('''
        SELECT * FROM produtos 
        WHERE data_validade <= ?
        ORDER BY data_validade
    ''', (data_limite,)).fetchall()
    
    conn.close()
    
    return jsonify({
        'estoque_baixo': [dict(p) for p in estoque_baixo],
        'vencimento_proximo': [dict(p) for p in vencimento_proximo]
    })

if __name__ == '__main__':
    print("=" * 60)
    print("Sistema de Farmácia - Iniciando...")
    print(f"Banco de dados: {DATABASE}")
    print(f"Templates: {app.template_folder}")
    print(f"Static: {app.static_folder}")
    print("Acesse: http://localhost:5000")
    print("=" * 60)
    app.run(debug=True, host='0.0.0.0', port=5000)
