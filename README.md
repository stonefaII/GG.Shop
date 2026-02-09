# GG.Shop - Site E-commerce Paris Esportifs

Site e-commerce pour GambleGenius.fr - Plateforme de prédictions et analyses de paris esportifs.

## 🏗️ Architecture

```
GG.Shop/
├── backend/          # Serveur Express.js
│   ├── server.js     # Point d'entrée du serveur
│   ├── package.json  # Dépendances backend
│   └── .env          # Variables d'environnement
│
└── frontend/         # Frontend HTML/CSS/Tailwind
    ├── src/
    │   └── input.css # Styles Tailwind source
    ├── dist/
    │   ├── index.html    # Page principale
    │   └── output.css    # CSS compilé (généré)
    ├── package.json      # Dépendances frontend
    └── tailwind.config.js # Configuration Tailwind
```

## 🚀 Installation

### Prérequis
- Node.js (v16 ou supérieur)
- npm ou yarn

### 1. Installer les dépendances Backend

```bash
cd backend
npm install
```

### 2. Installer les dépendances Frontend

```bash
cd frontend
npm install
```

## 💻 Lancement du projet

### Option 1: Développement complet (Backend + Frontend)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Le serveur Express sera disponible sur `http://localhost:3000`

**Terminal 2 - Frontend (Build Tailwind en mode watch):**
```bash
cd frontend
npm run build:css
```
Cela compile Tailwind CSS et surveille les changements.

### Option 2: Production

**1. Build le CSS:**
```bash
cd frontend
npm run build
```

**2. Lancer le serveur:**
```bash
cd backend
npm start
```

Visitez `http://localhost:3000` dans votre navigateur.

## 📦 Scripts disponibles

### Backend
- `npm start` - Démarre le serveur en mode production
- `npm run dev` - Démarre le serveur avec nodemon (rechargement automatique)

### Frontend
- `npm run build:css` - Compile Tailwind en mode watch (développement)
- `npm run build` - Compile et minifie Tailwind (production)

## 🎨 Technologies utilisées

### Backend
- **Express.js** - Framework web Node.js
- **CORS** - Gestion des requêtes cross-origin
- **dotenv** - Gestion des variables d'environnement

### Frontend
- **HTML5** - Structure sémantique
- **CSS3** - Styles natifs
- **Tailwind CSS** - Framework CSS utility-first
- **Font Awesome** - Icônes

## 🌟 Fonctionnalités

- ✅ Design moderne et responsive
- ✅ Thème sombre (dark mode)
- ✅ Sections produits (New Arrivals, Top Selling)
- ✅ Catégories de navigation
- ✅ Témoignages clients
- ✅ Newsletter
- ✅ Footer complet avec liens
- ✅ API REST backend (exemple)

## 🔧 Configuration

### Variables d'environnement (backend/.env)
```
PORT=3000
NODE_ENV=development
```

### Personnalisation Tailwind
Modifiez `frontend/tailwind.config.js` pour personnaliser:
- Couleurs
- Polices
- Breakpoints
- Plugins

## 📱 Routes API

- `GET /api/health` - Vérification de l'état du serveur
- `GET /api/products` - Liste des produits (exemple)

## 🎯 Prochaines étapes

- [ ] Ajouter une base de données (MongoDB/PostgreSQL)
- [ ] Implémenter l'authentification utilisateur
- [ ] Créer un panier d'achat fonctionnel
- [ ] Ajouter un système de paiement
- [ ] Intégrer les API de paris esportifs
- [ ] Ajouter des filtres et recherche avancée

## 📄 Licence

Ce projet est privé et confidentiel.

## 👨‍💻 Auteur

Développé pour GambleGenius.fr
