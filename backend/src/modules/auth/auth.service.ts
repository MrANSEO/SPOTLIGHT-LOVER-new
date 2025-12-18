import { Injectable, Logger, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
import { UserType } from 'src/types/enums';
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
   * Inscription d'un nouvel utilisateur
   */
  async register(dto: RegisterDto): Promise<AuthResponse> {
    this.logger.log(`📝 Tentative d'inscription: ${dto.email}`);

    // Vérifier si l'email existe déjà
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Cet email est déjà utilisé');
    }

    // Hasher le mot de passe
    const hashedPassword = await this.hashPassword(dto.password);

    // Créer l'utilisateur
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
        phone: dto.phone,
        userType: dto.userType,
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        userType: true,
      },
    });

    // Générer les tokens JWT
    const tokens = await this.generateTokens(user);

    this.logger.log(`✅ User créé avec succès: ${user.email} (${user.userType})`);

    return {
      user,
      tokens,
    };
  }

  /**
   * Connexion d'un utilisateur
   */
  async login(dto: LoginDto, ipAddress?: string): Promise<AuthResponse> {
    this.logger.log(`🔐 Tentative de connexion: ${dto.email}`);

    // Trouver l'utilisateur par email
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    // Vérifier si l'utilisateur est actif
    if (!user.isActive) {
      throw new UnauthorizedException('Compte désactivé');
    }

    // Vérifier le mot de passe
    const isPasswordValid = await this.comparePassword(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    // Si 2FA est activé, vérifier le code
    if (user.twoFactorEnabled) {
      if (!dto.twoFactorCode) {
        return {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            userType: user.userType,
          },
          tokens: { accessToken: '', refreshToken: '' },
          requires2FA: true,
        };
      }

      // Vérifier le code 2FA
      const is2FAValid = this.verify2FAToken(user.twoFactorSecret, dto.twoFactorCode);
      if (!is2FAValid) {
        throw new UnauthorizedException('Code 2FA invalide');
      }
    }

    // Mettre à jour la dernière connexion
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date(),
        lastLoginIp: ipAddress,
      },
    });

    // Générer les tokens JWT
    const tokens = await this.generateTokens({
      id: user.id,
      email: user.email,
      name: user.name,
      userType: user.userType,
    });

    this.logger.log(`✅ Connexion réussie: ${user.email} (${user.userType})`);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        userType: user.userType,
      },
      tokens,
    };
  }

  /**
   * Renouveler les tokens avec le refresh token
   */
  async refreshTokens(userId: string): Promise<JwtTokens> {
    this.logger.log(`🔄 Renouvellement tokens pour user: ${userId}`);

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        userType: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Accès non autorisé');
    }

    return this.generateTokens(user);
  }

  /**
   * Générer un secret 2FA et un QR Code
   */
  async generate2FASecret(userId: string): Promise<{ secret: string; qrCodeUrl: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User non trouvé');
    }

    // Générer un secret 2FA
    const secret = speakeasy.generateSecret({
      name: `Spotlight Lover (${user.email})`,
      issuer: 'Spotlight Lover',
    });

    // Sauvegarder le secret (temporairement, pas encore activé)
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorSecret: secret.base32,
      },
    });

    // Générer un QR Code
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

    this.logger.log(`🔐 Secret 2FA généré pour: ${user.email}`);

    return {
      secret: secret.base32,
      qrCodeUrl,
    };
  }

  /**
   * Activer le 2FA après vérification du code
   */
  async enable2FA(userId: string, token: string): Promise<{ success: boolean }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.twoFactorSecret) {
      throw new BadRequestException('Secret 2FA non généré');
    }

    // Vérifier le token
    const isValid = this.verify2FAToken(user.twoFactorSecret, token);

    if (!isValid) {
      throw new BadRequestException('Code 2FA invalide');
    }

    // Activer le 2FA
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorEnabled: true,
      },
    });

    this.logger.log(`✅ 2FA activé pour user: ${user.email}`);

    return { success: true };
  }

  /**
   * Désactiver le 2FA
   */
  async disable2FA(userId: string): Promise<{ success: boolean }> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorEnabled: false,
        twoFactorSecret: null,
      },
    });

    this.logger.log(`❌ 2FA désactivé pour user: ${userId}`);

    return { success: true };
  }

  /**
   * Obtenir le profil de l'utilisateur connecté
   */
  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        userType: true,
        twoFactorEnabled: true,
        lastLoginAt: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User non trouvé');
    }

    return user;
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
  private async generateTokens(user: { id: string; email: string; name?: string; userType: string }): Promise<JwtTokens> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      userType: user.userType,
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
  async updateProfile(userId: string, data: { email?: string; name?: string; phone?: string }) {
    this.logger.log(`📝 Mise à jour profil: ${userId}`);

    // Si email change, vérifier qu'il n'est pas déjà utilisé
    if (data.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingUser && existingUser.id !== userId) {
        throw new ConflictException('Cet email est déjà utilisé');
      }
    }

    // Mettre à jour
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        email: data.email,
        name: data.name,
        phone: data.phone,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        userType: true,
      },
    });

    this.logger.log(`✅ Profil mis à jour: ${userId}`);
    return user;
  }

  /**
   * Changer le mot de passe
   */
  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    this.logger.log(`🔐 Changement de mot de passe: ${userId}`);

    // Vérifier l'ancien mot de passe
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User non trouvé');
    }

    const isPasswordValid = await this.comparePassword(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Ancien mot de passe incorrect');
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await this.hashPassword(newPassword);

    // Mettre à jour
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    this.logger.log(`✅ Mot de passe changé: ${userId}`);
    return { message: 'Mot de passe changé avec succès' };
  }

  /**
   * Supprimer le compte (soft delete)
   */
  async deleteAccount(userId: string) {
    this.logger.log(`🗑️ Suppression compte: ${userId}`);

    // Soft delete (désactiver le compte)
    await this.prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
    });

    this.logger.log(`✅ Compte désactivé: ${userId}`);
    return { message: 'Compte supprimé avec succès' };
  }
}
