import { createApp } from './app';
import { env } from './config/env';
import { logger } from './utils/logger';

const app = createApp();

const server = app.listen(env.PORT, () => {
  logger.info(`🚀 Crystal Ball Command Centre API running on http://localhost:${env.PORT}`);
  logger.info(`🔧 Environment: ${env.NODE_ENV} | Active LLM Provider: ${env.LLM_PROVIDER}`);
  logger.info(`⏱️ LLM Timeout Threshold: ${env.LLM_TIMEOUT_MS}ms (with automatic fallback degradation)`);
});

// Graceful shutdown handling
const shutdown = (signal: string) => {
  logger.info(`Received ${signal}. Shutting down gracefully...`);
  server.close(() => {
    logger.info('Server closed. Process terminated clean.');
    process.exit(0);
  });

  setTimeout(() => {
    logger.error('Forceful shutdown after timeout');
    process.exit(1);
  }, 5000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

