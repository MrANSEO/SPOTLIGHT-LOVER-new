import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString({ message: 'L\'ancien mot de passe doit être une chaîne de caractères' })
  @MinLength(6, { message: 'L\'ancien mot de passe doit contenir au moins 6 caractères' })
  oldPassword: string;

  @IsString({ message: 'Le nouveau mot de passe doit être une chaîne de caractères' })
  @MinLength(6, { message: 'Le nouveau mot de passe doit contenir au moins 6 caractères' })
  newPassword: string;
}
