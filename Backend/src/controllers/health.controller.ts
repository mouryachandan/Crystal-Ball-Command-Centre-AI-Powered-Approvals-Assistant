import { Request, Response } from 'express';
import { env } from '../config/env';
import { APP_CONSTANTS } from '../config/constants';

export const getHealth = (_req: Request, res: Response): void => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: APP_CONSTANTS.APP_NAME,
    version: APP_CONSTANTS.API_VERSION,
    environment: env.NODE_ENV,
    llmProvider: env.LLM_PROVIDER,
    timeoutMs: env.LLM_TIMEOUT_MS,
  });
};

