import { APP_CONSTANTS } from '../config/constants';
import { PolicyChunk } from '../fixtures/policyDocument';

export const HELP_PROMPT_VERSION = APP_CONSTANTS.PROMPT_VERSIONS.HELP;

export interface HelpPromptVariables {
  question: string;
  retrievedChunks: PolicyChunk[];
}

export function buildHelpPrompt(vars: HelpPromptVariables): {
  systemPrompt: string;
  userPrompt: string;
  version: string;
} {
  const contextText = vars.retrievedChunks
    .map((chunk) => `[Citation: ${chunk.chunkId} - ${chunk.sectionTitle}]\n${chunk.content}`)
    .join('\n\n');

  const systemPrompt = `You are the OomniEye Approvals Policy & Compliance Help Assistant.
Your goal is to answer operator questions grounded STRICTLY in the provided Policy & Compliance excerpts.

RULES:
1. Ground every statement exclusively on the provided context.
2. If the answer cannot be deduced from the provided excerpts, explicitly state: "This question is not covered in the current OomniEye Operational Policy documentation." Do NOT invent policies or hallucinate external knowledge.
3. Explicitly mention section references (e.g. "Per Section 2...").`;

  const userPrompt = `Policy Context:
${contextText}

Operator Question:
${vars.question}

Please provide an operational, policy-grounded answer with citations:`;

  return {
    systemPrompt,
    userPrompt,
    version: HELP_PROMPT_VERSION,
  };
}

