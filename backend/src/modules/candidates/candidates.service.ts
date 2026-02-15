import { Injectable, Logger, NotFoundException, BadRequestException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';
import { ValidateCandidateDto, ValidationAction } from './dto/validate-candidate.dto';
import { QueryCandidatesDto } from './dto/query-candidates.dto';
import { CandidateStatus, PaymentStatus } from 'src/types/enums';
import { PaymentsService } from '../payments/payments.service';

@Injectable()
export class CandidatesService {
  private readonly logger = new Logger(CandidatesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly paymentsService: PaymentsService,
  ) {}

  /**
   * Créer un nouveau candidat (inscription publique)
   */
  async create(dto: CreateCandidateDto, ipAddress?: string, userAgent?: string) {
    this.logger.log(`📝 Nouvelle inscription candidat: ${dto.name}`);

    const candidateSettings = await this.getCandidateSettings();

    if (!candidateSettings.registrationEnabled) {
      throw new BadRequestException('Les inscriptions candidat sont temporairement fermées');
    }

    if (
      dto.videoDuration &&
      dto.videoDuration > candidateSettings.maxVideoDurationSeconds
    ) {
      throw new BadRequestException(
        `La durée vidéo maximale autorisée est ${candidateSettings.maxVideoDurationSeconds} secondes`,
      );
    }

    // Vérifier si l'IP est blacklistée
    if (ipAddress) {
      const isBlacklisted = await this.prisma.ipBlacklist.findFirst({
        where: {
          ipAddress,
          OR: [
            { expiresAt: null },
            { expiresAt: { gt: new Date() } },
          ],
        },
      });

      if (isBlacklisted) {
        throw new ForbiddenException('Votre IP a été bloquée. Contactez l\'administration.');
      }
    }

    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.email }, { phone: dto.phone }],
      },
      include: {
        candidate: {
          select: { id: true },
        },
      },
    });

    if (existingUser?.candidate) {
      throw new ConflictException('Ce candidat existe déjà');
    }

    if (existingUser && existingUser.userType !== 'CANDIDATE') {
      throw new ConflictException(
        'Un compte utilisateur existe déjà avec cet email ou ce numéro',
      );
    }

    // 1 & 2. Créer user + candidat dans une transaction
    const candidate = await this.prisma.$transaction(async (tx) => {
      const user = existingUser
        ? await tx.user.update({
            where: { id: existingUser.id },
            data: {
              name: dto.name,
              userType: 'CANDIDATE',
              isActive: false,
            },
          })
        : await tx.user.create({
            data: {
              email: dto.email,
              name: dto.name,
              phone: dto.phone,
              userType: 'CANDIDATE',
              password: '', // Parcours candidature publique
              isActive: false,
            },
          });

      return tx.candidate.create({
        data: {
          userId: user.id,
          age: dto.age,
          country: dto.country,
          city: dto.city,
          bio: dto.bio,
          videoUrl: dto.videoUrl,
          videoPublicId: dto.videoPublicId,
          thumbnailUrl: dto.thumbnailUrl,
          videoDuration: dto.videoDuration,
          videoFormat: dto.videoFormat,
          videoSize: dto.videoSize,
          instagramHandle: dto.instagramHandle,
          tiktokHandle: dto.tiktokHandle,
          youtubeHandle: dto.youtubeHandle,
          status: CandidateStatus.PENDING,
          ipAddress,
          userAgent,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      });
    });

    this.logger.log(`✅ Candidat créé avec succès: ${candidate.id}`);

    const payment = await this.initializeRegistrationPayment(candidate.id);

    return {
      ...candidate,
      registrationFeeDue: candidateSettings.candidateRegistrationFee,
      registrationPaymentStatus: payment.success ? 'PROCESSING' : 'PENDING',
      registrationPayment: payment,
    };
  }


  async initializeRegistrationPayment(candidateId: string) {
    const candidate = await this.prisma.candidate.findUnique({
      where: { id: candidateId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
          },
        },
      },
    });

    if (!candidate) {
      throw new NotFoundException('Candidat introuvable');
    }

    if (candidate.status === CandidateStatus.APPROVED) {
      return {
        success: true,
        reference: null,
        providerReference: null,
        message: 'Ce candidat est déjà activé',
        data: { candidateId: candidate.id, status: candidate.status },
      };
    }

    const existingPending = await this.prisma.candidateRegistrationPayment.findFirst({
      where: {
        candidateId: candidate.id,
        status: {
          in: ['PENDING', 'PROCESSING'],
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (existingPending) {
      return {
        success: true,
        reference: existingPending.reference,
        providerReference: existingPending.providerReference,
        message: 'Un paiement est déjà en cours pour ce candidat',
        data: { status: existingPending.status },
      };
    }

    const candidateSettings = await this.getCandidateSettings();

    if (!candidateSettings.registrationEnabled) {
      throw new BadRequestException(
        'Les inscriptions candidat sont temporairement fermées',
      );
    }

    const reference = `REG-${candidate.id}-${Date.now()}`;

    const paymentResult = await this.paymentsService.initializePayment('mesomb', {
      amount: candidateSettings.candidateRegistrationFee,
      currency: 'XAF',
      reference,
      callbackUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/candidate/payment-callback?reference=${reference}`,
      webhookUrl: `${process.env.API_URL || 'http://localhost:4000'}/webhooks/mesomb`,
      customerPhone: candidate.user.phone || undefined,
      customerEmail: candidate.user.email || undefined,
      customerName: candidate.user.name,
      description: `Inscription candidat ${candidate.user.name}`,
    });

    await this.prisma.candidateRegistrationPayment.upsert({
      where: { reference },
      create: {
        reference,
        candidateId: candidate.id,
        amount: candidateSettings.candidateRegistrationFee,
        status: paymentResult.success ? PaymentStatus.PENDING : PaymentStatus.FAILED,
        providerReference: paymentResult.providerReference || null,
        payload: JSON.stringify(paymentResult.data || {}),
      },
      update: {
        status: paymentResult.success ? PaymentStatus.PENDING : PaymentStatus.FAILED,
        providerReference: paymentResult.providerReference || null,
        payload: JSON.stringify(paymentResult.data || {}),
      },
    });

    return {
      success: paymentResult.success,
      reference,
      providerReference: paymentResult.providerReference,
      message: paymentResult.message,
      data: paymentResult.data,
    };
  }


  async confirmRegistrationPayment(candidateId: string) {
    const candidate = await this.prisma.candidate.findUnique({
      where: { id: candidateId },
      include: {
        user: {
          select: { id: true, email: true, name: true },
        },
      },
    });

    if (!candidate) {
      throw new NotFoundException('Candidat introuvable');
    }

    if (candidate.status === CandidateStatus.APPROVED && candidate.user?.id) {
      return candidate;
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: candidate.userId },
        data: { isActive: true },
      });

      return tx.candidate.update({
        where: { id: candidate.id },
        data: {
          status: CandidateStatus.APPROVED,
          validatedAt: new Date(),
          validatedBy: 'SYSTEM_PAYMENT',
          rejectionReason: null,
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              phone: true,
            },
          },
        },
      });
    });

    return updated;
  }

  async confirmRegistrationPaymentByAdmin(
    candidateId: string,
    admin: { id?: string; email?: string } | null,
    metadata?: { ipAddress?: string; userAgent?: string },
  ) {
    const updatedCandidate = await this.confirmRegistrationPayment(candidateId);

    if (!admin?.id) {
      return updatedCandidate;
    }

    await this.prisma.auditLog.create({
      data: {
        adminId: admin.id,
        action: 'MANUAL_CONFIRM_REGISTRATION_PAYMENT',
        entityType: 'CANDIDATE',
        entityId: candidateId,
        oldData: null,
        newData: JSON.stringify({ status: updatedCandidate.status, validatedAt: updatedCandidate.validatedAt }),
        details: `Confirmation manuelle du paiement d'inscription pour ${updatedCandidate.user?.email || candidateId}`,
        ipAddress: metadata?.ipAddress || 'unknown',
        userAgent: metadata?.userAgent || null,
      },
    });

    return updatedCandidate;
  }

  async confirmRegistrationPaymentByReference(
    reference: string,
    status: PaymentStatus,
    webhookPayload?: unknown,
  ) {
    let normalizedStatus = status;

    if (!reference.startsWith('REG-')) {
      this.logger.warn(`Référence invalide ignorée: ${reference}`);
      return null;
    }

    const record = await this.prisma.candidateRegistrationPayment.findUnique({
      where: { reference },
      select: {
        candidateId: true,
        status: true,
        providerReference: true,
      },
    });

    if (!record) {
      this.logger.warn(`Aucun paiement inscription trouvé pour référence ${reference}`);
      return null;
    }

    const currentStatus = (record.status || '').toUpperCase();

    // Idempotence : ne pas repasser un paiement déjà complété en FAILED/PENDING
    if (currentStatus === 'COMPLETED' && normalizedStatus !== PaymentStatus.COMPLETED) {
      return this.confirmRegistrationPayment(record.candidateId);
    }

    if (normalizedStatus === PaymentStatus.COMPLETED && record.providerReference) {
      try {
        const providerStatus = await this.paymentsService.getTransactionStatus(
          'mesomb',
          record.providerReference,
        );

        if (providerStatus.status !== 'completed') {
          normalizedStatus = PaymentStatus.PENDING;
        }
      } catch (error) {
        this.logger.warn(
          `Vérification provider impossible pour ${reference}: ${error.message}`,
        );
      }
    }

    await this.prisma.candidateRegistrationPayment.update({
      where: { reference },
      data: {
        status: normalizedStatus,
        payload: JSON.stringify(webhookPayload || {}),
      },
    });

    if (normalizedStatus !== PaymentStatus.COMPLETED) {
      return null;
    }

    return this.confirmRegistrationPayment(record.candidateId);
  }

  async getRegistrationPaymentStatusByReference(reference: string) {
    const record = await this.prisma.candidateRegistrationPayment.findUnique({
      where: { reference },
      include: {
        candidate: {
          select: {
            status: true,
          },
        },
      },
    });

    if (!record) {
      throw new NotFoundException('Référence de paiement introuvable');
    }

    return {
      reference: record.reference,
      candidate_id: record.candidateId,
      amount: record.amount,
      status: record.status,
      provider_reference: record.providerReference,
      updated_at: record.updatedAt,
      created_at: record.createdAt,
      candidate_status: record.candidate?.status || null,
      last_payload: record.payload,
    };
  }

  private async getCandidateSettings(): Promise<{
    registrationEnabled: boolean;
    maxVideoDurationSeconds: number;
    candidateRegistrationFee: number;
  }> {
    const defaults = {
      registrationEnabled: true,
      maxVideoDurationSeconds: 90,
      candidateRegistrationFee: 500,
    };

    try {
      const rows = await this.prisma.systemSetting.findMany({
        where: {
          key: {
            in: ['registrationEnabled', 'maxVideoDurationSeconds', 'candidateRegistrationFee'],
          },
        },
        select: {
          key: true,
          value: true,
        },
      });

      if (rows.length === 0) {
        return defaults;
      }

      const map = new Map(rows.map((row) => [row.key, row.value]));
      const registrationEnabledRaw = map.get('registrationEnabled');
      const durationRaw = map.get('maxVideoDurationSeconds');
      const registrationFeeRaw = map.get('candidateRegistrationFee');

      const parsedDuration = durationRaw ? Number(durationRaw) : defaults.maxVideoDurationSeconds;
      const parsedFee = registrationFeeRaw ? Number(registrationFeeRaw) : defaults.candidateRegistrationFee;

      return {
        registrationEnabled:
          registrationEnabledRaw === undefined
            ? defaults.registrationEnabled
            : registrationEnabledRaw === 'true',
        maxVideoDurationSeconds:
          Number.isNaN(parsedDuration) || parsedDuration < 30
            ? defaults.maxVideoDurationSeconds
            : parsedDuration,
        candidateRegistrationFee:
          Number.isNaN(parsedFee) || parsedFee < 100
            ? defaults.candidateRegistrationFee
            : parsedFee,
      };
    } catch (error) {
      this.logger.warn(
        `Impossible de charger la configuration candidat: ${error.message}`,
      );
      return defaults;
    }
  }


  async getPublicContestSettings() {
    const candidateSettings = await this.getCandidateSettings();

    return {
      candidateRegistrationFee: candidateSettings.candidateRegistrationFee,
      maxVideoDurationSeconds: candidateSettings.maxVideoDurationSeconds,
      registrationEnabled: candidateSettings.registrationEnabled,
    };
  }

  /**
   * Lister les candidats (avec filtres et pagination)
   */
  async findAll(query: QueryCandidatesDto) {
    const { status, country, search, sortBy, order, page, limit } = query;

    // Construction des filtres
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (country) {
      where.country = country;
    }

    if (search) {
      where.user = {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      };
    }

    // Pagination
    const skip = (page - 1) * limit;
    const take = limit;

    // Tri
    const orderBy: any = {};
    orderBy[sortBy] = order;

    // Requête avec comptage total
    const [candidates, total] = await Promise.all([
      this.prisma.candidate.findMany({
        where,
        orderBy,
        skip,
        take,
        select: {
          id: true,
          age: true,
          country: true,
          city: true,
          bio: true,
          videoUrl: true,
          thumbnailUrl: true,
          instagramHandle: true,
          tiktokHandle: true,
          youtubeHandle: true,
          status: true,
          totalVotes: true,
          totalRevenue: true,
          viewCount: true,
          shareCount: true,
          rank: true,
          createdAt: true,
          user: {
            select: {
              id: true,
                  email: true,
              phone: true,
            },
          },
        },
      }),
      this.prisma.candidate.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: candidates,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  /**
   * Obtenir un candidat par ID
   */
  async findOne(id: string, incrementView: boolean = false) {
    const candidate = await this.prisma.candidate.findUnique({
      where: { id },
      select: {
        id: true,
        age: true,
        country: true,
        city: true,
        bio: true,
        videoUrl: true,
        videoPublicId: true,
        thumbnailUrl: true,
        videoDuration: true,
        videoFormat: true,
        instagramHandle: true,
        tiktokHandle: true,
        youtubeHandle: true,
        status: true,
        totalVotes: true,
        totalRevenue: true,
        viewCount: true,
        shareCount: true,
        rank: true,
        validatedAt: true,
        rejectionReason: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!candidate) {
      throw new NotFoundException('Candidat non trouvé');
    }

    // Incrémenter le compteur de vues
    if (incrementView) {
      await this.prisma.candidate.update({
        where: { id },
        data: {
          viewCount: { increment: 1 },
        },
      });
      candidate.viewCount += 1;
    }

    return candidate;
  }

  /**
   * Mettre à jour un candidat (admin ou le candidat lui-même avant validation)
   */
  async update(id: string, dto: UpdateCandidateDto) {
    // Vérifier que le candidat existe
    const candidate = await this.findOne(id);

    // Si le candidat est déjà validé, interdire certaines modifications
    if (candidate.status === CandidateStatus.APPROVED) {
      // Seuls certains champs peuvent être modifiés après validation
      const allowedFields = ['bio', 'instagramHandle', 'tiktokHandle', 'youtubeHandle'];
      const updateKeys = Object.keys(dto);
      const forbiddenFields = updateKeys.filter((key) => !allowedFields.includes(key));

      if (forbiddenFields.length > 0) {
        throw new BadRequestException(
          `Impossible de modifier ces champs après validation: ${forbiddenFields.join(', ')}`,
        );
      }
    }

    const updated = await this.prisma.candidate.update({
      where: { id },
      data: dto,
    });

    this.logger.log(`✏️ Candidat mis à jour: ${id}`);

    return updated;
  }

  /**
   * Supprimer un candidat (admin uniquement)
   */
  async remove(id: string) {
    // Vérifier que le candidat existe
    await this.findOne(id);

    await this.prisma.candidate.delete({
      where: { id },
    });

    this.logger.log(`🗑️ Candidat supprimé: ${id}`);

    return { success: true, message: 'Candidat supprimé avec succès' };
  }

  /**
   * Valider/Rejeter/Suspendre un candidat (admin uniquement)
   */
  async validate(id: string, dto: ValidateCandidateDto, adminId: string, adminIp?: string) {
    // Vérifier que le candidat existe
    const candidate = await this.findOne(id);

    let newStatus: CandidateStatus;
    let logAction: string;

    switch (dto.action) {
      case ValidationAction.APPROVE:
        newStatus = CandidateStatus.APPROVED;
        logAction = 'VALIDATE_CANDIDATE';
        break;
      case ValidationAction.REJECT:
        newStatus = CandidateStatus.REJECTED;
        logAction = 'REJECT_CANDIDATE';
        break;
      case ValidationAction.SUSPEND:
        newStatus = CandidateStatus.SUSPENDED;
        logAction = 'SUSPEND_CANDIDATE';
        break;
    }

    // Mettre à jour le candidat
    const updated = await this.prisma.candidate.update({
      where: { id },
      data: {
        status: newStatus,
        validatedAt: dto.action === ValidationAction.APPROVE ? new Date() : null,
        validatedBy: adminId,
        rejectionReason: dto.reason || null,
      },
    });

    // Créer un log d'audit
    await this.prisma.auditLog.create({
      data: {
        adminId: adminId, // adminId représente un userId de type ADMIN
        action: logAction,
        entityType: 'Candidate',
        entityId: id,
        oldData: JSON.stringify({ status: candidate.status }),
        newData: JSON.stringify({ status: newStatus, reason: dto.reason }),
        ipAddress: adminIp || 'unknown',
      },
    });

    this.logger.log(`✅ Candidat ${dto.action}: ${id} par admin ${adminId}`);

    return updated;
  }

  /**
   * Incrémenter le compteur de partages
   */
  async incrementShare(id: string) {
    await this.prisma.candidate.update({
      where: { id },
      data: {
        shareCount: { increment: 1 },
      },
    });

    this.logger.log(`📤 Partage candidat: ${id}`);

    return { success: true };
  }

  /**
   * Obtenir les statistiques d'un candidat
   */
  async getStats(id: string) {
    const candidate = await this.findOne(id);

    // Obtenir les votes du candidat (groupés par méthode de paiement)
    const votesByMethod = await this.prisma.vote.groupBy({
      by: ['paymentMethod'],
      where: {
        candidateId: id,
        paymentStatus: 'COMPLETED',
      },
      _count: {
        id: true,
      },
      _sum: {
        amount: true,
      },
    });

    // Obtenir l'historique des votes (derniers 30 jours)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const votesHistory = await this.prisma.vote.groupBy({
      by: ['createdAt'],
      where: {
        candidateId: id,
        paymentStatus: 'COMPLETED',
        createdAt: { gte: thirtyDaysAgo },
      },
      _count: {
        id: true,
      },
    });

    return {
      candidate: {
        id: candidate.id,
        name: candidate.user.name,
        totalVotes: candidate.totalVotes,
        totalRevenue: candidate.totalRevenue,
        viewCount: candidate.viewCount,
        shareCount: candidate.shareCount,
        rank: candidate.rank,
      },
      votesByMethod,
      votesHistory,
    };
  }

  /**
   * Obtenir le top N candidats (classement)
   */
  async getTopCandidates(limit: number = 10) {
    return this.prisma.candidate.findMany({
      where: {
        status: CandidateStatus.APPROVED,
      },
      orderBy: {
        totalVotes: 'desc',
      },
      take: limit,
      select: {
        id: true,
        country: true,
        city: true,
        thumbnailUrl: true,
        totalVotes: true,
        totalRevenue: true,
        rank: true,
        user: {
          select: {
            },
        },
      },
    });
  }

  /**
   * Mettre à jour le rang des candidats (tâche planifiée)
   */
  async updateRanks() {
    this.logger.log('🔄 Mise à jour des rangs des candidats...');

    const candidates = await this.prisma.candidate.findMany({
      where: {
        status: CandidateStatus.APPROVED,
      },
      orderBy: {
        totalVotes: 'desc',
      },
      select: {
        id: true,
      },
    });

    // Mettre à jour les rangs
    const updates = candidates.map((candidate, index) =>
      this.prisma.candidate.update({
        where: { id: candidate.id },
        data: { rank: index + 1 },
      }),
    );

    await Promise.all(updates);

    this.logger.log(`✅ Rangs mis à jour pour ${candidates.length} candidats`);
  }
}
