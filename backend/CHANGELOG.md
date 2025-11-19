# Changelog - Spotlight Lover Backend

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/lang/fr/).

---

## [1.0.0-mesomb] - 2025-01-19

### 🎉 Ajouté

#### Intégration MeSomb

- **Provider MeSomb unifié** pour MTN Mobile Money et Orange Money
- SDK officiel `@hachther/mesomb@2.0.1` intégré
- Normalisation automatique numéros de téléphone (format 237XXXXXXXXX)
- Détection automatique opérateur (MTN/Orange selon préfixe)
- Vérification signature webhook HMAC (SHA1/SHA256, hex/base64)
- Endpoint webhook `/api/webhooks/mesomb` pour notifications paiement
- DTO `MeSombWebhookDto` pour validation payload
- Logging complet des webhooks dans table `WebhookLog`

#### Documentation

- `MESOMB_INTEGRATION.md` - Guide complet intégration MeSomb
- `README.md` (module Payments) - Architecture générale paiements
- `PROJECT_STATUS.md` - État complet du projet
- `CHANGELOG.md` - Ce fichier

#### Configuration

- Variables d'environnement MeSomb dans `.env.example`
- Fichier `.gitignore` pour sécurité
- Fichier `.env` local pour développement

### 🔧 Modifié

- **PaymentsService** : MTN et Orange routés vers MeSombProvider
- **PaymentsModule** : Ajout MeSombProvider dans les providers
- **TransactionStatus interface** : Ajout champ `reference` optionnel
- Webhooks MTN et Orange marqués LEGACY (compatibilité maintenue)

### 🐛 Corrigé

- Erreur TypeScript : Propriété `reference` manquante dans TransactionStatus
- Erreur TypeScript : Propriétés requises manquantes dans getTransactionStatus
- Erreur TypeScript : Décorateurs invalides dans webhook DTO

### 📊 Commits

```
ce13ef7 - docs: Document récapitulatif complet PROJECT_STATUS
6ddf0de - docs: Documentation complète module Payments avec MeSomb
4391327 - fix: Correction erreurs TypeScript dans MeSomb integration
c2972e0 - feat: Intégration MeSomb pour paiements MTN et Orange Money unifiés
```

### ⚠️ Breaking Changes

**Aucun breaking change pour les utilisateurs**. Les enums `PaymentMethod.MTN_MOBILE_MONEY` et `PaymentMethod.ORANGE_MONEY` fonctionnent toujours mais utilisent maintenant MeSomb en interne.

**Pour les développeurs** :
- Les providers `MtnMomoProvider` et `OrangeMoneyProvider` ne sont plus utilisés
- Le nouveau webhook `/webhooks/mesomb` doit être configuré dans le dashboard MeSomb
- Les anciens webhooks `/webhooks/mtn` et `/webhooks/orange` restent actifs en LEGACY

### 📦 Dépendances

**Ajoutées** :
- `@hachther/mesomb@2.0.1` - SDK officiel MeSomb

**Build** :
- ✅ Compilation TypeScript réussie
- ✅ Webpack bundle successful
- ✅ Aucune erreur ni warning

---

## [0.5.0] - 2025-01-18

### 🎉 Ajouté

#### Module Analytics

- Dashboard métriques administrateur
- 7 endpoints analytics (revenus, votes, candidats, utilisateurs, paiements, export)
- Calcul automatique des KPIs (revenus, conversions, top candidats)
- Export CSV complet de toutes les données
- Filtres temporels (24h, 7j, 30j, all)

#### Module Leaderboard

- Classement temps réel des candidats
- WebSocket Gateway sur namespace `/leaderboard`
- Événements temps réel (vote:created, candidate:updated, leaderboard:update)
- 4 endpoints REST (classement global, top N, position candidat, recalcul)
- Calcul automatique scores (votes + montants)

### 📊 Commits

