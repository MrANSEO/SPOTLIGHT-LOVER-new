import { IsOptional, IsEnum, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum AnalyticsPeriod {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
  ALL = 'all',
}

export enum AnalyticsMetric {
  VOTES = 'votes',
  REVENUE = 'revenue',
  USERS = 'users',
  CANDIDATES = 'candidates',
}

/**
 * DTO pour les requêtes analytics
 */
export class AnalyticsQueryDto {
  @ApiPropertyOptional({ enum: AnalyticsPeriod, example: AnalyticsPeriod.MONTH })
  @IsOptional()
  @IsEnum(AnalyticsPeriod)
  period?: AnalyticsPeriod;

  @ApiPropertyOptional({ enum: AnalyticsMetric, example: AnalyticsMetric.VOTES })
  @IsOptional()
  @IsEnum(AnalyticsMetric)
  metric?: AnalyticsMetric;

  @ApiPropertyOptional({ example: '2024-01-01' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ example: '2024-12-31' })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
