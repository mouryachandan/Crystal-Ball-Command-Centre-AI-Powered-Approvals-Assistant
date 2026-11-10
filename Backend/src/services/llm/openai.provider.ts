import OpenAI from 'openai';
import { ILlmProvider, LlmCompletionOptions, LlmStreamCallbacks } from './llm.interface';
import { ChatMessage } from '../../types/assistant.types';
import { LlmProviderError, LlmTimeoutError } from '../../utils/errors';
import { env } from '../../config/env';

export class OpenAiProvider implements ILlmProvider {
  public readonly name = 'openai';
  private client: OpenAI;
  private model: string;

  constructor(apiKey?: string, model?: string) {
    const key = apiKey || env.OPENAI_API_KEY;
    if (!key) {
      throw new Error('OPENAI_API_KEY is not configured');
    }
    this.client = new OpenAI({ apiKey: key });
    this.model = model || env.OPENAI_MODEL;
  }

  async generateText(prompt: string, options?: LlmCompletionOptions): Promise<string> {
    return this.generateChat([{ role: 'user', content: prompt }], options);
  }

  async generateChat(messages: ChatMessage[], options?: LlmCompletionOptions): Promise<string> {
    const timeout = options?.timeoutMs || env.LLM_TIMEOUT_MS;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const openAiMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [];

      if (options?.systemPrompt) {
        openAiMessages.push({ role: 'system', content: options.systemPrompt });
      }

      for (const m of messages) {
        openAiMessages.push({ role: m.role, content: m.content });
      }

      const response = await this.client.chat.completions.create(
        {
          model: this.model,
          messages: openAiMessages,
          temperature: options?.temperature ?? 0.2,
          max_tokens: options?.maxTokens ?? 1000,
        },
        { signal: controller.signal }
      );

      return response.choices[0]?.message?.content || '';
    } catch (err: unknown) {
      if (err instanceof Error && (err.name === 'AbortError' || controller.signal.aborted)) {
        throw new LlmTimeoutError(`OpenAI call timed out after ${timeout}ms`);
      }
      throw new LlmProviderError(`OpenAI error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async streamChat(
    messages: ChatMessage[],
    callbacks: LlmStreamCallbacks,
    options?: LlmCompletionOptions
  ): Promise<string> {
    const timeout = options?.timeoutMs || env.LLM_TIMEOUT_MS;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const openAiMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [];
      if (options?.systemPrompt) {
        openAiMessages.push({ role: 'system', content: options.systemPrompt });
      }
      for (const m of messages) {
        openAiMessages.push({ role: m.role, content: m.content });
      }

      const stream = await this.client.chat.completions.create(
        {
          model: this.model,
          messages: openAiMessages,
          temperature: options?.temperature ?? 0.2,
          max_tokens: options?.maxTokens ?? 1000,
          stream: true,
        },
        { signal: controller.signal }
      );

      let fullText = '';
      for await (const chunk of stream) {
        const token = chunk.choices[0]?.delta?.content || '';
        if (token) {
          fullText += token;
          callbacks.onToken(token);
        }
      }

      callbacks.onComplete?.(fullText);
      return fullText;
    } catch (err: unknown) {
      if (err instanceof Error && (err.name === 'AbortError' || controller.signal.aborted)) {
        const timeoutErr = new LlmTimeoutError(`OpenAI stream timed out after ${timeout}ms`);
        callbacks.onError?.(timeoutErr);
        throw timeoutErr;
      }
      const providerErr = new LlmProviderError(`OpenAI stream error: ${err instanceof Error ? err.message : String(err)}`);
      callbacks.onError?.(providerErr);
      throw providerErr;
    } finally {
      clearTimeout(timeoutId);
    }
  }
}

