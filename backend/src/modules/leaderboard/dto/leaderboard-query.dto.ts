import { IsOptional, IsEnum, IsNumber, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum LeaderboardTimeFrame {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  ALL_TIME = 'all_time',
}

export enum LeaderboardSortBy {
  VOTES = 'votes',
  REVENUE = 'revenue',
  POPULARITY = 'popularity',
}

/**
 * DTO pour les requêtes leaderboard
 */
export class LeaderboardQueryDto {
  @ApiPropertyOptional({ enum: LeaderboardTimeFrame, example: LeaderboardTimeFrame.WEEKLY })
  @IsOptional()
  @IsEnum(LeaderboardTimeFrame)
  timeFrame?: LeaderboardTimeFrame;

  @ApiPropertyOptional({ enum: LeaderboardSortBy, example: LeaderboardSortBy.VOTES })
  @IsOptional()
  @IsEnum(LeaderboardSortBy)
  sortBy?: LeaderboardSortBy;

  @ApiPropertyOptional({ example: 10, description: 'Nombre de résultats (1-100)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;
}
