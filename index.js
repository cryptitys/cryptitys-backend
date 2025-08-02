const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/login', async (req, res) => {
  const { ra, senha } = req.body;
  try {
    const response = await axios.post('https://edusp-api.pjpi.net/api/login', {
      username: ra,
      password: senha
    });
    res.json(response.data);
  } catch (error) {
    res.status(401).json({ error: 'Falha no login' });
  }
});

app.post('/atividades', async (req, res) => {
  const { token, alunoId, expired } = req.body;

  try {
    const response = await axios.get(`https://edusp-api.pjpi.net/api/todo?expired_only=${expired}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const atividades = response.data.filter(a => a.publication_target.includes(alunoId));
    res.json(atividades);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar atividades' });
  }
});

app.post('/responder', async (req, res) => {
  const { atividadeId, resposta, tempo, token } = req.body;

  setTimeout(async () => {
    try {
      await axios.patch(`https://edusp-api.pjpi.net/api/todo/${atividadeId}/complete`, {
        answer: resposta,
        time_spent: tempo
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      res.json({ status: 'Atividade enviada com sucesso' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao enviar atividade' });
    }
  }, tempo * 60000); // tempo em minutos
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
