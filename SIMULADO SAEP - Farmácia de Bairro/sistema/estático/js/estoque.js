let produtos = [];
let produtosData = {};

// Carregar produtos
async function loadProducts() {
    try {
        const response = await fetch('/api/produtos');
        produtos = await response.json();
        
        // Criar mapa de produtos para acesso rápido
        produtos.forEach(p => {
            produtosData[p.id] = p;
        });
        
        // Ordenar alfabeticamente
        produtos.sort((a, b) => a.nome.localeCompare(b.nome));
        
        const select = document.getElementById('produto_id');
        select.innerHTML = '<option value="">Selecione um produto...</option>' +
            produtos.map(p => `<option value="${p.id}">${p.nome} - Lote: ${p.lote}</option>`).join('');
        
        updateSummary();
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
    }
}

// Atualizar resumo
async function updateSummary() {
    try {
        const response = await fetch('/api/alertas');
        const data = await response.json();
        
        document.getElementById('totalProdutos').textContent = produtos.length;
        document.getElementById('estoqueBaixo').textContent = data.estoque_baixo.length;
        document.getElementById('vencimentoProximo').textContent = data.vencimento_proximo.length;
    } catch (error) {
        console.error('Erro ao carregar resumo:', error);
    }
}

// Carregar movimentações
async function loadMovements() {
    try {
        const response = await fetch('/api/movimentacoes');
        const movements = await response.json();
        
        const tbody = document.getElementById('movementsTableBody');
        
        if (movements.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="loading">Nenhuma movimentação registrada</td></tr>';
            return;
        }
        
        tbody.innerHTML = movements.map(m => `
            <tr>
                <td>${formatDate(m.data_movimentacao)}</td>
                <td>${m.produto_nome}</td>
                <td><span class="badge badge-${m.tipo === 'entrada' ? 'success' : 'danger'}">${m.tipo.toUpperCase()}</span></td>
                <td>${m.quantidade}</td>
                <td>${m.usuario_nome}</td>
                <td>${m.observacao || '-'}</td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Erro ao carregar movimentações:', error);
    }
}

// Abrir modal
function openModal() {
    const modal = document.getElementById('movementModal');
    document.getElementById('movementForm').reset();
    document.getElementById('productInfo').style.display = 'none';
    document.getElementById('alertMessage').style.display = 'none';
    
    // Definir data atual
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('data_movimentacao').value = today;
    
    modal.style.display = 'block';
}

// Fechar modal
function closeModal() {
    document.getElementById('movementModal').style.display = 'none';
}

// Atualizar informações do produto
function updateProductInfo() {
    const produtoId = document.getElementById('produto_id').value;
    const productInfo = document.getElementById('productInfo');
    
    if (!produtoId) {
        productInfo.style.display = 'none';
        return;
    }
    
    const produto = produtosData[produtoId];
    
    if (produto) {
        document.getElementById('estoqueAtual').textContent = produto.quantidade_estoque;
        document.getElementById('estoqueMinimo').textContent = produto.estoque_minimo;
        productInfo.style.display = 'block';
    }
}

// Salvar movimentação
document.getElementById('movementForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const data = {
        produto_id: parseInt(document.getElementById('produto_id').value),
        tipo: document.getElementById('tipo').value,
        quantidade: parseInt(document.getElementById('quantidade').value),
        data_movimentacao: document.getElementById('data_movimentacao').value,
        observacao: document.getElementById('observacao').value
    };
    
    // Validações
    if (data.quantidade <= 0) {
        alert('A quantidade deve ser maior que zero!');
        return;
    }
    
    const produto = produtosData[data.produto_id];
    if (data.tipo === 'saida' && data.quantidade > produto.quantidade_estoque) {
        alert('Quantidade indisponível em estoque!');
        return;
    }
    
    try {
        const response = await fetch('/api/movimentacoes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            if (result.alerta) {
                const alertDiv = document.getElementById('alertMessage');
                alertDiv.textContent = result.alerta;
                alertDiv.className = 'alert-message warning';
                alertDiv.style.display = 'block';
                
                setTimeout(() => {
                    alert(result.message + '\n\n' + result.alerta);
                    closeModal();
                    loadProducts();
                    loadMovements();
                }, 1000);
            } else {
                alert(result.message);
                closeModal();
                loadProducts();
                loadMovements();
            }
        } else {
            alert(result.message);
        }
    } catch (error) {
        alert('Erro ao registrar movimentação!');
    }
});

// Funções auxiliares
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

// Fechar modal ao clicar fora
window.onclick = function(event) {
    const modal = document.getElementById('movementModal');
    if (event.target === modal) {
        closeModal();
    }
}

// Carregar dados iniciais
loadProducts();
loadMovements();
