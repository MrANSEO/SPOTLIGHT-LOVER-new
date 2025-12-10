import { IsNumber, IsBoolean, IsOptional, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO pour les paramètres système
 */
export class SystemSettingsDto {
  @ApiPropertyOptional({ example: 500, description: 'Prix du vote en XAF' })
  @IsOptional()
  @IsNumber()
  @Min(100)
  votePrice?: number;

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
