// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware'); // 1. Importar o segurança

// --- Rotas Públicas ---
// (Qualquer um pode acessar)
router.post('/register', userController.register);
router.post('/login', userController.login);

// --- Rota Protegida ---
// (Só quem tem o "passaporte" JWT pode acessar)
// 2. Adicionar o segurança (authMiddleware) antes da função do controller
router.get('/dashboard', authMiddleware, userController.getDashboard);

module.exports = router;