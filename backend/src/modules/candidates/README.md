# 🎭 Module Candidates - Spotlight Lover

## Vue d'ensemble

Module complet de gestion des candidats avec upload vidéo Cloudinary, validation admin, statistiques et classement.

## 🎯 Fonctionnalités

- ✅ **Inscription publique** des candidats
- ✅ **Upload vidéo** via Cloudinary (direct upload)
- ✅ **Validation admin** (APPROVE, REJECT, SUSPEND)
- ✅ **CRUD complet** avec filtres et pagination
- ✅ **Statistiques** détaillées par candidat
- ✅ **Classement** (top N candidats)
- ✅ **Anti-fraude** (IP blacklist)
- ✅ **Audit log** des actions admin

---

## 📡 Endpoints API

### **PUBLIC - Inscription & Consultation**

#### **POST /api/candidates**
Inscription d'un nouveau candidat (PUBLIC).

**Request:**
```json
{
  "name": "Alice Kouadio",
  "age": 24,
  "country": "Côte d'Ivoire",
  "city": "Abidjan",
  "bio": "Danseuse professionnelle passionnée de culture africaine...",
  "videoUrl": "https://res.cloudinary.com/.../video.mp4",
  "videoPublicId": "spotlight-lover/abc123",
  "thumbnailUrl": "https://res.cloudinary.com/.../thumb.jpg",
  "videoDuration": 45,
  "videoFormat": "mp4",
  "videoSize": 15000000,
  "instagramHandle": "@alice.danse",
  "tiktokHandle": "@alicekdanse"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Inscription réussie ! Votre candidature sera validée par un administrateur.",
  "data": {
    "id": "uuid",
    "name": "Alice Kouadio",
    "status": "PENDING",
    "createdAt": "2025-01-06T..."
  }
}
```

---

#### **GET /api/candidates**
Lister les candidats avec filtres et pagination (PUBLIC - seulement APPROVED).

**Query Parameters:**
- `status` : PENDING, APPROVED, REJECTED, SUSPENDED (admin only)
- `country` : Filtrer par pays
- `search` : Rechercher par nom
- `sortBy` : totalVotes, createdAt, name (défaut: totalVotes)
- `order` : asc, desc (défaut: desc)
- `page` : Numéro de page (défaut: 1)
- `limit` : Nombre par page (défaut: 20)

**Example:**
```
GET /api/candidates?page=1&limit=10&sortBy=totalVotes&order=desc
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Alice Kouadio",
      "age": 24,
      "country": "Côte d'Ivoire",
      "city": "Abidjan",
      "bio": "Danseuse professionnelle...",
      "videoUrl": "https://...",
      "thumbnailUrl": "https://...",
      "status": "APPROVED",
      "totalVotes": 150,
      "totalRevenue": 15000,
      "viewCount": 1200,
      "shareCount": 45,
      "rank": 3,
      "createdAt": "2025-01-01T..."
    }
  ],
  "meta": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

#### **GET /api/candidates/:id**
Obtenir un candidat par ID (PUBLIC).

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Alice Kouadio",
    "age": 24,
    "country": "Côte d'Ivoire",
    "city": "Abidjan",
    "bio": "Danseuse professionnelle...",
    "videoUrl": "https://...",
    "thumbnailUrl": "https://...",
    "videoDuration": 45,
    "status": "APPROVED",
    "totalVotes": 150,
    "totalRevenue": 15000,
    "viewCount": 1201,
    "shareCount": 45,
    "rank": 3,
    "createdAt": "2025-01-01T...",
    "updatedAt": "2025-01-06T..."
  }
}
```

**Note** : Le viewCount est automatiquement incrémenté à chaque appel.

---

#### **GET /api/candidates/:id/stats**
Obtenir les statistiques détaillées d'un candidat (PUBLIC).

**Response:**
```json
{
  "success": true,
  "data": {
    "candidate": {
      "id": "uuid",
      "name": "Alice Kouadio",
      "totalVotes": 150,
      "totalRevenue": 15000,
      "viewCount": 1200,
      "shareCount": 45,
      "rank": 3
    },
    "votesByMethod": [
      {
        "paymentMethod": "MTN_MOBILE_MONEY",
        "_count": { "id": 80 },
        "_sum": { "amount": 8000 }
      },
      {
        "paymentMethod": "ORANGE_MONEY",
        "_count": { "id": 50 },
        "_sum": { "amount": 5000 }
      },
      {
        "paymentMethod": "CARD",
        "_count": { "id": 20 },
        "_sum": { "amount": 2000 }
      }
    ],
    "votesHistory": [
      {
        "createdAt": "2025-01-05T",
        "_count": { "id": 15 }
      }
    ]
  }
}
```

