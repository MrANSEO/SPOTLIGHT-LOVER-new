import { IsString, IsEmail, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { AdminRole } from '@prisma/client';

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

  @ApiPropertyOptional({ enum: AdminRole, example: AdminRole.MODERATOR })
  @IsEnum(AdminRole)
  @IsOptional()
  role?: AdminRole;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
