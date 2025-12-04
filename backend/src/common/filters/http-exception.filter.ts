import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Filtre global pour gérer les exceptions HTTP
 * Formatte les erreurs de manière uniforme
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message:
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).message || 'Une erreur est survenue',
      error:
        typeof exceptionResponse === 'string'
          ? undefined
          : (exceptionResponse as any).error,
    };

    // Logger les erreurs serveur (5xx)
    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `${request.method} ${request.url}`,
        JSON.stringify(errorResponse),
        exception.stack,
      );
    } else {
      this.logger.warn(`${request.method} ${request.url}`, JSON.stringify(errorResponse));
    }

    response.status(status).json(errorResponse);
  }
}
