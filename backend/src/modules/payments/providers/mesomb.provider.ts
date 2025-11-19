import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentOperation } from '@hachther/mesomb';
import * as crypto from 'crypto';
import {
  IPaymentProvider,
  InitPaymentParams,
  PaymentResponse,
  TransactionStatus,
  WebhookVerification,
} from './payment.interface';

@Injectable()
export class MeSombProvider implements IPaymentProvider {
  private readonly logger = new Logger(MeSombProvider.name);
  private readonly applicationKey: string;
  private readonly accessKey: string;
  private readonly secretKey: string;
  private readonly client: PaymentOperation;

  constructor(private readonly configService: ConfigService) {
    this.applicationKey = this.configService.get<string>('MESOMB_APP_KEY');
    this.accessKey = this.configService.get<string>('MESOMB_API_KEY');
    this.secretKey = this.configService.get<string>('MESOMB_SECRET_KEY');

    // Vérification des clés au démarrage
    if (!this.applicationKey || !this.accessKey || !this.secretKey) {
      this.logger.error('❌ ERREUR : Clés MeSomb manquantes dans .env');
      this.logger.error(
        `  - MESOMB_APP_KEY: ${this.applicationKey ? '✅' : '❌ MANQUANT'}`,
      );
      this.logger.error(
        `  - MESOMB_API_KEY: ${this.accessKey ? '✅' : '❌ MANQUANT'}`,
      );
      this.logger.error(
        `  - MESOMB_SECRET_KEY: ${this.secretKey ? '✅' : '❌ MANQUANT'}`,
      );
      throw new Error('Clés MeSomb manquantes');
    }

    // Initialiser le client MeSomb
    this.client = new PaymentOperation({
      applicationKey: this.applicationKey,
      accessKey: this.accessKey,
      secretKey: this.secretKey,
    });

    this.logger.log('✅ MeSomb Provider initialisé avec succès');
    this.logger.log(
      `  - APP_KEY: ${this.applicationKey.substring(0, 10)}...`,
    );
    this.logger.log(`  - API_KEY: ${this.accessKey.substring(0, 10)}...`);
  }

