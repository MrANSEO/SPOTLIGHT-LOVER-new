import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);

  constructor(private readonly configService: ConfigService) {
    // Configuration Cloudinary
    cloudinary.config({
      cloud_name: this.configService.get<string>('cloudinary.cloudName'),
      api_key: this.configService.get<string>('cloudinary.apiKey'),
      api_secret: this.configService.get<string>('cloudinary.apiSecret'),
    });

    this.logger.log('✅ Cloudinary configuré');
  }

  /**
   * Générer une signature pour upload direct vers Cloudinary
   */
  async generateUploadSignature() {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = this.configService.get<string>('cloudinary.folder');

    const uploadPreset = {
      timestamp,
      folder,
      resource_type: 'video',
      format: 'mp4',
      max_file_size: 52428800, // 50 MB
      // Transformation vidéo
      transformation: [
        { width: 1280, height: 720, crop: 'limit' },
        { quality: 'auto' },
      ],
      // Générer automatiquement une miniature
      eager: [
        {
          format: 'jpg',
          transformation: [
            { width: 640, height: 360, crop: 'fill' },
            { quality: 'auto' },
          ],
        },
      ],
      eager_async: true,
    };

    const apiSecret = this.configService.get<string>('cloudinary.apiSecret');
    const signature = cloudinary.utils.api_sign_request(uploadPreset, apiSecret);

    this.logger.log('🔐 Signature Cloudinary générée');

    return {
      signature,
      timestamp,
      folder,
      cloudName: this.configService.get<string>('cloudinary.cloudName'),
      apiKey: this.configService.get<string>('cloudinary.apiKey'),
      uploadPreset,
    };
  }

  /**
   * Vérifier qu'une vidéo existe sur Cloudinary
   */
  async verifyVideo(publicId: string): Promise<any> {
    try {
      const result = await cloudinary.api.resource(publicId, {
        resource_type: 'video',
      });

      this.logger.log(`✅ Vidéo vérifiée: ${publicId}`);

      return {
        publicId: result.public_id,
        url: result.secure_url,
        format: result.format,
        duration: result.duration,
        width: result.width,
        height: result.height,
        bytes: result.bytes,
        createdAt: result.created_at,
      };
    } catch (error) {
      this.logger.error(`❌ Erreur vérification vidéo: ${publicId}`, error.message);
      throw new BadRequestException('Vidéo non trouvée sur Cloudinary');
    }
  }

  /**
   * Supprimer une vidéo de Cloudinary
   */
  async deleteVideo(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId, {
        resource_type: 'video',
      });

      this.logger.log(`🗑️ Vidéo supprimée de Cloudinary: ${publicId}`);
    } catch (error) {
      this.logger.error(`❌ Erreur suppression vidéo: ${publicId}`, error.message);
      throw new BadRequestException('Impossible de supprimer la vidéo');
    }
  }

  /**
   * Obtenir les détails d'une vidéo
   */
  async getVideoDetails(publicId: string) {
    return this.verifyVideo(publicId);
  }

  /**
   * Générer une URL de transformation pour une vidéo
   */
  generateTransformedUrl(publicId: string, transformation: any): string {
    return cloudinary.url(publicId, {
      resource_type: 'video',
      ...transformation,
    });
  }

  /**
   * Générer une URL de miniature pour une vidéo
   */
  generateThumbnailUrl(publicId: string): string {
    return cloudinary.url(publicId, {
      resource_type: 'video',
      format: 'jpg',
      transformation: [
        { width: 640, height: 360, crop: 'fill' },
        { quality: 'auto' },
      ],
    });
  }
}
