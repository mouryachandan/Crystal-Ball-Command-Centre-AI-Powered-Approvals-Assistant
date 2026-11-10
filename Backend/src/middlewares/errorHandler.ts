import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError } from '../utils/errors';
import { logger } from '../utils/logger';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof ValidationError) {
    res.status(err.statusCode).json({
      status: 'fail',
      code: 'VALIDATION_ERROR',
      message: err.message,
      errors: err.errors,
    });
    return;
  }

  if (err instanceof AppError) {
    logger.warn(`Operational Error: ${err.message}`, { statusCode: err.statusCode });
    res.status(err.statusCode).json({
      status: 'error',
      code: err.constructor.name,
      message: err.message,
    });
    return;
  }

  logger.error('Unhandled Server Exception:', err);
  res.status(500).json({
    status: 'error',
    code: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected internal error occurred. Please contact system support.',
  });
};

