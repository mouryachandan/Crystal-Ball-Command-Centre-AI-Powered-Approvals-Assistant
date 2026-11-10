export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  public readonly errors: unknown;

  constructor(message: string, errors: unknown) {
    super(message, 400);
    this.errors = errors;
  }
}

export class LlmTimeoutError extends AppError {
  constructor(message = 'LLM request timed out after 8000ms threshold') {
    super(message, 504);
  }
}

export class LlmProviderError extends AppError {
  constructor(message: string, statusCode = 502) {
    super(message, statusCode);
  }
}

