import dotenv from 'dotenv';
import { z } from 'zod';
import { APP_CONSTANTS } from './constants';

dotenv.config();

const envSchema = z.object({
  PORT: z
    .string()
    .default('5000')
    .transform((val) => parseInt(val, 10)),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  CLIENT_ORIGIN: z.string().default('http://localhost:3000'),
  LLM_PROVIDER: z.enum(['mock', 'openai', 'anthropic']).default('mock'),
  OPENAI_API_KEY: z.string().optional().default(''),
  OPENAI_MODEL: z.string().default('gpt-4o'),
  ANTHROPIC_API_KEY: z.string().optional().default(''),
  ANTHROPIC_MODEL: z.string().default('claude-3-5-sonnet-20241022'),
  LLM_TIMEOUT_MS: z
    .string()
    .default(String(APP_CONSTANTS.DEFAULT_TIMEOUT_MS))
    .transform((val) => parseInt(val, 10)),
  RATE_LIMIT_WINDOW_MS: z
    .string()
    .default(String(APP_CONSTANTS.DEFAULT_RATE_LIMIT_WINDOW_MS))
    .transform((val) => parseInt(val, 10)),
  RATE_LIMIT_MAX_REQUESTS: z
    .string()
    .default(String(APP_CONSTANTS.DEFAULT_RATE_LIMIT_MAX))
    .transform((val) => parseInt(val, 10)),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables configuration:', parsed.error.format());
  throw new Error('Environment variables validation failed');
}

export const env = parsed.data;

