export type AssistantAction = 'summary' | 'talk' | 'help' | 'teach' | 'greeting';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
}

export interface SummaryPriorityItem {
  id: string;
  name: string;
  type: string;
  submittedBy: string;
  urgency: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  recommendedAction: string;
  reason: string;
}

export interface StructuredSummaryResult {
  headline: string;
  totalPending: number;
  criticalCount: number;
  spokenSummary: string; // Tailored for operator read-aloud
  items: SummaryPriorityItem[];
  suggestedNextStep: string;
  generatedAt: string;
  promptVersion: string;
  fallback?: boolean;
}

export interface HelpGroundedResult {
  answer: string;
  citations: Array<{
    chunkId: string;
    sectionTitle: string;
    similarityScore: number;
    snippet: string;
  }>;
  confidence: number;
  promptVersion: string;
  fallback?: boolean;
}

export interface TeachStepResult {
  stepNumber: number;
  totalSteps: number;
  stepTitle: string;
  instruction: string;
  operatorChecklist: string[];
  tipForOperator: string;
  promptVersion: string;
  fallback?: boolean;
}

export interface GreetingResult {
  greeting: string;
  queueContext: string;
  suggestedPrompt: string;
  promptVersion: string;
  fallback?: boolean;
}

