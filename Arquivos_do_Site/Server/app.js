const express = require('express'); // Importa o Express para criar o servidor
const usuario = require('./usuario'); // Importa as funções relacionadas aos usuários
const app = express();

// Middlewares
app.use(express.json()); // Middleware para interpretar JSON no corpo da requisição
app.use(express.urlencoded({ extended: true })); // Middleware para interpretar dados de formulários (x-www-form-urlencoded)

// Rota para registrar usuário
app.post('/registro', (req, res) => {
  const { nome, email, senha, telefone, dataNascimento } = req.body;

  console.log('Dados recebidos para registro:', req.body);

  usuario.registrarUsuario(nome, email, senha, telefone, dataNascimento);
  res.status(201).send('Usuário registrado com sucesso!');
});

// Rota para consultar usuário pelo email
app.get('/usuario', (req, res) => {
  const { email } = req.query;

  usuario.consultarUsuarioPorEmail(email, (usuarioEncontrado) => {
    if (!usuarioEncontrado) {
      res.status(404).send('Usuário não encontrado!');
    } else {
      res.status(200).json(usuarioEncontrado);
    }
  });
});

// Inicia o servidor
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