---

#### **POST /api/candidates/:id/share**
Incrémenter le compteur de partages (PUBLIC).

**Response:**
```json
{
  "success": true,
  "message": "Partage enregistré"
}
```

---

#### **GET /api/candidates/leaderboard/top**
Obtenir le top N candidats (PUBLIC).

**Query Parameters:**
- `limit` : Nombre de candidats (défaut: 10, max: 100)

**Example:**
```
GET /api/candidates/leaderboard/top?limit=20
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Mamadou Diallo",
      "country": "Sénégal",
      "city": "Dakar",
      "thumbnailUrl": "https://...",
      "totalVotes": 230,
      "totalRevenue": 23000,
      "rank": 1
    },
    {
      "id": "uuid",
      "name": "Alice Kouadio",
      "country": "Côte d'Ivoire",
      "city": "Abidjan",
      "thumbnailUrl": "https://...",
      "totalVotes": 150,
      "totalRevenue": 15000,
      "rank": 2
    }
  ]
}
```

---

### **ADMIN - Gestion & Validation**

#### **PATCH /api/candidates/:id** 🔒
Mettre à jour un candidat (ADMIN : SUPER_ADMIN, MODERATOR).

**Request:**
```json
{
  "bio": "Nouvelle bio mise à jour",
  "instagramHandle": "@nouveau_handle"
}
```

**Note** : Après validation (APPROVED), seuls certains champs peuvent être modifiés (bio, réseaux sociaux).

---

#### **PATCH /api/candidates/:id/validate** 🔒
Valider/Rejeter/Suspendre un candidat (ADMIN : SUPER_ADMIN, MODERATOR).

**Request:**
```json
{
  "action": "APPROVE",
  "reason": "Vidéo conforme, candidat approuvé"
}
```

**Actions possibles** :
- `APPROVE` : Valider le candidat (status → APPROVED)
- `REJECT` : Rejeter le candidat (status → REJECTED)
- `SUSPEND` : Suspendre le candidat (status → SUSPENDED)

**Response:**
```json
{
  "success": true,
  "message": "Candidat approve avec succès",
  "data": {
    "id": "uuid",
    "status": "APPROVED",
    "validatedAt": "2025-01-06T...",
    "validatedBy": "admin-uuid"
  }
}
```

**Audit Log** : Chaque action de validation est enregistrée dans `audit_logs`.

---

#### **DELETE /api/candidates/:id** 🔒
Supprimer un candidat (ADMIN : SUPER_ADMIN uniquement).

**Response:**
```json
{
  "success": true,
  "message": "Candidat supprimé avec succès"
}
```

---

#### **POST /api/candidates/ranks/update** 🔒
Mettre à jour les rangs de tous les candidats (ADMIN : SUPER_ADMIN).

**Response:**
```json
{
  "success": true,
  "message": "Rangs mis à jour avec succès"
}
```

**Note** : Cette action peut aussi être automatisée via CRON.

---

## 📤 Upload Vidéo (Cloudinary)

### Workflow Upload

```
1. Frontend demande une signature
   ↓
   POST /api/upload/signature
   
2. Backend génère signature Cloudinary
   ↓
   Returns: { signature, timestamp, cloudName, apiKey, ... }
   
3. Frontend upload DIRECT vers Cloudinary
   ↓
   POST https://api.cloudinary.com/v1_1/{cloud_name}/video/upload
   
4. Cloudinary retourne URL vidéo + publicId
   ↓
   { secure_url, public_id, format, duration, ... }
   
5. Frontend soumet candidature avec videoUrl
   ↓
   POST /api/candidates
```

### Endpoints Upload

#### **POST /api/upload/signature** (PUBLIC)
Générer une signature pour upload direct vers Cloudinary.

**Response:**
```json
{
  "success": true,
  "message": "Signature générée. Utilisez-la pour uploader vers Cloudinary.",
  "data": {
    "signature": "abc123...",
    "timestamp": 1704556800,
    "folder": "spotlight-lover",
    "cloudName": "your-cloud-name",
    "apiKey": "your-api-key",
    "uploadPreset": {
      "resource_type": "video",
      "format": "mp4",
      "max_file_size": 52428800,
      "transformation": [...]
    }
  }
}
```

#### **GET /api/upload/verify/:publicId** (PUBLIC)
Vérifier qu'une vidéo existe sur Cloudinary.

**Example:**
```
GET /api/upload/verify/spotlight-lover_abc123
```

