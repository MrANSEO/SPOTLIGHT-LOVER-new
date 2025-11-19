# Intégration MeSomb - Spotlight Lover

## 🎯 Objectif

Intégration de **MeSomb** comme plateforme de paiement unifiée pour **MTN Mobile Money** et **Orange Money** au Cameroun.

## 📦 SDK Utilisé

- **Package**: `@hachther/mesomb` (v2.0.1)
- **Documentation officielle**: https://mesomb.hachther.com/
- **GitHub**: https://github.com/hachther/mesomb-node

## 🏗️ Architecture

### Structure des fichiers

```
src/modules/payments/
├── providers/
│   ├── mesomb.provider.ts      ✨ NOUVEAU - Provider MeSomb unifié
│   ├── mtn.provider.ts         ⚠️ LEGACY - Non utilisé
│   ├── orange.provider.ts      ⚠️ LEGACY - Non utilisé
│   ├── stripe.provider.ts      ✅ Actif pour cartes bancaires
│   └── payment.interface.ts    ✅ Interface commune
├── payments.service.ts         ✅ Modifié pour utiliser MeSomb
├── payments.module.ts          ✅ MeSombProvider ajouté
└── MESOMB_INTEGRATION.md       📄 Cette documentation
```

### Webhooks

```
src/modules/votes/
├── webhooks.controller.ts      ✅ Handler /webhooks/mesomb ajouté
├── dto/
│   ├── webhook-mesomb.dto.ts   ✨ NOUVEAU
│   ├── webhook-mtn.dto.ts      ⚠️ LEGACY
│   └── webhook-orange.dto.ts   ⚠️ LEGACY
```

## ⚙️ Configuration

### Variables d'environnement (.env)

```env
# MeSomb Configuration
MESOMB_APP_KEY=your-mesomb-application-key
MESOMB_API_KEY=your-mesomb-access-key
MESOMB_SECRET_KEY=your-mesomb-secret-key
MESOMB_ENVIRONMENT=sandbox  # ou 'production'
```

### Obtenir les clés MeSomb

1. Créer un compte sur https://mesomb.hachther.com/
2. Accéder au Dashboard
3. Créer une application
4. Récupérer les 3 clés :
   - **Application Key** (applicationKey)
   - **Access Key** (accessKey)
   - **Secret Key** (secretKey)

## 🔄 Flow de paiement

### 1. Initialisation du paiement

**Endpoint**: `POST /api/votes`

```typescript
// Request
{
  "candidateId": "uuid-candidate",
  "amount": 500,
  "currency": "XAF",
  "paymentMethod": "MTN_MOBILE_MONEY", // ou "ORANGE_MONEY"
  "customerPhone": "237670000000",
  "customerName": "John Doe"
}

// Response
{
  "success": true,
  "vote": {
    "id": "uuid-vote",
    "status": "PENDING",
    "transaction": {
      "id": "uuid-transaction",
      "reference": "VOTE-1234567890",
      "providerReference": "mesomb-transaction-pk"
    }
  }
}
```

### 2. Processus MeSomb

Le `MeSombProvider` gère automatiquement :

- ✅ **Normalisation du téléphone** : `237670000000` format
- ✅ **Détection opérateur** : MTN ou ORANGE selon préfixe
- ✅ **Appel API MeSomb** : `PaymentOperation.makeCollect()`
- ✅ **Gestion erreurs** : Timeouts, insufficient funds, etc.

### 3. Webhook MeSomb

**Endpoint**: `POST /api/webhooks/mesomb`

MeSomb envoie automatiquement le webhook après le paiement :

```json
{
  "pk": "mesomb-transaction-id",
  "reference": "VOTE-1234567890",
  "status": "SUCCESS",
  "amount": 500,
  "service": "MTN",
  "payer": "237670000000",
  "currency": "XAF",
  "country": "CM"
}
```

## 🔐 Sécurité

### Vérification de signature

Le webhook MeSomb est sécurisé avec HMAC :

```typescript
// Headers reçus
{
  "x-mesomb-signature": "sha256=abcdef...",
  // ou
  "x-signature": "sha1=123456..."
}
```

Le `MeSombProvider.verifyWebhookSignature()` vérifie automatiquement :
- ✅ SHA1 et SHA256
- ✅ Hex et Base64 encoding
- ✅ Timing-safe comparison

## 📱 Détection opérateur

### Préfixes Orange Money (Cameroun)
- 655, 656, 657, 658, 659

### Préfixes MTN (Cameroun)
- Tous les autres (650, 651, 652, 653, 654, 680, 681, 682, 683, 684, ...)

