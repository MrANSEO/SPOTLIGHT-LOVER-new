import { IsString, Length } from 'class-validator';

export class Enable2FADto {
  @IsString()
  @Length(6, 6, { message: 'Le code 2FA doit contenir 6 chiffres' })
  token: string;
}

export class Verify2FADto {
  @IsString()
  @Length(6, 6, { message: 'Le code 2FA doit contenir 6 chiffres' })
  token: string;
}
