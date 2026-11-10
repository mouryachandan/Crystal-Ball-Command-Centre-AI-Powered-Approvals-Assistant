import rateLimit from 'express-rate-limit';
import { env } from '../config/env';

/**
 * AI Endpoints Rate Limiter.
 * Protects server-side LLM inference budgets against abuse or runaway client loops.
 * Employs standard IP/Session throttling with detailed retry-after headers.
 */
export const aiRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS, // Default: 60 seconds
  max: env.RATE_LIMIT_MAX_REQUESTS, // Default: 60 requests per window
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  message: {
    status: 'error',
    code: 'RATE_LIMIT_EXCEEDED',
    message: 'Rate limit exceeded on AI endpoint. Please slow down your requests.',
    retryAfterSeconds: Math.ceil(env.RATE_LIMIT_WINDOW_MS / 1000),
  },
});

