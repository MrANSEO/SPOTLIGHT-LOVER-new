import { IsString, IsNumber, IsOptional, IsObject } from 'class-validator';

/**
 * DTO pour le webhook MeSomb
 * Format basé sur la réponse webhook de MeSomb
 */
export class MeSombWebhookDto {
  @IsString()
  @IsOptional()
  pk?: string; // Transaction ID (primary key)

  @IsString()
  @IsOptional()
  reference?: string; // Notre référence de transaction

  @IsString()
  @IsOptional()
  status?: string; // SUCCESS, FAILED, PENDING

  @IsNumber()
  @IsOptional()
  amount?: number;

  @IsString()
  @IsOptional()
  service?: string; // MTN ou ORANGE

  @IsString()
  @IsOptional()
  payer?: string; // Numéro de téléphone du payeur

  @IsString()
  @IsOptional()
  currency?: string; // XAF

  @IsString()
  @IsOptional()
  country?: string; // CM

  @IsString()
  @IsOptional()
  message?: string;

  @IsString()
  @IsOptional()
  b_party?: string; // Merchant number

  @IsString()
  @IsOptional()
  c_party?: string; // Customer number

  @IsString()
  @IsOptional()
  type?: string; // payment, deposit, etc.

  @IsString()
  @IsOptional()
  direction?: string; // incoming, outgoing

  @IsString()
  @IsOptional()
  fees?: string;

  @IsString()
  @IsOptional()
  ts?: string; // Timestamp

  @IsObject()
  @IsOptional()
  transaction?: any; // Transaction complète object

  // Index signature pour propriétés additionnelles (sans décorateurs)
  [key: string]: any;
}
