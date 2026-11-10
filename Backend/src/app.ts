import express, { Express } from 'express';
import cors from 'cors';
import { env } from './config/env';
import { apiRouter } from './routes';
import { errorHandler } from './middlewares/errorHandler';
import { requestLogger } from './middlewares/requestLogger';
import { AppError } from './utils/errors';

export function createApp(): Express {
  const app = express();

  // Cross-Origin Resource Sharing
  app.use(
    cors({
      origin: [env.CLIENT_ORIGIN, 'http://localhost:3000', 'http://127.0.0.1:3000'],
      credentials: true,
      methods: ['GET', 'POST', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // Body parser
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Audit Request Logger
  app.use(requestLogger);

  // Mount API Routes
  app.use('/api', apiRouter);

  // 404 handler for undefined routes
  app.use((req, _res, next) => {
    next(new AppError(`Endpoint ${req.method} ${req.originalUrl} not found`, 404));
  });

  // Global Error Handler
  app.use(errorHandler);

  return app;
}

