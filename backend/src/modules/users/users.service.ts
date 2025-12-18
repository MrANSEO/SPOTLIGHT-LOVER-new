import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { UserType } from 'src/types/enums';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { SystemSettingsDto } from './dto/system-settings.dto';

/**
 * Service Users (Admin)
 * Gestion des users, candidats, votes, statistiques
 */
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // ========== GESTION USERS ==========

  /**
   * Récupérer tous les users avec pagination
   */
  async getAllUsers(
    page: number = 1,
    limit: number = 20,
    search?: string,
    userType?: string,
  ) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (userType) {
      where.userType = userType;
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
          name: true,
          phone: true,
          userType: true,
          isActive: true,
          lastLoginAt: true,
          createdAt: true,
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
   * Récupérer un user par ID
   */
  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        userType: true,
        isActive: true,
        twoFactorEnabled: true,
        lastLoginAt: true,
        lastLoginIp: true,
        createdAt: true,
        updatedAt: true,
        candidate: true, // Inclure les infos candidat si existe
      },
    });

    if (!user) {
      throw new NotFoundException(`User ${id} non trouvé`);
    }

    return user;
  }

  /**
   * Mettre à jour un user
   */
  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User ${id} non trouvé`);
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        userType: true,
        isActive: true,
        updatedAt: true,
      },
    });

    return updated;
  }

  /**
   * Supprimer un user
   */
  async deleteUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User ${id} non trouvé`);
    }

    if (user.userType === UserType.ADMIN) {
      throw new BadRequestException('Impossible de supprimer un ADMIN');
    }

    await this.prisma.user.delete({ where: { id } });

    return { message: 'User supprimé avec succès' };
  }

  // ========== GESTION CANDIDATS ==========

  /**
   * Récupérer tous les candidats
   */
  async getAllCandidates(
    page: number = 1,
    limit: number = 20,
    status?: string,
    search?: string,
  ) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.user = {
        name: { contains: search, mode: 'insensitive' }
      };
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
              name: true,
              email: true,
              phone: true,
            }
          }
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
              user: {
                select: {
                  name: true,
                }
              }
            },
          },
          voter: {
            select: {
              id: true,
              name: true,
              email: true,
            }
          }
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
        candidate: {
          select: {
            id: true,
            user: {
              select: {
                name: true,
              }
            }
          },
        },
        voter: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      },
    });

    if (!vote) {
      throw new NotFoundException(`Vote ${id} non trouvé`);
    }

    return vote;
  }

  // ========== STATISTIQUES ==========

  /**
   * Dashboard principal avec statistiques globales
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
        where: { paymentStatus: 'COMPLETED' },
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
      overview: {
        totalUsers,
        totalCandidates,
        totalVotes,
        totalRevenue: totalRevenue._sum.amount || 0,
        pendingCandidates,
        activeUsers,
      },
      recentActivity: {
        newUsers,
        newVotes,
      },
    };
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
   * Statistiques des users
   */
  async getUsersStats() {
    const [byType, byStatus] = await Promise.all([
      this.prisma.user.groupBy({
        by: ['userType'],
        _count: true,
      }),
      this.prisma.user.groupBy({
        by: ['isActive'],
        _count: true,
      }),
    ]);

    return { byType, byStatus };
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
   * Paramètres système
   */
  async getSystemSettings() {
    return {
      votePrice: 100,
      maintenanceMode: false,
      registrationEnabled: true,
      autoApproval: false,
    };
  }

  async updateSystemSettings(settings: SystemSettingsDto) {
    return settings;
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
      where.adminId = adminId; // adminId représente un userId de type ADMIN
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
