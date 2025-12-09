import { IsString, IsEmail, IsOptional, IsBoolean, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO pour la mise à jour d'un admin
 */
export class UpdateAdminDto {
  @ApiPropertyOptional({ example: 'admin@spotlightlover.cm' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: 'Admin Principal' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ enum: ['SUPER_ADMIN', 'MODERATOR'], example: 'MODERATOR' })
  @IsIn(['SUPER_ADMIN', 'MODERATOR'])
  @IsOptional()
  role?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