```
245183e - feat: implement Analytics module with comprehensive metrics
bcb58b3 - feat: implement Leaderboard module with real-time WebSocket
```

---

## [0.4.0] - 2025-01-17

### 🎉 Ajouté

#### Module Votes

- Création de votes avec paiement intégré
- Validation unicité vote (1 vote/user/candidate)
- Confirmation automatique via webhooks
- Historique votes par utilisateur
- Statistiques votes par candidat
- Remboursements (admin)

#### Webhooks

- Webhook MTN Mobile Money (`/webhooks/mtn`)
- Webhook Orange Money (`/webhooks/orange`)
- Webhook Stripe (`/webhooks/stripe`)
- Vérification signatures sécurisées
- Logging automatique dans `WebhookLog`

### 📊 Commits

```
3ae6088 - feat: implement Votes module with payment webhooks
```

---

## [0.3.0] - 2025-01-16

### 🎉 Ajouté

#### Module Candidates

- CRUD complet candidats
- Upload vidéos de présentation
- Validation stricte (titre, bio, liens sociaux)
- Soft delete (isActive)
- Filtres et pagination

#### Module Upload

- Upload vidéos vers Cloudinary
- Validation format (mp4, mov, avi)
- Validation taille (max 50MB)
- URLs sécurisées
- Gestion erreurs upload

### 📊 Commits

```
98c3b35 - feat: implement Candidates & Upload modules
867987c - docs: Document récapitulatif push GitHub
```

---

## [0.2.0] - 2025-01-15

### 🎉 Ajouté

#### Module Auth

- Inscription utilisateur (email + téléphone)
- Connexion JWT (access + refresh tokens)
- 2FA optionnel (TOTP avec Speakeasy)
- Guards : JWT, Roles, 2FA
- Decorators : @Public(), @Roles(), @CurrentUser()
- 8 endpoints auth complets

### 📊 Commits

```
2337fd1 - docs: README mis à jour - Phase 2 (Auth) complétée
e50829c - docs: Récapitulatif complet Module Auth
01afb51 - feat: Module Auth complet avec JWT, 2FA, Guards et Decorators
```

---

## [0.1.0] - 2025-01-14

### 🎉 Ajouté

#### Fondations du projet

- Setup NestJS avec TypeScript
- Configuration Prisma + PostgreSQL
- Schéma de base de données complet
- Structure modulaire
- Configuration environnement
- Providers paiements (MTN, Orange, Stripe) - Architecture initiale

### 📊 Commits

```
467024b - docs: Résumé complet Phase 1 - Fondations terminées
385a711 - docs: Guide de démarrage rapide + README mis à jour
f668721 - docs: Ajout documentation architecture complète
04da37f - feat: Backend NestJS - Structure complète avec providers de paiement
```

---

## Types de Changements

- **🎉 Ajouté** : Nouvelles fonctionnalités
- **🔧 Modifié** : Modifications de fonctionnalités existantes
- **🐛 Corrigé** : Corrections de bugs
- **⚠️ Déprécié** : Fonctionnalités bientôt supprimées
- **🗑️ Supprimé** : Fonctionnalités supprimées
- **🔒 Sécurité** : Corrections de vulnérabilités

---

## Prochaines Versions

### [1.1.0] - Prévu

- Module Notifications (emails, SMS, push)
- Tests unitaires et E2E
- Documentation Swagger/OpenAPI
- Rate limiting avancé
- Caching Redis

### [2.0.0] - Prévu

- Admin Dashboard Frontend (Next.js)
- Interface de modération
- Statistiques en temps réel
- Gestion avancée utilisateurs

---

**Légende des versions** :
- **MAJOR** (1.0.0) : Breaking changes
- **MINOR** (0.1.0) : Nouvelles fonctionnalités rétro-compatibles
- **PATCH** (0.0.1) : Corrections de bugs

**Version actuelle** : `1.0.0-mesomb`  
**Date de mise à jour** : 2025-01-19
