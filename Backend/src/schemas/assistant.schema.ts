import { z } from 'zod';

// ============================================================================
// 1. PRESENT ME SUMMARY SCHEMA
// ============================================================================
export const SummaryRequestSchema = z.object({
  language: z.string().default('en'),
  operatorId: z.string().optional().default('operator-1'),
});

export const SummaryPriorityItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  submittedBy: z.string(),
  urgency: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']),
  recommendedAction: z.string(),
  reason: z.string(),
});

export const SummaryResponseSchema = z.object({
  headline: z.string(),
  totalPending: z.number().int().nonnegative(),
  criticalCount: z.number().int().nonnegative(),
  spokenSummary: z.string(),
  items: z.array(SummaryPriorityItemSchema),
  suggestedNextStep: z.string(),
  generatedAt: z.string(),
  promptVersion: z.string(),
  fallback: z.boolean().optional(),
});

// ============================================================================
// 2. TALK TO ME SCHEMA (Multi-turn conversation)
// ============================================================================
export const ChatMessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string().min(1),
  timestamp: z.string().optional(),
});

export const TalkRequestSchema = z.object({
  messages: z.array(ChatMessageSchema).min(1),
  stream: z.boolean().default(true),
});

// ============================================================================
// 3. HELP ME SCHEMA (RAG Grounded Q&A)
// ============================================================================
export const HelpRequestSchema = z.object({
  question: z.string().min(2, 'Question must be at least 2 characters long'),
});

export const HelpCitationSchema = z.object({
  chunkId: z.string(),
  sectionTitle: z.string(),
  similarityScore: z.number(),
  snippet: z.string(),
});

export const HelpResponseSchema = z.object({
  answer: z.string(),
  citations: z.array(HelpCitationSchema),
  confidence: z.number(),
  promptVersion: z.string(),
  fallback: z.boolean().optional(),
});

// ============================================================================
// 4. TEACH ME SCHEMA (Step-by-step Operator Walkthrough)
// ============================================================================
export const TeachRequestSchema = z.object({
  currentStep: z.number().int().min(1).default(1),
  userQuestion: z.string().optional(),
});

export const TeachResponseSchema = z.object({
  stepNumber: z.number().int().min(1),
  totalSteps: z.number().int().min(1),
  stepTitle: z.string(),
  instruction: z.string(),
  operatorChecklist: z.array(z.string()),
  tipForOperator: z.string(),
  promptVersion: z.string(),
  fallback: z.boolean().optional(),
});

// ============================================================================
// 5. REPLAY GREETING SCHEMA
// ============================================================================
export const GreetingRequestSchema = z.object({
  operatorName: z.string().default('Operator'),
});

export const GreetingResponseSchema = z.object({
  greeting: z.string(),
  queueContext: z.string(),
  suggestedPrompt: z.string(),
  promptVersion: z.string(),
  fallback: z.boolean().optional(),
});

