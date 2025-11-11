# 🔐 Module Authentification - Spotlight Lover

## Vue d'ensemble

Module complet d'authentification avec JWT, 2FA (TOTP), guards, et decorators personnalisés.

## 🎯 Fonctionnalités

- ✅ **Inscription** administrateurs
- ✅ **Connexion** avec JWT
- ✅ **Refresh tokens** (7 jours)
- ✅ **2FA optionnel** (Google Authenticator, Authy, etc.)
- ✅ **Guards** pour protéger les routes
- ✅ **Decorators** (@Public, @Roles, @CurrentUser)
- ✅ **Hashing bcrypt** des mots de passe

---

## 📡 Endpoints API

### **POST /api/auth/register**
Inscrire un nouvel administrateur.

**Request:**
```json
{
  "email": "admin@example.com",
  "password": "SecurePassword123!",
  "name": "John Doe",
  "role": "SUPER_ADMIN" // ou "MODERATOR"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Admin créé avec succès",
  "data": {
    "admin": {
      "id": "uuid",
      "email": "admin@example.com",
      "name": "John Doe",
      "role": "SUPER_ADMIN"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

---

### **POST /api/auth/login**
Connexion d'un administrateur.

**Request:**
```json
{
  "email": "admin@example.com",
  "password": "SecurePassword123!",
  "twoFactorCode": "123456" // Optionnel si 2FA activé
}
```

**Response (sans 2FA):**
```json
{
  "success": true,
  "message": "Connexion réussie",
  "data": {
    "admin": {
      "id": "uuid",
      "email": "admin@example.com",
      "name": "John Doe",
      "role": "SUPER_ADMIN"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

**Response (2FA requis):**
```json
{
  "success": true,
  "message": "Code 2FA requis",
  "requires2FA": true
}
```

---

### **POST /api/auth/refresh**
Renouveler les tokens avec le refresh token.

**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Tokens renouvelés",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### **GET /api/auth/me** 🔒
Obtenir le profil de l'admin connecté (route protégée).

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "admin@example.com",
    "name": "John Doe",
    "role": "SUPER_ADMIN",
    "twoFactorEnabled": false,
    "lastLoginAt": "2025-01-06T10:30:00Z",
    "createdAt": "2025-01-01T00:00:00Z"
  }
}
```

---

### **POST /api/auth/2fa/generate** 🔒
Générer un secret 2FA (route protégée).

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response:**
```json
{
  "success": true,
  "message": "Secret 2FA généré. Scannez le QR Code avec votre app d'authentification.",
  "data": {
    "secret": "JBSWY3DPEHPK3PXP",
    "qrCodeUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
  }
}
```

**Instructions:**
1. Scannez le `qrCodeUrl` avec Google Authenticator ou Authy
2. Récupérez le code à 6 chiffres
3. Appelez `/api/auth/2fa/enable` avec ce code

---

### **POST /api/auth/2fa/enable** 🔒
Activer le 2FA après vérification du code (route protégée).

**Request:**
```json
{
  "token": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "2FA activé avec succès",
  "data": {
    "success": true
  }
}
```

---

### **POST /api/auth/2fa/disable** 🔒
Désactiver le 2FA (route protégée).

**Response:**
```json
{
  "success": true,
  "message": "2FA désactivé avec succès",
  "data": {
    "success": true
  }
}
```

---

## 🛡️ Guards & Decorators

### JwtAuthGuard (Appliqué globalement)

Toutes les routes sont protégées par défaut. Pour créer une route publique :

```typescript
@Public()
@Get('public-route')
publicRoute() {
  return { message: 'Route publique accessible sans token' };
}
```

### RolesGuard

Restreindre l'accès selon le rôle :

```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN')
@Delete('admin/:id')
deleteAdmin(@Param('id') id: string) {
  // Seulement les SUPER_ADMIN peuvent accéder
}
```

### @CurrentUser

Récupérer l'admin connecté :

```typescript
@Get('profile')
getProfile(@CurrentUser() admin: any) {
  return { admin };
}

// Ou récupérer un champ spécifique
@Get('email')
getEmail(@CurrentUser('email') email: string) {
  return { email };
}
```

---

## 🧪 Tests avec cURL

### 1. Inscription

```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456!",
    "name": "Test User",
    "role": "MODERATOR"
  }'
```

### 2. Connexion

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456!"
  }'
```

**Copier l'accessToken de la réponse**

### 3. Profil (avec token)

```bash
curl -X GET http://localhost:4000/api/auth/me \
  -H "Authorization: Bearer <votre_accessToken>"
```

### 4. Générer 2FA

```bash
curl -X POST http://localhost:4000/api/auth/2fa/generate \
  -H "Authorization: Bearer <votre_accessToken>"
```

### 5. Activer 2FA

```bash
curl -X POST http://localhost:4000/api/auth/2fa/enable \
  -H "Authorization: Bearer <votre_accessToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "token": "123456"
  }'
```

---

## 🔐 Sécurité

### Hashing Passwords

Utilise **bcrypt** avec 10 rounds par défaut :

```typescript
// Configurable dans .env
BCRYPT_ROUNDS=10
```

### JWT Tokens

- **Access Token** : Valide 15 minutes
- **Refresh Token** : Valide 7 jours

Configurable dans `.env` :

```bash
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_SECRET="your-refresh-secret"
JWT_REFRESH_EXPIRES_IN="7d"
```

### 2FA (TOTP)

- Utilise **speakeasy** pour générer les secrets
- Compatible avec Google Authenticator, Authy, Microsoft Authenticator
- Code valide pendant 30 secondes
- Window de 2 (accepte codes +/- 60 secondes)

---

## 📊 Flux Authentification

### Connexion Standard

```
1. User → POST /api/auth/login { email, password }
2. Backend vérifie credentials
3. Backend génère JWT tokens
4. Backend ← Retourne { admin, tokens }
5. Frontend stocke tokens (localStorage ou httpOnly cookies)
6. Frontend → GET /api/auth/me (Header: Authorization: Bearer <token>)
7. Backend vérifie token via JwtStrategy
8. Backend ← Retourne profil admin
```

### Connexion avec 2FA

```
1. User → POST /api/auth/login { email, password }
2. Backend vérifie credentials
3. Backend détecte 2FA activé
4. Backend ← { requires2FA: true }
5. User ouvre app d'authentification
6. User lit code à 6 chiffres
7. User → POST /api/auth/login { email, password, twoFactorCode: "123456" }
8. Backend vérifie code 2FA
9. Backend génère tokens
10. Backend ← Retourne { admin, tokens }
```

---

## 🚨 Codes d'Erreur

| Code | Message | Cause |
|------|---------|-------|
| 401 | Identifiants invalides | Email/password incorrect |
| 401 | Compte désactivé | Admin.isActive = false |
| 401 | Code 2FA invalide | TOTP code incorrect |
| 401 | Accès non autorisé | Token invalide/expiré |
| 409 | Cet email est déjà utilisé | Email déjà enregistré |

---

## 📝 Notes Importantes

1. **Routes Publiques** : Toujours marquer avec `@Public()`
2. **SUPER_ADMIN** : Seul rôle pouvant créer d'autres admins (en production)
3. **2FA** : Optionnel mais recommandé pour les SUPER_ADMIN
4. **Tokens** : Stocker de manière sécurisée (httpOnly cookies recommandés)
5. **Refresh** : Implémenter auto-refresh côté frontend avant expiration

---

**Version** : 1.0.0  
**Dernière mise à jour** : 2025-01-06
