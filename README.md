# 🎬 Spotlight Lover - Plateforme de Concours Vidéo

## 📋 Vue d'ensemble

Spotlight Lover est une plateforme de concours en ligne pour valoriser les talents africains via des vidéos courtes (danse, chant, sketch, performances artistiques). Le public vote de manière illimitée à **100 FCFA par vote**.

## 🎯 Caractéristiques principales

- ✅ **Concours vidéo uniquement** (pas de photos)
- ✅ **Vote illimité** (pas de limite par utilisateur)
- ✅ **1 vote = 100 FCFA**
- ✅ **Classement temps réel** (mise à jour toutes les 10 secondes)
- ✅ **Validation manuelle** des candidatures par admin
- ✅ **Paiements multiples** : MTN Mobile Money, Orange Money, Stripe, Carte bancaire

## 🏗️ Architecture du projet

```
spotlight-lover/
├── backend/          # API NestJS + PostgreSQL + Prisma
├── frontend/         # Next.js 14 + TailwindCSS
└── docs/            # Documentation technique
```

## 🚀 Stack technologique

### Backend
- **Framework** : NestJS (TypeScript)
- **Base de données** : PostgreSQL
- **ORM** : Prisma
- **Authentification** : JWT + 2FA (optionnel)
- **WebSocket** : Socket.IO (classement temps réel)
- **Stockage vidéo** : Cloudinary
- **Paiements** : MeSomb SDK (MTN + Orange Money unified), Stripe

### Frontend
- **Framework** : React 18
- **Build Tool** : Vite 7.2.4
- **Routing** : React Router v6
- **HTTP Client** : Axios
- **WebSocket** : Socket.IO Client
- **Styling** : CSS3 Variables + Animations (Design System complet)

### Infrastructure
- **Hébergement** : Railway / Render
- **CDN** : Cloudinary
- **Monitoring** : Sentry (optionnel)

## 📊 Statut du projet

- **Statut** : 🚀 En développement actif
- **Version Backend** : v1.0.0-mesomb
- **Version Frontend** : v0.1.0
- **Dernière mise à jour** : 24 Novembre 2025

## 🎨 Charte graphique

**🆕 Design Final (Thème Violet):**
- **Gradient Violet** : `#1b0028 → #2b0057 → #43007a → #6d00b8`
- **Violet Light** : `#c77dff` (Accents, liens)
- **Violet Glow** : `#b300ff` (Effets lumineux)
- **Police** : Poppins (Google Fonts)
- **Animations** : Gradient animé (15s), Glow (2s), Twinkle (3s)

## 📈 Fonctionnalités implémentées

### ✅ Backend - Complété 100%
- [x] 8 modules NestJS complets (Auth, Videos, Votes, Payments, Leaderboard, etc.)
- [x] Prisma ORM + PostgreSQL (10 modèles)
- [x] **MeSomb Integration** (MTN + Orange Money unified)
- [x] Stripe (Cartes bancaires)
- [x] Cloudinary (Upload vidéos)
- [x] WebSocket (Socket.IO) pour leaderboard temps réel
- [x] JWT (Access + Refresh tokens)
- [x] Profile Management (update, change password, delete)
- [x] Webhooks MeSomb avec vérification signature HMAC
- [x] Documentation complète (37 KB: GUIDE_COMPLET, PROJECT_STATUS, CHANGELOG)

### ✅ Frontend Phase 1 - Complété 100%
- [x] **Design System complet** (variables, animations, global CSS)
- [x] Thème violet avec gradient animé et 15+ animations
- [x] Layout Components : Header, Footer, BottomNav, MainLayout
- [x] Page d'accueil (Home) complète avec hero, stats, features
- [x] React Router v6 configuré
- [x] Build réussi (29KB CSS + 237KB JS)
- [x] Dev server online : https://5173-iblrr3mjnd8wgh51337zo-0e616f0a.sandbox.novita.ai

### 🔄 Frontend Phase 2 - Authentification (À faire - 0%)
- [ ] AuthContext (gestion tokens + auto-refresh)
- [ ] Services API (5 services: auth, videos, votes, leaderboard, api config)
- [ ] Pages Auth (Login, Register, RecoverPassword)
- [ ] ProtectedRoute pour routes authentifiées
- [ ] Guide complet disponible dans `PROCHAINES_ETAPES.md`

