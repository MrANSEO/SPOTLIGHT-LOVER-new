# 🔄 Migration vers PostgreSQL - Spotlight Lover

## ✅ Changements Effectués

### 1. **Schéma Prisma**
- ✅ Modèle `Admin` → `User` avec `userType: UserType`
- ✅ Enum `AdminRole` → `UserType` (USER, CANDIDATE, ADMIN, MODERATOR)
- ✅ Relations mises à jour : `User ↔ Candidate`, `User → Vote (voterId)`
- ✅ Support complet PostgreSQL (enums, JSON, relations)

### 2. **Module Backend**
- ✅ `AdminModule` → `UsersModule`
- ✅ `admin.controller.ts` → `users.controller.ts`
- ✅ `admin.service.ts` → `users.service.ts`
- ✅ DTOs adaptés : `UpdateAdminDto` → `UpdateUserDto`

### 3. **Routes API**
```
AVANT : /api/admin/*
APRÈS : /api/admin/users/*
```

### 4. **Script de Seed**
- ✅ `seed-user.js` créé (remplace `seed-admin.js`)
- ✅ Crée un User avec `userType: ADMIN`

---

## 🚀 Installation PostgreSQL

### Option 1: Docker (RECOMMANDÉ)

```bash
# 1. Démarrer PostgreSQL avec Docker
docker run --name spotlight-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=spotlight123 \
  -e POSTGRES_DB=spotlight_lover \
  -p 5432:5432 \
  -d postgres:15-alpine

# 2. Vérifier que le conteneur tourne
docker ps | grep spotlight-postgres

# 3. Tester la connexion
docker exec -it spotlight-postgres psql -U postgres -d spotlight_lover -c "SELECT version();"
```

### Option 2: PostgreSQL Cloud (Supabase - GRATUIT)

1. **Créer un projet sur Supabase**
   - Aller sur https://supabase.com
   - Créer un projet "spotlight-lover"
   - Noter le `DATABASE_URL` dans Settings > Database

2. **Configurer DATABASE_URL**
   ```bash
   # Dans backend/.env
   DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"
   ```

### Option 3: Installation Locale

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo -u postgres psql -c "CREATE DATABASE spotlight_lover;"
sudo -u postgres psql -c "CREATE USER spotlight WITH PASSWORD 'spotlight123';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE spotlight_lover TO spotlight;"
```

**macOS:**
```bash
brew install postgresql@15
brew services start postgresql@15
createdb spotlight_lover
```

---

## 🔧 Configuration Backend

### 1. Mettre à jour `.env`

```bash
cd /home/user/spotlight-lover/backend

cat > .env << 'EOF'
# Database (PostgreSQL)
DATABASE_URL="postgresql://postgres:spotlight123@localhost:5432/spotlight_lover?schema=public"

# JWT
JWT_SECRET="dev-jwt-secret-key-change-in-production"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_SECRET="dev-jwt-refresh-secret-change-in-production"
JWT_REFRESH_EXPIRES_IN="7d"

# MeSomb Payment
MESOMB_API_KEY="your-mesomb-api-key"
MESOMB_APP_KEY="your-mesomb-app-key"
MESOMB_APPLICATION_KEY="your-mesomb-app-key"
MESOMB_ACCESS_KEY="your-mesomb-access-key"
MESOMB_SECRET_KEY="your-mesomb-secret-key"

# Stripe (optional)
STRIPE_SECRET_KEY="your-stripe-secret-key"
STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"

# Cloudinary (upload)
CLOUDINARY_CLOUD_NAME="your-cloudinary-cloud-name"
CLOUDINARY_API_KEY="your-cloudinary-api-key"
CLOUDINARY_API_SECRET="your-cloudinary-api-secret"

# Server
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
EOF
```

### 2. Générer Prisma Client & Migrer

```bash
cd /home/user/spotlight-lover/backend

# Générer le client Prisma
npx prisma generate

# Créer la base de données (push schéma)
npx prisma db push

# Alternative: Créer une migration
# npx prisma migrate dev --name init
```

### 3. Créer le User ADMIN

```bash
cd /home/user/spotlight-lover/backend

# Utiliser le nouveau script seed-user.js
npm run seed-user

