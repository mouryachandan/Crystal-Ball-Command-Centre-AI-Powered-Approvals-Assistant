export const APP_CONSTANTS = {
  APP_NAME: 'Crystal Ball Command Centre - Approvals Assistant',
  API_VERSION: 'v1',
  DEFAULT_TIMEOUT_MS: 8000, // 8-second strict timeout requirement
  DEFAULT_RATE_LIMIT_WINDOW_MS: 60 * 1000,
  DEFAULT_RATE_LIMIT_MAX: 60,
  PROMPT_VERSIONS: {
    SUMMARY: 'v1.0.0',
    TALK: 'v1.0.0',
    HELP: 'v1.0.0',
    TEACH: 'v1.0.0',
    GREETING: 'v1.0.0',
  },
} as const;

