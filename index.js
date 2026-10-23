// index.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const db = require('./db/database.js');
const cors = require('cors');

// Middleware para o servidor entender JSON
app.use(express.json());
app.use(cors());

// Uma rota de teste para ver se tudo está funcionando
app.get('/', (req, res) => {
    res.json({ message: "API do Sistema de Indicação está funcionando!" });
});

// Importar e usar as rotas de usuário
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// Liga o servidor só quando o arquivo é executado direto (npm start).
// Nos testes, o app é importado sem abrir a porta.
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
    });
}

module.exports = app;