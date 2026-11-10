export type AssistantView = 'idle' | 'summary' | 'talk' | 'help' | 'teach';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  fallback?: boolean;
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

export interface StructuredSummary {
  headline: string;
  totalPending: number;
  criticalCount: number;
  spokenSummary: string;
  items: SummaryPriorityItem[];
  suggestedNextStep: string;
  generatedAt: string;
  promptVersion: string;
  fallback?: boolean;
}

export interface HelpCitation {
  chunkId: string;
  sectionTitle: string;
  similarityScore: number;
  snippet: string;
}

export interface GroundedHelpResult {
  answer: string;
  citations: HelpCitation[];
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

export interface DynamicGreeting {
  greeting: string;
  queueContext: string;
  suggestedPrompt: string;
  promptVersion: string;
  fallback?: boolean;
}

