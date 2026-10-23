// tests/login.test.js — POST /api/users/login
const jwt = require('jsonwebtoken');
const db = require('../db/database');
const { novoUsuario, registrar, login } = require('./helpers');

beforeAll(() => db.ready);
afterAll((done) => { db.close(done); });

describe('Login', () => {
    test('com credenciais corretas devolve um token JWT do usuário', async () => {
        const dados = novoUsuario();
        const cadastro = await registrar(dados);

        const res = await login(dados.email, dados.password);

        expect(res.status).toBe(200);
        expect(res.body.user).toEqual({ id: cadastro.body.user.id, username: dados.username });

        const conteudo = jwt.decode(res.body.token);
        expect(conteudo.userId).toBe(cadastro.body.user.id);
        expect(conteudo.exp - conteudo.iat).toBe(60 * 60); // expira em 1 hora
    });

    test('com senha errada devolve 401', async () => {
        const dados = novoUsuario();
        await registrar(dados);

        const res = await login(dados.email, 'senhaErrada');

        expect(res.status).toBe(401);
        expect(res.body.token).toBeUndefined();
    });

    test('com e-mail inexistente devolve 401 com a mesma mensagem (não revela se o e-mail existe)', async () => {
        const dados = novoUsuario();
        await registrar(dados);

        const senhaErrada = await login(dados.email, 'senhaErrada');
        const emailInexistente = await login('ninguem@teste.com', 'qualquer');

        expect(emailInexistente.status).toBe(401);
        expect(emailInexistente.body.message).toBe(senhaErrada.body.message);
    });

    test('sem e-mail ou senha devolve 400', async () => {
        const semSenha = await login('alguem@teste.com', undefined);
        const semEmail = await login(undefined, 'senha');

        expect(semSenha.status).toBe(400);
        expect(semEmail.status).toBe(400);
    });
});
