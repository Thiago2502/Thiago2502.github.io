const express = require('express');
const app = express();
const port = 3000; // Porta do servidor

// Middleware para lidar com requisições JSON
app.use(express.json());

// Rota GET para retornar um "olá"
app.get('/', (req, res) => {
  res.send('Olá, servidor funcionando!');
});

// Rota POST para receber uma notícia
app.post('/api/noticias', (req, res) => {
  const noticia = req.body; // Recebe a notícia enviada no corpo da requisição
  console.log('Notícia recebida:', noticia);

  // Aqui você pode salvar a notícia em um banco de dados, ou só retorná-la como exemplo
  res.status(201).json({
    message: 'Notícia recebida com sucesso!',
    noticiaRecebida: noticia
  });
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
