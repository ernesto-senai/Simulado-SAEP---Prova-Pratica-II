const express = require('express');
const path = require('path');
const pool = require('./db');

const app = express();
const PORT = 3000;

app.use(express.json());

// Serve as telas. A rota "/" abre o index.html (Gerenciador de evento),
// que é a primeira tela apresentada ao iniciar a aplicação.
app.use(express.static(path.join(__dirname, 'public')));

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function vazio(valor) {
  return valor === undefined || valor === null || String(valor).trim() === '';
}

function erroServidor(res, err) {
  console.error(err);
  res.status(500).json({ mensagem: 'Erro no servidor. Verifique a conexão com o banco de dados.' });
}

// =========================================================
// PALESTRANTES
// =========================================================

// Lista os palestrantes (usado no campo "Palestrante" do cadastro de evento)
app.get('/api/palestrantes', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id_palestrante, nome, email FROM palestrante ORDER BY nome'
    );
    res.json(rows);
  } catch (err) {
    erroServidor(res, err);
  }
});

// Cadastra um palestrante
app.post('/api/palestrantes', async (req, res) => {
  const { nome, email } = req.body;

  if (vazio(nome) || vazio(email)) {
    return res.status(400).json({ mensagem: 'Preencha todos os campos.' });
  }
  if (!EMAIL_REGEX.test(String(email).trim())) {
    return res.status(400).json({ mensagem: 'E-mail inválido.' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO palestrante (nome, email) VALUES (?, ?)',
      [String(nome).trim(), String(email).trim().toLowerCase()]
    );
    res.status(201).json({ id: result.insertId, mensagem: 'Cadastro concluído com sucesso' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ mensagem: 'Este e-mail já está cadastrado.' });
    }
    erroServidor(res, err);
  }
});

// =========================================================
// EVENTOS
// =========================================================

function validarEvento(body) {
  const { nome, descricao, local_evento, id_palestrante } = body;
  if ([nome, descricao, local_evento, id_palestrante].some(vazio)) {
    return 'Preencha todos os campos.';
  }
  if (!Number.isInteger(Number(id_palestrante))) {
    return 'Palestrante inválido.';
  }
  return null;
}

function dadosEvento(body) {
  return [
    String(body.nome).trim(),
    String(body.descricao).trim(),
    String(body.local_evento).trim(),
    Number(body.id_palestrante)
  ];
}

// Lista todos os eventos com o nome do palestrante vinculado
app.get('/api/eventos', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT e.id_evento, e.nome, e.descricao, e.local_evento,
             e.id_palestrante, p.nome AS palestrante
      FROM evento e
      INNER JOIN palestrante p ON p.id_palestrante = e.id_palestrante
      ORDER BY e.id_evento
    `);
    res.json(rows);
  } catch (err) {
    erroServidor(res, err);
  }
});

// Busca um evento (usado para preencher o formulário na edição)
app.get('/api/eventos/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id_evento, nome, descricao, local_evento, id_palestrante FROM evento WHERE id_evento = ?',
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ mensagem: 'Evento não encontrado.' });
    }
    res.json(rows[0]);
  } catch (err) {
    erroServidor(res, err);
  }
});

// Cadastra um evento
app.post('/api/eventos', async (req, res) => {
  const erro = validarEvento(req.body);
  if (erro) return res.status(400).json({ mensagem: erro });

  try {
    const [result] = await pool.query(
      'INSERT INTO evento (nome, descricao, local_evento, id_palestrante) VALUES (?, ?, ?, ?)',
      dadosEvento(req.body)
    );
    res.status(201).json({ id: result.insertId, mensagem: 'Cadastro concluído com sucesso' });
  } catch (err) {
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ mensagem: 'Palestrante não encontrado.' });
    }
    erroServidor(res, err);
  }
});

// Atualiza um evento existente (edição: não cria um novo registro)
app.put('/api/eventos/:id', async (req, res) => {
  const erro = validarEvento(req.body);
  if (erro) return res.status(400).json({ mensagem: erro });

  try {
    const [result] = await pool.query(
      'UPDATE evento SET nome = ?, descricao = ?, local_evento = ?, id_palestrante = ? WHERE id_evento = ?',
      [...dadosEvento(req.body), req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensagem: 'Evento não encontrado.' });
    }
    res.json({ mensagem: 'Evento atualizado com sucesso' });
  } catch (err) {
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ mensagem: 'Palestrante não encontrado.' });
    }
    erroServidor(res, err);
  }
});

// Exclui um evento
app.delete('/api/eventos/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM evento WHERE id_evento = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensagem: 'Evento não encontrado.' });
    }
    res.json({ mensagem: 'Evento excluído com sucesso' });
  } catch (err) {
    erroServidor(res, err);
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
