// index.js
const express = require('express');
const app = express();
const PORT = 3000;
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

// Liga o servidor e o faz "escutar" na porta definida
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});