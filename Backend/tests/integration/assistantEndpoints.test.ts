import { describe, it, expect, beforeAll } from '@jest/globals';
import request from 'supertest';
import { createApp } from '../../src/app';
import { LlmFactory } from '../../src/services/llm/llm.factory';
import { MockLlmProvider } from '../../src/services/llm/mock.provider';

describe('Integration Test: Assistant API Endpoints', () => {
  const app = createApp();

  beforeAll(() => {
    LlmFactory.setProvider(new MockLlmProvider());
  });

  it('GET /api/health should return 200 and healthy status', async () => {
    const res = await request(app).get('/api/health');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
    expect(res.body.timeoutMs).toBe(8000);
  });

  it('GET /api/approvals should return 4 mock queue items', async () => {
    const res = await request(app).get('/api/approvals');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.count).toBe(4);
    expect(res.body.stats.pendingCount).toBe(4);
  });

  it('POST /api/assistant/summary should return structured JSON validated with Zod', async () => {
    const res = await request(app)
      .post('/api/assistant/summary')
      .send({ language: 'en' });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data).toHaveProperty('headline');
    expect(res.body.data).toHaveProperty('spokenSummary');
    expect(res.body.data).toHaveProperty('items');
    expect(res.body.data.items.length).toBeGreaterThan(0);
    expect(res.body.data.promptVersion).toBe('v1.0.0');
  });

  it('POST /api/assistant/help should return RAG grounded response with citations', async () => {
    const res = await request(app)
      .post('/api/assistant/help')
      .send({ question: 'What is the drone flight altitude rule?' });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data).toHaveProperty('answer');
    expect(res.body.data).toHaveProperty('citations');
    expect(res.body.data.citations.length).toBeGreaterThan(0);
  });

  it('POST /api/assistant/teach should return step-by-step guidance', async () => {
    const res = await request(app)
      .post('/api/assistant/teach')
      .send({ currentStep: 1 });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data.stepNumber).toBe(1);
    expect(res.body.data.totalSteps).toBe(4);
    expect(res.body.data.operatorChecklist).toBeInstanceOf(Array);
  });

  it('POST /api/assistant/greeting should return context-aware greeting', async () => {
    const res = await request(app)
      .post('/api/assistant/greeting')
      .send({ operatorName: 'TestOperator' });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data).toHaveProperty('greeting');
    expect(res.body.data).toHaveProperty('queueContext');
  });

  it('POST /api/assistant/summary should reject invalid payload with 400 validation error', async () => {
    const res = await request(app)
      .post('/api/assistant/summary')
      .send({ language: 12345 });

    expect(res.status).toBe(400);
    expect(res.body.code).toBe('VALIDATION_ERROR');
  });
});
