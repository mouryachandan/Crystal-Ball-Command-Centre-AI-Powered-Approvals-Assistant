import { LlmFactory } from './llm/llm.factory';
import { RagService } from './rag/rag.service';
import { ApprovalsService } from './approvals.service';
import {
  StructuredSummaryResult,
  HelpGroundedResult,
  TeachStepResult,
  GreetingResult,
  ChatMessage,
} from '../types/assistant.types';
import {
  SummaryResponseSchema,
  HelpResponseSchema,
  TeachResponseSchema,
  GreetingResponseSchema,
} from '../schemas/assistant.schema';
import {
  buildSummaryPrompt,
  buildTalkSystemPrompt,
  buildHelpPrompt,
  buildTeachPrompt,
  buildGreetingPrompt,
} from '../prompts';
import { logger } from '../utils/logger';
import { SseClient } from '../utils/sse';
import { env } from '../config/env';

export class AssistantService {
  private approvalsService: ApprovalsService;
  private ragService: RagService;

  constructor(approvalsService?: ApprovalsService, ragService?: RagService) {
    this.approvalsService = approvalsService || new ApprovalsService();
    this.ragService = ragService || new RagService();
  }

  // ==========================================================================
  // 1. PRESENT ME SUMMARY (Structured JSON with Urgency Prioritization)
  // ==========================================================================
  public async generateSummary(language = 'en'): Promise<StructuredSummaryResult> {
    const queueItems = this.approvalsService.getQueue({ status: 'Pending Review' });
    const { systemPrompt, userPrompt, version } = buildSummaryPrompt({ queueItems, language });
    const llm = LlmFactory.getProvider();

    try {
      const rawOutput = await llm.generateText(userPrompt, {
        systemPrompt,
        timeoutMs: env.LLM_TIMEOUT_MS,
      });

      // Strip markdown block formatting if present
      const cleanJson = rawOutput.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      // Validate structured output with Zod before it leaves the service
      const validated = SummaryResponseSchema.parse({
        ...parsed,
        generatedAt: new Date().toISOString(),
        promptVersion: version,
        fallback: false,
      });

      return validated;
    } catch (err) {
      logger.warn('LLM summary failed or timed out; activating graceful fallback degradation', err);
      return this.getFallbackSummary(version);
    }
  }

  // ==========================================================================
  // 2. TALK TO ME (Multi-turn SSE Streaming)
  // ==========================================================================
  public async streamTalk(messages: ChatMessage[], sse: SseClient): Promise<void> {
    const queueItems = this.approvalsService.getQueue();
    const { systemPrompt } = buildTalkSystemPrompt({ queueItems });
    const llm = LlmFactory.getProvider();

    try {
      await llm.streamChat(
        messages,
        {
          onToken: (token) => {
            sse.sendToken(token);
          },
          onError: (err) => {
            logger.error('Stream chat encountered error', err);
            sse.sendError(
              'The assistant encountered a transient streaming error. Falling back to static queue briefing.',
              true
            );
          },
          onComplete: () => {
            sse.close();
          },
        },
        {
          systemPrompt,
          timeoutMs: env.LLM_TIMEOUT_MS,
        }
      );
    } catch (err) {
      logger.warn('Talk stream aborted or timed out', err);
      sse.sendToken(
        ' [Fallback mode active: 4 pending items in queue. Level 2 Drone Patrol Video requires immediate action due to active aerial perimeter checks.]'
      );
      sse.close();
    }
  }

