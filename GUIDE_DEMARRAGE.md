# 🚀 GUIDE DE DÉMARRAGE - Spotlight Lover

## ⚠️ PROBLÈME ACTUEL

**PostgreSQL n'est pas démarré/installé sur votre machine.**

Le backend NestJS nécessite PostgreSQL pour fonctionner. Voici vos options :

---

## 📦 OPTION 1 : Installer et Démarrer PostgreSQL (RECOMMANDÉ)

### Sur Ubuntu/Debian :
```bash
# Installer PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Démarrer le service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Créer la base de données
sudo -u postgres psql -c "CREATE DATABASE spotlight_lover;"
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'postgres';"
```

### Sur macOS :
```bash
# Avec Homebrew
brew install postgresql@15
brew services start postgresql@15

# Créer la DB
createdb spotlight_lover
```

### Puis synchroniser le schéma :
```bash
cd /home/user/spotlight-lover/backend
npx prisma db push
```

---

## 🐳 OPTION 2 : Utiliser Docker (Plus Simple)

### 1. Installer Docker :
```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
newgrp docker

# macOS
# Télécharger Docker Desktop : https://www.docker.com/products/docker-desktop
```

### 2. Démarrer PostgreSQL :
```bash
cd /home/user/spotlight-lover
docker compose up -d

# Attendre 10 secondes que PostgreSQL démarre
sleep 10

# Créer les tables
cd backend
npx prisma db push
```

---

## 💻 OPTION 3 : Base de Données Distante (Supabase/Neon/Railway)

### Supabase (GRATUIT) :
1. Allez sur https://supabase.com
2. Créez un projet gratuit
3. Copiez la "Connection String" (URI PostgreSQL)
4. Modifiez `/home/user/spotlight-lover/backend/.env` :
   ```env
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@[HOST]:[PORT]/postgres"
   ```
5. Synchronisez :
   ```bash
   cd /home/user/spotlight-lover/backend
   npx prisma db push
   ```

### Neon (GRATUIT) :
1. Allez sur https://neon.tech
2. Créez un projet gratuit
3. Copiez la connection string
4. Même procédure que Supabase ci-dessus

---

## ✅ APRÈS AVOIR CONFIGURÉ LA BASE DE DONNÉES

### 1. Créer le premier admin :
```bash
cd /home/user/spotlight-lover/backend
npm run create-admin

# Saisissez :
# Email : admin@spotlightlover.cm
# Nom : Admin Principal
# Mot de passe : Admin123!
# Role : 1 (SUPER_ADMIN)
```

### 2. Démarrer le backend :
```bash
cd /home/user/spotlight-lover/backend
npm run start:dev

# Le backend démarre sur http://localhost:3000
# API : http://localhost:3000/api
# Swagger : http://localhost:3000/api/docs
```

### 3. Démarrer le frontend :
```bash
cd /home/user/spotlight-lover/frontend
npm run dev

# Le frontend démarre sur http://localhost:5173
```

### 4. Tester l'application :
1. Ouvrez http://localhost:5173
2. Connectez-vous avec le compte admin
3. Vous serez redirigé vers http://localhost:5173/admin

---

## 🔧 VÉRIFIER QUE PostgreSQL FONCTIONNE

```bash
# Test de connexion
psql -h localhost -U postgres -d spotlight_lover -c "SELECT version();"

# Ou avec Docker
docker exec spotlight-postgres psql -U postgres -d spotlight_lover -c "SELECT version();"
```

---

## 📞 BESOIN D'AIDE ?

Si vous choisissez **Supabase/Neon** (bases distantes gratuites), c'est la solution la plus simple et rapide. Pas besoin d'installer PostgreSQL localement !

1. Créez un compte gratuit
2. Copiez la connection string
3. Mettez-la dans `.env`
4. Lancez `npx prisma db push`
5. C'est tout ! ✅
