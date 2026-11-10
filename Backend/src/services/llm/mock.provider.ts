import { ILlmProvider, LlmCompletionOptions, LlmStreamCallbacks } from './llm.interface';
import { ChatMessage } from '../../types/assistant.types';

export class MockLlmProvider implements ILlmProvider {
  public readonly name = 'mock';

  async generateText(prompt: string, _options?: LlmCompletionOptions): Promise<string> {
    // 1. Present me Summary
    if (prompt.includes('Current Approvals Queue') || prompt.includes('structured JSON summary')) {
      return JSON.stringify({
        headline: 'Queue Alert: 4 Submissions Pending — 1 Critical Drone Patrol Requires Immediate Sign-Off',
        totalPending: 4,
        criticalCount: 1,
        spokenSummary:
          'Good day Operator. You have four items pending review in your command queue. The highest priority item is Alex HelpAdmin\'s Level 2 Drone Patrol Video Demo, which requires immediate flight boundary verification. Sam HelpAdmin has submitted Site Patrol Checklists and Sensor Specs, and Elena HelpAdmin submitted the 360 Spatial Camera Map. I recommend clearing the drone video first to maintain perimeter surveillance compliance.',
        items: [
          {
            id: 'appr-002',
            name: 'Level 2 Drone Patrol Video Demo',
            type: 'Video',
            submittedBy: 'Alex HelpAdmin',
            urgency: 'CRITICAL',
            recommendedAction: 'Verify geofence boundary & approve flight log',
            reason: 'Active perimeter surveillance automation cannot proceed without approved collision tolerance.',
          },
          {
            id: 'appr-001',
            name: 'Site Patrol Onboarding & Checklists',
            type: 'Folder',
            submittedBy: 'Sam HelpAdmin',
            urgency: 'HIGH',
            recommendedAction: 'Review emergency technician check-in steps',
            reason: 'Regional field operations require signed SOPs prior to shift rotation.',
          },
          {
            id: 'appr-003',
            name: 'Safety Equipment & Sensor Specs',
            type: 'Pdf',
            submittedBy: 'Sam HelpAdmin',
            urgency: 'MEDIUM',
            recommendedAction: 'Cross-reference ISO-9001 and calibration validity',
            reason: 'Vibration and thermal sensor specs within standard 180-day calibration window.',
          },
          {
            id: 'appr-004',
            name: '360° Spatial Zone Layout & Camera Map',
            type: 'Image',
            submittedBy: 'Elena HelpAdmin',
            urgency: 'MEDIUM',
            recommendedAction: 'Inspect Zone 4 CCTV blindness overlays',
            reason: 'Ensure 98% overlap across egress walkways before site sign-off.',
          },
        ],
        suggestedNextStep: 'Open item appr-002 (Level 2 Drone Patrol Video Demo) in Snapshot & Control view.',
      });
    }

    // 2. Help Me (RAG Grounded Q&A)
    if (prompt.includes('Policy Context:') || prompt.includes('Policy & Compliance')) {
      const pLower = prompt.toLowerCase();
      if (pLower.includes('drone') || pLower.includes('flight') || pLower.includes('altitude')) {
        return 'Per Section 2 of OomniEye Operational Standards, Level 2 Drone Patrol Video submissions are designated CRITICAL priority. Operators must verify continuous optical feed integrity, confirm altitude compliance under 120m AGL, and ensure absence of active geofence breaches. If safety margins are under 5 meters from live infrastructure, approval must be withheld until manual flight logs are verified.';
      }
      if (pLower.includes('sensor') || pLower.includes('vibration') || pLower.includes('calibration') || pLower.includes('iso')) {
        return 'Per Section 3 of OomniEye Operational Standards, safety equipment and IoT sensor technical specifications require dual validation: verify ISO-9001/ATEX explosive atmosphere certifications and calibration timestamps within the last 180 days. Sensor accuracy tolerances exceeding +/- 2.5% must be flagged for vendor recalibration prior to operational commissioning.';
      }
      if (pLower.includes('spatial') || pLower.includes('zone') || pLower.includes('camera') || pLower.includes('blindness')) {
        return 'Per Section 4 of OomniEye Operational Standards, operators reviewing 360-degree spatial layout blueprints and camera map overlays must confirm zero camera blindness along primary emergency ingress and egress paths. LiDAR spatial coverage must achieve 98% overlap across high-density zone intersections.';
      }
      // General SLA / policy answer
      return 'Per Section 1 of OomniEye Operational Standards, all pending submissions within the Command Centre must be acted upon within a 24-hour operational window. Approvals and rejections submitted by Help Admin or Senior Operators are final and directly synchronise with digital-twin edge controllers. Incomplete submissions must be rejected with detailed revision notes rather than placed on hold.';
    }

    // 3. Teach Me
    if (prompt.includes('Standardized 4-Step Approval Lifecycle') || prompt.includes('Current Step:')) {
      let stepNum = 1;
      if (prompt.includes('Current Step: 2')) stepNum = 2;
      else if (prompt.includes('Current Step: 3')) stepNum = 3;
      else if (prompt.includes('Current Step: 4')) stepNum = 4;

      const steps: Record<number, { title: string; instruction: string; checklist: string[]; tip: string }> = {
        1: {
          title: 'Step 1: Inspect Queue & Urgency Level',
          instruction:
            'Scan your Pending Approval Requests table. Identify incoming asset classifications (Folder, Video, PDF, Image) and review submission age. Always evaluate CRITICAL items like drone flight feeds or emergency checklists first.',
          checklist: [
            'Filter queue by urgency or submission date',
            'Check for flagged geofence or safety anomalies',
            'Ensure turnaround remains within the 24-hour SLA window',
          ],
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

      const s = steps[stepNum] || steps[1]!;

      return JSON.stringify({
        stepNumber: stepNum,
        totalSteps: 4,
        stepTitle: s.title,
        instruction: s.instruction,
        operatorChecklist: s.checklist,
        tipForOperator: s.tip,
      });
    }

    // 4. Greeting
    if (prompt.includes('generate a dynamic, context-aware greeting') || prompt.includes('Operator:')) {
      return JSON.stringify({
        greeting:
          'Welcome back, Operator. You have 4 pending approval requests awaiting action, including 1 critical perimeter drone patrol flight.',
        queueContext: '4 items pending | 1 CRITICAL (Drone Patrol) | SLA: 18h remaining',
        suggestedPrompt: 'Which of these needs my attention first and why?',
      });
    }

    return 'OomniEye Command Centre Assistant standing by. How can I assist with your approvals queue?';
  }

  async generateChat(messages: ChatMessage[], options?: LlmCompletionOptions): Promise<string> {
    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user')?.content || '';
    return this.generateText(lastUserMessage, options);
  }

  async streamChat(
    messages: ChatMessage[],
    callbacks: LlmStreamCallbacks,
    options?: LlmCompletionOptions
  ): Promise<string> {
    const lastMessage = [...messages].reverse().find((m) => m.role === 'user')?.content.toLowerCase() || '';

    let responseText =
      'Based on the current approvals queue, you have 4 pending items. The item that requires your immediate attention is the Level 2 Drone Patrol Video Demo submitted by Alex HelpAdmin. Drone flights carry active airspace collision risk and automated perimeter geofencing dependencies, so per policy, critical surveillance demo feeds must be validated before routine checklists.';

    if (lastMessage.includes('drone') || lastMessage.includes('alex')) {
      responseText =
        'Alex HelpAdmin submitted the Level 2 Drone Patrol Video Demo on Sep 18. This contains 4K 60fps aerial surveillance testing automated perimeter boundary sweeps. You must confirm altitude stays below 120m and no geofence alarms were tripped during the test.';
    } else if (lastMessage.includes('sam') || lastMessage.includes('patrol') || lastMessage.includes('checklist')) {
      responseText =
        'Sam HelpAdmin submitted two items: Site Patrol Onboarding & Checklists (Folder) and Safety Equipment & Sensor Specs (PDF). The checklists cover field technician emergency check-in protocols. Both are in good order and standard 24h SLA applies.';
    } else if (lastMessage.includes('elena') || lastMessage.includes('camera') || lastMessage.includes('360')) {
      responseText =
        'Elena HelpAdmin submitted the 360 Spatial Zone Layout & Camera Map. This is a 12.6 MB panoramic CAD overlay verifying CCTV camera coverage in Zone 4. Check for blind spots along emergency egress corridors.';
    }

    // Stream out words with realistic micro-delays
    const words = responseText.split(' ');
    let accumulated = '';

    for (let i = 0; i < words.length; i++) {
      if (options?.abortSignal?.aborted) {
        throw new Error('Stream aborted');
      }
      const word = (i === 0 ? '' : ' ') + words[i];
      accumulated += word;
      callbacks.onToken(word);
      await new Promise((resolve) => setTimeout(resolve, 25)); // 25ms simulation
    }

    callbacks.onComplete?.(accumulated);
    return accumulated;
  }
}
