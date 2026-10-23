// tests/servidor.test.js — front-end servido pelo Express e configuração de produção
const request = require('supertest');
const db = require('../db/database');
const { app } = require('./helpers');

beforeAll(() => db.ready);
afterAll((done) => { db.close(done); });

describe('Servidor', () => {
    test('GET / entrega a página do front-end', async () => {
        const res = await request(app).get('/');

        expect(res.status).toBe(200);
        expect(res.headers['content-type']).toMatch(/html/);
    });

    test('GET /app.js entrega o JavaScript do front-end', async () => {
        const res = await request(app).get('/app.js');

        expect(res.status).toBe(200);
        expect(res.headers['content-type']).toMatch(/javascript/);
    });

    test('GET /api responde que a API está funcionando', async () => {
        const res = await request(app).get('/api');

        expect(res.status).toBe(200);
        expect(res.body.message).toMatch(/funcionando/);
    });

    test.each(['/db.sqlite', '/index.js', '/package.json', '/config/auth.js'])(
        'não expõe arquivos internos: %s devolve 404',
        async (caminho) => {
            const res = await request(app).get(caminho);

            expect(res.status).toBe(404);
        }
    );
});

describe('Configuração do JWT', () => {
    const ambienteOriginal = { ...process.env };
    afterEach(() => { process.env = { ...ambienteOriginal }; });

    const carregarConfig = () => {
        let config;
        jest.isolateModules(() => { config = require('../config/auth'); });
        return config;
    };

    test('em produção, sem JWT_SECRET, o servidor se recusa a subir', () => {
        process.env.NODE_ENV = 'production';
        delete process.env.JWT_SECRET;

        expect(carregarConfig).toThrow(/JWT_SECRET/);
    });

    test('em produção, usa o JWT_SECRET definido no ambiente', () => {
        process.env.NODE_ENV = 'production';
        process.env.JWT_SECRET = 'segredo-de-teste';

        expect(carregarConfig().JWT_SECRET).toBe('segredo-de-teste');
    });
});