  // ==========================================================================
  // 3. HELP ME (RAG Grounded Q&A)
  // ==========================================================================
  public async answerHelp(question: string): Promise<HelpGroundedResult> {
    const retrievedChunks = this.ragService.retrieve(question, 2);
    const { systemPrompt, userPrompt, version } = buildHelpPrompt({
      question,
      retrievedChunks,
    });
    const llm = LlmFactory.getProvider();

    const citations = retrievedChunks.map((chunk) => ({
      chunkId: chunk.chunkId,
      sectionTitle: chunk.sectionTitle,
      similarityScore: chunk.similarityScore,
      snippet: chunk.content.slice(0, 140) + '...',
    }));

    try {
      const answer = await llm.generateText(userPrompt, {
        systemPrompt,
        timeoutMs: env.LLM_TIMEOUT_MS,
      });

      const result: HelpGroundedResult = {
        answer: answer.trim(),
        citations,
        confidence: retrievedChunks[0]?.similarityScore || 0.85,
        promptVersion: version,
        fallback: false,
      };

      return HelpResponseSchema.parse(result);
    } catch (err) {
      logger.warn('Help LLM query failed; serving grounded fallback snippet directly', err);
      const topChunk = retrievedChunks[0];
      return {
        answer: topChunk
          ? `[Grounded Policy Snippet - ${topChunk.sectionTitle}]: ${topChunk.content}`
          : 'Please consult standard OomniEye Operating Procedures.',
        citations,
        confidence: 0.75,
        promptVersion: version,
        fallback: true,
      };
    }
  }

  // ==========================================================================
  // 4. TEACH ME (Step-by-step Operator Walkthrough)
  // ==========================================================================
  public async teachOperator(currentStep: number, userQuestion?: string): Promise<TeachStepResult> {
    const { systemPrompt, userPrompt, version } = buildTeachPrompt({
      currentStep,
      userQuestion,
    });
    const llm = LlmFactory.getProvider();

    try {
      const raw = await llm.generateText(userPrompt, {
        systemPrompt,
        timeoutMs: env.LLM_TIMEOUT_MS,
      });

      const cleanJson = raw.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      return TeachResponseSchema.parse({
        ...parsed,
        promptVersion: version,
        fallback: false,
      });
    } catch (err) {
      logger.warn('Teach LLM call failed or timed out; serving structured fallback step', err);
      return this.getFallbackTeachStep(currentStep, version);
    }
  }

  // ==========================================================================
  // 5. REPLAY GREETING (Context-Aware Greeting)
  // ==========================================================================
  public async replayGreeting(operatorName = 'Operator'): Promise<GreetingResult> {
    const stats = this.approvalsService.getStats();
    const criticalItems = this.approvalsService
      .getQueue({ status: 'Pending Review' })
      .filter((i) => i.priority === 'CRITICAL')
      .map((i) => i.name);

    const { systemPrompt, userPrompt, version } = buildGreetingPrompt({
      operatorName,
      stats,
      criticalItemNames: criticalItems,
    });
    const llm = LlmFactory.getProvider();

    try {
      const raw = await llm.generateText(userPrompt, {
        systemPrompt,
        timeoutMs: env.LLM_TIMEOUT_MS,
      });

      const cleanJson = raw.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      return GreetingResponseSchema.parse({
        ...parsed,
        promptVersion: version,
        fallback: false,
      });
    } catch (err) {
      logger.warn('Greeting LLM call timed out or failed; serving context fallback', err);
      return {
        greeting: `Welcome back, ${operatorName}. You currently have ${stats.pendingCount} approvals pending, with ${stats.criticalCount} critical drone flight review.`,
        queueContext: `${stats.pendingCount} pending requests | ${stats.criticalCount} critical`,
        suggestedPrompt: 'Which of these needs my attention first and why?',
        promptVersion: version,
        fallback: true,
      };
    }
  }