**Response:**
```json
{
  "success": true,
  "data": {
    "publicId": "spotlight-lover/abc123",
    "url": "https://res.cloudinary.com/.../video.mp4",
    "format": "mp4",
    "duration": 45.5,
    "width": 1280,
    "height": 720,
    "bytes": 15000000,
    "createdAt": "2025-01-06T..."
  }
}
```

#### **GET /api/upload/thumbnail/:publicId** (PUBLIC)
Générer une URL de miniature pour une vidéo.

**Response:**
```json
{
  "success": true,
  "data": {
    "thumbnailUrl": "https://res.cloudinary.com/.../thumb.jpg"
  }
}
```

#### **DELETE /api/upload/:publicId** 🔒
Supprimer une vidéo de Cloudinary (SUPER_ADMIN uniquement).

---

## 🔒 Sécurité

### Anti-Fraude

1. **IP Blacklist** :
   - Les IPs blacklistées ne peuvent pas s'inscrire
   - Vérification automatique à chaque inscription

2. **Validation Admin** :
   - Tous les candidats doivent être validés manuellement
   - Status par défaut : PENDING

3. **Audit Log** :
   - Toutes les actions admin sont enregistrées
   - Traçabilité complète

### Restrictions Modification

- **Avant validation** : Tous les champs modifiables
- **Après validation (APPROVED)** : Seulement bio, instagramHandle, tiktokHandle, youtubeHandle

---

## 🧪 Tests avec cURL

### 1. Obtenir signature upload

```bash
curl http://localhost:4000/api/upload/signature
```

### 2. Inscrire un candidat

```bash
curl -X POST http://localhost:4000/api/candidates \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Candidat",
    "age": 25,
    "country": "Côte d'\''Ivoire",
    "city": "Abidjan",
    "bio": "Bio de test pour candidat",
    "videoUrl": "https://res.cloudinary.com/demo/video/upload/sample.mp4",
    "videoPublicId": "demo/sample",
    "thumbnailUrl": "https://res.cloudinary.com/demo/image/upload/sample.jpg"
  }'
```

### 3. Lister les candidats

```bash
curl "http://localhost:4000/api/candidates?page=1&limit=5"
```

### 4. Valider un candidat (ADMIN)

```bash
curl -X PATCH http://localhost:4000/api/candidates/{id}/validate \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "APPROVE",
    "reason": "Vidéo conforme"
  }'
```

### 5. Obtenir le top 10

```bash
curl "http://localhost:4000/api/candidates/leaderboard/top?limit=10"
```

---

## 📊 Statistiques

### Métriques par candidat

- **totalVotes** : Nombre total de votes reçus
- **totalRevenue** : Revenus générés (FCFA)
- **viewCount** : Nombre de vues de la page
- **shareCount** : Nombre de partages
- **rank** : Position dans le classement

### Classement

Le classement est basé sur `totalVotes` (ordre décroissant).

Mise à jour :
- **Automatique** : À chaque vote comptabilisé
- **Manuelle** : Endpoint `/api/candidates/ranks/update`
- **CRON** : Planifié toutes les heures (recommandé)

---

## 🔄 Workflow Complet

```
1. CANDIDAT s'inscrit (PUBLIC)
   ↓ Status: PENDING
   
2. ADMIN valide (PATCH /validate)
   ↓ Status: APPROVED
   
3. CANDIDAT visible publiquement
   ↓ Apparaît dans GET /candidates
   
4. USERS votent
   ↓ totalVotes++, totalRevenue+=100
   
5. Classement mis à jour
   ↓ rank recalculé
   
6. CANDIDAT consulte ses stats
   ↓ GET /candidates/:id/stats
```

---

## 📝 DTOs & Validation

### CreateCandidateDto

- `name` : String (max 100 caractères)
- `age` : Number (18-99)
- `country` : String (max 100 caractères)
- `city` : String (max 100 caractères)
- `bio` : String (max 200 caractères)
- `videoUrl` : URL valide
- `instagramHandle` : String (optionnel, format: @username)
- `tiktokHandle` : String (optionnel, format: @username)

### ValidateCandidateDto

- `action` : Enum (APPROVE, REJECT, SUSPEND)
- `reason` : String (optionnel, max 500 caractères)

### QueryCandidatesDto

- `status` : Enum (PENDING, APPROVED, REJECTED, SUSPENDED)
- `country` : String
- `search` : String
- `sortBy` : Enum (totalVotes, createdAt, name)
- `order` : Enum (asc, desc)
- `page` : Number (min 1)
- `limit` : Number (min 1)

---

**Version** : 1.0.0  
**Dernière mise à jour** : 2025-01-06
