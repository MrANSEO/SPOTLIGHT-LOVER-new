# 🚀 Guide de Démarrage Rapide - Spotlight Lover

## 📋 Prérequis

- **Node.js** 18+ ([télécharger](https://nodejs.org/))
- **PostgreSQL** 14+ ([télécharger](https://www.postgresql.org/download/))
- **Git** ([télécharger](https://git-scm.com/))
- **npm** (inclus avec Node.js)

---

## ⚡ Installation Rapide (5 minutes)

### 1. Cloner le projet

```bash
git clone <repository-url> spotlight-lover
cd spotlight-lover
```

### 2. Configurer la base de données PostgreSQL

```bash
# Se connecter à PostgreSQL
psql -U postgres

# Créer la base de données
CREATE DATABASE spotlight_lover;

# Quitter PostgreSQL
\q
```

### 3. Configuration Backend

```bash
cd backend

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env

# Éditer .env et configurer au minimum :
# - DATABASE_URL (votre connexion PostgreSQL)
# - JWT_SECRET (générer une clé sécurisée)
nano .env

# Générer le client Prisma
npx prisma generate

# Lancer les migrations
npx prisma migrate dev

# Compiler le projet
npm run build
```

### 4. Démarrer le backend

```bash
# Mode développement (avec hot-reload)
npm run start:dev

# Le backend démarre sur http://localhost:4000
```

### 5. Tester l'API

```bash
# Health check
curl http://localhost:4000/api/health

# Résultat attendu :
{
  "status": "ok",
  "timestamp": "2025-01-06T...",
  "database": "connected",
  "uptime": 123.45,
  "environment": "development"
}

# Tester le module Auth
curl http://localhost:4000/api/auth/test

# Tester les providers de paiement
curl http://localhost:4000/api/payments/providers
```

---

## 🔑 Configuration des APIs de Paiement

### MTN Mobile Money

1. **Créer un compte développeur** :
   - Aller sur https://momodeveloper.mtn.com/
   - Créer un compte
   - Créer une souscription "Collection"

2. **Récupérer les clés** :
   - API Key
   - API Secret  
   - Subscription Key

3. **Configurer `.env`** :
   ```bash
   MTN_MOMO_API_KEY="votre-api-key"
   MTN_MOMO_API_SECRET="votre-api-secret"
   MTN_MOMO_SUBSCRIPTION_KEY="votre-subscription-key"
   MTN_MOMO_ENVIRONMENT="sandbox"
   ```

### Orange Money

1. **Créer un compte développeur** :
   - Aller sur https://developer.orange.com/
   - Créer un compte
   - Créer une application "Orange Money"

2. **Récupérer les clés** :
   - Client ID
   - Client Secret
   - Merchant Key

3. **Configurer `.env`** :
   ```bash
   ORANGE_MONEY_CLIENT_ID="votre-client-id"
   ORANGE_MONEY_CLIENT_SECRET="votre-client-secret"
   ORANGE_MONEY_MERCHANT_KEY="votre-merchant-key"
   ORANGE_MONEY_ENVIRONMENT="sandbox"
   ```

### Stripe (Cartes Bancaires)

1. **Créer un compte** :
   - Aller sur https://stripe.com/
   - Créer un compte
   - Activer le mode Test

2. **Récupérer les clés** :
   - Secret Key (sk_test_...)
   - Publishable Key (pk_test_...)
   - Webhook Secret (créer un endpoint webhook)

3. **Configurer `.env`** :
   ```bash
   STRIPE_SECRET_KEY="sk_test_votre_cle"
   STRIPE_PUBLISHABLE_KEY="pk_test_votre_cle"
   STRIPE_WEBHOOK_SECRET="whsec_votre_secret"
   STRIPE_CURRENCY="XOF"
   ```

### Cloudinary (Stockage Vidéos)

1. **Créer un compte** :
   - Aller sur https://cloudinary.com/
   - Créer un compte gratuit

2. **Récupérer les clés** (Dashboard) :
   - Cloud Name
   - API Key
   - API Secret

3. **Configurer `.env`** :
   ```bash
   CLOUDINARY_CLOUD_NAME="votre-cloud-name"
   CLOUDINARY_API_KEY="votre-api-key"
   CLOUDINARY_API_SECRET="votre-api-secret"
   ```

---

## 🧪 Tester les Paiements

### Test MTN Mobile Money

```bash
curl -X POST http://localhost:4000/api/payments/init \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "mtn",
    "amount": 100,
    "currency": "XOF",
    "reference": "TEST-MTN-001",
    "callbackUrl": "http://localhost:3000/vote/callback",
    "customerPhone": "+225XXXXXXXX"
  }'
```

### Test Orange Money

```bash
curl -X POST http://localhost:4000/api/payments/init \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "orange",
    "amount": 100,
    "currency": "XOF",
    "reference": "TEST-ORANGE-001",
    "callbackUrl": "http://localhost:3000/vote/callback",
    "customerPhone": "+225XXXXXXXX"
  }'
```

### Test Stripe

```bash
curl -X POST http://localhost:4000/api/payments/init \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "stripe",
    "amount": 100,
    "currency": "XOF",
    "reference": "TEST-STRIPE-001",
    "callbackUrl": "http://localhost:3000/vote/callback",
    "customerEmail": "test@example.com"
  }'
```

---

## 🗄️ Gérer la Base de Données

### Prisma Studio (Interface Graphique)

```bash
cd backend
npx prisma studio

# Ouvre une interface web sur http://localhost:5555
# Permet de visualiser et éditer les données
```

### Créer un Admin de Test

```bash
# Se connecter à PostgreSQL
psql -U postgres -d spotlight_lover

# Créer un admin (mot de passe sera hashé par l'app)
INSERT INTO admins (id, email, password, name, role, is_active) 
VALUES (
  gen_random_uuid(),
  'admin@spotlightlover.com',
  '$2b$10$example_hashed_password', -- À remplacer par hash bcrypt
  'Admin Principal',
  'SUPER_ADMIN',
  true
);
```

### Réinitialiser la Base (Dev Only)

```bash
cd backend

# Attention : Supprime toutes les données !
npm run prisma:reset

# Relance les migrations et le seed
```

---

## 📊 Monitorer l'Application

### Logs Backend

```bash
cd backend

# Suivre les logs en temps réel
npm run start:dev

# Les logs affichent :
# ✅ Connexions base de données
# 🔄 Requêtes API
# 🔐 Tentatives d'authentification
# 💳 Initialisations de paiements
# ❌ Erreurs
```

### Vérifier l'État de l'API

```bash
# Health check complet
curl http://localhost:4000/api/health | jq

# Vérifier connexion database
curl http://localhost:4000/api/health/ping
```

---

## 🐛 Résolution de Problèmes

### Erreur : "Cannot connect to database"

**Solution** :
1. Vérifier que PostgreSQL est démarré
2. Vérifier `DATABASE_URL` dans `.env`
3. Tester la connexion :
   ```bash
   psql "postgresql://user:password@localhost:5432/spotlight_lover"
   ```

### Erreur : "Port 4000 already in use"

**Solution** :
```bash
# Trouver le processus sur le port 4000
lsof -i :4000

# Tuer le processus
kill -9 <PID>

# Ou changer le port dans .env
PORT=4001
```

### Erreur : "Prisma Client not generated"

**Solution** :
```bash
cd backend
npx prisma generate
npm run build
```

### Erreur Paiements : "Invalid API Key"

**Solution** :
1. Vérifier les clés dans `.env`
2. Vérifier que vous êtes en mode `sandbox`
3. Consulter la documentation du provider :
   - MTN : https://momodeveloper.mtn.com/api-documentation
   - Orange : https://developer.orange.com/apis/
   - Stripe : https://stripe.com/docs

---

## 📚 Prochaines Étapes

Une fois le backend démarré et testé :

1. **Implémenter le Module Auth complet** :
   - Login admin avec JWT
   - Protection des routes
   - 2FA (optionnel)

2. **Créer le Module Candidates** :
   - Endpoints CRUD
   - Upload vidéo Cloudinary
   - Validation admin

3. **Développer le Module Votes** :
   - Logique de création de votes
   - Intégration webhooks paiements
   - Mise à jour classement

4. **Ajouter WebSocket** :
   - Classement temps réel
   - Notifications live

5. **Construire le Frontend Next.js** :
   - Pages publiques
   - Dashboard admin
   - Player vidéo

---

## 🆘 Besoin d'Aide ?

- **Documentation complète** : Voir `/docs/ARCHITECTURE.md`
- **README Backend** : Voir `/backend/README.md`
- **Issues GitHub** : Créer une issue sur le repo
- **Contact** : team@spotlightlover.com

---

**Bon développement ! 🚀**

*Équipe Spotlight Lover - Version 1.0.0*
