import { IsString, IsInt, Min, Max, MaxLength, IsUrl, IsOptional, Matches } from 'class-validator';

export class CreateCandidateDto {
  @IsString({ message: 'Le nom est requis' })
  @MaxLength(100, { message: 'Le nom ne doit pas dépasser 100 caractères' })
  name: string;

  @IsInt({ message: 'L\'âge doit être un nombre entier' })
  @Min(18, { message: 'L\'âge minimum est 18 ans' })
  @Max(99, { message: 'L\'âge maximum est 99 ans' })
  age: number;

  @IsString({ message: 'Le pays est requis' })
  @MaxLength(100, { message: 'Le pays ne doit pas dépasser 100 caractères' })
  country: string;

  @IsString({ message: 'La ville est requise' })
  @MaxLength(100, { message: 'La ville ne doit pas dépasser 100 caractères' })
  city: string;

  @IsString({ message: 'La bio est requise' })
  @MaxLength(200, { message: 'La bio ne doit pas dépasser 200 caractères' })
  bio: string;

  @IsUrl({}, { message: 'URL vidéo invalide' })
  videoUrl: string;

  @IsOptional()
  @IsString()
  videoPublicId?: string;

  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @IsOptional()
  @IsInt()
  videoDuration?: number;

  @IsOptional()
  @IsString()
  videoFormat?: string;

  @IsOptional()
  @IsInt()
  videoSize?: number;

  // Réseaux sociaux (optionnels)
  @IsOptional()
  @IsString()
  @Matches(/^@?[\w.]+$/, { message: 'Handle Instagram invalide (ex: @username ou username)' })
  instagramHandle?: string;

  @IsOptional()
  @IsString()
  @Matches(/^@?[\w.]+$/, { message: 'Handle TikTok invalide (ex: @username ou username)' })
  tiktokHandle?: string;

  @IsOptional()
  @IsString()
  @Matches(/^@?[\w.]+$/, { message: 'Handle YouTube invalide (ex: @username ou username)' })
  youtubeHandle?: string;
}
