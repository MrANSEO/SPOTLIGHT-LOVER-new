import { Injectable, Logger, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload, JwtTokens, AuthResponse } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Inscription d'un nouvel administrateur
   */
  async register(dto: RegisterDto): Promise<AuthResponse> {
    this.logger.log(`📝 Tentative d'inscription: ${dto.email}`);

    // Vérifier si l'email existe déjà
    const existingAdmin = await this.prisma.admin.findUnique({
      where: { email: dto.email },
    });

    if (existingAdmin) {
      throw new ConflictException('Cet email est déjà utilisé');
    }

    // Hasher le mot de passe
    const hashedPassword = await this.hashPassword(dto.password);

    // Créer l'admin
    const admin = await this.prisma.admin.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
        role: dto.role,
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    // Générer les tokens JWT
    const tokens = await this.generateTokens(admin);

    this.logger.log(`✅ Admin créé avec succès: ${admin.email}`);

    return {
      admin,
      tokens,
    };
  }

  /**
   * Connexion d'un administrateur
   */
  async login(dto: LoginDto, ipAddress?: string): Promise<AuthResponse> {
    this.logger.log(`🔐 Tentative de connexion: ${dto.email}`);

    // Trouver l'admin par email
    const admin = await this.prisma.admin.findUnique({
      where: { email: dto.email },
    });

    if (!admin) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    // Vérifier si l'admin est actif
    if (!admin.isActive) {
      throw new UnauthorizedException('Compte désactivé');
    }

    // Vérifier le mot de passe
    const isPasswordValid = await this.comparePassword(dto.password, admin.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    // Si 2FA est activé, vérifier le code
    if (admin.twoFactorEnabled) {
      if (!dto.twoFactorCode) {
        return {
          admin: {
            id: admin.id,
            email: admin.email,
            name: admin.name,
            role: admin.role,
          },
          tokens: { accessToken: '', refreshToken: '' },
          requires2FA: true,
        };
      }

      // Vérifier le code 2FA
      const is2FAValid = this.verify2FAToken(admin.twoFactorSecret, dto.twoFactorCode);
      if (!is2FAValid) {
        throw new UnauthorizedException('Code 2FA invalide');
      }
    }

    // Mettre à jour la dernière connexion
    await this.prisma.admin.update({
      where: { id: admin.id },
      data: {
        lastLoginAt: new Date(),
        lastLoginIp: ipAddress,
      },
    });

    // Générer les tokens JWT
    const tokens = await this.generateTokens({
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    });

    this.logger.log(`✅ Connexion réussie: ${admin.email}`);

    return {
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
      tokens,
    };
  }

  /**
   * Renouveler les tokens avec le refresh token
   */
  async refreshTokens(adminId: string): Promise<JwtTokens> {
    this.logger.log(`🔄 Renouvellement tokens pour admin: ${adminId}`);

    const admin = await this.prisma.admin.findUnique({
      where: { id: adminId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
      },
    });

    if (!admin || !admin.isActive) {
      throw new UnauthorizedException('Accès non autorisé');
    }

    return this.generateTokens(admin);
  }

  /**
   * Générer un secret 2FA et un QR Code
   */
  async generate2FASecret(adminId: string): Promise<{ secret: string; qrCodeUrl: string }> {
    const admin = await this.prisma.admin.findUnique({
      where: { id: adminId },
    });

    if (!admin) {
      throw new UnauthorizedException('Admin non trouvé');
    }

    // Générer un secret 2FA
    const secret = speakeasy.generateSecret({
      name: `Spotlight Lover (${admin.email})`,
      issuer: 'Spotlight Lover',
    });

    // Sauvegarder le secret (temporairement, pas encore activé)
    await this.prisma.admin.update({
      where: { id: adminId },
      data: {
        twoFactorSecret: secret.base32,
      },
    });

    // Générer un QR Code
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

    this.logger.log(`🔐 Secret 2FA généré pour: ${admin.email}`);

    return {
      secret: secret.base32,
      qrCodeUrl,
    };
  }

  /**
   * Activer le 2FA après vérification du code
   */
  async enable2FA(adminId: string, token: string): Promise<{ success: boolean }> {
    const admin = await this.prisma.admin.findUnique({
      where: { id: adminId },
    });

    if (!admin || !admin.twoFactorSecret) {
      throw new BadRequestException('Secret 2FA non généré');
    }

    // Vérifier le token
    const isValid = this.verify2FAToken(admin.twoFactorSecret, token);

    if (!isValid) {
      throw new BadRequestException('Code 2FA invalide');
    }

    // Activer le 2FA
    await this.prisma.admin.update({
      where: { id: adminId },
      data: {
        twoFactorEnabled: true,
      },
    });

    this.logger.log(`✅ 2FA activé pour admin: ${admin.email}`);

    return { success: true };
  }

  /**
   * Désactiver le 2FA
   */
  async disable2FA(adminId: string): Promise<{ success: boolean }> {
    await this.prisma.admin.update({
      where: { id: adminId },
      data: {
        twoFactorEnabled: false,
        twoFactorSecret: null,
      },
    });

    this.logger.log(`❌ 2FA désactivé pour admin: ${adminId}`);

    return { success: true };
  }

  /**
   * Obtenir le profil de l'admin connecté
   */
  async getProfile(adminId: string) {
    const admin = await this.prisma.admin.findUnique({
      where: { id: adminId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        twoFactorEnabled: true,
        lastLoginAt: true,
        createdAt: true,
      },
    });

    if (!admin) {
      throw new UnauthorizedException('Admin non trouvé');
    }

    return admin;
  }

  // ============================================
  // MÉTHODES PRIVÉES
  // ============================================

  /**
   * Hasher un mot de passe avec bcrypt
   */
  private async hashPassword(password: string): Promise<string> {
    const rounds = this.configService.get<number>('BCRYPT_ROUNDS', 10);
    return bcrypt.hash(password, rounds);
  }

  /**
   * Comparer un mot de passe avec son hash
   */
  private async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Générer les tokens JWT (access + refresh)
   */
  private async generateTokens(admin: { id: string; email: string; name?: string; role: string }): Promise<JwtTokens> {
    const payload: JwtPayload = {
      sub: admin.id,
      email: admin.email,
      role: admin.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('jwt.secret'),
        expiresIn: this.configService.get<string>('jwt.expiresIn'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
        expiresIn: this.configService.get<string>('jwt.refreshExpiresIn'),
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Vérifier un token 2FA
   */
  private verify2FAToken(secret: string, token: string): boolean {
    return speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 2, // Accepter les codes +/- 60 secondes
    });
  }

  /**
   * Mettre à jour le profil utilisateur
   */
  async updateProfile(adminId: string, data: { email?: string; fullName?: string; phone?: string }) {
    this.logger.log(`📝 Mise à jour profil: ${adminId}`);

    // Si email change, vérifier qu'il n'est pas déjà utilisé
    if (data.email) {
      const existingAdmin = await this.prisma.admin.findUnique({
        where: { email: data.email },
      });

      if (existingAdmin && existingAdmin.id !== adminId) {
        throw new ConflictException('Cet email est déjà utilisé');
      }
    }

    // Mettre à jour
    const admin = await this.prisma.admin.update({
      where: { id: adminId },
      data: {
        email: data.email,
        name: data.fullName,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    this.logger.log(`✅ Profil mis à jour: ${adminId}`);
    return admin;
  }

  /**
   * Changer le mot de passe
   */
  async changePassword(adminId: string, oldPassword: string, newPassword: string) {
    this.logger.log(`🔐 Changement de mot de passe: ${adminId}`);

    // Vérifier l'ancien mot de passe
    const admin = await this.prisma.admin.findUnique({
      where: { id: adminId },
    });

    if (!admin) {
      throw new UnauthorizedException('Admin non trouvé');
    }

    const isPasswordValid = await this.comparePassword(oldPassword, admin.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Ancien mot de passe incorrect');
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await this.hashPassword(newPassword);

    // Mettre à jour
    await this.prisma.admin.update({
      where: { id: adminId },
      data: { password: hashedPassword },
    });

    this.logger.log(`✅ Mot de passe changé: ${adminId}`);
    return { message: 'Mot de passe changé avec succès' };
  }

  /**
   * Supprimer le compte (soft delete)
   */
  async deleteAccount(adminId: string) {
    this.logger.log(`🗑️ Suppression compte: ${adminId}`);

    // Soft delete (désactiver le compte)
    await this.prisma.admin.update({
      where: { id: adminId },
      data: { isActive: false },
    });

    this.logger.log(`✅ Compte désactivé: ${adminId}`);
    return { message: 'Compte supprimé avec succès' };
  }
}
