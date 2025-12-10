import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO pour mettre à jour le statut d'un candidat
 */
export class UpdateCandidateStatusDto {
  @ApiPropertyOptional({
    example: 'Contenu inapproprié',
    description: 'Raison du rejet (optionnel)',
  })
  @IsOptional()
  @IsString()
  reason?: string;
}
