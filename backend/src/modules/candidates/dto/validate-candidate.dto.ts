import { IsString, IsOptional, MaxLength, IsEnum } from 'class-validator';

export enum ValidationAction {
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  SUSPEND = 'SUSPEND',
}

export class ValidateCandidateDto {
  @IsEnum(ValidationAction, { message: 'Action invalide' })
  action: ValidationAction;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'La raison ne doit pas dépasser 500 caractères' })
  reason?: string;
}
