import { describe, it, expect, jest } from '@jest/globals';
import { buildSummaryPrompt, buildHelpPrompt } from '../../src/prompts';
import { MOCK_APPROVAL_QUEUE } from '../../src/fixtures/mockQueue';
import { OPERATIONAL_POLICY_CHUNKS } from '../../src/fixtures/policyDocument';
import { AssistantService } from '../../src/services/assistant.service';
import { LlmFactory } from '../../src/services/llm/llm.factory';
import { ILlmProvider } from '../../src/services/llm/llm.interface';

describe('Unit Test: Prompt Engineering & Response Validation', () => {
  it('should build a versioned summary prompt with strict JSON instructions', () => {
    const prompt = buildSummaryPrompt({ queueItems: MOCK_APPROVAL_QUEUE, language: 'en' });

    expect(prompt.version).toBe('v1.0.0');
    expect(prompt.systemPrompt).toContain('You are the OomniEye Digital Twin Approvals Command Assistant');
    expect(prompt.systemPrompt).toContain('Required JSON Schema');
    expect(prompt.userPrompt).toContain('Level 2 Drone Patrol Video Demo');
    expect(prompt.userPrompt).toContain('Site Patrol Onboarding & Checklists');
  });

  it('should build a versioned RAG Help prompt with policy citations', () => {
    const prompt = buildHelpPrompt({
      question: 'What is the drone altitude limit?',
      retrievedChunks: [OPERATIONAL_POLICY_CHUNKS[1]!],
    });

    expect(prompt.version).toBe('v1.0.0');
    expect(prompt.systemPrompt).toContain('RULES:');
    expect(prompt.userPrompt).toContain('policy-sec-2');
    expect(prompt.userPrompt).toContain('What is the drone altitude limit?');
  });

  it('should catch invalid LLM JSON response and activate graceful fallback', async () => {
    // Custom mock provider returning broken / non-JSON output
    const brokenLlmProvider: ILlmProvider = {
      name: 'broken-mock',
      generateText: (jest.fn() as any).mockResolvedValue('Oops! I cannot return valid JSON here.'),
      generateChat: (jest.fn() as any).mockResolvedValue(''),
      streamChat: (jest.fn() as any).mockResolvedValue(''),
    };

    LlmFactory.setProvider(brokenLlmProvider);

    const service = new AssistantService();
    const result = await service.generateSummary();

    // Verify graceful fallback
    expect(result.fallback).toBe(true);
    expect(result.totalPending).toBe(4);
    expect(result.items.length).toBe(4);
    expect(result.spokenSummary).toContain(
      'Attention Operator: The AI decision layer is currently operating in fallback mode'
    );
  });

  it('should successfully parse and validate a well-formed LLM response against Zod schema', async () => {
    const validJsonOutput = JSON.stringify({
      headline: '4 Items Pending Review',
      totalPending: 4,
      criticalCount: 1,
      spokenSummary: 'You have 4 items in the queue with 1 critical drone demo.',
      items: [
        {
          id: 'appr-002',
          name: 'Level 2 Drone Patrol Video Demo',
          type: 'Video',
          submittedBy: 'Alex HelpAdmin',
          urgency: 'CRITICAL',
          recommendedAction: 'Verify altitude margins',
          reason: 'Aerial security compliance',
        },
      ],
      suggestedNextStep: 'Review drone video.',
    });

    const goodLlmProvider: ILlmProvider = {
      name: 'good-mock',
      generateText: (jest.fn() as any).mockResolvedValue(validJsonOutput),
      generateChat: (jest.fn() as any).mockResolvedValue(''),
      streamChat: (jest.fn() as any).mockResolvedValue(''),
    };

    LlmFactory.setProvider(goodLlmProvider);

    const service = new AssistantService();
    const result = await service.generateSummary();

    expect(result.fallback).toBe(false);
    expect(result.headline).toBe('4 Items Pending Review');
    expect(result.criticalCount).toBe(1);
    expect(result.promptVersion).toBe('v1.0.0');
  });
});
