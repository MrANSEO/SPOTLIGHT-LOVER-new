import { Injectable, Logger, NotFoundException, BadRequestException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';
import { ValidateCandidateDto, ValidationAction } from './dto/validate-candidate.dto';
import { QueryCandidatesDto } from './dto/query-candidates.dto';
import { CandidateStatus } from 'src/types/enums';

@Injectable()
export class CandidatesService {
  private readonly logger = new Logger(CandidatesService.name);

  constructor(private readonly prisma: PrismaService) {}

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
            },
          })
        : await tx.user.create({
            data: {
              email: dto.email,
              name: dto.name,
              phone: dto.phone,
              userType: 'CANDIDATE',
              password: '', // Parcours candidature publique
              isActive: true,
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

    return {
      ...candidate,
      registrationFeeDue: candidateSettings.candidateRegistrationFee,
      registrationPaymentStatus: 'PENDING',
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
      const rows = await this.prisma.$queryRaw<Array<{ key: string; value: string }>>`
        SELECT key, value
        FROM system_settings
        WHERE key IN ('registrationEnabled', 'maxVideoDurationSeconds', 'candidateRegistrationFee')
      `;

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
