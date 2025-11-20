import { IsString, IsOptional, IsEmail, MinLength, IsPhoneNumber } from 'class-validator';

export class UpdateProfileDto {
  @IsEmail({}, { message: 'Email invalide' })
  @IsOptional()
  email?: string;

  @IsString({ message: 'Le nom complet doit être une chaîne de caractères' })
  @MinLength(2, { message: 'Le nom complet doit contenir au moins 2 caractères' })
  @IsOptional()
  fullName?: string;

  @IsString({ message: 'Le téléphone doit être une chaîne de caractères' })
  @IsOptional()
  phone?: string;
}
