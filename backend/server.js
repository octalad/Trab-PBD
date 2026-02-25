const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

/* ===============================
   LISTAR TODOS OS PONTOS
================================ */

app.get("/pontos", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.id_ponto,
        p.nome_ponto,
        p.descricao,
        c.nome_cidade,
        r.nome_regiao,
        t.descricao AS tipo
      FROM Ponto_turistico p
      JOIN Cidade c ON p.id_cidade = c.id_cidade
      JOIN Regiao r ON c.id_regiao = r.id_regiao
      JOIN Tipo_Ponto t ON p.id_tipo = t.id_tipo
      ORDER BY r.nome_regiao, c.nome_cidade
    `);

    res.json(rows);
  } catch (err) {
    res.status(500).json(err);
  }
});

/* ===============================
   INSERIR NOVO PONTO
================================ */

app.post("/pontos", async (req, res) => {
  const { nome_ponto, descricao, id_cidade, id_tipo } = req.body;

  try {
    await db.query(
      `INSERT INTO Ponto_turistico 
       (nome_ponto, descricao, id_cidade, id_tipo)
       VALUES (?, ?, ?, ?)`,
      [nome_ponto, descricao, id_cidade, id_tipo],
    );

    res.status(201).json({ message: "Criado com sucesso" });
  } catch (err) {
    res.status(500).json(err);
  }
});

app.listen(3001, () => {
  console.log("Servidor rodando em http://localhost:3001");
});

app.get("/pontos-por-tipo", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.nome_ponto,
        t.descricao AS tipo_ponto,
        c.nome_cidade
      FROM Ponto_turistico p
      JOIN Tipo_Ponto t ON p.id_tipo = t.id_tipo
      JOIN Cidade c ON p.id_cidade = c.id_cidade
      ORDER BY t.descricao, c.nome_cidade
    `);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/servicos-por-ponto", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.nome_ponto,
        s.nome_servico
      FROM Ponto_turistico p
      JOIN Ponto_Turistico_Servico pts ON p.id_ponto = pts.id_ponto
      JOIN Servico s ON pts.id_servico = s.id_servico
      ORDER BY p.nome_ponto, s.nome_servico
    `);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/acessibilidade-por-ponto", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.nome_ponto,
        a.descricao AS acessibilidade
      FROM Ponto_turistico p
      JOIN Ponto_Turistico_Acessibilidade pta ON p.id_ponto = pta.id_ponto
      JOIN Acessibilidade a ON pta.id_acessibilidade = a.id_acessibilidade
      ORDER BY p.nome_ponto, a.descricao
    `);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/pontos-estacionamento", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.nome_ponto,
        c.nome_cidade
      FROM Ponto_turistico p
      JOIN Ponto_Turistico_Servico pts ON p.id_ponto = pts.id_ponto
      JOIN Servico s ON pts.id_servico = s.id_servico
      JOIN Cidade c ON p.id_cidade = c.id_cidade
      WHERE s.nome_servico = 'Estacionamento'
      ORDER BY c.nome_cidade
    `);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/pontos-litoral", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.nome_ponto,
        t.descricao AS tipo_ponto,
        s.nome_servico
      FROM Ponto_turistico p
      JOIN Cidade c ON p.id_cidade = c.id_cidade
      JOIN Regiao r ON c.id_regiao = r.id_regiao
      JOIN Tipo_Ponto t ON p.id_tipo = t.id_tipo
      LEFT JOIN Ponto_Turistico_Servico pts ON p.id_ponto = pts.id_ponto
      LEFT JOIN Servico s ON pts.id_servico = s.id_servico
      WHERE r.nome_regiao = 'Litoral'
      ORDER BY p.nome_ponto
    `);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
