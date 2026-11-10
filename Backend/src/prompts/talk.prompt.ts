import { ApprovalItem } from '../types/approvals.types';
import { APP_CONSTANTS } from '../config/constants';

export const TALK_PROMPT_VERSION = APP_CONSTANTS.PROMPT_VERSIONS.TALK;

export interface TalkPromptVariables {
  queueItems: ApprovalItem[];
}

export function buildTalkSystemPrompt(vars: TalkPromptVariables): {
  systemPrompt: string;
  version: string;
} {
  const queueOverview = vars.queueItems
    .map(
      (item) =>
        `- [${item.id}] ${item.name} (${item.type}, Priority: ${item.priority}, Submitted By: ${item.submittedBy}, Status: ${item.status}): ${item.description}`
    )
    .join('\n');

  const systemPrompt = `You are the OomniEye Digital Twin Approvals Copilot.
You assist facility operators with questions about their active approvals queue.

Current Operational Queue:
${queueOverview}

Guidelines:
1. Speak with precision, professional authority, and operational directness.
2. If asked "which of these needs my attention first and why?", point directly to the Level 2 Drone Patrol Video Demo due to active geofence aerial risk, followed by Site Patrol Onboarding.
3. Be concise: keep responses focused on actionable next steps without excessive filler.
4. Support follow-up questions about approval criteria, technical specs, or operator responsibilities.`;

  return {
    systemPrompt,
    version: TALK_PROMPT_VERSION,
  };
}

