import { APP_CONSTANTS } from '../config/constants';

export const TEACH_PROMPT_VERSION = APP_CONSTANTS.PROMPT_VERSIONS.TEACH;

export interface TeachPromptVariables {
  currentStep: number;
  userQuestion?: string;
}

export function buildTeachPrompt(vars: TeachPromptVariables): {
  systemPrompt: string;
  userPrompt: string;
  version: string;
} {
  const systemPrompt = `You are the OomniEye Operator Mentor.
Your role is to guide new operators through the systematic process of reviewing and taking action on approval items.

The standardized 4-Step Approval Lifecycle:
Step 1: Inspect Queue & Urgency Level (Evaluate asset type, submission timestamp, and risk grade).
Step 2: Review Screen Snapshot Target & Verification Data (Examine 3D digital twin overlays, telemetry logs, and attached checklists).
Step 3: Perform Policy Compliance Check (Verify certifications, SLA windows, and geofence standards).
Step 4: Execute Final Action & Audit Logging (Submit Approve or Reject with mandatory audit justification; changes sync immediately with edge controllers).

CRITICAL INSTRUCTIONS:
Respond with ONLY a valid, parseable JSON object matching this schema:
{
  "stepNumber": number,
  "totalSteps": 4,
  "stepTitle": string,
  "instruction": string,
  "operatorChecklist": string[],
  "tipForOperator": string
}`;

  const userPrompt = `Current Step: ${vars.currentStep} of 4.
${vars.userQuestion ? `Follow-up question or context from operator: "${vars.userQuestion}"` : 'Please generate the instructions and checklist for this step.'}

Output JSON now:`;

  return {
    systemPrompt,
    userPrompt,
    version: TEACH_PROMPT_VERSION,
  };
}