### 🔄 Frontend Phase 3 - Features Principales (À faire - 0%)
- [ ] Page Feed (scroll TikTok-style avec auto-play)
- [ ] Page Leaderboard (WebSocket temps réel)
- [ ] Page Gallery avec filtres
- [ ] Page Upload vidéo
- [ ] Pages Profile + Settings + Notifications

### ⏳ Frontend Phase 4-6 - Finalisation
- [ ] Admin Dashboard (7 pages)
- [ ] Pages spéciales (About, Contact, FAQ, Legal, 404, 500)
- [ ] Tests E2E
- [ ] Déploiement Vercel
- [ ] SEO + Analytics

## 📦 Commits en Attente

**11 commits prêts à pusher sur GitHub:**
1. 🎉 Session Complète: Synthèse finale
2. 📚 Guide: Prochaines Étapes détaillées (Phase 2)
3. 📝 Documentation: Récapitulatif complet de la session
4. 🎨 Frontend Phase 1: Design System + Layout Components + Home Page
5. 📚 Documentation complète projet + Frontend React initialisé
6. ✨ Endpoints gestion profil utilisateur + Guide complet
7. 📝 CHANGELOG.md avec historique complet versions
8. 📊 Document récapitulatif complet PROJECT_STATUS
9. 📚 Documentation complète module Payments avec MeSomb
10. 🔧 Correction erreurs TypeScript dans MeSomb integration
11. 💳 Intégration MeSomb pour paiements MTN et Orange Money unifiés

**Pour pusher:**
```bash
cd /home/user/spotlight-lover
git push origin main
# Ou si historique divergent:
git push --force origin main
```

## 🛠️ Installation locale

### Prérequis
- Node.js 18+
- PostgreSQL 14+
- npm ou yarn

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Configurer .env avec vos clés API
npx prisma migrate dev
npm run start:dev
```

### Frontend
```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

## 🌍 URLs

### Développement
- **Backend API** : `http://localhost:3000/api`
- **Backend Swagger** : `http://localhost:3000/api/docs`
- **Frontend Dev** : `http://localhost:5173`
- **Frontend Public** : `https://5173-iblrr3mjnd8wgh51337zo-0e616f0a.sandbox.novita.ai`

### Production (à venir)
- **Frontend** : À déployer sur Vercel
- **Backend** : À déployer sur Railway/Render

## 👥 Public cible

- **Âge** : 18-35 ans
- **Localisation** : Afrique francophone (Côte d'Ivoire, Sénégal, Cameroun, RDC, etc.)
- **Profil** : Actifs sur TikTok, Instagram Reels, YouTube Shorts
- **Passions** : Création vidéo, performance, divertissement

## 💰 Modèle économique

- **Vote** : 100 FCFA/vote (illimité)
- **Frais plateforme** : 3-5% par transaction
- **Prix candidats** : À définir par concours

## 📚 Documentation Disponible

### Guides Principaux
- **LISEZ_MOI_DABORD.md** - Récapitulatif complet de la session (10KB)
- **PROCHAINES_ETAPES.md** - Guide détaillé Phase 2 (20KB)
- **SESSION_COMPLETE.md** - Synthèse finale avec statistiques (11KB)

### Backend
- **backend/GUIDE_COMPLET.md** - Installation + Configuration (18KB)
- **backend/PROJECT_STATUS.md** - Status des 8 modules (14KB)
- **backend/CHANGELOG.md** - Historique versions (6.7KB)

### Frontend
- **frontend/FRONTEND_STATUS.md** - Progression phases + roadmap (7.9KB)

### Total Documentation
- **65+ KB** de documentation complète
- **Architecture détaillée**
- **Exemples de code**
- **Commandes utiles**

## 📞 Support

Pour toute question, consultez la documentation ou contactez l'équipe Spotlight Lover.

---

**Produit par** : Équipe Spotlight Lover  
**Licence** : Propriétaire  
**Tous montants exprimés en FCFA (XOF)**
