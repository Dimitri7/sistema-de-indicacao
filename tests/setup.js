// Executado antes de cada arquivo de teste: usa um banco SQLite temporário
// em memória, para não mexer no db.sqlite de verdade.
process.env.DB_PATH = ':memory:';
