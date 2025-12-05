# 🎬 SPOTLIGHT LOVER - GUIDE COMPLET

## 📋 Table des Matières

1. [Qu'est-ce que Spotlight Lover ?](#1-quest-ce-que-spotlight-lover-)
2. [Architecture et Fonctionnalités](#2-architecture-et-fonctionnalités)
3. [Deux Types d'Inscription](#3-deux-types-dinscription)
4. [Galerie Vidéos et Vote](#4-galerie-vidéos-et-vote)
5. [Installation et Lancement](#5-installation-et-lancement)
6. [Configuration des Services](#6-configuration-des-services)
7. [Déploiement Production](#7-déploiement-production)

---

## 1. Qu'est-ce que Spotlight Lover ?

**Spotlight Lover** est une **plateforme de concours de vidéos** qui permet à :

### 🎯 Participants
- S'inscrire en payant **500 FCFA**
- Uploader leur **vidéo de présentation**
- Recevoir des votes du public
- Voir leur classement en temps réel

### 👥 Votants
- S'inscrire **GRATUITEMENT**
- Regarder toutes les vidéos des participants
- Voter **illimité** pour leurs favoris (**100 FCFA par vote**)
- Suivre le classement en temps réel

### 🎖️ Administrateurs
- Gérer les candidats et les votes
- Voir les statistiques complètes
- Exporter les données en CSV
- Modérer le contenu

---

## 2. Architecture et Fonctionnalités

### 🏗️ Stack Technique

```
┌──────────────────────────────────────┐
│   FRONTEND (À DÉVELOPPER)            │
│   - Next.js 14 / React               │
│   - TailwindCSS                      │
│   - Socket.IO Client                 │
└──────────────────────────────────────┘
              ↕ API REST + WebSocket
┌──────────────────────────────────────┐
│   BACKEND (COMPLET ✅)               │
│   - NestJS + TypeScript              │
│   - PostgreSQL + Prisma              │
│   - JWT Authentication               │
│   - MeSomb + Stripe Payments         │
│   - Socket.IO (Real-time)            │
└──────────────────────────────────────┘
              ↕
┌──────────────────────────────────────┐
│   SERVICES EXTERNES                  │
│   - Cloudinary (Vidéos)              │
│   - MeSomb (MTN + Orange)            │
│   - Stripe (Cartes bancaires)        │
│   - PostgreSQL (Base de données)     │
└──────────────────────────────────────┘
```

### ✅ Modules Backend Complétés (8/10)

| Module | Statut | Fonctionnalités |
|--------|--------|-----------------|
| **Auth** | ✅ | Inscription, Connexion, JWT, 2FA, Profil |
| **Candidates** | ✅ | CRUD candidats, vidéos |
| **Upload** | ✅ | Upload vidéos Cloudinary |
| **Votes** | ✅ | Voter avec paiement |
| **Payments** | ✅ | MeSomb (MTN+Orange), Stripe |
| **Leaderboard** | ✅ | Classement temps réel WebSocket |
| **Analytics** | ✅ | Dashboard stats, Export CSV |
| **Webhooks** | ✅ | Confirmation paiements |
| **Notifications** | ⏳ | Emails, SMS (à faire) |
| **Admin Frontend** | ⏳ | Interface admin (à faire) |

---

## 3. Deux Types d'Inscription

### 🆓 Inscription VOTANT (Gratuit)

**Endpoint Backend** : `POST /api/auth/register`

```json
{
  "email": "votant@example.com",
  "password": "monmotdepasse",
  "fullName": "Marie Kouam",
  "role": "USER"
}
```

**Page Frontend (À créer)** :
```
/register/votant
- Formulaire simple
- Aucun paiement requis
- Accès immédiat après validation
```

---

### 💰 Inscription PARTICIPANT (500 FCFA)

**Processus en 4 étapes** :

#### Étape 1 : Créer un compte
```json
POST /api/auth/register
{
  "email": "participant@example.com",
  "password": "pass123",
  "fullName": "Jean Dupont",
  "role": "PARTICIPANT"
}
```

#### Étape 2 : Upload vidéo
```http
POST /api/upload/video
Headers: Authorization: Bearer {token}
Body: multipart/form-data
{
  "video": [fichier depuis galerie/caméra]
}

Response:
{
  "url": "https://res.cloudinary.com/.../video.mp4",
  "publicId": "spotlight-lover/abc123",
  "duration": 45,
  "format": "mp4",
  "size": 12500000
}
```

#### Étape 3 : Créer profil candidat
```json
POST /api/candidates
{
  "title": "Jean Dupont - Danseur",
  "bio": "Passionné de danse depuis 10 ans...",
  "videoUrl": "https://res.cloudinary.com/.../video.mp4",
  "socialLinks": {
    "instagram": "@jeandupont",
    "tiktok": "@jeandupont"
  }
}

Response:
{
  "id": "uuid-candidat",
  "title": "Jean Dupont - Danseur",
  ...
}
```

#### Étape 4 : Payer les frais d'inscription (500 FCFA)
```json
POST /api/votes
{
  "candidateId": "uuid-candidat",
  "amount": 500,
  "currency": "XAF",
  "paymentMethod": "MTN_MOBILE_MONEY", // ou ORANGE_MONEY
  "customerPhone": "237670000000",
  "customerName": "Jean Dupont"
}

Response:
{
  "success": true,
  "vote": {
    "id": "uuid-vote",
    "status": "PENDING",
    "transaction": {
      "reference": "VOTE-1234567890",
      "providerReference": "mesomb-tx-id"
    }
  }
}
```

**Après le paiement** :
1. Popup MTN/Orange Money apparaît
2. Utilisateur confirme le paiement
3. MeSomb envoie un webhook au backend
4. Transaction confirmée ✅
5. Candidat validé et visible publiquement

---

### 📱 UI/UX Frontend Recommandée

```
Page : /register

┌─────────────────────────────────────┐
│  SPOTLIGHT LOVER - Inscription      │
├─────────────────────────────────────┤
│                                     │
│  ┌───────────┐    ┌───────────┐   │
│  │  VOTANT   │    │PARTICIPANT│   │
│  │           │    │           │   │
│  │ Gratuit   │    │  500 FCFA │   │
│  │           │    │           │   │
│  │ • Voir    │    │ • Upload  │   │
│  │   vidéos  │    │   vidéo   │   │
│  │ • Voter   │    │ • Recevoir│   │
│  │           │    │   votes   │   │
│  │ [Choisir] │    │ [Choisir] │   │
│  └───────────┘    └───────────┘   │
│                                     │
└─────────────────────────────────────┘
```

**Page Votant** : `/register/votant`
- Email, Mot de passe, Nom complet
- Bouton "S'inscrire" → Immédiat ✅

**Page Participant** : `/register/participant`
- Email, Mot de passe, Nom complet
- Upload vidéo (depuis galerie ou caméra)
- Biographie, Liens sociaux
- Bouton "Payer 500 FCFA" → Popup paiement

---

## 4. Galerie Vidéos et Vote

### 📹 Galerie Publique (Tous peuvent voir)

**Endpoint** : `GET /api/candidates`

```json
Response:
[
  {
    "id": "uuid-1",
    "title": "Jean - Danseur",
    "bio": "Passionné de danse...",
    "videoUrl": "https://cloudinary.com/video1.mp4",
    "thumbnailUrl": "https://cloudinary.com/thumb1.jpg",
    "totalVotes": 45,
    "totalAmount": 4500,
    "rank": 1,
    "socialLinks": {
      "instagram": "@jean",
      "tiktok": "@jean"
    }
  },
  ...
]
```

**Page Frontend** : `/videos` ou `/galerie`

```
┌──────────────────────────────────────────┐
│  SPOTLIGHT LOVER - Galerie              │
├──────────────────────────────────────────┤
│                                          │
│  ┌────────┐  ┌────────┐  ┌────────┐    │
│  │ VIDEO  │  │ VIDEO  │  │ VIDEO  │    │
│  │        │  │        │  │        │    │
│  │ Jean   │  │ Marie  │  │ Paul   │    │
│  │ 45 ❤️  │  │ 30 ❤️  │  │ 20 ❤️  │    │
│  │[Voter] │  │[Voter] │  │[Voter] │    │
│  └────────┘  └────────┘  └────────┘    │
│                                          │
└──────────────────────────────────────────┘
```

---

### 🗳️ Voter pour un Candidat

**Endpoint** : `POST /api/votes`

```json
{
  "candidateId": "uuid-candidat",
  "amount": 100,
  "paymentMethod": "MTN_MOBILE_MONEY",
  "customerPhone": "237680000000"
}
```

**Flow Frontend** :
1. Utilisateur clique "Voter" sur une vidéo
2. Modal apparaît : "Voter pour Jean - 100 FCFA"
3. Choisir méthode : MTN ou Orange Money
4. Entrer numéro de téléphone
5. Cliquer "Confirmer" → Popup paiement
6. Payer → Vote validé ✅
7. **Peut voter autant de fois qu'il veut** (votes illimités)

---

### 📊 Classement Temps Réel

**WebSocket** : `ws://localhost:4000/leaderboard`

```javascript
// Frontend
import io from 'socket.io-client';

const socket = io('http://localhost:4000/leaderboard');

socket.on('leaderboard:update', (data) => {
  console.log('Classement mis à jour:', data);
  // Mettre à jour l'affichage
});

socket.on('vote:created', (vote) => {
  console.log('Nouveau vote !', vote);
  // Animation ou notification
});
```

**Page Frontend** : `/classement` ou `/leaderboard`

```
┌────────────────────────────────────────┐
│  SPOTLIGHT LOVER - Classement 🏆       │
├────┬──────────┬───────┬────────┬───────┤
│ #  │ Candidat │ Votes │ Montant│ Action│
├────┼──────────┼───────┼────────┼───────┤
│ 🥇 │ Jean     │ 45    │ 4500 F │[Voter]│
│ 🥈 │ Marie    │ 30    │ 3000 F │[Voter]│
│ 🥉 │ Paul     │ 20    │ 2000 F │[Voter]│
│ 4  │ Sophie   │ 15    │ 1500 F │[Voter]│
└────┴──────────┴───────┴────────┴───────┘
```

---

### 👤 Profil Utilisateur

**Voir mon profil** : `GET /api/auth/me`
**Modifier mon profil** : `PATCH /api/auth/profile`
**Changer mot de passe** : `POST /api/auth/change-password`
**Supprimer compte** : `DELETE /api/auth/account`

**Page Frontend** : `/profile` ou `/mon-compte`

```
┌──────────────────────────────────────┐
│  Mon Profil                          │
├──────────────────────────────────────┤
│                                      │
│  📧 Email: jean@example.com          │
│  👤 Nom: Jean Dupont                 │
│  🎭 Rôle: Participant                │
│                                      │
│  [Modifier]  [Changer mot de passe] │
│  [Supprimer mon compte]              │
│                                      │
└──────────────────────────────────────┘
```

---

## 5. Installation et Lancement

### 📦 Prérequis

- **Node.js** 18+ ([https://nodejs.org](https://nodejs.org))
- **PostgreSQL** 14+ ([https://postgresql.org](https://postgresql.org))
- **VS Code** ([https://code.visualstudio.com](https://code.visualstudio.com))
- **Git** ([https://git-scm.com](https://git-scm.com))

### 🚀 Étape 1 : Cloner le Projet

```bash
# Cloner depuis GitHub
git clone https://github.com/MrANSEO/Spotlight-lover-project-back-end..git

# Aller dans le dossier
cd Spotlight-lover-project-back-end./backend
```

### 📝 Étape 2 : Installer les Dépendances

```bash
npm install
```

**Temps estimé** : 2-3 minutes

### ⚙️ Étape 3 : Configurer l'Environnement

Créer un fichier `.env` à la racine du projet backend :

```bash
# Copier l'exemple
cp .env.example .env

# Éditer avec VS Code
code .env
```

**Contenu minimum du `.env`** :

```env
# Base de données PostgreSQL
DATABASE_URL="postgresql://postgres:password@localhost:5432/spotlight_lover"

# JWT Secrets
JWT_SECRET="dev-secret-key-12345"
JWT_REFRESH_SECRET="dev-refresh-secret-67890"

# Cloudinary (Stockage vidéos)
CLOUDINARY_CLOUD_NAME="ton-cloud-name"
CLOUDINARY_API_KEY="ton-api-key"
CLOUDINARY_API_SECRET="ton-api-secret"

# MeSomb (Paiements MTN + Orange)
MESOMB_APP_KEY="ton-app-key"
MESOMB_API_KEY="ton-access-key"
MESOMB_SECRET_KEY="ton-secret-key"
MESOMB_ENVIRONMENT="sandbox"

# Stripe (Cartes bancaires - optionnel)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### 🗄️ Étape 4 : Créer la Base de Données

```bash
# Démarrer PostgreSQL (si pas déjà démarré)
# Windows: via PostgreSQL Service
# Mac: brew services start postgresql
# Linux: sudo service postgresql start

# Créer la database
psql -U postgres
CREATE DATABASE spotlight_lover;
\q

# Appliquer les migrations Prisma
npx prisma migrate dev

# Générer le client Prisma
npx prisma generate
```

### ✅ Étape 5 : Lancer le Serveur

**Mode Développement** :
```bash
npm run start:dev
```

Le serveur démarre sur **http://localhost:4000**

**Vous verrez** :
```
[Nest] 12345  - LOG [NestApplication] Nest application successfully started
[Nest] 12345  - LOG [Main] 🚀 Server running on http://localhost:4000
[Nest] 12345  - LOG [Main] 📝 API Docs available at http://localhost:4000/api
```

### 🧪 Étape 6 : Tester l'API

**Avec cURL** :
```bash
# Test endpoint public
curl http://localhost:4000/api/candidates

# Test inscription
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "fullName": "Test User",
    "role": "USER"
  }'
```

**Avec Postman** :
1. Télécharger [Postman](https://www.postman.com/downloads/)
2. Importer la collection (à créer)
3. Tester les endpoints

---

## 6. Configuration des Services

### 📹 Cloudinary (Stockage Vidéos)

**1. Créer un compte gratuit** :
- Aller sur [https://cloudinary.com/users/register/free](https://cloudinary.com/users/register/free)
- S'inscrire avec email

**2. Récupérer les credentials** :
- Aller dans **Dashboard** → **Account Details**
- Copier :
  - `Cloud name`
  - `API Key`
  - `API Secret`

**3. Ajouter dans `.env`** :
```env
CLOUDINARY_CLOUD_NAME="ton-cloud-name"
CLOUDINARY_API_KEY="123456789"
CLOUDINARY_API_SECRET="abcdefghijklmnop"
CLOUDINARY_FOLDER="spotlight-lover"
```

**4. Tester l'upload** :
```bash
curl -X POST http://localhost:4000/api/upload/video \
  -H "Authorization: Bearer {ton-token}" \
  -F "video=@/chemin/vers/video.mp4"
```

---

### 💸 MeSomb (Paiements MTN + Orange)

**1. Créer un compte MeSomb** :
- Aller sur [https://mesomb.hachther.com/](https://mesomb.hachther.com/)
- Cliquer **Sign Up**
- Remplir le formulaire
- Valider l'email

**2. Créer une application** :
- Se connecter au **Dashboard**
- Aller dans **Applications** → **Create Application**
- Nom : "Spotlight Lover"
- Description : "Concours de vidéos"
- Sauvegarder

**3. Récupérer les clés** :
- Dans l'application créée, aller dans **API Keys**
- Copier :
  - `Application Key`
  - `Access Key`
  - `Secret Key`

**4. Ajouter dans `.env`** :
```env
MESOMB_APP_KEY="abc123..."
MESOMB_API_KEY="xyz789..."
MESOMB_SECRET_KEY="secret123..."
MESOMB_ENVIRONMENT="sandbox"
```

**5. Configurer le webhook** :
- Dans MeSomb Dashboard → **Webhooks**
- Ajouter URL : `https://ton-domaine.com/api/webhooks/mesomb`
- Méthode : `POST`
- Activer

**6. Tester en sandbox** :
```bash
# Créer un vote avec paiement
curl -X POST http://localhost:4000/api/votes \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "candidateId": "uuid-candidat",
    "amount": 100,
    "paymentMethod": "MTN_MOBILE_MONEY",
    "customerPhone": "237670000000"
  }'
```

---

### 💳 Stripe (Cartes Bancaires - Optionnel)

**1. Créer un compte Stripe** :
- Aller sur [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register)
- S'inscrire

**2. Activer mode Test** :
- Dans le Dashboard, basculer en **Test Mode** (toggle en haut)

**3. Récupérer les clés test** :
- **Developers** → **API Keys**
- Copier :
  - `Publishable key` (pk_test_...)
  - `Secret key` (sk_test_...)

**4. Créer un webhook** :
- **Developers** → **Webhooks** → **Add endpoint**
- URL : `https://ton-domaine.com/api/webhooks/stripe`
- Events : `checkout.session.completed`, `payment_intent.succeeded`
- Copier le **Signing secret** (whsec_...)

**5. Ajouter dans `.env`** :
```env
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_CURRENCY="XAF"
```

---

## 7. Déploiement Production

### 🚀 Plateformes Recommandées

#### Backend API : **Railway** (Recommandé)

**Pourquoi Railway ?**
- ✅ Déploiement Git automatique
- ✅ PostgreSQL inclus gratuitement
- ✅ Variables d'environnement faciles
- ✅ HTTPS automatique
- ✅ Logs en temps réel
- ✅ 5$ gratuit par mois

**Étapes** :

**1. Créer un compte Railway** :
- Aller sur [https://railway.app](https://railway.app)
- Sign Up with GitHub

**2. Créer un nouveau projet** :
- Cliquer **New Project**
- Choisir **Deploy from GitHub repo**
- Sélectionner ton repo `Spotlight-lover-project-back-end.`

**3. Ajouter PostgreSQL** :
- Dans le projet, cliquer **New**
- Choisir **Database** → **PostgreSQL**
- Railway crée automatiquement la database

**4. Configurer les variables d'environnement** :
- Cliquer sur le service Backend
- Aller dans **Variables**
- Ajouter toutes les variables du `.env` :

```
DATABASE_URL=${DATABASE_URL} (auto depuis PostgreSQL)
JWT_SECRET=prod-secret-super-secure-123
JWT_REFRESH_SECRET=prod-refresh-super-secure-456
CLOUDINARY_CLOUD_NAME=ton-cloud-name
CLOUDINARY_API_KEY=ton-api-key
CLOUDINARY_API_SECRET=ton-api-secret
MESOMB_APP_KEY=ton-app-key-prod
MESOMB_API_KEY=ton-access-key-prod
MESOMB_SECRET_KEY=ton-secret-key-prod
MESOMB_ENVIRONMENT=production
PORT=4000
NODE_ENV=production
```

**5. Déployer** :
- Railway détecte automatiquement NestJS
- Build et déploiement automatiques
- URL publique générée : `https://ton-app.up.railway.app`

**6. Appliquer les migrations** :
```bash
# Dans Railway, aller dans le service
# Ouvrir le terminal et exécuter :
npx prisma migrate deploy
```

**7. Tester** :
```bash
curl https://ton-app.up.railway.app/api/candidates
```

---

#### Alternatives Backend

**Render.com** (Gratuit) :
- [https://render.com](https://render.com)
- PostgreSQL gratuit
- Déploiement Git

**DigitalOcean App Platform** (5$/mois) :
- [https://www.digitalocean.com/products/app-platform](https://www.digitalocean.com/products/app-platform)
- Plus de contrôle
- Meilleure performance

---

### 🌐 Frontend : **Vercel** (Recommandé pour Next.js)

**1. Créer un compte Vercel** :
- Aller sur [https://vercel.com/signup](https://vercel.com/signup)
- Sign Up with GitHub

**2. Importer le projet Frontend** :
- Cliquer **Add New** → **Project**
- Choisir le repo frontend

**3. Configurer** :
- Framework Preset : **Next.js**
- Build Command : `npm run build`
- Output Directory : `.next`

**4. Variables d'environnement** :
```
NEXT_PUBLIC_API_URL=https://ton-app.up.railway.app/api
NEXT_PUBLIC_WS_URL=wss://ton-app.up.railway.app
```

**5. Déployer** :
- Vercel déploie automatiquement
- URL : `https://spotlight-lover.vercel.app`

---

### ✅ Checklist Finale Déploiement

- [ ] Backend déployé sur Railway
- [ ] PostgreSQL provisionné et migrations appliquées
- [ ] Variables d'environnement production configurées
- [ ] Cloudinary en mode production
- [ ] MeSomb en mode production avec vraies clés
- [ ] Webhooks MeSomb pointant vers l'URL production
- [ ] Frontend déployé sur Vercel
- [ ] CORS configuré pour autoriser le frontend
- [ ] SSL/HTTPS actif (automatique sur Railway/Vercel)
- [ ] Tests de paiement MTN et Orange en production
- [ ] Backup automatique database activé

---

## 📞 Support et Contact

**Email** : abdellahoumar.456@gmail.com  
**GitHub** : [https://github.com/MrANSEO/Spotlight-lover-project-back-end.](https://github.com/MrANSEO/Spotlight-lover-project-back-end.)

---

**Document créé le** : 19 Janvier 2025  
**Version** : 1.0.0-mesomb
