import Anthropic from '@anthropic-ai/sdk';
import { ILlmProvider, LlmCompletionOptions, LlmStreamCallbacks } from './llm.interface';
import { ChatMessage } from '../../types/assistant.types';
import { LlmProviderError, LlmTimeoutError } from '../../utils/errors';
import { env } from '../../config/env';

export class AnthropicProvider implements ILlmProvider {
  public readonly name = 'anthropic';
  private client: Anthropic;
  private model: string;

  constructor(apiKey?: string, model?: string) {
    const key = apiKey || env.ANTHROPIC_API_KEY;
    if (!key) {
      throw new Error('ANTHROPIC_API_KEY is not configured');
    }
    this.client = new Anthropic({ apiKey: key });
    this.model = model || env.ANTHROPIC_MODEL;
  }

  async generateText(prompt: string, options?: LlmCompletionOptions): Promise<string> {
    return this.generateChat([{ role: 'user', content: prompt }], options);
  }

  async generateChat(messages: ChatMessage[], options?: LlmCompletionOptions): Promise<string> {
    const timeout = options?.timeoutMs || env.LLM_TIMEOUT_MS;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const anthropicMessages = messages
        .filter((m) => m.role !== 'system')
        .map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        }));

      const response = await this.client.messages.create(
        {
          model: this.model,
          max_tokens: options?.maxTokens ?? 1024,
          system: options?.systemPrompt,
          messages: anthropicMessages,
          temperature: options?.temperature ?? 0.2,
        },
        { signal: controller.signal }
      );

      const firstBlock = response.content[0];
      if (firstBlock && firstBlock.type === 'text') {
        return firstBlock.text;
      }
      return '';
    } catch (err: unknown) {
      if (err instanceof Error && (err.name === 'AbortError' || controller.signal.aborted)) {
        throw new LlmTimeoutError(`Anthropic call timed out after ${timeout}ms`);
      }
      throw new LlmProviderError(`Anthropic error: ${err instanceof Error ? err.message : String(err)}`);
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
      const anthropicMessages = messages
        .filter((m) => m.role !== 'system')
        .map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        }));

      const stream = await this.client.messages.create(
        {
          model: this.model,
          max_tokens: options?.maxTokens ?? 1024,
          system: options?.systemPrompt,
          messages: anthropicMessages,
          temperature: options?.temperature ?? 0.2,
          stream: true,
        },
        { signal: controller.signal }
      );

      let fullText = '';
      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
          const token = chunk.delta.text;
          fullText += token;
          callbacks.onToken(token);
        }
      }

      callbacks.onComplete?.(fullText);
      return fullText;
    } catch (err: unknown) {
      if (err instanceof Error && (err.name === 'AbortError' || controller.signal.aborted)) {
        const timeoutErr = new LlmTimeoutError(`Anthropic stream timed out after ${timeout}ms`);
        callbacks.onError?.(timeoutErr);
        throw timeoutErr;
      }
      const providerErr = new LlmProviderError(
        `Anthropic stream error: ${err instanceof Error ? err.message : String(err)}`
      );
      callbacks.onError?.(providerErr);
      throw providerErr;
    } finally {
      clearTimeout(timeoutId);
    }
  }
}

