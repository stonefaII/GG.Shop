const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques du frontend
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Routes API
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'GG.Shop API is running' });
});

// Route pour les produits (exemple)
app.get('/api/products', (req, res) => {
  res.json({
    products: [
      { id: 1, name: 'Prediction Pack Premium', price: 49.99, category: 'esports' },
      { id: 2, name: 'Analyse Match CS2', price: 29.99, category: 'csgo' },
      { id: 3, name: 'Pack LoL Championship', price: 79.99, category: 'lol' }
    ]
  });
});

// Toutes les autres routes renvoient index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
