import { IsNumber, IsBoolean, IsOptional, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO pour les paramètres système
 */
export class SystemSettingsDto {
  @ApiPropertyOptional({ example: 100, description: 'Prix d\'un vote en FCFA' })
  @IsOptional()
  @IsNumber()
  @Min(100)
  votePrice?: number;

  @ApiPropertyOptional({
    example: 500,
    description: 'Frais d\'inscription candidat en FCFA',
  })
  @IsOptional()
  @IsNumber()
  @Min(100)
  candidateRegistrationFee?: number;

  @ApiPropertyOptional({
    example: 90,
    description: 'Durée max autorisée pour une vidéo candidat (secondes)',
  })
  @IsOptional()
  @IsNumber()
  @Min(30)
  @Max(120)
  maxVideoDurationSeconds?: number;

  @ApiPropertyOptional({ example: false, description: 'Mode maintenance activé' })
  @IsOptional()
  @IsBoolean()
  maintenanceMode?: boolean;

  @ApiPropertyOptional({ example: true, description: 'Inscription autorisée' })
  @IsOptional()
  @IsBoolean()
  registrationEnabled?: boolean;

  @ApiPropertyOptional({ example: true, description: 'Votes autorisés' })
  @IsOptional()
  @IsBoolean()
  votingEnabled?: boolean;

  @ApiPropertyOptional({
    example: 0.1,
    description: 'Commission plateforme (ex: 0.1 = 10%)',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  platformFee?: number;
}
