// db/database.js
const sqlite3 = require('sqlite3').verbose();
// Nos testes usamos DB_PATH=":memory:" (banco temporário em memória)
const DBSOURCE = process.env.DB_PATH || "db.sqlite";

// Promessa que resolve quando a tabela "users" está pronta para uso
let marcarComoPronto;
const ready = new Promise((resolve) => { marcarComoPronto = resolve; });

const db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        // Se não conseguir abrir o banco de dados
        console.error(err.message);
        throw err;
    } else {
        console.log('Conectado ao banco de dados SQLite.');
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL,
            referral_code TEXT NOT NULL UNIQUE,
            points INTEGER NOT NULL DEFAULT 0,
            referred_by_id INTEGER,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (referred_by_id) REFERENCES users (id)
        )`, (err) => {
            if (err) {
                // A tabela já foi criada
            } else {
                // A tabela acabou de ser criada
                console.log('Tabela "users" criada com sucesso.');
            }
            marcarComoPronto();
        });
    }
});

db.ready = ready;

module.exports = db;