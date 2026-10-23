// config/auth.js
// O segredo do JWT vem da variável de ambiente JWT_SECRET.
// Em produção (Render) ela é obrigatória: sem ela o servidor nem sobe.
// Na máquina local, se não for definida, usa um segredo só de desenvolvimento.
const emProducao = process.env.NODE_ENV === 'production' || process.env.RENDER === 'true';

const JWT_SECRET = process.env.JWT_SECRET || (emProducao ? null : 'segredo-apenas-para-desenvolvimento');

if (!JWT_SECRET) {
    throw new Error('Defina a variável de ambiente JWT_SECRET antes de iniciar o servidor em produção.');
}

module.exports = { JWT_SECRET };
