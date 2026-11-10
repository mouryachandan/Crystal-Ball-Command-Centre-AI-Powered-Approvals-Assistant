import { ILlmProvider } from './llm.interface';
import { MockLlmProvider } from './mock.provider';
import { OpenAiProvider } from './openai.provider';
import { AnthropicProvider } from './anthropic.provider';
import { env } from '../../config/env';
import { logger } from '../../utils/logger';

export class LlmFactory {
  private static instance: ILlmProvider | null = null;

  public static getProvider(providerType = env.LLM_PROVIDER): ILlmProvider {
    if (this.instance && this.instance.name === providerType) {
      return this.instance;
    }

    try {
      switch (providerType) {
        case 'openai':
          if (!env.OPENAI_API_KEY) {
            logger.warn('OpenAI API key missing; falling back to Mock provider');
            this.instance = new MockLlmProvider();
          } else {
            this.instance = new OpenAiProvider();
          }
          break;

        case 'anthropic':
          if (!env.ANTHROPIC_API_KEY) {
            logger.warn('Anthropic API key missing; falling back to Mock provider');
            this.instance = new MockLlmProvider();
          } else {
            this.instance = new AnthropicProvider();
          }
          break;

        case 'mock':
        default:
          this.instance = new MockLlmProvider();
          break;
      }
    } catch (err) {
      logger.error('Failed to initialize requested LLM provider; using Mock provider fallback', err);
      this.instance = new MockLlmProvider();
    }

    return this.instance;
  }

  public static setProvider(provider: ILlmProvider): void {
    this.instance = provider;
  }
}

