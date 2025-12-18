import { IsString, IsEmail, IsOptional, IsBoolean, IsIn, IsEnum } from 'class-validator';
import { UserType } from 'src/types/enums';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO pour la mise à jour d'un user
 */
export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'user@spotlightlover.cm' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: 'John Doe' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: '+237677889900' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ enum: UserType, example: UserType.USER })
  @IsEnum(UserType)
  @IsOptional()
  userType?: string; // 'USER' | 'CANDIDATE' | 'ADMIN' | 'MODERATOR'

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
