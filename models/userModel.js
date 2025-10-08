const db = require('../db/database.js');
const bcrypt = require('bcryptjs');

// Função para gerar um código de indicação único e simples
const generateReferralCode = (length = 6) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

// Função para encontrar um usuário pelo e-mail (vamos usar no login)
exports.findUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE email = ?';
        db.get(sql, [email], (err, user) => {
            if (err) {
                reject(err);
            } else {
                resolve(user);
            }
        });
    });
};

// Função para criar um novo usuário
exports.createUser = async ({ username, email, password, referralCodeFromFriend }) => {
    // 1. Criptografar a senha
    const passwordHash = await bcrypt.hash(password, 10);

    // 2. Gerar código de indicação único
    const newReferralCode = generateReferralCode();

    return new Promise(async (resolve, reject) => {
        db.serialize(async () => {
            db.run('BEGIN TRANSACTION');

            try {
                let referredById = null;

                // 3. Se foi usado um código de indicação
                if (referralCodeFromFriend) {
                    const referrer = await new Promise((res, rej) => {
                        db.get('SELECT id, points FROM users WHERE referral_code = ?', [referralCodeFromFriend], (err, row) => {
                            if (err) rej(err);
                            res(row);
                        });
                    });

                    // Se encontramos quem indicou → dar 1 ponto
                    if (referrer) {
                        referredById = referrer.id;
                        const currentPoints = referrer.points || 0;
                        const newPoints = currentPoints + 1;

                        await new Promise((res, rej) => {
                            db.run('UPDATE users SET points = ? WHERE id = ?', [newPoints, referrer.id], function(err) {
                                if (err) rej(err);
                                res();
                            });
                        });
                    }
                }

                // 4. Inserir novo usuário (sempre começa com 0 pontos)
                const sql = `INSERT INTO users 
                    (username, email, password_hash, referral_code, referred_by_id, points) 
                    VALUES (?, ?, ?, ?, ?, ?)`;

                const params = [username, email, passwordHash, newReferralCode, referredById, 0];

                db.run(sql, params, function(err) {
                    if (err) {
                        db.run('ROLLBACK');
                        reject(err);
                    } else {
                        db.run('COMMIT');
                        resolve({
                            id: this.lastID,
                            username,
                            email,
                            referralCode: newReferralCode,
                            points: 0
                        });
                    }
                });

            } catch (error) {
                db.run('ROLLBACK');
                reject(error);
            }
        });
    });
};


// Função para buscar os dados principais do dashboard (pontos e código)
exports.getDashboardData = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT username, points, referral_code FROM users WHERE id = ?';
        db.get(sql, [userId], (err, userData) => {
            if (err) {
                reject(err);
            } else {
                resolve(userData);
            }
        });
    });
};

// Função para buscar a lista de usuários que foram indicados por este usuário
exports.getReferredUsers = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT username, created_at FROM users WHERE referred_by_id = ? ORDER BY created_at DESC';
        db.all(sql, [userId], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};
