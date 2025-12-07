import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { SystemSettingsDto } from './dto/system-settings.dto';
import { AdminRole } from '@prisma/client';

/**
 * Service Admin
 * Gestion des admins, candidats, votes, statistiques
 */
@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  // ========== GESTION ADMINS ==========

  /**
   * Récupérer tous les admins avec pagination
   */
  async getAllAdmins(
    page: number = 1,
    limit: number = 20,
    search?: string,
    role?: AdminRole,
  ) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (role) {
      where.role = role;
    }

    const [admins, total] = await Promise.all([
      this.prisma.admin.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          lastLoginAt: true,
          createdAt: true,
        },
      }),
      this.prisma.admin.count({ where }),
    ]);

    return {
      data: admins,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Récupérer un admin par ID
   */
  async getAdminById(id: string) {
    const admin = await this.prisma.admin.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        twoFactorEnabled: true,
        lastLoginAt: true,
        lastLoginIp: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!admin) {
      throw new NotFoundException(`Admin ${id} non trouvé`);
    }

    return admin;
  }

  /**
   * Mettre à jour un admin
   */
  async updateAdmin(id: string, updateAdminDto: UpdateAdminDto) {
    const admin = await this.prisma.admin.findUnique({ where: { id } });

    if (!admin) {
      throw new NotFoundException(`Admin ${id} non trouvé`);
    }

    const updated = await this.prisma.admin.update({
      where: { id },
      data: updateAdminDto,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        updatedAt: true,
      },
    });

    return updated;
  }

  /**
   * Supprimer un admin
   */
  async deleteAdmin(id: string) {
    const admin = await this.prisma.admin.findUnique({ where: { id } });

    if (!admin) {
      throw new NotFoundException(`Admin ${id} non trouvé`);
    }

    if (admin.role === AdminRole.SUPER_ADMIN) {
      throw new BadRequestException('Impossible de supprimer un SUPER_ADMIN');
    }

    await this.prisma.admin.delete({ where: { id } });

    return { message: 'Admin supprimé avec succès' };
  }

  // ========== GESTION CANDIDATS ==========

  /**
   * Récupérer tous les candidats
   */
  async getAllCandidates(
    page: number = 1,
    limit: number = 20,
    status?: string,
    category?: string,
  ) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (status) {
      where.status = status;
    }

    const [candidates, total] = await Promise.all([
      this.prisma.candidate.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          age: true,
          country: true,
          city: true,
          bio: true,
          videoUrl: true,
          thumbnailUrl: true,
          status: true,
          totalVotes: true,
          totalRevenue: true,
          viewCount: true,
          rank: true,
          createdAt: true,
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
  async updateCandidateStatus(id: string, status: string, reason?: string) {
    const candidate = await this.prisma.candidate.findUnique({ where: { id } });

    if (!candidate) {
      throw new NotFoundException(`Candidat ${id} non trouvé`);
    }

    const updated = await this.prisma.candidate.update({
      where: { id },
      data: {
        status: status as any,
        ...(reason && { rejectionReason: reason }),
        ...(status === 'APPROVED' && { validatedAt: new Date() }),
      },
    });

    return updated;
  }

  /**
   * Supprimer un candidat
   */
  async deleteCandidate(id: string) {
    const candidate = await this.prisma.candidate.findUnique({ where: { id } });

    if (!candidate) {
      throw new NotFoundException(`Candidat ${id} non trouvé`);
    }

    await this.prisma.candidate.delete({ where: { id } });

    return { message: 'Candidat supprimé avec succès' };
  }

  // ========== GESTION VOTES ==========

  /**
   * Récupérer tous les votes
   */
  async getAllVotes(page: number = 1, limit: number = 20, status?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (status) {
      where.paymentStatus = status;
    }

    const [votes, total] = await Promise.all([
      this.prisma.vote.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          candidate: {
            select: {
              id: true,
              name: true,
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

  // ========== STATISTIQUES ==========

  /**
   * Dashboard principal avec statistiques globales
   */
  async getDashboardStats() {
    const [
      totalAdmins,
      totalCandidates,
      totalVotes,
      totalRevenue,
      pendingCandidates,
      activeAdmins,
    ] = await Promise.all([
      this.prisma.admin.count(),
      this.prisma.candidate.count(),
      this.prisma.vote.count(),
      this.prisma.vote.aggregate({
        _sum: { amount: true },
        where: { paymentStatus: 'COMPLETED' },
      }),
      this.prisma.candidate.count({ where: { status: 'PENDING' } }),
      this.prisma.admin.count({ where: { isActive: true } }),
    ]);

    // Statistiques des 7 derniers jours
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [newAdmins, newVotes] = await Promise.all([
      this.prisma.admin.count({
        where: { createdAt: { gte: sevenDaysAgo } },
      }),
      this.prisma.vote.count({
        where: { createdAt: { gte: sevenDaysAgo } },
      }),
    ]);

    return {
      overview: {
        totalAdmins,
        totalCandidates,
        totalVotes,
        totalRevenue: totalRevenue._sum.amount || 0,
        pendingCandidates,
        activeAdmins,
      },
      recentActivity: {
        newAdmins,
        newVotes,
      },
    };
  }

  /**
   * Statistiques détaillées pour les graphiques
   */
  async getAnalytics(startDate?: string, endDate?: string, groupBy: string = 'day') {
    const dateFilter = startDate ? new Date(startDate) : undefined;

    // Statistiques de votes par jour
    const votes = await this.prisma.vote.findMany({
      where: {
        ...(dateFilter && { createdAt: { gte: dateFilter } }),
      },
      select: {
        createdAt: true,
        amount: true,
        paymentMethod: true,
      },
    });

    return {
      votes,
      summary: {
        total: votes.length,
        totalAmount: votes.reduce((sum, v) => sum + v.amount, 0),
      },
    };
  }

  /**
   * Paramètres système
   */
  async getSystemSettings() {
    // Pour l'instant, retourner des valeurs par défaut
    return {
      votePrice: 100,
      maintenanceMode: false,
      registrationEnabled: true,
      autoApproval: false,
    };
  }

  async updateSystemSettings(settings: SystemSettingsDto) {
    // Pour l'instant, juste retourner les paramètres
    return settings;
  }

  /**
   * Statistiques des votes
   */
  async getVotesStats(period: string = '30d') {
    const days = parseInt(period.replace('d', ''));
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const votes = await this.prisma.vote.findMany({
      where: {
        createdAt: { gte: startDate },
      },
      select: {
        paymentMethod: true,
        amount: true,
        paymentStatus: true,
      },
    });

    return {
      total: votes.length,
      byMethod: votes.reduce((acc, v) => {
        acc[v.paymentMethod] = (acc[v.paymentMethod] || 0) + 1;
        return acc;
      }, {}),
      totalAmount: votes.reduce((sum, v) => sum + v.amount, 0),
    };
  }

  /**
   * Statistiques des admins
   */
  async getAdminsStats() {
    const [byRole, byStatus] = await Promise.all([
      this.prisma.admin.groupBy({
        by: ['role'],
        _count: true,
      }),
      this.prisma.admin.groupBy({
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

  /**
   * Récupérer un vote par ID
   */
  async getVoteById(id: string) {
    const vote = await this.prisma.vote.findUnique({
      where: { id },
      include: {
        candidate: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!vote) {
      throw new NotFoundException(`Vote ${id} non trouvé`);
    }

    return vote;
  }

  /**
   * Logs d'activité (alias pour getActivityLogs)
   */
  async getLogs(params: {
    type?: string;
    page?: number;
    limit?: number;
  }) {
    return this.getActivityLogs(
      params.page || 1,
      params.limit || 50,
      params.type,
    );
  }

  /**
   * Logs d'activité
   */
  async getActivityLogs(
    page: number = 1,
    limit: number = 50,
    action?: string,
    adminId?: string,
  ) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (action) {
      where.action = action;
    }

    if (adminId) {
      where.adminId = adminId;
    }

    const [logs, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          admin: {
            select: {
              email: true,
              name: true,
            },
          },
        },
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return {
      data: logs.map((log) => ({
        id: log.id,
        type: log.action,
        message: `${log.action} sur ${log.entityType} ${log.entityId}`,
        user: log.admin.email,
        timestamp: log.createdAt,
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
