import { APP_CONSTANTS } from '../config/constants';
import { QueueSummaryStats } from '../types/approvals.types';

export const GREETING_PROMPT_VERSION = APP_CONSTANTS.PROMPT_VERSIONS.GREETING;

export interface GreetingPromptVariables {
  operatorName: string;
  stats: QueueSummaryStats;
  criticalItemNames: string[];
}

export function buildGreetingPrompt(vars: GreetingPromptVariables): {
  systemPrompt: string;
  userPrompt: string;
  version: string;
} {
  const systemPrompt = `You are the OomniEye Digital Twin Assistant.
Your task is to generate a dynamic, context-aware greeting for the operator opening their Approvals workspace.

Guidelines:
1. Greet the operator professionally.
2. Directly mention that there are ${vars.stats.pendingCount} pending approval requests in the queue.
3. Call out that ${vars.stats.criticalCount} item requires critical attention (specifically: ${vars.criticalItemNames.join(', ')}).
4. Keep the greeting under 3 concise sentences.
5. Return ONLY a valid JSON object matching:
{
  "greeting": string,
  "queueContext": string,
  "suggestedPrompt": string
}`;

  const userPrompt = `Operator: ${vars.operatorName}
Pending items: ${vars.stats.pendingCount}
Critical items: ${vars.criticalItemNames.join(', ')}

Generate greeting JSON now:`;

  return {
    systemPrompt,
    userPrompt,
    version: GREETING_PROMPT_VERSION,
  };
}

