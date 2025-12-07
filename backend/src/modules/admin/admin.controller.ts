import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AdminService } from './admin.service';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// import { RolesGuard } from '../auth/guards/roles.guard';
// import { Roles } from '../auth/decorators/roles.decorator';
import { AdminRole } from '@prisma/client';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { UpdateCandidateStatusDto } from './dto/update-candidate-status.dto';
import { SystemSettingsDto } from './dto/system-settings.dto';

/**
 * Contrôleur Admin
 * Gestion des utilisateurs, candidats, votes, statistiques
 * Accès réservé aux administrateurs uniquement
 */
@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin')
// @UseGuards(JwtAuthGuard, RolesGuard)
// @Roles(AdminRole.SUPER_ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ===== GESTION UTILISATEURS =====

  /**
   * Récupérer tous les utilisateurs avec filtres
   */
  @Get('admins')
  @ApiOperation({ summary: 'Lister tous les utilisateurs' })
  @ApiQuery({ name: 'search', required: false, description: 'Recherche par nom/email' })
  @ApiQuery({ name: 'role', required: false, enum: AdminRole })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Liste des utilisateurs' })
  async getAllAdmins(
    @Query('search') search?: string,
    @Query('role') role?: AdminRole,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.adminService.getAllAdmins(
      search,
      role,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
    });
  }

  /**
   * Récupérer un utilisateur par ID
   */
  @Get('admins/:id')
  @ApiOperation({ summary: 'Détails d\'un utilisateur' })
  @ApiResponse({ status: 200, description: 'Utilisateur trouvé' })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  async getAdminById(@Param('id') id: string) {
    return this.adminService.getAdminById(id);
  }

  /**
   * Mettre à jour un utilisateur
   */
  @Put('admins/:id')
  @ApiOperation({ summary: 'Modifier un utilisateur' })
  @ApiResponse({ status: 200, description: 'Utilisateur mis à jour' })
  async updateAdmin(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.updateAdmin(id, updateAdminDto);
  }

  /**
   * Supprimer un utilisateur
   */
  @Delete('admins/:id')
  @ApiOperation({ summary: 'Supprimer un utilisateur' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: 204, description: 'Utilisateur supprimé' })
  async deleteAdmin(@Param('id') id: string) {
    return this.adminService.deleteAdmin(id);
  }

  /**
   * Suspendre/activer un utilisateur
   */
  @Put('admins/:id/status')
  @ApiOperation({ summary: 'Suspendre ou activer un utilisateur' })
  @ApiResponse({ status: 200, description: 'Statut modifié' })
  async toggleUserStatus(@Param('id') id: string, @Body('active') active: boolean) {
    // Méthode simplifiée - utilise updateAdmin avec isActive
    return this.adminService.updateAdmin(id, { isActive: active });
  }

  // ===== GESTION CANDIDATS =====

  /**
   * Récupérer tous les candidats avec filtres
   */
  @Get('candidates')
  @ApiOperation({ summary: 'Lister tous les candidats' })
  @ApiQuery({ name: 'status', required: false, description: 'Filtrer par statut' })
  @ApiQuery({ name: 'search', required: false, description: 'Recherche par nom' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Liste des candidats' })
  async getAllCandidates(
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.adminService.getAllCandidates(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
      status,
      search
    );
  }

  /**
   * Approuver un candidat
   */
  @Put('candidates/:id/approve')
  @ApiOperation({ summary: 'Approuver un candidat' })
  @ApiResponse({ status: 200, description: 'Candidat approuvé' })
  async approveCandidate(@Param('id') id: string) {
    return this.adminService.updateCandidateStatus(id, 'APPROVED');
  }

  /**
   * Rejeter un candidat
   */
  @Put('candidates/:id/reject')
  @ApiOperation({ summary: 'Rejeter un candidat' })
  @ApiResponse({ status: 200, description: 'Candidat rejeté' })
  async rejectCandidate(
    @Param('id') id: string,
    @Body() dto: UpdateCandidateStatusDto,
  ) {
    return this.adminService.updateCandidateStatus(id, 'REJECTED', dto.reason);
  }

  /**
   * Supprimer un candidat
   */
  @Delete('candidates/:id')
  @ApiOperation({ summary: 'Supprimer un candidat' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: 204, description: 'Candidat supprimé' })
  async deleteCandidate(@Param('id') id: string) {
    return this.adminService.deleteCandidate(id);
  }

  // ===== GESTION VOTES =====

  /**
   * Récupérer tous les votes avec filtres
   */
  @Get('votes')
  @ApiOperation({ summary: 'Lister tous les votes' })
  @ApiQuery({ name: 'candidateId', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Liste des votes' })
  async getAllVotes(
    @Query('candidateId') candidateId?: string,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.adminService.getAllVotes(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 50,
      status
    );
  }

  /**
   * Récupérer un vote par ID
   */
  @Get('votes/:id')
  @ApiOperation({ summary: 'Détails d\'un vote' })
  @ApiResponse({ status: 200, description: 'Vote trouvé' })
  async getVoteById(@Param('id') id: string) {
    return this.adminService.getVoteById(id);
  }

  // ===== STATISTIQUES =====

  /**
   * Statistiques globales du dashboard
   */
  @Get('dashboard/stats')
  @ApiOperation({ summary: 'Statistiques du dashboard' })
  @ApiResponse({ status: 200, description: 'Statistiques globales' })
  async getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  /**
   * Statistiques détaillées des votes
   */
  @Get('dashboard/votes-stats')
  @ApiOperation({ summary: 'Statistiques des votes' })
  @ApiQuery({ name: 'period', required: false, description: 'Période (7d, 30d, 90d, all)' })
  @ApiResponse({ status: 200, description: 'Statistiques des votes' })
  async getVotesStats(@Query('period') period?: string) {
    return this.adminService.getVotesStats(period || '30d');
  }

  /**
   * Statistiques des utilisateurs
   */
  @Get('dashboard/users-stats')
  @ApiOperation({ summary: 'Statistiques des utilisateurs' })
  @ApiResponse({ status: 200, description: 'Statistiques des utilisateurs' })
  async getAdminsStats() {
    return this.adminService.getAdminsStats();
  }

  /**
   * Statistiques des candidats
   */
  @Get('dashboard/candidates-stats')
  @ApiOperation({ summary: 'Statistiques des candidats' })
  @ApiResponse({ status: 200, description: 'Statistiques des candidats' })
  async getCandidatesStats() {
    return this.adminService.getCandidatesStats();
  }

  // ===== LOGS SYSTÈME =====

  /**
   * Récupérer les logs système
   */
  @Get('logs')
  @ApiOperation({ summary: 'Logs système' })
  @ApiQuery({ name: 'type', required: false, description: 'Type de log (auth, payment, error)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Logs système' })
  async getLogs(
    @Query('type') type?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.adminService.getLogs({
      type,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 50,
    });
  }

  // ===== PARAMÈTRES SYSTÈME =====

  /**
   * Récupérer les paramètres système
   */
  @Get('settings')
  @ApiOperation({ summary: 'Paramètres système' })
  @ApiResponse({ status: 200, description: 'Paramètres actuels' })
  async getSystemSettings() {
    return this.adminService.getSystemSettings();
  }

  /**
   * Mettre à jour les paramètres système
   */
  @Put('settings')
  @ApiOperation({ summary: 'Modifier les paramètres système' })
  @ApiResponse({ status: 200, description: 'Paramètres mis à jour' })
  async updateSystemSettings(@Body() settings: SystemSettingsDto) {
    return this.adminService.updateSystemSettings(settings);
  }
}
