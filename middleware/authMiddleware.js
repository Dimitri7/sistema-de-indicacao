// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        // O token geralmente é enviado no cabeçalho 'Authorization' no formato "Bearer TOKEN"
        const token = req.headers.authorization.split(' ')[1];

        // Verifica se o token é válido usando o mesmo segredo que usamos para criá-lo
        const decodedToken = jwt.verify(token, 'SEU_SEGREDO_JWT_SUPER_SECRETO');

        // Adiciona os dados do usuário (que estavam no token) ao objeto 'req'
        // para que as próximas rotas possam usá-los
        req.userData = { userId: decodedToken.userId, username: decodedToken.username };

        // Se tudo deu certo, chama 'next()' para permitir que o pedido continue
        next();
    } catch (error) {
        // Se o token for inválido ou não existir, retorna um erro de "não autorizado"
        return res.status(401).json({ message: 'Falha na autenticação.' });
    }
};