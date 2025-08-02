const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rota de teste
app.get('/', (req, res) => {
  res.send('Servidor Cryptitys ativo.');
});

// Endpoint para autenticação (exemplo)
app.post('/login', (req, res) => {
  const { ra, senha } = req.body;
  // Simule autenticação real aqui
  if (ra && senha) {
    res.json({ success: true, token: 'simulado-123' });
  } else {
    res.status(401).json({ success: false, message: 'Credenciais inválidas' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});app.post('/responder', async (req, res) => {
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
