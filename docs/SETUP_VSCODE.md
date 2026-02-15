# SpotLightLover — Guide VS Code (pas à pas)

Ce guide te montre **exactement** comment lancer le projet en local avec VS Code (backend + frontend).

---

## 0) Important (stabilité dépendances backend)

Le backend utilise NestJS v10. Pour éviter les conflits de peer deps, le package `@nestjs/swagger` est aligné en v7 (compatible Nest 10).

---

## 1) Prérequis

Installe ces outils avant de commencer :

- **Node.js 20 LTS** (recommandé)
- **npm 10+**
- **Git**
- **VS Code**
- Extension VS Code recommandée :
  - Prisma
  - ESLint
  - Prettier

Vérifie les versions dans un terminal :

```bash
node -v
npm -v
git --version
```

---

## 2) Ouvrir le projet dans VS Code

```bash
git clone https://github.com/MrANSEO/SPOTLIGHT-LOVER-new
cd SPOTLIGHT-LOVER-new
code .
```

---

## 3) Configurer le backend

### 3.1 Installer les dépendances

```bash
cd backend
npm install
```

### 3.2 Variables d’environnement

Crée un fichier `.env` dans `backend/` (ou copie `.env.example` s’il existe) avec au minimum :

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="change-me"
JWT_EXPIRES_IN="7d"
FRONTEND_URL="http://localhost:5173"
API_URL="http://localhost:4000"
```

> Ajoute aussi tes variables MeSomb/Cloudinary réelles pour les paiements/upload en production.

### 3.3 Générer Prisma Client + appliquer migrations

```bash
npx prisma generate
npx prisma migrate dev
```

### 3.4 (Optionnel) Seed admin

```bash
npm run create-admin
```

### 3.5 Lancer le backend

```bash
npm run start:dev
```

Backend disponible sur : `http://localhost:4000`

---

## 4) Configurer le frontend

Ouvre un **2e terminal** dans VS Code :

```bash
cd frontend
npm install
```

Crée `frontend/.env` :

```env
VITE_API_URL="http://localhost:4000"
```

Lance le frontend :

```bash
npm run dev
```

Frontend disponible sur : `http://localhost:5173`

---

## 5) Vérifier que tout fonctionne

### Build frontend

```bash
cd frontend
npm run build
```

### Build backend

```bash
cd backend
npm run build
```

### Sanity check Prisma

```bash
cd backend
npx prisma validate
```

---

## 6) Flux test manuel conseillé (rapide)

1. Ouvre `/become-candidate`
2. Soumets un candidat valide
3. Vérifie la redirection paiement / callback
4. Vérifie en admin la confirmation et le statut candidat
5. Teste un vote sur une vidéo

---

## 7) Erreurs fréquentes et solutions

### `nest: not found`
Tu n’as pas installé les dépendances backend.

```bash
cd backend
npm install
npm run build
```

### `prisma: command not found`

```bash
cd backend
npm install
npx prisma generate
```

### Port déjà utilisé
- Frontend (5173) :
  ```bash
  npm run dev -- --port 5174
  ```
- Backend (4000) : ajuste le port dans `.env` et `main.ts` si nécessaire.

---


## 8) VS Code Tasks (optionnel mais pratique)

Le repo contient `.vscode/tasks.json`. Dans VS Code :

- `Ctrl+Shift+P` → **Tasks: Run Task**
- Lance `project: dev (backend + frontend)` pour démarrer les 2 apps
- Ou lance séparément `backend: dev` et `frontend: dev`

---

## 9) Commandes VS Code utiles

Dans VS Code (`Ctrl+Shift+P`) :
- **Tasks: Run Task** → lancer scripts npm
- **Terminal: Create New Terminal** → backend/frontend en parallèle
- **Format Document** + ESLint Fix pour garder le code propre

---

## 10) Déploiement (résumé)

- Frontend : Vercel/Netlify
- Backend : Render/Railway/Fly.io
- DB : PostgreSQL conseillé en prod (au lieu de SQLite)
- Paiements : MeSomb webhook en HTTPS + secret
