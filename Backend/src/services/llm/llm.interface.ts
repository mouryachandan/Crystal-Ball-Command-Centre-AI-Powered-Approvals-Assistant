import { ChatMessage } from '../../types/assistant.types';

export interface LlmCompletionOptions {
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  timeoutMs?: number;
  abortSignal?: AbortSignal;
}

export interface LlmStreamCallbacks {
  onToken: (token: string) => void;
  onError?: (err: Error) => void;
  onComplete?: (fullText: string) => void;
}

export interface ILlmProvider {
  name: string;
  generateText: (prompt: string, options?: LlmCompletionOptions) => Promise<string>;
  generateChat: (messages: ChatMessage[], options?: LlmCompletionOptions) => Promise<string>;
  streamChat: (
    messages: ChatMessage[],
    callbacks: LlmStreamCallbacks,
    options?: LlmCompletionOptions
  ) => Promise<string>;
}

