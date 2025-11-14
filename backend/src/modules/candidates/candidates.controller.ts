import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
  Logger,
} from '@nestjs/common';
import { CandidatesService } from './candidates.service';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';
import { ValidateCandidateDto } from './dto/validate-candidate.dto';
import { QueryCandidatesDto } from './dto/query-candidates.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('candidates')
export class CandidatesController {
  private readonly logger = new Logger(CandidatesController.name);

  constructor(private readonly candidatesService: CandidatesService) {}

  /**
   * Inscription d'un nouveau candidat (PUBLIC)
   */
  @Public()
  @Post()
  async create(@Body() createCandidateDto: CreateCandidateDto, @Req() req: any) {
    try {
      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.headers['user-agent'];

      const candidate = await this.candidatesService.create(
        createCandidateDto,
        ipAddress,
        userAgent,
      );

      return {
        success: true,
        message: 'Inscription réussie ! Votre candidature sera validée par un administrateur.',
        data: candidate,
      };
    } catch (error) {
      this.logger.error('❌ Erreur création candidat', error.message);
      throw error;
    }
  }

  /**
   * Lister les candidats (PUBLIC - seulement APPROVED)
   * Admin peut voir tous les statuts
   */
  @Public()
  @Get()
  async findAll(@Query() query: QueryCandidatesDto, @Req() req: any) {
    try {
      // Si pas authentifié, forcer status APPROVED
      if (!req.user) {
        query.status = 'APPROVED';
      }

      const result = await this.candidatesService.findAll(query);

      return {
        success: true,
        ...result,
      };
    } catch (error) {
      this.logger.error('❌ Erreur listage candidats', error.message);
      throw error;
    }
  }

  /**
   * Obtenir un candidat par ID (PUBLIC)
   */
  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const candidate = await this.candidatesService.findOne(id, true);

      return {
        success: true,
        data: candidate,
      };
    } catch (error) {
      this.logger.error('❌ Erreur récupération candidat', error.message);
      throw error;
    }
  }

  /**
   * Obtenir les statistiques d'un candidat (PUBLIC)
   */
  @Public()
  @Get(':id/stats')
  async getStats(@Param('id') id: string) {
    try {
      const stats = await this.candidatesService.getStats(id);

      return {
        success: true,
        data: stats,
      };
    } catch (error) {
      this.logger.error('❌ Erreur récupération stats', error.message);
      throw error;
    }
  }

  /**
   * Incrémenter le compteur de partages (PUBLIC)
   */
  @Public()
  @Post(':id/share')
  async incrementShare(@Param('id') id: string) {
    try {
      await this.candidatesService.incrementShare(id);

      return {
        success: true,
        message: 'Partage enregistré',
      };
    } catch (error) {
      this.logger.error('❌ Erreur enregistrement partage', error.message);
      throw error;
    }
  }

  /**
   * Obtenir le top N candidats (PUBLIC)
   */
  @Public()
  @Get('leaderboard/top')
  async getTopCandidates(@Query('limit') limit?: number) {
    try {
      const topLimit = limit ? Math.min(limit, 100) : 10;
      const candidates = await this.candidatesService.getTopCandidates(topLimit);

      return {
        success: true,
        data: candidates,
      };
    } catch (error) {
      this.logger.error('❌ Erreur récupération top candidats', error.message);
      throw error;
    }
  }

  /**
   * Mettre à jour un candidat (ADMIN)
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'MODERATOR')
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCandidateDto: UpdateCandidateDto) {
    try {
      const candidate = await this.candidatesService.update(id, updateCandidateDto);

      return {
        success: true,
        message: 'Candidat mis à jour',
        data: candidate,
      };
    } catch (error) {
      this.logger.error('❌ Erreur mise à jour candidat', error.message);
      throw error;
    }
  }

  /**
   * Valider/Rejeter/Suspendre un candidat (ADMIN)
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'MODERATOR')
  @Patch(':id/validate')
  async validate(
    @Param('id') id: string,
    @Body() validateDto: ValidateCandidateDto,
    @CurrentUser('id') adminId: string,
    @Req() req: any,
  ) {
    try {
      const ipAddress = req.ip || req.connection.remoteAddress;
      const candidate = await this.candidatesService.validate(id, validateDto, adminId, ipAddress);

      return {
        success: true,
        message: `Candidat ${validateDto.action.toLowerCase()} avec succès`,
        data: candidate,
      };
    } catch (error) {
      this.logger.error('❌ Erreur validation candidat', error.message);
      throw error;
    }
  }

  /**
   * Supprimer un candidat (SUPER_ADMIN uniquement)
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const result = await this.candidatesService.remove(id);

      return result;
    } catch (error) {
      this.logger.error('❌ Erreur suppression candidat', error.message);
      throw error;
    }
  }

  /**
   * Mettre à jour les rangs (ADMIN - endpoint manuel ou CRON)
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @Post('ranks/update')
  async updateRanks() {
    try {
      await this.candidatesService.updateRanks();

      return {
        success: true,
        message: 'Rangs mis à jour avec succès',
      };
    } catch (error) {
      this.logger.error('❌ Erreur mise à jour rangs', error.message);
      throw error;
    }
  }
}
