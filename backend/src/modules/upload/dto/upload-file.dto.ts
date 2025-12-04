import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum FileType {
  IMAGE = 'image',
  VIDEO = 'video',
  DOCUMENT = 'document',
}

/**
 * DTO pour l'upload de fichiers
 */
export class UploadFileDto {
  @ApiProperty({ enum: FileType, example: FileType.IMAGE })
  @IsEnum(FileType)
  fileType: FileType;

  @ApiPropertyOptional({ example: 'profile', description: 'Catégorie du fichier' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ example: 'user-avatar', description: 'Description du fichier' })
  @IsOptional()
  @IsString()
  description?: string;
}
