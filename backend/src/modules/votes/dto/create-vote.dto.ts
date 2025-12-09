import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsIn,
  IsOptional,
  IsPhoneNumber,
  IsEmail,
  MaxLength,
} from 'class-validator';

/**
 * DTO pour la création d'un vote
 * Utilisé lors de l'initialisation du paiement
 */
export class CreateVoteDto {
  /**
   * ID du candidat pour lequel voter
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  @IsUUID()
  @IsNotEmpty()
  candidateId: string;

  /**
   * Méthode de paiement choisie
   * @example "MTN_MOBILE_MONEY"
   */
  @IsIn(['MTN_MOBILE_MONEY', 'ORANGE_MONEY', 'MOOV_MONEY', 'WAVE', 'CARD'])
  @IsNotEmpty()
  paymentMethod: string;

  /**
   * Numéro de téléphone du votant
   * Requis pour MTN_MONEY et ORANGE_MONEY
   * @example "+237677889900"
   */
  @IsOptional()
  @IsPhoneNumber(null)
  phone?: string;

  /**
   * Email du votant
   * Requis pour STRIPE
   * @example "voter@example.com"
   */
  @IsOptional()
  @IsEmail()
  email?: string;

  /**
   * Nom du votant (optionnel)
   * @example "Jean Dupont"
   */
  @IsOptional()
  @IsString()
  @MaxLength(100)
  voterName?: string;

  /**
   * Message du votant au candidat (optionnel)
   * @example "Bravo ! Continue comme ça !"
   */
  @IsOptional()
  @IsString()
  @MaxLength(200)
  message?: string;
}
