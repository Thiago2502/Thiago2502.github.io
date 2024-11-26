const express = require('express');
const session = require('express-session');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Configuração do banco de dados SQLite
const db = new sqlite3.Database('./Banco_Dados.db');

// Configuração do middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
    secret: 'secreta', 
    resave: false,
    saveUninitialized: true,
}));

// Verificação de login do usuário
app.use((req, res, next) => {
    if (!req.session.userId && req.url !== '/login') {
        return res.redirect('/login');
    }
    next();
});

// Rota para login (não registrada no banco para simplificação)
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/Login/Login.html');
});

app.post('/login', (req, res) => {
    const { email, senha } = req.body;
    db.get('SELECT * FROM usuarios WHERE email = ? AND senha = ?', [email, senha], (err, row) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Erro ao realizar login');
        }
        if (row) {
            req.session.userId = row.id;
            return res.redirect('/destinos');
        } else {
            return res.status(401).send('Credenciais inválidas');
        }
    });
});

// Rota para a página de registro
app.get('/registro', (req, res) => {
    res.sendFile(__dirname + '/public/Login/Registro.html');
});

app.post('/registro', (req, res) => {
    const { nome, email, senha, telefone, data_nascimento } = req.body;
    db.run('INSERT INTO usuarios (nome, email, senha, telefone, data_nascimento) VALUES (?, ?, ?, ?, ?)', 
        [nome, email, senha, telefone, data_nascimento], function(err) {
        if (err) {
            console.log(err);
            return res.status(500).send('Erro ao registrar');
        }
        res.redirect('/login');
    });
});

// Rota para adicionar novos destinos
app.post('/adicionar-lugar', (req, res) => {
    const { nome, descricao, avaliacao } = req.body;
    db.run('INSERT INTO destinos (nome, descricao, avaliacao) VALUES (?, ?, ?)', 
        [nome, descricao, avaliacao], function(err) {
        if (err) {
            console.log(err);
            return res.status(500).send('Erro ao adicionar destino');
        }
        res.redirect('/destinos');
    });
});

// Rota para pegar a lista de destinos
app.get('/destinos', (req, res) => {
    db.all('SELECT * FROM destinos', (err, rows) => {
        if (err) {
            return res.status(500).send('Erro ao carregar destinos');
        }
        res.json(rows);
    });
});

// Inicialização do servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
