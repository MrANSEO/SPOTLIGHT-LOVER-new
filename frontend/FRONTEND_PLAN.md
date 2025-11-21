# 🎨 SPOTLIGHT LOVER FRONTEND - Plan de Développement

## 📋 Analyse du Design Existant

### 🎨 Palette de Couleurs (Inspirée de tes prototypes)
```css
/* Gradient principal */
background: linear-gradient(-45deg, #1b0028, #2b0057, #43007a, #6d00b8);

/* Couleurs d'accentuation */
Primary: #c77dff (Violet clair)
Secondary: #d28cff (Violet moyen)
Gradient Button: linear-gradient(90deg, #8a00ff, #d000ff)
Text: #ffffff
Background Card: rgba(0, 0, 0, 0.6)
Border: rgba(255, 255, 255, 0.1)
```

### ✨ Animations Existantes
1. `gradientMove` - Fond animé (15s)
2. `glow` - Effet de lueur sur logo (2s)
3. `slideUp` - Entrée des boutons
4. `fadeIn` - Apparition des éléments
5. `twinkle` - Étoiles scintillantes

## 🗂️ Structure des Pages (À implémenter en React)

### 1. Page d'Accueil (`/`)
**Prototype** : `index.html` (lignes 1-142)
- Logo "Spotlight Lover" avec effet glow
- 2 boutons : Se connecter | S'inscrire
- Étoiles animées en arrière-plan
- Footer

**Composants React** :
- `pages/Home.jsx`
- `components/StarBackground.jsx`
- `components/AnimatedLogo.jsx`

---

### 2. Page de Connexion (`/login`)
**Prototype** : `login.html` (lignes 450-579)
- Formulaire email + password
- Boutons social login (Google, Facebook)
- Lien vers inscription

**Composants React** :
- `pages/Login.jsx`
- `components/AuthForm.jsx`
- `components/SocialButtons.jsx`

---

### 3. Page d'Inscription (`/register`)

#### Option A : **Inscription Votant** (`/register/voter`)
- Gratuit
- Email, Password, Nom complet
- Bouton "S'inscrire Gratuitement"

#### Option B : **Inscription Participant** (`/register/participant`)
- 500 FCFA
- Email, Password, Nom, Upload vidéo, Bio, Réseaux sociaux
- Bouton "Payer 500 FCFA"
- Popup paiement MTN/Orange

**Composants React** :
- `pages/Register.jsx`
- `pages/RegisterVoter.jsx`
- `pages/RegisterParticipant.jsx`
- `components/VideoUpload.jsx`
- `components/PaymentModal.jsx`

---

### 4. Feed Principal (`/feed` ou `/main`)
**Prototype** : `main.html` (lignes 582-760)
- Scroll vertical type TikTok
- Vidéos en plein écran
- Informations candidat (nom, votes)
- Bouton "Voter" par vidéo
- Auto-play/pause au scroll

**Composants React** :
- `pages/Feed.jsx`
- `components/VideoCard.jsx`
- `components/VoteButton.jsx`
- `hooks/useIntersectionObserver.js`

---

### 5. Classement (`/leaderboard`)
**Prototype** : `leaderboard.html` (lignes 239-447)
- Top candidats avec rang, avatar, votes
- Mise à jour temps réel (WebSocket)
- Animations d'apparition

**Composants React** :
- `pages/Leaderboard.jsx`
- `components/LeaderboardItem.jsx`
- `hooks/useWebSocket.js`

---

### 6. Profil Utilisateur (`/profile`)
**Prototype** : `profile.html` (lignes 763-936)
- Avatar, pseudo, nombre de votes
- Grille de vidéos uploadées
- Bouton "Modifier profil"

**Composants React** :
- `pages/Profile.jsx`
- `components/ProfileCard.jsx`
- `components/VideoGrid.jsx`

---

### 7. Paramètres (`/settings`)
**Prototype** : `settings.html` (lignes 1073-1219)
- Modifier pseudo, email, mot de passe
- Upload avatar
- Bouton déconnexion

**Composants React** :
- `pages/Settings.jsx`
- `components/SettingsForm.jsx`

---

## 🧩 Composants Réutilisables

### Layout
- `Layout.jsx` - Container principal
- `Header.jsx` - Logo + navigation
- `BottomNav.jsx` - Navigation fixe en bas (Accueil, Classement, Profil, Paramètres)
- `Footer.jsx` - Copyright

### Forms
- `Input.jsx` - Input stylisé
- `Button.jsx` - Bouton avec gradients
- `FileInput.jsx` - Upload fichier

### UI
- `Card.jsx` - Carte avec fond transparent
- `Modal.jsx` - Modal popup
- `Loading.jsx` - Spinner de chargement
- `Toast.jsx` - Notifications

---

