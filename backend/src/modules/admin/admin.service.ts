import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { SystemSettingsDto } from './dto/system-settings.dto';
import { UserRole } from '@prisma/client';

/**
 * Service Admin
 * Logique métier pour toutes les opérations admin
 */
@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  // ===== GESTION UTILISATEURS =====

  /**
   * Récupérer tous les utilisateurs avec pagination et filtres
   */
  async getAllUsers(filters: {
    search?: string;
    role?: UserRole;
    page?: number;
    limit?: number;
  }) {
    const { search, role, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (role) {
      where.role = role;
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          isActive: true,
          emailVerified: true,
          createdAt: true,
          _count: {
            select: {
              votes: true,
            },
          },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Récupérer un utilisateur par ID
   */
  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        votes: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            candidate: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profileImage: true,
              },
            },
          },
        },
        _count: {
          select: {
            votes: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`Utilisateur ${id} non trouvé`);
    }

    // Ne pas retourner le mot de passe
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Mettre à jour un utilisateur
   */
  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`Utilisateur ${id} non trouvé`);
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isActive: true,
        updatedAt: true,
      },
    });

    return updated;
  }

  /**
   * Supprimer un utilisateur
   */
  async deleteUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`Utilisateur ${id} non trouvé`);
    }

    // Impossible de supprimer un admin
    if (user.role === UserRole.ADMIN) {
      throw new BadRequestException('Impossible de supprimer un administrateur');
    }

    await this.prisma.user.delete({ where: { id } });

    return { message: 'Utilisateur supprimé avec succès' };
  }

  /**
   * Suspendre/activer un utilisateur
   */
  async toggleUserStatus(id: string, active: boolean) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`Utilisateur ${id} non trouvé`);
    }

    if (user.role === UserRole.ADMIN) {
      throw new BadRequestException('Impossible de modifier le statut d\'un administrateur');
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: { isActive: active },
      select: {
        id: true,
        email: true,
        isActive: true,
      },
    });

    return updated;
  }

  // ===== GESTION CANDIDATS =====

  /**
   * Récupérer tous les candidats avec filtres
   */
  async getAllCandidates(filters: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const { status, search, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { bio: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [candidates, total] = await Promise.all([
      this.prisma.candidate.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
          _count: {
            select: {
              votes: true,
            },
          },
        },
      }),
      this.prisma.candidate.count({ where }),
    ]);

    return {
      data: candidates,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Mettre à jour le statut d'un candidat
   */
  async updateCandidateStatus(
    id: string,
    status: string,
    reason?: string,
  ) {
    const candidate = await this.prisma.candidate.findUnique({
      where: { id },
    });

    if (!candidate) {
      throw new NotFoundException(`Candidat ${id} non trouvé`);
    }

    const updated = await this.prisma.candidate.update({
      where: { id },
      data: {
        status,
        ...(reason && { rejectionReason: reason }),
      },
    });

    return updated;
  }

  /**
   * Supprimer un candidat
   */
  async deleteCandidate(id: string) {
    const candidate = await this.prisma.candidate.findUnique({
      where: { id },
    });

    if (!candidate) {
      throw new NotFoundException(`Candidat ${id} non trouvé`);
    }

    await this.prisma.candidate.delete({ where: { id } });

    return { message: 'Candidat supprimé avec succès' };
  }

  // ===== GESTION VOTES =====

  /**
   * Récupérer tous les votes avec filtres
   */
  async getAllVotes(filters: {
    candidateId?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const { candidateId, status, page = 1, limit = 50 } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (candidateId) {
      where.candidateId = candidateId;
    }

    if (status) {
      where.status = status;
    }

    const [votes, total] = await Promise.all([
      this.prisma.vote.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
          candidate: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profileImage: true,
            },
          },
        },
      }),
      this.prisma.vote.count({ where }),
    ]);

    return {
      data: votes,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Récupérer un vote par ID
   */
  async getVoteById(id: string) {
    const vote = await this.prisma.vote.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        candidate: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true,
          },
        },
      },
    });

    if (!vote) {
      throw new NotFoundException(`Vote ${id} non trouvé`);
    }

    return vote;
  }

  // ===== STATISTIQUES =====

  /**
   * Statistiques globales du dashboard
   */
  async getDashboardStats() {
    const [
      totalUsers,
      totalCandidates,
      totalVotes,
      totalRevenue,
      pendingCandidates,
      activeUsers,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.candidate.count(),
      this.prisma.vote.count(),
      this.prisma.vote.aggregate({
        _sum: { amount: true },
        where: { status: 'COMPLETED' },
      }),
      this.prisma.candidate.count({ where: { status: 'PENDING' } }),
      this.prisma.user.count({ where: { isActive: true } }),
    ]);

    // Statistiques des 7 derniers jours
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [newUsers, newVotes] = await Promise.all([
      this.prisma.user.count({
        where: { createdAt: { gte: sevenDaysAgo } },
      }),
      this.prisma.vote.count({
        where: { createdAt: { gte: sevenDaysAgo } },
      }),
    ]);

    return {
      totalUsers,
      totalCandidates,
      totalVotes,
      totalRevenue: totalRevenue._sum.amount || 0,
      pendingCandidates,
      activeUsers,
      newUsers,
      newVotes,
    };
  }

  /**
   * Statistiques des votes par période
   */
  async getVotesStats(period: string) {
    let dateFilter: Date;
    const now = new Date();

    switch (period) {
      case '7d':
        dateFilter = new Date(now.setDate(now.getDate() - 7));
        break;
      case '30d':
        dateFilter = new Date(now.setDate(now.getDate() - 30));
        break;
      case '90d':
        dateFilter = new Date(now.setDate(now.getDate() - 90));
        break;
      default:
        dateFilter = new Date(0); // Depuis le début
    }

    const votes = await this.prisma.vote.groupBy({
      by: ['paymentMethod', 'status'],
      _count: true,
      _sum: { amount: true },
      where: {
        createdAt: { gte: dateFilter },
      },
    });

    return votes;
  }

  /**
   * Statistiques des utilisateurs
   */
  async getUsersStats() {
    const [byRole, byStatus] = await Promise.all([
      this.prisma.user.groupBy({
        by: ['role'],
        _count: true,
      }),
      this.prisma.user.groupBy({
        by: ['isActive'],
        _count: true,
      }),
    ]);

    return { byRole, byStatus };
  }

  /**
   * Statistiques des candidats
   */
  async getCandidatesStats() {
    const byStatus = await this.prisma.candidate.groupBy({
      by: ['status'],
      _count: true,
    });

    return { byStatus };
  }

  // ===== LOGS SYSTÈME =====

  /**
   * Récupérer les logs système
   */
  async getLogs(filters: { type?: string; page?: number; limit?: number }) {
    const { type, page = 1, limit = 50 } = filters;
    const skip = (page - 1) * limit;

    // TODO: Implémenter un système de logs (Winston/Pino)
    // Pour l'instant, retourner les dernières actions des votes
    const votes = await this.prisma.vote.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        amount: true,
        status: true,
        paymentMethod: true,
        createdAt: true,
        user: {
          select: {
            email: true,
          },
        },
        candidate: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    const total = await this.prisma.vote.count();

    return {
      data: votes.map((v) => ({
        id: v.id,
        type: 'payment',
        message: `Vote de ${v.amount} XAF via ${v.paymentMethod} - ${v.status}`,
        user: v.user.email,
        candidate: `${v.candidate.firstName} ${v.candidate.lastName}`,
        timestamp: v.createdAt,
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // ===== PARAMÈTRES SYSTÈME =====

  /**
   * Récupérer les paramètres système
   */
  async getSystemSettings() {
    // TODO: Stocker les settings dans une table dédiée
    return {
      votePrice: 500, // XAF
      maintenanceMode: false,
      registrationEnabled: true,
      votingEnabled: true,
      platformFee: 0.1, // 10%
    };
  }

  /**
   * Mettre à jour les paramètres système
   */
  async updateSystemSettings(settings: SystemSettingsDto) {
    // TODO: Sauvegarder dans une table settings
    return settings;
  }
}