  /**
   * Initialiser un paiement via MeSomb
   * MeSomb unifie MTN et Orange Money
   */
  async initializePayment(
    params: InitPaymentParams,
  ): Promise<PaymentResponse> {
    try {
      this.logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      this.logger.log('🚀 Initialisation paiement MeSomb');
      this.logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      this.logger.log(`📞 Téléphone: ${params.customerPhone}`);
      this.logger.log(`💰 Montant: ${params.amount} ${params.currency}`);
      this.logger.log(`📱 Référence: ${params.reference}`);

      // Validation des paramètres
      if (!params.amount || params.amount < 100) {
        return {
          success: false,
          message: 'Montant invalide (minimum 100 XAF)',
        };
      }

      if (!params.customerPhone) {
        return {
          success: false,
          message: 'Numéro de téléphone requis',
        };
      }

      // Normaliser le numéro (format: 237XXXXXXXXX)
      let phone = params.customerPhone.replace(/^\+/, '').replace(/\s/g, '');
      if (!phone.startsWith('237')) {
        phone = '237' + phone;
      }

      // Validation format camerounais
      if (!/^237[0-9]{9}$/.test(phone)) {
        return {
          success: false,
          message:
            'Numéro de téléphone invalide (format attendu: 237XXXXXXXXX)',
        };
      }

      // Déterminer le service (MTN ou ORANGE)
      // MeSomb détermine automatiquement, mais on peut spécifier
      const service = this.detectOperator(phone);

      this.logger.log(`🔧 Service détecté: ${service}`);

      // Paramètres du paiement MeSomb
      const paymentParams = {
        payer: phone,
        amount: params.amount,
        service: service, // 'MTN' ou 'ORANGE'
        country: 'CM', // Cameroun
        currency: params.currency || 'XAF',
        // MeSomb n'accepte pas ces champs dans makeCollect
        // fees: false, // Les frais sont à la charge du payeur
      };

      this.logger.log(
        '📤 Paramètres MeSomb:',
        JSON.stringify(paymentParams, null, 2),
      );

      // Appel API MeSomb
      const response = await this.client.makeCollect(paymentParams);

      this.logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      this.logger.log('📥 Réponse MeSomb:', JSON.stringify(response, null, 2));
      this.logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      // Analyse de la réponse
      this.logger.log('🔍 Analyse de la réponse:');
      this.logger.log(
        '  - isOperationSuccess():',
        response.isOperationSuccess ? response.isOperationSuccess() : 'N/A',
      );
      this.logger.log(
        '  - isTransactionSuccess():',
        response.isTransactionSuccess
          ? response.isTransactionSuccess()
          : 'N/A',
      );
      this.logger.log(
        '  - Transaction ID (pk):',
        response.transaction?.pk || 'N/A',
      );
      this.logger.log('  - Status:', response.transaction?.status || 'N/A');

      // IMPORTANT: Le statut final viendra du WEBHOOK
      // On retourne seulement si l'initiation a réussi
      if (response.isOperationSuccess && response.isOperationSuccess()) {
        if (response.isTransactionSuccess && response.isTransactionSuccess()) {
          this.logger.log('✅ Paiement initié avec succès');
          this.logger.log(
            '⏳ Attente de la confirmation client et du webhook MeSomb...',
          );

          return {
            success: true,
            providerReference: response.transaction?.pk,
            message: 'Paiement initié avec succès. Confirmez sur votre téléphone.',
            data: {
              transactionId: response.transaction?.pk,
              service: service,
              phone: phone,
            },
          };
        } else {
          this.logger.log(
            '❌ Transaction échouée (isTransactionSuccess = false)',
          );
          return {
            success: false,
            message: "Échec de l'initiation du paiement",
          };
        }
      } else {
        this.logger.log('❌ Opération échouée (isOperationSuccess = false)');
        return {
          success: false,
          message: "Échec de l'initiation du paiement",
        };
      }
    } catch (error) {
      this.logger.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      this.logger.error('❌ Erreur MeSomb:', error.message);
      this.logger.error('Stack:', error.stack);
      this.logger.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      if (error.response) {
        this.logger.error("📥 Réponse d'erreur:", error.response.data);
      }

      return {
        success: false,
        message: error.message || "Erreur lors de l'appel à MeSomb",
      };
    }
  }

  /**
   * Vérifier la signature du webhook MeSomb
   */
  verifyWebhookSignature(
    payload: any,
    signature?: string,
    headers?: any,
  ): WebhookVerification {
    try {
      // Récupérer la signature des headers
      const webhookSignature =
        signature ||
        headers?.['x-signature'] ||
        headers?.['x-mesomb-signature'] ||
        headers?.['signature'] ||
        headers?.['x-hub-signature'];

      if (!webhookSignature) {
        this.logger.warn('⚠️ Aucune signature trouvée dans le webhook');
        return {
          isValid: false,
          error: 'Signature manquante',
        };
      }

      // Convertir le payload en string si nécessaire
      const payloadBuffer = Buffer.isBuffer(payload)
        ? payload
        : Buffer.from(typeof payload === 'string' ? payload : JSON.stringify(payload));

      // MeSomb peut utiliser SHA1 ou SHA256
      const isValid = this.tryVerifySignature(
        payloadBuffer,
        webhookSignature,
        this.secretKey,
      );

      if (isValid) {
        this.logger.log('✅ Signature MeSomb vérifiée avec succès');
        return { isValid: true };
      } else {
        this.logger.warn('❌ Signature MeSomb invalide');
        return {
          isValid: false,
          error: 'Signature invalide',
        };
      }
    } catch (error) {
      this.logger.error(
        'Erreur lors de la vérification de la signature:',
        error.message,
      );
      return {
        isValid: false,
        error: error.message,
      };
    }
  }