  // ==========================================================================
  // FALLBACK DETERMINISTIC RESPONSES (Guarantees zero-500 graceful degradation)
  // ==========================================================================
  private getFallbackSummary(promptVersion: string): StructuredSummaryResult {
    return {
      headline: 'Offline/Fallback Summary: 4 Pending Items in Queue',
      totalPending: 4,
      criticalCount: 1,
      spokenSummary:
        'Attention Operator: The AI decision layer is currently operating in fallback mode. You have 4 pending approvals. The highest priority item is the Level 2 Drone Patrol Video Demo from Alex HelpAdmin. Sam HelpAdmin has submitted Site Patrol Onboarding and Safety Equipment Specs, and Elena HelpAdmin has submitted the 360 Spatial Map. Prioritize reviewing the drone video.',
      items: [
        {
          id: 'appr-002',
          name: 'Level 2 Drone Patrol Video Demo',
          type: 'Video',
          submittedBy: 'Alex HelpAdmin',
          urgency: 'CRITICAL',
          recommendedAction: 'Inspect geofence margins and approve',
          reason: 'Aerial surveillance feed requires flight path clearance.',
        },
        {
          id: 'appr-001',
          name: 'Site Patrol Onboarding & Checklists',
          type: 'Folder',
          submittedBy: 'Sam HelpAdmin',
          urgency: 'HIGH',
          recommendedAction: 'Verify field checklists',
          reason: 'Operator safety protocol compliance.',
        },
        {
          id: 'appr-003',
          name: 'Safety Equipment & Sensor Specs',
          type: 'Pdf',
          submittedBy: 'Sam HelpAdmin',
          urgency: 'MEDIUM',
          recommendedAction: 'Review calibration specs',
          reason: '180-day calibration review.',
        },
        {
          id: 'appr-004',
          name: '360° Spatial Zone Layout & Camera Map',
          type: 'Image',
          submittedBy: 'Elena HelpAdmin',
          urgency: 'MEDIUM',
          recommendedAction: 'Check blind spots',
          reason: 'CCTV Zone 4 coverage validation.',
        },
      ],
      suggestedNextStep: 'Proceed to Level 2 Drone Patrol Video Demo item.',
      generatedAt: new Date().toISOString(),
      promptVersion,
      fallback: true,
    };
  }

  private getFallbackTeachStep(step: number, promptVersion: string): TeachStepResult {
    const steps: Record<number, { title: string; instruction: string; checklist: string[]; tip: string }> = {
      1: {
        title: 'Step 1: Inspect Queue & Urgency Level',
        instruction:
          'Scan your Pending Approval Requests table. Identify incoming asset classifications and review submission age. Always evaluate CRITICAL items like drone flight feeds first.',
        checklist: ['Filter queue by urgency', 'Check for flagged anomalies', 'Verify 24h SLA remaining'],
        tip: 'Pro-tip: Keyboard shortcut "Q" toggles between flat Queue View and Hierarchy View.',
      },
      2: {
        title: 'Step 2: Review Screen Snapshot Target',
        instruction:
          'Open the inspection pane on the right. Inspect the 3D snapshot target, verify camera angles, and review embedded telemetry.',
        checklist: ['Confirm camera ID overlay', 'Check timestamp synchronization', 'Inspect boundary markers'],
        tip: 'Click "Snapshot & Control" to interact with the live digital twin.',
      },
      3: {
        title: 'Step 3: Perform Policy Compliance Check',
        instruction:
          'Cross-reference the submission against OomniEye Operational Standards (e.g., Drone altitude <120m, Sensor calibration <180 days).',
        checklist: ['Verify ISO certifications', 'Confirm geofence clearances', 'Check operator ID'],
        tip: 'Use the "Help me" assistant card if in doubt about specific thresholds.',
      },
      4: {
        title: 'Step 4: Execute Final Action & Audit Logging',
        instruction:
          'Select Approve or Reject. Approvals synchronize directly to edge controllers; rejections require an explicit audit note.',
        checklist: ['Provide clear audit justification for rejections', 'Confirm edge sync trigger'],
        tip: 'Approvals are final and cannot be rolled back without supervisor override.',
      },
    };

    const s = steps[step] || steps[1]!;

    return {
      stepNumber: step > 4 ? 4 : step < 1 ? 1 : step,
      totalSteps: 4,
      stepTitle: s.title,
      instruction: s.instruction,
      operatorChecklist: s.checklist,
      tipForOperator: s.tip,
      promptVersion,
      fallback: true,
    };
  }
}

