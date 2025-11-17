document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');
    
    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            window.location.href = '/dashboard';
        } else {
            errorMessage.textContent = data.message;
            errorMessage.style.display = 'block';
            
            setTimeout(() => {
                errorMessage.style.display = 'none';
            }, 3000);
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        errorMessage.textContent = 'Erro ao conectar com o servidor!';
        errorMessage.style.display = 'block';
    }
});