  /**
   * Essayer de vérifier la signature avec différents algorithmes
   */
  private tryVerifySignature(
    payloadBuffer: Buffer,
    signatureHeader: string,
    secret: string,
  ): boolean {
    // Nettoyer la signature (enlever les préfixes si présents)
    let sig = String(signatureHeader).trim();
    sig = sig.replace(/^(sha1=|sha256=|sha1:|sha256:)/i, '');

    // Essayer avec différentes combinaisons
    const algorithms = ['sha1', 'sha256'];
    const encodings: BufferEncoding[] = ['hex', 'base64'];

    for (const alg of algorithms) {
      for (const encoding of encodings) {
        try {
          const computed = crypto
            .createHmac(alg, secret)
            .update(payloadBuffer)
            .digest();
          const sigBuf = Buffer.from(sig, encoding);

          if (sigBuf.length === computed.length) {
            if (crypto.timingSafeEqual(computed, sigBuf)) {
              this.logger.log(`✅ Signature vérifiée avec ${alg}/${encoding}`);
              return true;
            }
          }
        } catch (e) {
          // Continuer avec la prochaine combinaison
        }
      }
    }

    return false;
  }

  /**
   * Vérifier le statut d'une transaction MeSomb
   * NOTE: Cette méthode ne devrait être utilisée qu'en dernier recours
   * Le statut DOIT venir du webhook pour être fiable
   */
  async getTransactionStatus(
    providerReference: string,
  ): Promise<TransactionStatus> {
    try {
      this.logger.log(
        `🔍 Vérification statut MeSomb pour: ${providerReference}`,
      );
      this.logger.warn(
        '⚠️ ATTENTION : Cette méthode ne devrait être utilisée qu\'en dernier recours',
      );
      this.logger.warn(
        '   Le statut DOIT venir du webhook pour être fiable',
      );

      const transactions = await this.client.getTransactions([
        providerReference,
      ]);

      if (transactions && transactions.length > 0) {
        const transaction = transactions[0];
        this.logger.log(
          '✅ Transaction trouvée:',
          JSON.stringify(transaction, null, 2),
        );

        // Mapper le statut MeSomb vers notre enum
        const statusMap = {
          SUCCESS: 'completed',
          FAILED: 'failed',
          PENDING: 'pending',
          EXPIRED: 'cancelled',
          REFUNDED: 'cancelled',
        };

        const status = statusMap[transaction.status] || 'pending';

        return {
          status: status as any,
          providerReference: transaction.pk,
          reference: transaction.pk,
          amount: transaction.amount,
          currency: 'XAF',
        };
      } else {
        this.logger.log('❌ Transaction non trouvée sur MeSomb');
        return {
          status: 'pending',
          providerReference: providerReference,
          reference: providerReference,
          amount: 0,
          currency: 'XAF',
        };
      }
    } catch (error) {
      this.logger.error(
        '❌ Erreur vérification statut MeSomb:',
        error.message,
      );
      throw error;
    }
  }

  /**
   * Détecter l'opérateur téléphonique (MTN ou Orange)
   * Basé sur les préfixes Cameroun
   */
  private detectOperator(phone: string): 'MTN' | 'ORANGE' {
    // Préfixes Orange Cameroun: 655, 656, 657, 658, 659
    // Préfixes MTN Cameroun: 650, 651, 652, 653, 654, 670-679, 680-689, 690-699
    
    const orangePrefixes = ['655', '656', '657', '658', '659'];
    const prefix = phone.substring(3, 6); // Après le 237

    if (orangePrefixes.includes(prefix)) {
      return 'ORANGE';
    }

    // Par défaut MTN (la majorité des numéros)
    return 'MTN';
  }

  /**
   * MeSomb ne supporte pas les remboursements directs via l'API
   * Cette méthode n'est pas implémentée
   */
  async refundTransaction(
    providerReference: string,
    amount?: number,
  ): Promise<PaymentResponse> {
    this.logger.warn(
      '⚠️ MeSomb ne supporte pas les remboursements automatiques',
    );
    return {
      success: false,
      message: 'Fonctionnalité non supportée par MeSomb',
    };
  }
}