# Output attendu:
# ✅ Admin créé avec succès !
#    ID       : [uuid]
#    Email    : admin@spotlightlover.cm
#    Name     : Admin Principal
#    Phone    : +237600000000
#    UserType : ADMIN
```

---

## 🎯 Démarrage du Projet

### 1. Backend

```bash
cd /home/user/spotlight-lover/backend

# Nettoyer le port
fuser -k 3000/tcp 2>/dev/null || true

# Démarrer en mode dev
npm run start:dev

# Vérifier le démarrage
curl http://localhost:3000/api/health
```

### 2. Frontend

```bash
cd /home/user/spotlight-lover/frontend

# Nettoyer le port
fuser -k 5173/tcp 2>/dev/null || true

# Démarrer
npm run dev
```

---

## 🔐 Connexion Admin

### Credentials
```
Email    : admin@spotlightlover.cm
Password : Admin123!
```

### URLs
- **Login**: http://localhost:5173/login
- **Dashboard Admin**: http://localhost:5173/admin
- **Backend API**: http://localhost:3000/api
- **Swagger**: http://localhost:3000/api/docs

---

## 📊 Vérifications

### Base de Données

```bash
# Vérifier les tables créées
npx prisma studio

# Vérifier le user admin via psql
docker exec -it spotlight-postgres psql -U postgres -d spotlight_lover

# Dans psql:
SELECT id, email, name, "userType" FROM users WHERE "userType" = 'ADMIN';
\q
```

### API Endpoints

```bash
# Health check
curl http://localhost:3000/api/health

# Users admin endpoint
curl http://localhost:3000/api/admin/users

# Dashboard stats (nécessite auth)
curl http://localhost:3000/api/admin/users/dashboard/stats
```

---

## 🔄 Différences Clés

| Aspect | AVANT (SQLite) | APRÈS (PostgreSQL) |
|--------|----------------|-------------------|
| **Modèle** | `Admin` | `User` |
| **Type** | `role: string` | `userType: UserType` |
| **Valeurs** | "SUPER_ADMIN", "MODERATOR" | USER, CANDIDATE, ADMIN, MODERATOR |
| **Relations** | `Admin → AuditLog` | `User → AuditLog, Vote, Candidate` |
| **Module** | `AdminModule` | `UsersModule` |
| **Routes** | `/api/admin/*` | `/api/admin/users/*` |
| **DTO** | `UpdateAdminDto` | `UpdateUserDto` |
| **Enums** | String literals | PostgreSQL enums natifs |
| **JSON** | String sérialisé | PostgreSQL JSON natif |

---

## 🐛 Résolution de Problèmes

### Erreur: "Can't reach database server"

```bash
# Vérifier PostgreSQL
docker ps | grep postgres
# ou
sudo systemctl status postgresql

# Tester connexion
psql "postgresql://postgres:spotlight123@localhost:5432/spotlight_lover" -c "SELECT 1;"
```

### Erreur: "Enum UserType does not exist"

```bash
# Régénérer client et push
npx prisma generate
npx prisma db push --accept-data-loss
```

### Erreur: "Port 5432 already in use"

```bash
# Arrêter PostgreSQL existant
sudo systemctl stop postgresql
# ou
docker stop spotlight-postgres
```

---

## ✅ Checklist Migration

- [ ] PostgreSQL installé et démarré
- [ ] `.env` configuré avec `DATABASE_URL`
- [ ] `npx prisma generate` exécuté
- [ ] `npx prisma db push` réussi
- [ ] `npm run seed-user` exécuté
- [ ] User ADMIN créé
- [ ] Backend démarre sans erreur
- [ ] Frontend démarre sans erreur
- [ ] Connexion admin fonctionnelle
- [ ] API endpoints testés

---

## 📚 Ressources

- **PostgreSQL Docker**: https://hub.docker.com/_/postgres
- **Supabase**: https://supabase.com (PostgreSQL gratuit)
- **Neon**: https://neon.tech (PostgreSQL serverless)
- **Prisma Docs**: https://www.prisma.io/docs
- **NestJS Docs**: https://docs.nestjs.com

---

**Migration réussie ! Le projet utilise maintenant PostgreSQL avec le modèle User unifié. 🎉**
