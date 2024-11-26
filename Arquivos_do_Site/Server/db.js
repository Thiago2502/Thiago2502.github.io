const sqlite3 = require('sqlite3').verbose(); // Importa o SQLite3

// Inicializa o banco de dados
const db = new sqlite3.Database('./rota_campinas.db');

// Cria a tabela de usuários
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      senha TEXT NOT NULL,
      telefone TEXT,
      data_nascimento TEXT NOT NULL
    )
  `, (err) => {
    if (err) {
      console.error('Erro ao criar a tabela de usuários: ' + err.message);
    } else {
      console.log('Tabela de usuários configurada.');
    }
  });
});

// Exporta o banco de dados para uso em outros arquivos
module.exports = db;
