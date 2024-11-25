const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const db = new sqlite3.Database('./Banco_Dados.db'); // Banco persistente
app.use(bodyParser.json());

// Criar tabela "noticias" (executa apenas na inicialização)
db.run(`
    CREATE TABLE IF NOT EXISTS noticias (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        conteudo TEXT NOT NULL
    )
`);

// CREATE - Adicionar notícia
app.post('/noticias', (req, res) => {
    const { titulo, conteudo } = req.body;
    db.run(
        `INSERT INTO noticias (titulo, conteudo) VALUES (?, ?)`,
        [titulo, conteudo],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: this.lastID, titulo, conteudo });
        }
    );
});

// RETRIEVE - Obter todas as notícias
app.get('/noticias', (req, res) => {
    db.all(`SELECT * FROM noticias`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// RETRIEVE - Obter uma notícia específica
app.get('/noticias/:id', (req, res) => {
    const { id } = req.params;
    db.get(`SELECT * FROM noticias WHERE id = ?`, [id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Notícia não encontrada' });
        res.json(row);
    });
});

// UPDATE - Atualizar uma notícia
app.put('/noticias/:id', (req, res) => {
    const { id } = req.params;
    const { titulo, conteudo } = req.body;
    db.run(
        `UPDATE noticias SET titulo = ?, conteudo = ? WHERE id = ?`,
        [titulo, conteudo, id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            if (this.changes === 0)
                return res.status(404).json({ error: 'Notícia não encontrada' });
            res.json({ id, titulo, conteudo });
        }
    );
});

// DELETE - Remover uma notícia
app.delete('/noticias/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM noticias WHERE id = ?`, [id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0)
            return res.status(404).json({ error: 'Notícia não encontrada' });
        res.json({ message: 'Notícia deletada com sucesso!' });
    });
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
