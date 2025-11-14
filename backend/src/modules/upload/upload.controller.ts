import { Controller, Post, Get, Delete, Param, UseGuards, Logger } from '@nestjs/common';
import { UploadService } from './upload.service';
import { Public } from '../../common/decorators/public.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('upload')
export class UploadController {
  private readonly logger = new Logger(UploadController.name);

  constructor(private readonly uploadService: UploadService) {}

  /**
   * Obtenir une signature pour upload direct vers Cloudinary (PUBLIC)
   */
  @Public()
  @Post('signature')
  async generateSignature() {
    try {
      const signatureData = await this.uploadService.generateUploadSignature();

      return {
        success: true,
        message: 'Signature générée. Utilisez-la pour uploader vers Cloudinary.',
        data: signatureData,
      };
    } catch (error) {
      this.logger.error('❌ Erreur génération signature', error.message);
      throw error;
    }
  }

  /**
   * Vérifier qu'une vidéo existe sur Cloudinary
   */
  @Public()
  @Get('verify/:publicId')
  async verifyVideo(@Param('publicId') publicId: string) {
    try {
      // Remplacer les underscores par des slashes pour le publicId
      const decodedPublicId = publicId.replace(/_/g, '/');
      
      const videoDetails = await this.uploadService.verifyVideo(decodedPublicId);

      return {
        success: true,
        data: videoDetails,
      };
    } catch (error) {
      this.logger.error('❌ Erreur vérification vidéo', error.message);
      throw error;
    }
  }

  /**
   * Obtenir les détails d'une vidéo
   */
  @Public()
  @Get('details/:publicId')
  async getVideoDetails(@Param('publicId') publicId: string) {
    try {
      const decodedPublicId = publicId.replace(/_/g, '/');
      const videoDetails = await this.uploadService.getVideoDetails(decodedPublicId);

      return {
        success: true,
        data: videoDetails,
      };
    } catch (error) {
      this.logger.error('❌ Erreur récupération détails vidéo', error.message);
      throw error;
    }
  }

  /**
   * Générer une URL de miniature pour une vidéo
   */
  @Public()
  @Get('thumbnail/:publicId')
  async getThumbnailUrl(@Param('publicId') publicId: string) {
    try {
      const decodedPublicId = publicId.replace(/_/g, '/');
      const thumbnailUrl = await this.uploadService.generateThumbnailUrl(decodedPublicId);

      return {
        success: true,
        data: {
          thumbnailUrl,
        },
      };
    } catch (error) {
      this.logger.error('❌ Erreur génération miniature', error.message);
      throw error;
    }
  }

  /**
   * Supprimer une vidéo de Cloudinary (ADMIN uniquement)
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @Delete(':publicId')
  async deleteVideo(@Param('publicId') publicId: string) {
    try {
      const decodedPublicId = publicId.replace(/_/g, '/');
      await this.uploadService.deleteVideo(decodedPublicId);

      return {
        success: true,
        message: 'Vidéo supprimée de Cloudinary',
      };
    } catch (error) {
      this.logger.error('❌ Erreur suppression vidéo', error.message);
      throw error;
    }
  }
}
