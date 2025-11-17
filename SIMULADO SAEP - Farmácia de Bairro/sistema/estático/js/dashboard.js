// Carregar alertas
async function loadAlerts() {
    try {
        const response = await fetch('/api/alertas');
        const data = await response.json();
        
        const alertsSection = document.getElementById('alertsSection');
        alertsSection.innerHTML = '';
        
        if (data.estoque_baixo.length > 0) {
            const alertDiv = document.createElement('div');
            alertDiv.className = 'alert alert-warning';
            alertDiv.innerHTML = `
                <h3>⚠️ Produtos com Estoque Baixo</h3>
                <ul>
                    ${data.estoque_baixo.map(p => 
                        `<li><strong>${p.nome}</strong> - Estoque: ${p.quantidade_estoque} (Mínimo: ${p.estoque_minimo})</li>`
                    ).join('')}
                </ul>
            `;
            alertsSection.appendChild(alertDiv);
        }
        
        if (data.vencimento_proximo.length > 0) {
            const alertDiv = document.createElement('div');
            alertDiv.className = 'alert alert-danger';
            alertDiv.innerHTML = `
                <h3>🚨 Produtos Próximos ao Vencimento</h3>
                <ul>
                    ${data.vencimento_proximo.map(p => 
                        `<li><strong>${p.nome}</strong> - Lote: ${p.lote} - Vence em: ${formatDate(p.data_validade)}</li>`
                    ).join('')}
                </ul>
            `;
            alertsSection.appendChild(alertDiv);
        }
    } catch (error) {
        console.error('Erro ao carregar alertas:', error);
    }
}

// Carregar movimentações recentes
async function loadRecentMovements() {
    try {
        const response = await fetch('/api/movimentacoes');
        const movements = await response.json();
        
        const tbody = document.getElementById('recentMovements');
        
        if (movements.length === 0) {
            tbody.innerHTML = '<p>Nenhuma movimentação registrada.</p>';
            return;
        }
        
        tbody.innerHTML = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Produto</th>
                        <th>Tipo</th>
                        <th>Quantidade</th>
                        <th>Usuário</th>
                    </tr>
                </thead>
                <tbody>
                    ${movements.slice(0, 10).map(m => `
                        <tr>
                            <td>${formatDate(m.data_movimentacao)}</td>
                            <td>${m.produto_nome}</td>
                            <td><span class="badge badge-${m.tipo === 'entrada' ? 'success' : 'danger'}">${m.tipo.toUpperCase()}</span></td>
                            <td>${m.quantidade}</td>
                            <td>${m.usuario_nome}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Erro ao carregar movimentações:', error);
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

// Carregar dados ao iniciar
loadAlerts();
loadRecentMovements();