## 🔧 Services & Utilities

### API Service (`src/services/api.js`)
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VITE_API_URL || 'http://localhost:4000/api',
});

// Intercepteur pour JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### Auth Service (`src/services/auth.js`)
```javascript
export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
  getProfile: () => api.get('/auth/me'),
};
```

### Vote Service (`src/services/votes.js`)
```javascript
export const voteService = {
  createVote: (data) => api.post('/votes', data),
  getMyVotes: () => api.get('/votes/my-votes'),
};
```

### Candidate Service (`src/services/candidates.js`)
```javascript
export const candidateService = {
  getAll: () => api.get('/candidates'),
  getOne: (id) => api.get(`/candidates/${id}`),
};
```

### Upload Service (`src/services/upload.js`)
```javascript
export const uploadService = {
  uploadVideo: (file) => {
    const formData = new FormData();
    formData.append('video', file);
    return api.post('/upload/video', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
```

### WebSocket Hook (`src/hooks/useWebSocket.js`)
```javascript
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export const useWebSocket = (namespace) => {
  const [socket, setSocket] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    const socketInstance = io(`http://localhost:4000/${namespace}`);
    setSocket(socketInstance);

    socketInstance.on('leaderboard:update', (newData) => {
      setData(newData);
    });

    return () => socketInstance.disconnect();
  }, [namespace]);

  return { socket, data };
};
```

---

## 📁 Structure de Dossiers

```
frontend/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/
│   │   └── logo.svg
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Layout.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── BottomNav.jsx
│   │   │   └── Footer.jsx
│   │   ├── auth/
│   │   │   ├── AuthForm.jsx
│   │   │   ├── SocialButtons.jsx
│   │   │   └── RegisterOptions.jsx
│   │   ├── video/
│   │   │   ├── VideoCard.jsx
│   │   │   ├── VideoUpload.jsx
│   │   │   └── VideoGrid.jsx
│   │   ├── leaderboard/
│   │   │   └── LeaderboardItem.jsx
│   │   ├── profile/
│   │   │   └── ProfileCard.jsx
│   │   ├── ui/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Loading.jsx
│   │   │   └── Toast.jsx
│   │   └── effects/
│   │       ├── StarBackground.jsx
│   │       └── AnimatedLogo.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── RegisterVoter.jsx
│   │   ├── RegisterParticipant.jsx
│   │   ├── Feed.jsx
│   │   ├── Leaderboard.jsx
│   │   ├── Profile.jsx
│   │   └── Settings.jsx
│   ├── services/
│   │   ├── api.js
│   │   ├── auth.js
│   │   ├── candidates.js
│   │   ├── votes.js
│   │   └── upload.js
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useWebSocket.js
│   │   └── useIntersectionObserver.js
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   ├── styles/
│   │   ├── global.css
│   │   └── animations.css
│   ├── utils/
│   │   ├── constants.js
│   │   └── helpers.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env
├── .env.example
├── vite.config.js
├── package.json
└── README.md
```

---

## 🚀 Roadmap d'Implémentation

### Phase 1 : Setup & Configuration (✅ FAIT)
- [x] Créer projet Vite React
- [x] Installer dépendances (react-router-dom, axios, socket.io-client)

### Phase 2 : Layout & Design System (EN COURS)
- [ ] Créer fichier `global.css` avec palette de couleurs
- [ ] Créer `animations.css` avec animations du prototype
- [ ] Composant `Layout` avec Header + BottomNav
- [ ] Composant `StarBackground`

### Phase 3 : Auth (Prioritaire)
- [ ] Page Home avec 2 boutons
- [ ] Page Login
- [ ] Page Register (choix Votant/Participant)
- [ ] AuthContext pour gestion état utilisateur
- [ ] Connexion API backend

### Phase 4 : Feed Principal
- [ ] Page Feed avec scroll vertical
- [ ] VideoCard component
- [ ] Auto-play/pause au scroll
- [ ] Bouton Vote avec popup paiement

### Phase 5 : Leaderboard
- [ ] Page Leaderboard
- [ ] WebSocket temps réel
- [ ] Animations d'apparition

### Phase 6 : Profil & Settings
- [ ] Page Profile
- [ ] Page Settings
- [ ] Edit profile
- [ ] Change password

### Phase 7 : Tests & Déploiement
- [ ] Tests des flows complets
- [ ] Build production
- [ ] Déploiement Vercel

---

## 🎯 Prochaines Étapes Immédiates

1. **Créer les fichiers CSS globaux** avec le design violet
2. **Créer le Layout principal** (Header + BottomNav)
3. **Page Home** avec logo animé et 2 boutons
4. **Page Login** avec formulaire
5. **Connexion API backend**

---

**Date de création** : 19 Janvier 2025  
**Status** : 🚧 En développement
