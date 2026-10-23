// tests/cadastro.test.js — POST /api/users/register
const db = require('../db/database');
const { novoUsuario, registrar } = require('./helpers');

beforeAll(() => db.ready);
afterAll((done) => { db.close(done); });

describe('Cadastro', () => {
    test('cria usuário com código de indicação e 0 pontos', async () => {
        const dados = novoUsuario();
        const res = await registrar(dados);

        expect(res.status).toBe(201);
        expect(res.body.user).toMatchObject({
            username: dados.username,
            email: dados.email,
            points: 0,
        });
        expect(res.body.user.referralCode).toMatch(/^[A-Z0-9]{6}$/);
    });

    test('não devolve a senha na resposta', async () => {
        const res = await registrar(novoUsuario());

        expect(res.body.user.password).toBeUndefined();
        expect(res.body.user.password_hash).toBeUndefined();
    });

    test('guarda a senha criptografada com bcrypt, nunca em texto puro', async () => {
        const dados = novoUsuario();
        await registrar(dados);

        const linha = await new Promise((resolve, reject) => {
            db.get('SELECT password_hash FROM users WHERE email = ?', [dados.email], (err, row) =>
                err ? reject(err) : resolve(row));
        });

        expect(linha.password_hash).not.toBe(dados.password);
        expect(linha.password_hash).toMatch(/^\$2[aby]\$10\$/);
    });

    test.each(['username', 'email', 'password'])('recusa cadastro sem %s (400)', async (campo) => {
        const dados = novoUsuario();
        delete dados[campo];

        const res = await registrar(dados);

        expect(res.status).toBe(400);
    });

    test('recusa e-mail já cadastrado (409)', async () => {
        const dados = novoUsuario();
        await registrar(dados);

        const res = await registrar({ ...dados, username: 'outroNome' });

        expect(res.status).toBe(409);
        expect(res.body.message).toBe('Este email já está em uso.');
    });
});
