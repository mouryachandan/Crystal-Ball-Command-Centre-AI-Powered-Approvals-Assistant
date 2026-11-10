import { describe, it, expect, jest } from '@jest/globals';
import request from 'supertest';
import { createApp } from '../../src/app';
import { LlmFactory } from '../../src/services/llm/llm.factory';
import { ILlmProvider } from '../../src/services/llm/llm.interface';
import { LlmTimeoutError } from '../../src/utils/errors';

describe('Integration Test: Fallback Degradation & Timeout Handling', () => {
  const app = createApp();

  it('should gracefully degrade on LLM timeout without returning a 500 status', async () => {
    // Simulate an LLM call that times out at 8000ms threshold
    const timingOutLlmProvider: ILlmProvider = {
      name: 'timeout-mock',
      generateText: (jest.fn() as any).mockImplementation(() => {
        return Promise.reject(new LlmTimeoutError('Call exceeded 8000ms threshold'));
      }),
      generateChat: (jest.fn() as any).mockImplementation(() => {
        return Promise.reject(new LlmTimeoutError('Call exceeded 8000ms threshold'));
      }),
      streamChat: (jest.fn() as any).mockImplementation(() => {
        return Promise.reject(new LlmTimeoutError('Call exceeded 8000ms threshold'));
      }),
    };

    LlmFactory.setProvider(timingOutLlmProvider);

    // Call summary endpoint
    const res = await request(app)
      .post('/api/assistant/summary')
      .send({ language: 'en' });

    // Must be 200 OK with fallback: true flag, NOT a raw 500 error!
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data.fallback).toBe(true);
    expect(res.body.data.headline).toContain('Offline/Fallback Summary');
    expect(res.body.data.totalPending).toBe(4);
    expect(res.body.data.items[0].urgency).toBe('CRITICAL');
  });

  it('should gracefully degrade on LLM provider outage in Help Me RAG endpoint', async () => {
    const brokenLlmProvider: ILlmProvider = {
      name: 'broken-mock',
      generateText: (jest.fn() as any).mockRejectedValue(new Error('Connection to Anthropic failed')),
      generateChat: (jest.fn() as any).mockRejectedValue(new Error('Connection failed')),
      streamChat: (jest.fn() as any).mockRejectedValue(new Error('Connection failed')),
    };

    LlmFactory.setProvider(brokenLlmProvider);

    const res = await request(app)
      .post('/api/assistant/help')
      .send({ question: 'What is the drone altitude limit?' });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data.fallback).toBe(true);
    expect(res.body.data.answer).toContain('[Grounded Policy Snippet');
    expect(res.body.data.citations.length).toBeGreaterThan(0);
  });
});
