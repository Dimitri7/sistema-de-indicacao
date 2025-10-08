// app.js (VERSÃO FINAL CORRIGIDA)

// Espera o HTML ser completamente carregado antes de executar o JavaScript
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. SELEÇÃO DOS ELEMENTOS DO HTML ---
    const loginView = document.getElementById('login-view');
    const registerView = document.getElementById('register-view');
    const dashboardView = document.getElementById('dashboard-view');

    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');

    const logoutButton = document.getElementById('logout-button');
    const copyButton = document.getElementById('copy-button');

    const API_URL = 'http://localhost:3000/api/users';

    // --- 2. FUNÇÕES DE NAVEGAÇÃO ---
    function navigateTo(viewId) {
        loginView.classList.remove('active');
        registerView.classList.remove('active');
        dashboardView.classList.remove('active');
        document.getElementById(viewId).classList.add('active');
    }

    // --- 3. LÓGICA DE AUTENTICAÇÃO E API ---

    async function handleRegister(event) {
        event.preventDefault();

        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const referralCode = document.getElementById('register-referral').value;

        let isValid = true;
        if (password.length < 8 ||!/\d/.test(password) ||!/[a-zA-Z]/.test(password)) {
            alert('A senha deve ter no mínimo 8 caracteres, contendo letras e números.');
            isValid = false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            alert('Por favor, insira um e-mail válido.');
            isValid = false;
        }

        if (!isValid) return;

        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password, referralCode }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            alert('Cadastro realizado com sucesso! Por favor, faça o login.');
            registerForm.reset();
            navigateTo('login-view');

        } catch (error) {
            alert(`Erro no cadastro: ${error.message}`);
        }
    }

    async function handleLogin(event) {
        event.preventDefault();

        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            localStorage.setItem('jwtToken', data.token);
            
            loginForm.reset();
            navigateTo('dashboard-view');
            fetchDashboardData();

        } catch (error) {
            alert(`Erro no login: ${error.message}`);
        }
    }

    async function fetchDashboardData() {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            navigateTo('login-view');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/dashboard`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 401) {
                handleLogout();
                alert('Sua sessão expirou. Por favor, faça login novamente.');
                return;
            }

            const data = await response.json();
            
            document.getElementById('dash-username').textContent = data.username;
            document.getElementById('dash-points').textContent = data.points;
            
            const referralLink = `${window.location.origin}${window.location.pathname}?ref=${data.referralCode}`;
            document.getElementById('dash-referral-link').value = referralLink;

        } catch (error) {
            console.error('Erro ao buscar dados do dashboard:', error);
        }
    }

    function handleLogout() {
        localStorage.removeItem('jwtToken');
        navigateTo('login-view');
    }

    function copyReferralLink() {
        const referralLinkInput = document.getElementById('dash-referral-link');
        navigator.clipboard.writeText(referralLinkInput.value).then(() => {
            copyButton.textContent = 'Copiado!';
            setTimeout(() => {
                copyButton.textContent = 'Copiar';
            }, 2000);
        }).catch(err => {
            console.error('Erro ao copiar o link: ', err);
            alert('Não foi possível copiar o link.');
        });
    }

    // --- 4. EVENT LISTENERS ---
    showRegisterLink.addEventListener('click', (e) => { e.preventDefault(); navigateTo('register-view'); });
    showLoginLink.addEventListener('click', (e) => { e.preventDefault(); navigateTo('login-view'); });

    registerForm.addEventListener('submit', handleRegister);
    loginForm.addEventListener('submit', handleLogin);

    logoutButton.addEventListener('click', handleLogout);
    copyButton.addEventListener('click', copyReferralLink);

    // --- 5. INICIALIZAÇÃO ---
    function initializeApp() {
        // *** NOVA LÓGICA ADICIONADA AQUI ***
        // Pega os parâmetros da URL (ex:?ref=ABCDE)
        const params = new URLSearchParams(window.location.search);
        const refCode = params.get('ref');

        // Se encontrou um código 'ref' na URL, preenche o campo de cadastro
        if (refCode) {
            document.getElementById('register-referral').value = refCode;
        }

        // Continua com a lógica normal de verificar se o usuário está logado
        const token = localStorage.getItem('jwtToken');
        if (token) {
            navigateTo('dashboard-view');
            fetchDashboardData();
        } else {
            navigateTo('login-view');
        }
    }

    initializeApp(); // Roda a função de inicialização
});