// tests/indicacao.test.js — pontuação por indicação e GET /api/users/dashboard
const db = require('../db/database');
const { novoUsuario, registrar, dashboard, registrarELogar } = require('./helpers');

beforeAll(() => db.ready);
afterAll((done) => { db.close(done); });

describe('Pontuação por indicação', () => {
    test('usuário novo começa com 0 pontos e sem indicados', async () => {
        const { token, user } = await registrarELogar();

        const res = await dashboard(token);

        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({ points: 0, referralCode: user.referralCode, referredUsers: [] });
    });

    test('quem indica ganha 1 ponto quando alguém se cadastra com seu código', async () => {
        const padrinho = await registrarELogar();

        await registrar(novoUsuario({ referralCode: padrinho.user.referralCode }));

        const res = await dashboard(padrinho.token);
        expect(res.body.points).toBe(1);
    });

    test('os pontos acumulam: 3 indicações = 3 pontos, e os indicados aparecem na lista', async () => {
        const padrinho = await registrarELogar();
        const indicados = [novoUsuario(), novoUsuario(), novoUsuario()];

        for (const indicado of indicados) {
            await registrar({ ...indicado, referralCode: padrinho.user.referralCode });
        }

        const res = await dashboard(padrinho.token);
        expect(res.body.points).toBe(3);
        expect(res.body.referredUsers.map((u) => u.username).sort())
            .toEqual(indicados.map((u) => u.username).sort());
    });

    test('o usuário indicado não ganha ponto por usar um código', async () => {
        const padrinho = await registrarELogar();

        const indicado = await registrarELogar({ referralCode: padrinho.user.referralCode });

        const res = await dashboard(indicado.token);
        expect(res.body.points).toBe(0);
    });

    test('código de indicação inexistente não dá ponto, mas o cadastro funciona', async () => {
        const res = await registrar(novoUsuario({ referralCode: 'XXXXXX' }));

        expect(res.status).toBe(201);
        expect(res.body.user.points).toBe(0);
    });

    test('cadastro que falha (e-mail repetido) não dá ponto a quem indicou', async () => {
        const padrinho = await registrarELogar();
        const existente = novoUsuario();
        await registrar(existente);

        const res = await registrar({ ...existente, referralCode: padrinho.user.referralCode });
        expect(res.status).toBe(409);

        const painel = await dashboard(padrinho.token);
        expect(painel.body.points).toBe(0);
    });

    test('dashboard sem token devolve 401', async () => {
        const res = await dashboard();

        expect(res.status).toBe(401);
    });

    test('dashboard com token inválido devolve 401', async () => {
        const res = await dashboard('token-falso');

        expect(res.status).toBe(401);
    });
});
