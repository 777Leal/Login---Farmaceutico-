let produtos = [];
let fabricantes = [];
let editingId = null;

// Carregar produtos
async function loadProducts(search = '') {
    try {
        const url = search ? `/api/produtos?busca=${encodeURIComponent(search)}` : '/api/produtos';
        const response = await fetch(url);
        produtos = await response.json();
        renderProducts();
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
    }
}

// Renderizar produtos
function renderProducts() {
    const tbody = document.getElementById('productsTableBody');
    
    if (produtos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="loading">Nenhum produto encontrado</td></tr>';
        return;
    }
    
    tbody.innerHTML = produtos.map(p => {
        const vencimentoProximo = isExpirationNear(p.data_validade);
        const estoqueBaixo = p.quantidade_estoque < p.estoque_minimo;
        
        return `
            <tr>
                <td>${p.nome}</td>
                <td>${p.lote}</td>
                <td>${p.fabricante_nome || '-'}</td>
                <td>
                    ${p.quantidade_estoque}
                    ${estoqueBaixo ? '<span class="badge badge-warning">Baixo</span>' : ''}
                </td>
                <td>
                    ${formatDate(p.data_validade)}
                    ${vencimentoProximo ? '<span class="badge badge-danger">Próximo</span>' : ''}
                </td>
                <td>R$ ${parseFloat(p.preco).toFixed(2)}</td>
                <td>${p.controle_especial ? '<span class="badge badge-warning">Sim</span>' : 'Não'}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editProduct(${p.id})">Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteProduct(${p.id}, '${p.nome}')">Excluir</button>
                </td>
            </tr>
        `;
    }).join('');
}

// Carregar fabricantes
async function loadManufacturers() {
    try {
        const response = await fetch('/api/fabricantes');
        fabricantes = await response.json();
        
        const select = document.getElementById('fabricante_id');
        select.innerHTML = '<option value="">Selecione...</option>' +
            fabricantes.map(f => `<option value="${f.id}">${f.nome}</option>`).join('');
    } catch (error) {
        console.error('Erro ao carregar fabricantes:', error);
    }
}

// Abrir modal
function openModal(id = null) {
    editingId = id;
    const modal = document.getElementById('productModal');
    const form = document.getElementById('productForm');
    
    if (id) {
        document.getElementById('modalTitle').textContent = 'Editar Produto';
        const produto = produtos.find(p => p.id === id);
        
        document.getElementById('productId').value = produto.id;
        document.getElementById('nome').value = produto.nome;
        document.getElementById('descricao').value = produto.descricao || '';
        document.getElementById('lote').value = produto.lote;
        document.getElementById('fabricante_id').value = produto.fabricante_id;
        document.getElementById('preco').value = produto.preco;
        document.getElementById('data_fabricacao').value = produto.data_fabricacao;
        document.getElementById('data_validade').value = produto.data_validade;
        document.getElementById('quantidade_estoque').value = produto.quantidade_estoque;
        document.getElementById('estoque_minimo').value = produto.estoque_minimo;
        document.getElementById('controle_especial').checked = produto.controle_especial === 1;
    } else {
        document.getElementById('modalTitle').textContent = 'Novo Produto';
        form.reset();
        document.getElementById('productId').value = '';
    }
    
    modal.style.display = 'block';
}

// Fechar modal
function closeModal() {
    document.getElementById('productModal').style.display = 'none';
    editingId = null;
}

// Editar produto
function editProduct(id) {
    openModal(id);
}

// Excluir produto
async function deleteProduct(id, nome) {
    if (!confirm(`Deseja realmente excluir o produto "${nome}"?`)) {
        return;
    }
    
    try {
        const response = await fetch(`/api/produtos/${id}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert(data.message);
            loadProducts();
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert('Erro ao excluir produto!');
    }
}

// Salvar produto
document.getElementById('productForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('productId').value;
    const data = {
        nome: document.getElementById('nome').value,
        descricao: document.getElementById('descricao').value,
        lote: document.getElementById('lote').value,
        fabricante_id: document.getElementById('fabricante_id').value,
        preco: document.getElementById('preco').value,
        data_fabricacao: document.getElementById('data_fabricacao').value,
        data_validade: document.getElementById('data_validade').value,
        quantidade_estoque: document.getElementById('quantidade_estoque').value,
        estoque_minimo: document.getElementById('estoque_minimo').value,
        controle_especial: document.getElementById('controle_especial').checked ? 1 : 0
    };
    
    // Validações
    if (new Date(data.data_validade) <= new Date(data.data_fabricacao)) {
        alert('A data de validade deve ser posterior à data de fabricação!');
        return;
    }
    
    if (parseInt(data.quantidade_estoque) < 0 || parseInt(data.estoque_minimo) < 0) {
        alert('As quantidades não podem ser negativas!');
        return;
    }
    
    try {
        const url = id ? `/api/produtos/${id}` : '/api/produtos';
        const method = id ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert(result.message);
            closeModal();
            loadProducts();
        } else {
            alert(result.message);
        }
    } catch (error) {
        alert('Erro ao salvar produto!');
    }
});

// Busca
document.getElementById('searchInput').addEventListener('input', (e) => {
    loadProducts(e.target.value);
});

// Funções auxiliares
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

function isExpirationNear(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const diffDays = Math.ceil((date - today) / (1000 * 60 * 60 * 24));
    return diffDays <= 30;
}

// Fechar modal ao clicar fora
window.onclick = function(event) {
    const modal = document.getElementById('productModal');
    if (event.target === modal) {
        closeModal();
    }
}

// Carregar dados iniciais
loadProducts();
loadManufacturers();