```typescript
// Exemple
detectOperator('237655123456') → 'ORANGE'
detectOperator('237680123456') → 'MTN'
```

## 🧪 Tests

### Test en mode sandbox

```bash
# 1. Configurer l'environnement
MESOMB_ENVIRONMENT=sandbox

# 2. Utiliser les numéros de test MeSomb
# Téléphone test : 237XXXXXXXXX (fourni par MeSomb)

# 3. Lancer le serveur
npm run start:dev

# 4. Tester un paiement
curl -X POST http://localhost:4000/api/votes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "candidateId": "uuid",
    "amount": 500,
    "currency": "XAF",
    "paymentMethod": "MTN_MOBILE_MONEY",
    "customerPhone": "237670000000",
    "customerName": "Test User"
  }'
```

### Simuler un webhook (développement)

```bash
curl -X POST http://localhost:4000/api/webhooks/mesomb \
  -H "Content-Type: application/json" \
  -H "x-mesomb-signature: sha256=YOUR_SIGNATURE" \
  -d '{
    "pk": "test-transaction-id",
    "reference": "VOTE-1234567890",
    "status": "SUCCESS",
    "amount": 500,
    "service": "MTN",
    "payer": "237670000000",
    "currency": "XAF"
  }'
```

## 🚀 Déploiement en production

### 1. Configurer les variables d'environnement

```bash
# Production
MESOMB_ENVIRONMENT=production
MESOMB_APP_KEY=prod-application-key
MESOMB_API_KEY=prod-access-key
MESOMB_SECRET_KEY=prod-secret-key
```

### 2. Configurer l'URL de webhook

Dans le dashboard MeSomb :
- **URL**: `https://votre-domaine.com/api/webhooks/mesomb`
- **Méthode**: POST
- **Format**: JSON

### 3. Tester en production

- ✅ Utiliser de vrais numéros de téléphone
- ✅ Vérifier les logs dans le dashboard MeSomb
- ✅ Monitorer la table `WebhookLog` dans la DB

## 📊 Monitoring

### Logs de webhooks

Tous les webhooks MeSomb sont enregistrés dans la table `WebhookLog` :

```sql
SELECT * FROM "WebhookLog" 
WHERE provider = 'MESOMB' 
ORDER BY "createdAt" DESC 
LIMIT 10;
```

### Transactions

```sql
SELECT 
  t.reference,
  t.amount,
  t.status,
  t."paymentMethod",
  t."providerReference",
  v."candidateId"
FROM "Transaction" t
JOIN "Vote" v ON v."transactionId" = t.id
WHERE t."paymentMethod" IN ('MTN_MOBILE_MONEY', 'ORANGE_MONEY')
ORDER BY t."createdAt" DESC;
```

## 🐛 Débogage

### Problèmes courants

#### 1. Erreur : "Signature invalide"

```bash
# Vérifier les headers
x-mesomb-signature: sha256=...
# ou
x-signature: sha1=...

# Vérifier le MESOMB_SECRET_KEY dans .env
```

#### 2. Erreur : "Opérateur non détecté"

```typescript
// Vérifier le format du téléphone
Input: "670000000"   ❌
Input: "+237670000000" ✅
Input: "237670000000"  ✅
```

#### 3. Paiement PENDING bloqué

```bash
# Vérifier que le webhook est bien configuré dans MeSomb
# URL: https://votre-domaine.com/api/webhooks/mesomb
# Méthode: POST

# Vérifier les logs dans la table WebhookLog
```

## 📚 Ressources

- [Documentation MeSomb](https://mesomb.hachther.com/documentation/)
- [SDK Node.js](https://github.com/hachther/mesomb-node)
- [API Reference](https://mesomb.hachther.com/api/)
- [Dashboard MeSomb](https://mesomb.hachther.com/dashboard)

## 🔄 Migration depuis MTN/Orange séparés

Les anciens endpoints `/webhooks/mtn` et `/webhooks/orange` sont conservés en mode LEGACY pour compatibilité, mais **tous les nouveaux paiements utilisent MeSomb** via `/webhooks/mesomb`.

### Avantages de MeSomb

✅ **Une seule intégration** pour MTN et Orange  
✅ **API unifiée** - Moins de code à maintenir  
✅ **Détection automatique** de l'opérateur  
✅ **Webhook unifié** - Un seul endpoint  
✅ **Meilleure fiabilité** - Agrégateur spécialisé  
✅ **Support local** - Équipe au Cameroun

---

**Date de création** : Janvier 2025  
**Dernière mise à jour** : Janvier 2025  
**Version SDK** : @hachther/mesomb@2.0.1
