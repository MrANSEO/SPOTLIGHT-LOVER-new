import { IsOptional, IsString, IsInt, Min, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryCandidatesDto {
  @IsOptional()
  @IsString()
  @IsIn(['PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED'], { message: 'Status invalide' })
  status?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  search?: string; // Recherche par nom

  @IsOptional()
  @IsString()
  @IsIn(['totalVotes', 'createdAt', 'name'], { message: 'Tri invalide' })
  sortBy?: string = 'totalVotes';

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'], { message: 'Ordre invalide' })
  order?: 'asc' | 'desc' = 'desc';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;
}
