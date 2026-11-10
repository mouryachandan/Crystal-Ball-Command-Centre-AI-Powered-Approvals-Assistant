import { ApprovalItem } from '../types/approvals.types';
import { APP_CONSTANTS } from '../config/constants';

export const SUMMARY_PROMPT_VERSION = APP_CONSTANTS.PROMPT_VERSIONS.SUMMARY;

export interface SummaryPromptVariables {
  queueItems: ApprovalItem[];
  language?: string;
  operatorName?: string;
}

export function buildSummaryPrompt(vars: SummaryPromptVariables): {
  systemPrompt: string;
  userPrompt: string;
  version: string;
} {
  const itemsFormatted = vars.queueItems
    .map(
      (item, idx) =>
        `${idx + 1}. [${item.id}] "${item.name}" | Type: ${item.type} | Priority: ${item.priority} | Submitted By: ${item.submittedBy} | Date: ${item.submittedDate}\n   Summary: ${item.description}`
    )
    .join('\n\n');

  const systemPrompt = `You are the OomniEye Digital Twin Approvals Command Assistant.
Your mission is to analyze the pending approvals queue and produce a prioritized, structured summary for the facility operator.

CRITICAL INSTRUCTIONS:
1. Prioritize items strictly based on operational risk and urgency (e.g., Drone flights and critical safety protocols rank higher than standard documentation).
2. Produce a clear, spoken summary paragraph written directly in an executive, crisp voice for immediate read-aloud playback.
3. You MUST respond with ONLY a valid, parseable JSON object matching the requested schema. No Markdown backticks, no markdown codeblocks, no preamble.

Required JSON Schema:
{
  "headline": string,
  "totalPending": number,
  "criticalCount": number,
  "spokenSummary": string,
  "items": [
    {
      "id": string,
      "name": string,
      "type": string,
      "submittedBy": string,
      "urgency": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
      "recommendedAction": string,
      "reason": string
    }
  ],
  "suggestedNextStep": string
}`;

  const userPrompt = `Current Approvals Queue (${vars.queueItems.length} items):\n\n${itemsFormatted}\n\nLanguage: ${vars.language || 'en'}\nPlease analyze and output the structured JSON summary now.`;

  return {
    systemPrompt,
    userPrompt,
    version: SUMMARY_PROMPT_VERSION,
  };
}

