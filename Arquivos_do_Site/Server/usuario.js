const db = require('./db'); // Importa o banco de dados configurado no `db.js`
const bcrypt = require('bcrypt'); // Importa o bcrypt para criptografar senhas
const saltRounds = 10; // Define o número de rounds para a criptografia

// Função para registrar um novo usuário
function registrarUsuario(nome, email, senha, telefone, dataNascimento) {
  // Log para verificar os dados recebidos
  console.log('Dados recebidos para registro:', { nome, email, senha, telefone, dataNascimento });

  bcrypt.hash(senha, saltRounds, (err, hashedPassword) => {
    if (err) {
      console.error('Erro ao criptografar a senha: ' + err.message);
      return;
    }

    const query = `
      INSERT INTO usuarios (nome, email, senha, telefone, data_nascimento)
      VALUES (?, ?, ?, ?, ?)
    `;
    db.run(query, [nome, email, hashedPassword, telefone, dataNascimento], function(err) {
      if (err) {
        console.error('Erro ao registrar usuário: ' + err.message);
        return;
      }
      console.log(`Usuário registrado com ID: ${this.lastID}`);
    });
  });
}

// Função para consultar um usuário pelo email
function consultarUsuarioPorEmail(email, callback) {
  const query = 'SELECT * FROM usuarios WHERE email = ?';
  db.get(query, [email], (err, row) => {
    if (err) {
      console.error('Erro ao consultar usuário: ' + err.message);
      return;
    }
    callback(row); // Retorna o usuário encontrado
  });
}

// Exporta as funções para serem usadas em outros arquivos
module.exports = {
  registrarUsuario,
  consultarUsuarioPorEmail,
};
