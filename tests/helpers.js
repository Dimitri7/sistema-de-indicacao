// tests/helpers.js — funções reutilizadas pelos testes
const request = require('supertest');
const app = require('../index');

let contador = 0;

// Gera dados de usuário únicos para cada chamada (evita e-mail repetido)
const novoUsuario = (extra = {}) => {
    contador += 1;
    return {
        username: `usuario${contador}`,
        email: `usuario${contador}@teste.com`,
        password: 'senhaSegura123',
        ...extra,
    };
};

const registrar = (dados) => request(app).post('/api/users/register').send(dados);

const login = (email, password) => request(app).post('/api/users/login').send({ email, password });

const dashboard = (token) => {
    const req = request(app).get('/api/users/dashboard');
    return token ? req.set('Authorization', `Bearer ${token}`) : req;
};

// Registra um usuário e já faz login, devolvendo o token
const registrarELogar = async (extra = {}) => {
    const dados = novoUsuario(extra);
    const cadastro = await registrar(dados);
    const resposta = await login(dados.email, dados.password);
    return { dados, user: cadastro.body.user, token: resposta.body.token };
};

module.exports = { app, novoUsuario, registrar, login, dashboard, registrarELogar };
