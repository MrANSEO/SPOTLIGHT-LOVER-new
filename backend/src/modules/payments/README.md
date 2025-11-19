# Module Payments - Spotlight Lover

## 🎯 Vue d'ensemble

Le module Payments gère tous les paiements du concours Spotlight Lover via différents providers (MeSomb, Stripe).

## 🏗️ Architecture

### Structure des fichiers

```
src/modules/payments/
├── providers/
│   ├── payment.interface.ts    ✅ Interface commune IPaymentProvider
│   ├── mesomb.provider.ts      ✅ MeSomb (MTN + Orange)
│   ├── stripe.provider.ts      ✅ Stripe (Cartes bancaires)
│   ├── mtn.provider.ts         ⚠️ LEGACY (non utilisé)
│   └── orange.provider.ts      ⚠️ LEGACY (non utilisé)
├── payments.service.ts         ✅ Service orchestrateur
├── payments.module.ts          ✅ Module NestJS
├── payments.controller.ts      ✅ API endpoints
├── MESOMB_INTEGRATION.md       📄 Doc détaillée MeSomb
└── README.md                   📄 Cette documentation
```

## 🔌 Providers Disponibles

### 1. MeSomb (Actif) ✅

**Plateforme** : MeSomb (Agrégateur Cameroun)  
**Méthodes** : MTN Mobile Money, Orange Money  
**Provider** : `MeSombProvider`  
**SDK** : `@hachther/mesomb@2.0.1`

#### Configuration

```env
MESOMB_APP_KEY=your-mesomb-application-key
MESOMB_API_KEY=your-mesomb-access-key
MESOMB_SECRET_KEY=your-mesomb-secret-key
MESOMB_ENVIRONMENT=sandbox
```

#### Caractéristiques

- ✅ Détection automatique opérateur (MTN/Orange)
- ✅ Normalisation téléphone (237XXXXXXXXX)
- ✅ Webhook unifié `/api/webhooks/mesomb`
- ✅ Vérification signature HMAC (SHA1/SHA256)
- ✅ Support paiements collecte (collect)
- ✅ Statut temps réel
- ✅ Montant minimum : 100 XAF

#### Documentation détaillée

Voir [MESOMB_INTEGRATION.md](./MESOMB_INTEGRATION.md)

### 2. Stripe (Actif) ✅

**Plateforme** : Stripe  
**Méthodes** : Cartes bancaires (Visa, Mastercard, etc.)  
**Provider** : `StripeProvider`  
**SDK** : `stripe`

#### Configuration

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_CURRENCY=XAF
```

#### Caractéristiques

- ✅ Paiements par carte internationaux
- ✅ Checkout Session avec redirection
- ✅ Webhooks sécurisés
- ✅ Remboursements supportés
- ✅ Support 3D Secure

### 3. MTN & Orange (Legacy) ⚠️

Les providers directs MTN et Orange sont **OBSOLÈTES** et remplacés par MeSomb.

**Pourquoi ?**
- ✅ Un seul provider au lieu de deux
- ✅ API unifiée plus simple
- ✅ Meilleure fiabilité
- ✅ Support local Cameroun

Les endpoints `/webhooks/mtn` et `/webhooks/orange` sont conservés pour compatibilité mais ne sont plus utilisés pour les nouveaux paiements.

## 🔄 Flow de paiement

### 1. Initialisation (Frontend → Backend)

```http
POST /api/votes
Content-Type: application/json
Authorization: Bearer {token}

{
  "candidateId": "uuid-candidate",
  "amount": 500,
  "currency": "XAF",
  "paymentMethod": "MTN_MOBILE_MONEY", // ou ORANGE_MONEY, CARD
  "customerPhone": "237670000000",
  "customerName": "John Doe"
}
```

### 2. Traitement Backend

```typescript
// 1. VotesService créé un Vote + Transaction PENDING
const vote = await votesService.create(dto, user);

// 2. PaymentsService route vers le bon provider
const provider = paymentsService.getProvider('mesomb'); // MTN/Orange → MeSomb

// 3. Provider initialise le paiement
const response = await provider.initializePayment({
  amount: 500,
  currency: 'XAF',
  reference: 'VOTE-1234567890',
  customerPhone: '237670000000',
  // ...
});

// 4. Transaction mise à jour avec providerReference
transaction.providerReference = response.providerReference;
```

### 3. Webhook (Provider → Backend)

```http
POST /api/webhooks/mesomb
Content-Type: application/json
x-mesomb-signature: sha256=abc123...

{
  "pk": "mesomb-transaction-id",
  "reference": "VOTE-1234567890",
  "status": "SUCCESS",
  "amount": 500,
  "service": "MTN",
  "payer": "237670000000"
}
```

### 4. Confirmation

```typescript
// 1. WebhooksController vérifie la signature
const verification = paymentsService.verifyWebhookSignature(
  'mesomb',
  payload,
  signature,
  headers
);

// 2. Si valide, confirme le paiement
await votesService.confirmPayment(
  reference,
  PaymentStatus.COMPLETED,
  webhookData
);

// 3. Vote validé, Candidate scores mis à jour
// 4. Leaderboard mis à jour en temps réel (WebSocket)
```

## 🛡️ Sécurité

### 1. Vérification Webhook

Tous les webhooks DOIVENT être vérifiés avec signature HMAC :

```typescript
interface WebhookVerification {
  isValid: boolean;
  data?: any;
  error?: string;
}

const verification = provider.verifyWebhookSignature(payload, signature, headers);

if (!verification.isValid) {
  throw new BadRequestException('Signature invalide');
}
```

### 2. Validation montants

```typescript
// Montant minimum : 100 XAF
if (amount < 100) {
  throw new BadRequestException('Montant minimum : 100 XAF');
}

