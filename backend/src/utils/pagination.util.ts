import { PaginationMeta } from '../common/interfaces/pagination.interface';

/**
 * Calculer les métadonnées de pagination
 */
export function calculatePaginationMeta(
  total: number,
  page: number,
  limit: number,
): PaginationMeta {
  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Calculer le skip pour Prisma
 */
export function calculateSkip(page: number, limit: number): number {
  return (page - 1) * limit;
}

/**
 * Valider les paramètres de pagination
 */
export function validatePaginationParams(page?: number, limit?: number): {
  page: number;
  limit: number;
} {
  const validatedPage = page && page > 0 ? page : 1;
  const validatedLimit = limit && limit > 0 && limit <= 100 ? limit : 20;

  return {
    page: validatedPage,
    limit: validatedLimit,
  };
}
