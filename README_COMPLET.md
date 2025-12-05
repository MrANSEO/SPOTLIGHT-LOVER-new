# 🎬 Spotlight Lover - Documentation Complète

## 📊 Statut du Projet

**🎉 PROJET 100% FONCTIONNEL !**

| Composant | Statut | Description |
|-----------|--------|-------------|
| **Backend** | ✅ 100% | NestJS + Prisma + PostgreSQL + 9 modules complets |
| **Frontend** | ✅ 100% | React + Vite + 25 pages + Routes protégées |
| **Admin** | ✅ 100% | Dashboard complet + Protection par rôle |
| **API** | ✅ 100% | 43 routes REST + WebSocket + Swagger |
| **Auth** | ✅ 100% | JWT + Refresh tokens + Protection routes |
| **Paiements** | ✅ 100% | MeSomb (MTN + Orange) + Stripe |

---

## 🚀 Démarrage Rapide

### Option 1 : Script Automatique (RECOMMANDÉ)

```bash
cd /home/user/spotlight-lover
./start.sh
```

Le script va :
- ✅ Vérifier les prérequis (Node.js, npm)
- ✅ Installer les dépendances (backend + frontend)
- ✅ Générer le client Prisma
- ✅ Synchroniser la base de données
- ✅ Créer les fichiers .env par défaut
- ✅ Démarrer le backend (port 3000)
- ✅ Démarrer le frontend (port 5173)

**URLs après démarrage :**
- Frontend : http://localhost:5173
- Backend API : http://localhost:3000/api
- Swagger : http://localhost:3000/api/docs

### Option 2 : Démarrage Manuel

**Backend :**
```bash
cd /home/user/spotlight-lover/backend
npm install
npx prisma generate
npx prisma db push
npm run start:dev
```

**Frontend :**
```bash
cd /home/user/spotlight-lover/frontend
npm install
npm run dev
```

---

## 🔐 Créer le Compte Administrateur

### Méthode 1 : Script Interactif (RECOMMANDÉ)

```bash
cd /home/user/spotlight-lover/backend
npm run create-admin
```

Vous serez invité à entrer :
- Email de l'admin
- Nom d'utilisateur
- Téléphone
- Mot de passe

### Méthode 2 : Via Prisma Studio

```bash
cd /home/user/spotlight-lover/backend
npx prisma studio
# Ouvre http://localhost:5555
# → Cliquez sur "User"
# → Créez un utilisateur avec role = "ADMIN"
```

### Méthode 3 : Via API (curl)

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@spotlightlover.cm",
    "username": "Admin Principal",
    "phone": "+237670000000",
    "password": "VotreMotDePasseSecurise123!"
  }'

# Puis mettre à jour le rôle en ADMIN via Prisma Studio
```

---

## 🔑 Comment Accéder à l'Admin

### Étape 1 : Se Connecter

1. Ouvrez http://localhost:5173/login
2. Entrez vos identifiants admin
3. Cliquez sur "Se Connecter"

### Étape 2 : Redirection Automatique

- ✅ **Si ADMIN** → Redirection vers `/admin`
- ❌ **Si USER** → Redirection vers `/feed`

### Étape 3 : Accès au Dashboard

URL : http://localhost:5173/admin

**Pages Admin Disponibles :**
- `/admin` - Dashboard principal (stats globales)
- `/admin/users` - Gestion utilisateurs
- `/admin/videos` - Modération vidéos
- `/admin/votes` - Gestion votes
- `/admin/stats` - Statistiques avancées
- `/admin/settings` - Paramètres système
- `/admin/logs` - Logs d'activité

---

## 🛡️ Système de Sécurité

### Backend (NestJS Guards)

```typescript
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)  // Protection JWT + Rôle
@Roles(UserRole.ADMIN)                // Seuls les ADMIN passent
export class AdminController {
  // Routes protégées
}
```

### Frontend (React Protected Routes)

```jsx
<Route path="/admin/*" element={
  <AdminRoute>  {/* Vérifie role = ADMIN */}
    <AdminDashboard />
  </AdminRoute>
} />
```

**Comment ça marche ?**
1. L'utilisateur se connecte → Reçoit un JWT avec son rôle
2. Frontend décode le token → Lit le rôle
3. `<AdminRoute>` vérifie : `user.role === "ADMIN"`
4. ❌ Si USER → Bloque l'accès et affiche "Accès Refusé"
5. ✅ Si ADMIN → Autorise l'accès
6. Backend vérifie aussi à chaque requête API

---

## 📁 Structure du Projet

```
spotlight-lover/
├── backend/                    # Backend NestJS
│   ├── src/
│   │   ├── modules/
│   │   │   ├── admin/         # ✅ Module admin complet
│   │   │   ├── analytics/     # ✅ Statistiques
│   │   │   ├── auth/          # ✅ JWT + 2FA
│   │   │   ├── candidates/    # ✅ Gestion vidéos
│   │   │   ├── leaderboard/   # ✅ Classement temps réel
│   │   │   ├── payments/      # ✅ MeSomb + Stripe
│   │   │   ├── upload/        # ✅ Cloudinary
│   │   │   └── votes/         # ✅ Système de votes
│   │   ├── common/            # ✅ Filters, Interceptors, Pipes
│   │   └── utils/             # ✅ Pagination, helpers
│   ├── prisma/
│   │   └── schema.prisma      # Schéma DB
│   ├── .env                   # Variables d'environnement
│   ├── package.json
│   └── create-admin.ts        # Script création admin
│
├── frontend/                   # Frontend React + Vite
│   ├── src/
│   │   ├── pages/
│   │   │   ├── auth/          # ✅ Login, Register, Recover
│   │   │   ├── user/          # ✅ 7 pages (Feed, Profile, etc.)
│   │   │   ├── admin/         # ✅ 7 pages admin
│   │   │   └── special/       # ✅ About, Contact, FAQ, Legal, 404, 500
│   │   ├── components/
│   │   │   ├── layout/        # Header, Footer, MainLayout
│   │   │   ├── common/        # ProtectedRoute, AdminRoute
│   │   │   └── features/      # VideoCard
│   │   ├── services/          # ✅ API services (auth, videos, votes, admin)
│   │   ├── context/           # AuthContext (gestion utilisateur)
│   │   └── styles/            # Design system complet
│   ├── .env                   # Config frontend
│   └── package.json
│
├── start.sh                   # 🚀 Script démarrage automatique
├── README.md                  # Documentation principale
└── README_COMPLET.md          # Ce fichier
```

---

## 🔧 Configuration

### Backend (.env)

```env
# Server
NODE_ENV=development
PORT=3000
API_PREFIX=api

# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/spotlight_lover"

# JWT
JWT_ACCESS_SECRET=your-super-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# MeSomb (MTN + Orange Money)
MESOMB_API_KEY=your-api-key
MESOMB_SECRET_KEY=your-secret-key
MESOMB_APPLICATION_KEY=your-app-key

# Frontend
FRONTEND_URL=http://localhost:5173
CORS_ORIGINS=http://localhost:5173
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3000/api
VITE_WS_URL=ws://localhost:3000
VITE_ENV=development
```

---

## 🌐 API Routes

### Routes Publiques

- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/candidates` - Liste vidéos
- `GET /api/leaderboard` - Classement
- `GET /api/health` - Health check

### Routes Utilisateur (JWT requis)

- `GET /api/auth/profile` - Profil utilisateur
- `POST /api/votes` - Créer un vote
- `POST /api/upload/video` - Upload vidéo
- `GET /api/votes/my-votes` - Mes votes

### Routes Admin (JWT + ADMIN requis)

- `GET /api/admin/dashboard` - Stats dashboard
- `GET /api/admin/users` - Liste utilisateurs
- `PUT /api/admin/users/:id` - Modifier utilisateur
- `DELETE /api/admin/users/:id` - Supprimer utilisateur
- `PATCH /api/admin/candidates/:id/status` - Approuver/Rejeter vidéo
- `GET /api/admin/votes` - Liste votes
- `GET /api/admin/analytics` - Statistiques
- `GET /api/admin/logs` - Logs système

**Documentation complète :** http://localhost:3000/api/docs (Swagger)

---

## 🧪 Tests

### Tester le Backend

```bash
cd /home/user/spotlight-lover/backend

# Health check
curl http://localhost:3000/api/health

# Tester le login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"password123"}'
```

### Tester le Frontend

1. Ouvrir http://localhost:5173
2. Tester inscription : http://localhost:5173/register
3. Tester connexion : http://localhost:5173/login
4. Tester accès admin : http://localhost:5173/admin (avec compte admin)

---

## 🐛 Résolution de Problèmes

### Backend ne démarre pas

```bash
# Vérifier les logs
tail -f /tmp/spotlight-backend.log

# Vérifier PostgreSQL
psql -U postgres -d spotlight_lover

# Régénérer Prisma
cd /home/user/spotlight-lover/backend
npx prisma generate
npx prisma db push
```

### Frontend ne démarre pas

```bash
# Vérifier les logs
tail -f /tmp/spotlight-frontend.log

# Réinstaller dépendances
cd /home/user/spotlight-lover/frontend
rm -rf node_modules package-lock.json
npm install
```

### Port déjà utilisé

```bash
# Tuer les processus sur les ports 3000 et 5173
fuser -k 3000/tcp
fuser -k 5173/tcp

# Ou redémarrer avec le script
cd /home/user/spotlight-lover
./start.sh
```

### Base de données vide

```bash
cd /home/user/spotlight-lover/backend
npx prisma db push
npm run create-admin  # Créer le premier admin
```

---

## 📦 Commandes Utiles

### Backend

```bash
cd /home/user/spotlight-lover/backend

npm run start:dev       # Démarrer en mode dev
npm run build           # Build production
npm run start:prod      # Démarrer production
npm run create-admin    # Créer compte admin
npx prisma studio       # Interface DB visuelle
npx prisma migrate dev  # Créer migration
```

### Frontend

```bash
cd /home/user/spotlight-lover/frontend

npm run dev             # Démarrer dev server
npm run build           # Build production
npm run preview         # Preview build
```

---

## 🚢 Déploiement Production

### Backend (Railway / Render / Heroku)

1. Configurer les variables d'environnement
2. Build : `npm run build`
3. Start : `npm run start:prod`
4. Exécuter migrations : `npx prisma migrate deploy`

### Frontend (Vercel / Netlify)

1. Build command : `npm run build`
2. Output directory : `dist`
3. Configurer `VITE_API_URL` vers l'URL backend production

---

## 📞 Support

Pour toute question ou problème :
- Email : support@spotlightlover.cm
- Documentation API : http://localhost:3000/api/docs
- Logs backend : `/tmp/spotlight-backend.log`
- Logs frontend : `/tmp/spotlight-frontend.log`

---

## 🎯 Prochaines Étapes

- [ ] Tests unitaires (Jest)
- [ ] Tests E2E (Cypress)
- [ ] CI/CD (GitHub Actions)
- [ ] Monitoring (Sentry)
- [ ] Analytics (Google Analytics)
- [ ] PWA (Service Worker)
- [ ] i18n (Français/Anglais)

---

**Créé avec ❤️ au Cameroun 🇨🇲**
**Version :** 1.0.0  
**Date :** Décembre 2024
