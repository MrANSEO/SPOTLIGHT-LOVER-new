# SpotLightLover — Cahier des charges ajusté (Web Mobile-First)

## 1) Positionnement produit
SpotLightLover est une **plateforme de concours vidéo monétisé**, pas un réseau social.

- Les **candidats** paient une inscription pour publier leur vidéo de concours.
- Les **utilisateurs** paient chaque vote.
- L’**admin** pilote le concours, la modération et la publication des résultats.

## 2) Règles métier officielles

### Candidat
- Inscription + paiement obligatoire : **500 FCFA**.
- Validation automatique du compte candidat **uniquement après confirmation du paiement** (webhook MeSomb validé côté backend).
- 1 seule vidéo active par candidat.
- Durée max vidéo : **90 secondes** (option recommandée, plus simple à modérer).
- Peut modifier son profil et demander suppression de compte.
- Peut consulter ses statistiques : total votes, revenus générés, classement.

### Utilisateur simple
- Inscription gratuite (nom, email, mot de passe).
- Peut voir les vidéos validées.
- Peut voter de manière illimitée.
- Prix : **1 vote = 100 FCFA**.
- Un vote n’est comptabilisé qu’après paiement confirmé.
- Peut modifier son profil et supprimer son compte.

### Admin
- Gère users/candidats/vidéos.
- Peut suspendre un candidat (fraude, contenu inapproprié).
- Peut invalider/supprimer des votes frauduleux.
- Peut publier le classement officiel et clôturer le concours.
- A accès aux statistiques (inscriptions, votes, CA total).
- Les votes admin sont gratuits (usage contrôle/QA, journalisé en audit log).

## 3) Stack technique recommandée (adaptée mobile web)

### Frontend (Web mobile-first)
- **React + Vite** (déjà en place)
- **React Router**
- **Axios** pour API
- **UI responsive mobile-first** (Bottom nav, cartes vidéos, pages légères)
- **PWA** (recommandé phase 2) pour une expérience quasi-app sans coût natif

### Backend
- **NestJS** (déjà en place)
- **Prisma ORM**
- **PostgreSQL** en production (SQLite seulement dev local)
- **JWT + Refresh Token**
- **Validation DTO class-validator**
- **Swagger/OpenAPI** pour documentation API

### Paiement
- **MeSomb** comme agrégateur (Orange + MTN), avec:
  - endpoint d’initialisation paiement
  - webhook de confirmation
  - vérification de signature
  - idempotence anti double-traitement

### Vidéo & média
- **Cloudinary** pour stockage vidéo/thumbnail
- Contrôle format et taille en backend
- CDN Cloudinary pour diffusion rapide mobile

### Infra / Ops
- Docker + docker-compose
- Nginx reverse proxy
- CI/CD (GitHub Actions) recommandé
- Monitoring (logs backend, erreurs paiement, alertes webhook)

## 4) Modules backend à finaliser/maintenir
- Auth Module
- Users Module
- Candidates Module
- Upload/Video Module
- Votes Module
- Payments Module (MeSomb prioritaire)
- Leaderboard Module
- Admin Module
- Fraud Detection (rate limiting + blacklist IP + heuristiques)
- Analytics/Reporting Module

## 5) Sécurité indispensable
- Hash des mots de passe : bcrypt
- JWT court + refresh token
- Rate limiting API
- Captcha sur flux sensibles (inscription/vote)
- Journaux d’audit admin
- Vérification stricte des webhooks
- Protection anti double vote transactionnel (idempotency key)

## 6) KPI / tableaux de bord
- Nombre total de candidats validés
- Nombre total de votes payés
- Chiffre d’affaires votes + inscriptions
- Top candidats en temps réel
- Répartition par moyen de paiement

## 7) Plan de livraison réaliste
1. Stabilisation backend paiement + webhooks + idempotence
2. Validation workflow candidat payant (inscription -> paiement -> activation)
3. Finalisation UX mobile (vote en 2-3 taps)
4. QA complète (tests API + tests parcours)
5. Préprod puis prod

## 8) Définition de “100% fonctionnel”
Le projet est considéré prêt lorsque:
- Paiement inscription candidat fonctionne bout-en-bout
- Paiement vote fonctionne bout-en-bout
- Classement temps réel fiable
- Admin peut modérer et publier résultats
- Logs/audits disponibles
- Sauvegarde/restauration BDD documentée

