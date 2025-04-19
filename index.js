const express = require('express');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

const DATA_FILE = 'data.json';

let canal = {
  nome: "Meu Canal no YouTube",
  imagem: "https://i.ibb.co/x8KR2DNw/channels4-profile.jpg",
  link: "https://youtube.com/@ice_noobz?si=95x2-51So46C24Ga"
};
let itens = [];

try {
  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  canal = data.canal || canal;
  itens = data.itens || [];
} catch (err) {
  salvarDados();
}

function salvarDados() {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ canal, itens }, null, 2));
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const gerarHTML = (isManager = false) => {
  const form = `
    <form method="POST" action="/add">
      <input name="image" type="url" placeholder="URL da Imagem" required />
      <input name="text" placeholder="Texto" required />
      <input name="link" type="url" placeholder="Link" required />
      <button type="submit">Adicionar</button>
    </form>
    <hr/>
  `;

  return `
  <!DOCTYPE html>
  <html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <title>${isManager ? 'Painel de Gerenciamento' : 'Bio do Canal'}</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">
    <style>
      * { box-sizing: border-box; }
      body {
        font-family: 'Poppins', sans-serif;
        background: linear-gradient(135deg, #2c3e50, #3498db);
        margin: 0;
        padding: 0;
        color: #333;
      }
      header {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        padding: 30px;
        text-align: center;
        color: #fff;
        font-size: 2rem;
        font-weight: 600;
        box-shadow: 0 4px 10px rgba(0,0,0,0.2);
      }
      .container {
        max-width: 800px;
        margin: 40px auto;
        background: #fff;
        padding: 30px;
        border-radius: 20px;
        box-shadow: 0 8px 20px rgba(0,0,0,0.15);
      }
      .profile {
        text-align: center;
        cursor: pointer;
        transition: transform 0.3s ease;
      }
      .profile:hover {
        transform: scale(1.03);
      }
      .profile img {
        border-radius: 50%;
        width: 120px;
        height: 120px;
        object-fit: cover;
        border: 4px solid #3498db;
      }
      .profile h2 {
        margin-top: 15px;
        font-size: 1.8rem;
        color: #2c3e50;
      }
      .item {
        display: flex;
        align-items: center;
        background: #f5f5f5;
        padding: 15px;
        border-radius: 12px;
        margin-top: 15px;
        transition: box-shadow 0.3s ease;
      }
      .item:hover {
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      }
      .item img {
        width: 70px;
        height: 70px;
        margin-right: 15px;
        border-radius: 10px;
        object-fit: cover;
        border: 2px solid #3498db;
      }
      .item a {
        font-size: 1.1rem;
        color: #2980b9;
        font-weight: 600;
        text-decoration: none;
      }
      form input, form button {
        width: 100%;
        padding: 12px;
        border-radius: 10px;
        border: none;
        margin-top: 12px;
        font-size: 1rem;
      }
      form input {
        background: #f0f0f0;
      }
      form button {
        background: #3498db;
        color: #fff;
        font-weight: bold;
        cursor: pointer;
        transition: background 0.3s ease;
      }
      form button:hover {
        background: #2980b9;
      }
      hr {
        margin: 30px 0;
        border: none;
        border-top: 2px solid #eee;
      }
    </style>
  </head>
  <body>
    <header>${isManager ? 'Painel de Gerenciamento' : 'Bio do Canal'}</header>
    <div class="container">
      <div class="profile" onclick="window.open('${canal.link}', '_blank')">
        <img src="${canal.imagem}" alt="Imagem do Canal" />
        <h2>${canal.nome}</h2>
      </div>
    </div>
    <div class="container">
      ${isManager ? form : ''}
      ${itens.map(item => `
        <div class="item">
          <img src="${item.image}" alt="">
          <a href="${item.link}" target="_blank">${item.text}</a>
        </div>
      `).join('')}
    </div>
  </body>
  </html>
  `;
};

app.get('/', (req, res) => res.send(gerarHTML(false)));
app.get('/manager', (req, res) => res.send(gerarHTML(true)));

app.post('/add', (req, res) => {
  const { image, text, link } = req.body;
  if (image && text && link) {
    itens.push({ image, text, link });
    salvarDados();
  }
  res.redirect('/manager');
});

app.listen(PORT, () => console.log(`Rodando em http://localhost:${PORT}`));