// Vérification double : Request vs Webhook
if (webhook.amount !== transaction.amount) {
  throw new BadRequestException('Montant incohérent');
}
```

### 3. Prévention replay attacks

```typescript
// Vérifier que la transaction n'est pas déjà traitée
if (transaction.status !== PaymentStatus.PENDING) {
  this.logger.warn('Transaction déjà traitée');
  return; // Ignorer silencieusement
}
```

## 📊 Statuts de paiement

```typescript
enum PaymentStatus {
  PENDING = 'PENDING',       // En attente du paiement
  PROCESSING = 'PROCESSING', // En cours de traitement
  COMPLETED = 'COMPLETED',   // Paiement réussi
  FAILED = 'FAILED',         // Paiement échoué
  CANCELLED = 'CANCELLED',   // Paiement annulé
  REFUNDED = 'REFUNDED',     // Remboursé
}
```

## 🔍 Monitoring

### Logs de webhooks

```sql
SELECT 
  provider,
  event,
  payload,
  "ipAddress",
  "createdAt"
FROM "WebhookLog"
WHERE provider = 'MESOMB'
ORDER BY "createdAt" DESC
LIMIT 20;
```

### Statistiques paiements

```sql
SELECT 
  "paymentMethod",
  status,
  COUNT(*) as count,
  SUM(amount) as total,
  AVG(amount) as average
FROM "Transaction"
GROUP BY "paymentMethod", status
ORDER BY count DESC;
```

### Taux de succès

```sql
SELECT 
  "paymentMethod",
  ROUND(
    COUNT(CASE WHEN status = 'COMPLETED' THEN 1 END)::numeric / 
    COUNT(*)::numeric * 100,
    2
  ) as success_rate
FROM "Transaction"
WHERE "createdAt" >= NOW() - INTERVAL '7 days'
GROUP BY "paymentMethod";
```

## 🧪 Tests

### Test unitaire d'un provider

```typescript
describe('MeSombProvider', () => {
  let provider: MeSombProvider;

  beforeEach(() => {
    provider = new MeSombProvider(configService);
  });

  it('should normalize phone number', () => {
    expect(provider['normalizePhone']('670000000')).toBe('237670000000');
    expect(provider['normalizePhone']('+237670000000')).toBe('237670000000');
  });

  it('should detect operator', () => {
    expect(provider['detectOperator']('237655000000')).toBe('ORANGE');
    expect(provider['detectOperator']('237680000000')).toBe('MTN');
  });
});
```

### Test d'intégration

```bash
# 1. Lancer le serveur en mode dev
npm run start:dev

# 2. Créer un vote avec paiement
curl -X POST http://localhost:4000/api/votes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "candidateId": "uuid",
    "amount": 500,
    "paymentMethod": "MTN_MOBILE_MONEY",
    "customerPhone": "237670000000"
  }'

# 3. Simuler le webhook MeSomb
curl -X POST http://localhost:4000/api/webhooks/mesomb \
  -H "Content-Type: application/json" \
  -H "x-mesomb-signature: sha256=..." \
  -d '{
    "reference": "VOTE-123...",
    "status": "SUCCESS",
    "amount": 500
  }'
```

## 🚀 Déploiement

### Production Checklist

- [ ] Configurer `MESOMB_ENVIRONMENT=production`
- [ ] Utiliser les vraies clés API MeSomb
- [ ] Configurer l'URL webhook dans le dashboard MeSomb
- [ ] Tester avec de vrais paiements (petits montants)
- [ ] Activer les alertes sur les webhooks échoués
- [ ] Monitorer les logs dans Sentry/CloudWatch
- [ ] Backup quotidien de la table `Transaction`

### URLs Webhook en production

```env
# MeSomb Dashboard → Webhooks
https://api.spotlightlover.com/api/webhooks/mesomb

# Stripe Dashboard → Webhooks
https://api.spotlightlover.com/api/webhooks/stripe
```

## 📚 Ressources

### MeSomb
- [Dashboard](https://mesomb.hachther.com/dashboard)
- [Documentation](https://mesomb.hachther.com/documentation/)
- [SDK Node.js](https://github.com/hachther/mesomb-node)

### Stripe
- [Dashboard](https://dashboard.stripe.com/)
- [Documentation](https://stripe.com/docs)
- [SDK Node.js](https://github.com/stripe/stripe-node)

## 🐛 Troubleshooting

### Problème : Webhook non reçu

**Solution** :
1. Vérifier l'URL dans le dashboard du provider
2. Vérifier que le serveur est accessible publiquement
3. Consulter les logs du dashboard provider
4. Vérifier les logs `WebhookLog` dans la DB

### Problème : Signature webhook invalide

**Solution** :
1. Vérifier que `MESOMB_SECRET_KEY` est correct
2. Vérifier le format du header (sha1=, sha256=)
3. Tester avec Postman/curl en mode debug
4. Consulter les logs du provider

### Problème : Paiement bloqué en PENDING

**Solution** :
1. Vérifier si le webhook a été reçu (`WebhookLog`)
2. Vérifier le statut côté provider (dashboard)
3. Si webhook raté, rejouer manuellement :

```typescript
// VotesController - Endpoint admin
@Post('votes/:id/confirm-manual')
@Roles('ADMIN')
async confirmManualPayment(@Param('id') voteId: string) {
  const vote = await votesService.findOne(voteId);
  const status = await paymentsService.getTransactionStatus(
    vote.transaction.paymentMethod,
    vote.transaction.providerReference
  );
  
  return votesService.confirmPayment(
    vote.transaction.reference,
    status.status as PaymentStatus,
    status
  );
}
```

---

**Date de création** : Janvier 2025  
**Dernière mise à jour** : Janvier 2025  
**Version** : 1.0.0
