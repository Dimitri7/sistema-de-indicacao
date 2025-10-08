// controllers/userController.js
const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Função para lidar com o REGISTRO de um novo usuário
exports.register = async (req, res) => {
    const { username, email, password, referralCode } = req.body;

    // Validação simples para garantir que os campos essenciais foram enviados
    if (!username ||!email ||!password) {
        return res.status(400).json({ message: "Por favor, forneça nome de usuário, email e senha." });
    }

    try {
        // Pede ao "Model" para criar o usuário no banco de dados
        const newUser = await userModel.createUser({
            username,
            email,
            password,
            referralCodeFromFriend: referralCode
        });
        // Envia uma resposta de sucesso
        res.status(201).json({ message: "Usuário registrado com sucesso!", user: newUser });
    } catch (error) {
        // Trata erros comuns, como um e-mail que já existe
        if (error.message.includes('UNIQUE constraint failed: users.email')) {
            return res.status(409).json({ message: "Este email já está em uso." });
        }
        // Envia uma resposta de erro genérica para outros problemas
        res.status(500).json({ message: "Erro ao registrar usuário.", error: error.message });
    }
};

// Função para lidar com o LOGIN de um usuário
exports.login = async (req, res) => {
    const { email, password } = req.body;
    if (!email ||!password) {
        return res.status(400).json({ message: "Por favor, forneça email e senha." });
    }

    try {
        // 1. Pede ao "Model" para encontrar o usuário pelo email
        const user = await userModel.findUserByEmail(email);
        if (!user) {
            // Se o usuário não existe, envia um erro de "não autorizado"
            return res.status(401).json({ message: "Credenciais inválidas." });
        }

        // 2. Compara a senha enviada com a senha criptografada no banco de dados
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            // Se as senhas não batem, envia o mesmo erro para não dar dicas a hackers
            return res.status(401).json({ message: "Credenciais inválidas." });
        }

        // 3. Se tudo estiver correto, crie o "passaporte digital" (JWT)
        const payload = {
            userId: user.id,
            username: user.username
        };

        const token = jwt.sign(
            payload,
            'SEU_SEGREDO_JWT_SUPER_SECRETO', // IMPORTANTE: Em um projeto real, isso deve ser mais seguro!
            { expiresIn: '1h' } // O passaporte expira em 1 hora
        );

        // 4. Envia o passaporte (token) de volta para o cliente
        res.status(200).json({
            message: "Login bem-sucedido!",
            token: token,
            user: { id: user.id, username: user.username }
        });

    } catch (error) {
        res.status(500).json({ message: "Erro no servidor durante o login.", error: error.message });
    }
};

// Função para lidar com a busca de dados do DASHBOARD
exports.getDashboard = async (req, res) => {
    try {
        // O ID do usuário vem do nosso middleware de autenticação (req.userData)
        const userId = req.userData.userId;

        // Pede ao "Model" para buscar os dados
        const dashboardData = await userModel.getDashboardData(userId);
        const referredUsers = await userModel.getReferredUsers(userId);

        if (!dashboardData) {
            return res.status(404).json({ message: "Usuário não encontrado." });
        }

        // Envia todos os dados juntos em uma única resposta JSON
        res.status(200).json({
            username: dashboardData.username,
            points: dashboardData.points,
            referralCode: dashboardData.referral_code,
            referredUsers: referredUsers
        });

    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar dados do dashboard.", error: error.message });
    }
};