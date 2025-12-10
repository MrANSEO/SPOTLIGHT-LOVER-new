# ⚡ Démarrage Rapide - PostgreSQL avec Docker

## 🎯 En 5 Minutes

### 1. Démarrer PostgreSQL (Docker)

```bash
# Lancer PostgreSQL
docker run --name spotlight-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=spotlight123 \
  -e POSTGRES_DB=spotlight_lover \
  -p 5432:5432 \
  -d postgres:15-alpine

# Vérifier
docker ps | grep spotlight-postgres
```

### 2. Configurer Backend

```bash
cd /home/user/spotlight-lover/backend

# Le .env est déjà configuré avec:
# DATABASE_URL="postgresql://postgres:spotlight123@localhost:5432/spotlight_lover?schema=public"

# Générer Prisma Client
npx prisma generate

# Créer les tables
npx prisma db push

# Créer le User ADMIN
npm run seed-user
```

**Output attendu:**
```
✅ Admin créé avec succès !
   ID       : [uuid]
   Email    : admin@spotlightlover.cm
   UserType : ADMIN
```

### 3. Démarrer le Projet

```bash
# Terminal 1 - Backend
cd /home/user/spotlight-lover/backend
npm run start:dev

# Terminal 2 - Frontend
cd /home/user/spotlight-lover/frontend
npm run dev
```

### 4. Se Connecter

- **URL**: http://localhost:5173/login
- **Email**: `admin@spotlightlover.cm`
- **Password**: `Admin123!`

---

## 🔧 Commandes Utiles

### PostgreSQL

```bash
# Arrêter
docker stop spotlight-postgres

# Redémarrer
docker start spotlight-postgres

# Supprimer (et données)
docker rm -f spotlight-postgres

# Logs
docker logs spotlight-postgres

# Console SQL
docker exec -it spotlight-postgres psql -U postgres -d spotlight_lover
```

### Prisma

```bash
# Régénérer client
npx prisma generate

# Recréer DB
npx prisma db push --force-reset

# Interface visuelle
npx prisma studio
```

### Backend

```bash
# Dev
npm run start:dev

# Build
npm run build

# Production
npm run start:prod

# Logs
tail -f /tmp/spotlight-backend.log
```

---

## 🎯 Résultat

✅ PostgreSQL running  
✅ Base `spotlight_lover` créée  
✅ Tables créées (users, candidates, votes, transactions, etc.)  
✅ User ADMIN créé  
✅ Backend démarré  
✅ Frontend démarré  
✅ Login admin fonctionnel  

**C'est tout ! 🚀**
