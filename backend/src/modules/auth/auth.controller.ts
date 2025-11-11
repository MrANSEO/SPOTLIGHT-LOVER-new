import { Controller, Post, Get, Body, UseGuards, Req, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Enable2FADto } from './dto/enable-2fa.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  /**
   * Inscription d'un nouvel administrateur
   * Note: En production, cette route devrait être protégée (only SUPER_ADMIN)
   */
  @Public()
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    try {
      const result = await this.authService.register(dto);
      return {
        success: true,
        message: 'Admin créé avec succès',
        data: result,
      };
    } catch (error) {
      this.logger.error('❌ Erreur inscription', error.message);
      throw error;
    }
  }

  /**
   * Connexion d'un administrateur
   */
  @Public()
  @Post('login')
  async login(@Body() dto: LoginDto, @Req() req: any) {
    try {
      const ipAddress = req.ip || req.connection.remoteAddress;
      const result = await this.authService.login(dto, ipAddress);

      // Si 2FA requis, ne pas renvoyer les tokens
      if (result.requires2FA) {
        return {
          success: true,
          message: 'Code 2FA requis',
          requires2FA: true,
        };
      }

      return {
        success: true,
        message: 'Connexion réussie',
        data: result,
      };
    } catch (error) {
      this.logger.error('❌ Erreur connexion', error.message);
      throw error;
    }
  }

  /**
   * Renouveler les tokens avec le refresh token
   */
  @Public()
  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  async refresh(@CurrentUser('id') adminId: string) {
    try {
      const tokens = await this.authService.refreshTokens(adminId);
      return {
        success: true,
        message: 'Tokens renouvelés',
        data: tokens,
      };
    } catch (error) {
      this.logger.error('❌ Erreur renouvellement tokens', error.message);
      throw error;
    }
  }

  /**
   * Obtenir le profil de l'admin connecté
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser('id') adminId: string) {
    try {
      const profile = await this.authService.getProfile(adminId);
      return {
        success: true,
        data: profile,
      };
    } catch (error) {
      this.logger.error('❌ Erreur récupération profil', error.message);
      throw error;
    }
  }

  /**
   * Générer un secret 2FA
   */
  @Post('2fa/generate')
  @UseGuards(JwtAuthGuard)
  async generate2FA(@CurrentUser('id') adminId: string) {
    try {
      const result = await this.authService.generate2FASecret(adminId);
      return {
        success: true,
        message: 'Secret 2FA généré. Scannez le QR Code avec votre app d\'authentification.',
        data: result,
      };
    } catch (error) {
      this.logger.error('❌ Erreur génération 2FA', error.message);
      throw error;
    }
  }

  /**
   * Activer le 2FA
   */
  @Post('2fa/enable')
  @UseGuards(JwtAuthGuard)
  async enable2FA(@CurrentUser('id') adminId: string, @Body() dto: Enable2FADto) {
    try {
      const result = await this.authService.enable2FA(adminId, dto.token);
      return {
        success: true,
        message: '2FA activé avec succès',
        data: result,
      };
    } catch (error) {
      this.logger.error('❌ Erreur activation 2FA', error.message);
      throw error;
    }
  }

  /**
   * Désactiver le 2FA
   */
  @Post('2fa/disable')
  @UseGuards(JwtAuthGuard)
  async disable2FA(@CurrentUser('id') adminId: string) {
    try {
      const result = await this.authService.disable2FA(adminId);
      return {
        success: true,
        message: '2FA désactivé avec succès',
        data: result,
      };
    } catch (error) {
      this.logger.error('❌ Erreur désactivation 2FA', error.message);
      throw error;
    }
  }

  /**
   * Test endpoint (route protégée)
   */
  @Get('test-protected')
  @UseGuards(JwtAuthGuard)
  testProtected(@CurrentUser() admin: any) {
    return {
      message: 'Route protégée accessible !',
      admin: {
        id: admin.id,
        email: admin.email,
        role: admin.role,
      },
    };
  }

  /**
   * Test endpoint SUPER_ADMIN only
   */
  @Get('test-super-admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  testSuperAdmin(@CurrentUser() admin: any) {
    return {
      message: 'Route SUPER_ADMIN accessible !',
      admin: {
        id: admin.id,
        email: admin.email,
        role: admin.role,
      },
    };
  }
}
