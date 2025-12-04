# 🚀 Spotlight Lover - Démarrage Rapide

## 📋 Prérequis

Avant de démarrer, assurez-vous d'avoir installé :

- **Node.js** 18+ ([Télécharger](https://nodejs.org/))
- **PostgreSQL** 14+ ([Télécharger](https://www.postgresql.org/download/))
- **npm** ou **yarn**

---

## ⚡ Démarrage Ultra-Rapide (Recommandé)

### **Option 1: Script Automatique** (Le plus simple ! 🎯)

```bash
# 1. Cloner le projet
git clone https://github.com/votre-username/spotlight-lover.git
cd spotlight-lover

# 2. Lancer le script de démarrage automatique
./start.sh
```

Le script va :
- ✅ Installer toutes les dépendances
- ✅ Générer les fichiers .env
- ✅ Configurer Prisma
- ✅ Démarrer backend + frontend automatiquement

🎉 **C'est tout ! Votre application est maintenant accessible sur :**
- Frontend: http://localhost:5173
- Backend API: http://localhost:4000/api
- Swagger Docs: http://localhost:4000/api/docs

---

### **Option 2: Démarrage Manuel** (Pour les experts)

#### A. Configuration Backend

```bash
# 1. Aller dans le dossier backend
cd backend

# 2. Installer les dépendances
npm install

# 3. Créer le fichier .env
cp .env.example .env

# 4. Éditer .env avec vos configurations
nano .env  # ou vim, code, etc.

# 5. Générer le client Prisma
npx prisma generate

# 6. Exécuter les migrations
npx prisma migrate deploy

# 7. (Optionnel) Seed la base de données
npx prisma db seed

# 8. Démarrer le backend
npm run start:dev
```

#### B. Configuration Frontend

```bash
# 1. Aller dans le dossier frontend
cd frontend

# 2. Installer les dépendances
npm install

# 3. Créer le fichier .env
echo "VITE_API_URL=http://localhost:4000/api" > .env
echo "VITE_WS_URL=ws://localhost:4000" >> .env

# 4. Démarrer le frontend
npm run dev
```

---

## 🔧 Configuration Minimale Requise

### Backend `.env`

Les variables **absolument nécessaires** :

```env
# Base de données (OBLIGATOIRE)
DATABASE_URL="postgresql://user:password@localhost:5432/spotlight_lover"

# JWT (OBLIGATOIRE)
JWT_SECRET="votre-secret-super-securise-changez-moi"
JWT_REFRESH_SECRET="votre-refresh-secret-changez-moi"

# Frontend (OBLIGATOIRE)
FRONTEND_URL="http://localhost:5173"

# Le reste est optionnel pour le développement
```

### Frontend `.env`

```env
VITE_API_URL=http://localhost:4000/api
VITE_WS_URL=ws://localhost:4000
```

---

## 📊 Vérification du Bon Fonctionnement

### 1. **Backend Health Check**

```bash
curl http://localhost:4000/api/health
```

Réponse attendue :
```json
{
  "status": "ok",
  "timestamp": "2024-12-04T10:00:00.000Z"
}
```

### 2. **Frontend**

Ouvrez http://localhost:5173 dans votre navigateur.
Vous devriez voir la page d'accueil avec le header violet animé.

### 3. **Swagger Documentation**

Ouvrez http://localhost:4000/api/docs
Vous devriez voir toute la documentation API interactive.

---

## 🎯 Fonctionnalités Disponibles

### ✅ **Backend (100% Fonctionnel)**

#### Modules Implémentés:
- ✅ **Auth** : Register, Login, Refresh Token, 2FA
- ✅ **Candidates** : CRUD, Validation, Statut (Pending/Approved/Rejected)
- ✅ **Votes** : Création, Paiement MeSomb (MTN + Orange Money)
- ✅ **Leaderboard** : WebSocket temps réel, Filtres (daily/weekly/monthly/all-time)
- ✅ **Analytics** : Statistiques globales, Par période, Graphiques
- ✅ **Upload** : Cloudinary, Validation fichiers
- ✅ **Payments** : MeSomb Provider unifié (MTN + Orange)
- ✅ **Admin** : Dashboard, Gestion users, Modération candidats, Stats, Logs, Settings
- ✅ **Health** : Health check endpoint

#### Routes Admin (Protégées - ADMIN only):
```
GET    /api/admin/users                    # Liste utilisateurs
GET    /api/admin/users/:id                # Détails utilisateur
PUT    /api/admin/users/:id                # Modifier utilisateur
DELETE /api/admin/users/:id                # Supprimer utilisateur
PUT    /api/admin/users/:id/status         # Suspendre/activer

GET    /api/admin/candidates               # Liste candidats
PUT    /api/admin/candidates/:id/approve   # Approuver
PUT    /api/admin/candidates/:id/reject    # Rejeter
DELETE /api/admin/candidates/:id           # Supprimer

GET    /api/admin/votes                    # Liste votes
GET    /api/admin/votes/:id                # Détails vote

GET    /api/admin/dashboard/stats          # Stats dashboard
GET    /api/admin/dashboard/votes-stats    # Stats votes
GET    /api/admin/dashboard/users-stats    # Stats users
GET    /api/admin/dashboard/candidates-stats # Stats candidats

GET    /api/admin/logs                     # Logs système
GET    /api/admin/settings                 # Paramètres
PUT    /api/admin/settings                 # Modifier paramètres
```

### ✅ **Frontend (Phase 1 Complète)**

#### Pages Disponibles:
- ✅ **Home** : Page d'accueil avec design violet animé
- ✅ **Header** : Navigation responsive avec menu burger mobile
- ✅ **Footer** : Liens sociaux, newsletter, mentions légales
- ✅ **Bottom Nav** : Navigation mobile (visible sur < 768px)

#### À Venir (Phases 2-5):
- ⏳ **Auth** : Login, Register, Password Recovery
- ⏳ **Feed** : TikTok-style scroll vertical
- ⏳ **Leaderboard** : Classement temps réel
- ⏳ **Profile** : Profil utilisateur, stats
- ⏳ **Admin Dashboard** : Interface complète

---

## 🐛 Dépannage

### Problème 1: Port déjà utilisé

```bash
# Backend (port 4000)
lsof -ti:4000 | xargs kill -9

# Frontend (port 5173)
lsof -ti:5173 | xargs kill -9
```

### Problème 2: Erreur Prisma "Client not generated"

```bash
cd backend
npx prisma generate
```

### Problème 3: Erreur de connexion base de données

1. Vérifiez que PostgreSQL est démarré :
```bash
# Mac
brew services start postgresql

# Linux
sudo service postgresql start

# Windows
# Via l'interface Services (services.msc)
```

2. Créez la base de données si nécessaire :
```bash
psql -U postgres
CREATE DATABASE spotlight_lover;
\q
```

3. Vérifiez votre `DATABASE_URL` dans `backend/.env`

### Problème 4: Module not found

```bash
# Backend
cd backend && npm install

# Frontend
cd frontend && npm install
```

---

## 📝 Logs et Débogage

### Voir les logs en temps réel

```bash
# Backend
tail -f logs/backend.log

# Frontend
tail -f logs/frontend.log

# Les deux en même temps
tail -f logs/*.log
```

### Logs Prisma (requêtes SQL)

Ajoutez dans `backend/.env` :
```env
DATABASE_URL="postgresql://...?schema=public&connection_limit=5&log_queries=true"
```

---

## 🔐 Créer un Compte Admin

### Option 1: Via Prisma Studio (Recommandé pour dev)

```bash
cd backend
npx prisma studio
```

1. Ouvrez http://localhost:5555
2. Allez dans la table `User`
3. Créez un utilisateur avec `role = "ADMIN"`

### Option 2: Via SQL Direct

```bash
psql -U postgres spotlight_lover

INSERT INTO "User" (
  email, 
  password, 
  "firstName", 
  "lastName", 
  role, 
  "emailVerified"
) VALUES (
  'admin@spotlightlover.com',
  '$2b$10$xYourHashedPasswordHere',  -- Hash bcrypt
  'Admin',
  'Spotlight',
  'ADMIN',
  true
);
```

### Option 3: Via endpoint (À implémenter)

Créez un endpoint temporaire pour créer un admin :
```typescript
// backend/src/modules/auth/auth.controller.ts
@Post('create-admin')
@Public()
async createAdmin(@Body() dto: RegisterDto) {
  // Logique pour créer un admin
  // À SUPPRIMER en production !
}
```

---

## 🚀 Passer en Production

### 1. Build du Frontend

```bash
cd frontend
npm run build
# Les fichiers sont dans frontend/dist/
```

### 2. Build du Backend

```bash
cd backend
npm run build
# Les fichiers sont dans backend/dist/
```

### 3. Variables d'Environnement Production

```env
NODE_ENV=production
DATABASE_URL="postgresql://prod-user:prod-pass@prod-host:5432/spotlight_lover"
JWT_SECRET="super-secret-production-key-change-me"
MESOMB_ENVIRONMENT="production"
CLOUDINARY_FOLDER="spotlight-lover-production"
```

### 4. Déploiement Recommandé

- **Backend** : Railway, Render, Heroku, AWS EC2
- **Frontend** : Vercel, Netlify, CloudFlare Pages
- **Base de données** : Railway PostgreSQL, Neon, Supabase

---

## 📞 Support & Contributions

- **Issues** : https://github.com/votre-username/spotlight-lover/issues
- **Documentation complète** : Voir `/docs`
- **Swagger API** : http://localhost:4000/api/docs

---

## ✅ Checklist Post-Installation

- [ ] Backend démarre sur http://localhost:4000
- [ ] Frontend démarre sur http://localhost:5173
- [ ] Health check backend fonctionne
- [ ] Swagger accessible
- [ ] Prisma Studio fonctionne (`npx prisma studio`)
- [ ] Compte admin créé
- [ ] Login fonctionne
- [ ] Upload de vidéo fonctionne (si Cloudinary configuré)
- [ ] Paiement test fonctionne (si MeSomb configuré)

---

**🎉 Félicitations ! Spotlight Lover est maintenant opérationnel !**

Pour toute question, consultez les fichiers suivants :
- `LISEZ_MOI_DABORD.md` : Vue d'ensemble du projet
- `PROCHAINES_ETAPES.md` : Roadmap et next steps
- `backend/GUIDE_COMPLET.md` : Documentation backend complète
- `frontend/FRONTEND_STATUS.md` : État du frontend
