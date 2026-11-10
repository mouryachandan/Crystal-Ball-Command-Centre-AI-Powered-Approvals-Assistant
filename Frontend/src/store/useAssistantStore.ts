import { create } from 'zustand';
import {
  AssistantView,
  ChatMessage,
  StructuredSummary,
  GroundedHelpResult,
  TeachStepResult,
  DynamicGreeting,
} from '../types/assistant';
import { api } from '../lib/api';

interface AssistantState {
  isOpen: boolean;
  isExpanded: boolean;
  activeView: AssistantView;
  messages: ChatMessage[];
  streamingText: string;
  isStreaming: boolean;
  isLoading: boolean;
  error: string | null;
  isFallback: boolean;

  // Cached response data
  summaryData: StructuredSummary | null;
  helpData: GroundedHelpResult | null;
  teachData: TeachStepResult | null;
  greetingData: DynamicGreeting | null;

  // Actions
  toggleOpen: () => void;
  setOpen: (open: boolean) => void;
  toggleExpand: () => void;
  setActiveView: (view: AssistantView) => void;
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  setStreamingText: (text: string) => void;
  appendStreamingToken: (token: string) => void;
  setIsStreaming: (isStreaming: boolean) => void;
  clearChat: () => void;

  // Async Assistant Operations
  fetchSummary: () => Promise<void>;
  fetchHelp: (question: string) => Promise<void>;
  fetchTeachStep: (step: number, question?: string) => Promise<void>;
  fetchGreeting: (operatorName?: string) => Promise<void>;
}

export const useAssistantStore = create<AssistantState>((set, get) => ({
  isOpen: true,
  isExpanded: false,
  activeView: 'idle',
  messages: [
    {
      id: 'welcome-msg',
      role: 'assistant',
      content:
        'Greetings Operator. I am your Approvals Copilot. 4 requests are pending in your queue, with 1 critical drone perimeter demo. How can I assist you?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ],
  streamingText: '',
  isStreaming: false,
  isLoading: false,
  error: null,
  isFallback: false,
  summaryData: null,
  helpData: null,
  teachData: null,
  greetingData: null,

  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
  setOpen: (open: boolean) => set({ isOpen: open }),
  toggleExpand: () => set((state) => ({ isExpanded: !state.isExpanded })),
  setActiveView: (view: AssistantView) => set({ activeView: view, error: null }),

  addMessage: (message) => {
    const newMessage: ChatMessage = {
      ...message,
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    set((state) => ({ messages: [...state.messages, newMessage] }));
  },

  setStreamingText: (text: string) => set({ streamingText: text }),
  appendStreamingToken: (token: string) =>
    set((state) => ({ streamingText: state.streamingText + token })),
  setIsStreaming: (isStreaming: boolean) => set({ isStreaming }),

  clearChat: () =>
    set({
      messages: [],
      streamingText: '',
      isStreaming: false,
      error: null,
    }),

  fetchSummary: async () => {
    set({ isLoading: true, error: null, activeView: 'summary' });
    try {
      const data = await api.getSummary();
      set({
        summaryData: data,
        isFallback: !!data.fallback,
        isLoading: false,
      });
    } catch (err: unknown) {
      console.warn('Backend summary call failed or offline; activating graceful fallback', err);
      // Graceful fallback summary
      set({
        summaryData: {
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
          generatedAt: new Date().toISOString(),
          promptVersion: 'v1.0.0',
          fallback: true,
        },
        isFallback: true,
        isLoading: false,
      });
    }
  },

  fetchHelp: async (question: string) => {
    set({ isLoading: true, error: null, activeView: 'help' });
    try {
      const data = await api.getHelp(question);
      set({
        helpData: data,
        isFallback: !!data.fallback,
        isLoading: false,
      });
    } catch (err: unknown) {
      console.warn('Backend help call offline; serving grounded fallback citations', err);
      set({
        helpData: {
          answer:
            'Per Section 2 of OomniEye Operational Standards, Level 2 Drone Patrol Video submissions are designated CRITICAL priority. Operators must verify continuous optical feed integrity, confirm altitude compliance under 120m AGL, and verify absence of active geofence breaches. If telemetry shows safety margins under 5 meters from live infrastructure, approval must be withheld until manual flight logs are verified.',
          citations: [
            {
              chunkId: 'policy-sec-2',
              sectionTitle: 'Section 2: Aerial & Drone Patrol Surveillance Standards',
              similarityScore: 0.94,
              snippet:
                'Level 2 Drone Patrol Video submissions are designated CRITICAL priority. Operators must verify continuous optical feed integrity, altitude compliance under 120m AGL...',
            },
          ],
          confidence: 0.94,
          promptVersion: 'v1.0.0',
          fallback: true,
        },
        isFallback: true,
        isLoading: false,
      });
    }
  },

  fetchTeachStep: async (step: number, question?: string) => {
    set({ isLoading: true, error: null, activeView: 'teach' });
    try {
      const data = await api.getTeach(step, question);
      set({
        teachData: data,
        isFallback: !!data.fallback,
        isLoading: false,
      });
    } catch (err: unknown) {
      console.warn('Backend teach step offline; serving structured fallback walkthrough', err);
      const stepsData: Record<number, { title: string; instruction: string; checklist: string[]; tip: string }> = {
        1: {
          title: 'Step 1: Inspect Queue & Urgency Level',
          instruction:
            'Scan your Pending Approval Requests table. Identify incoming asset classifications (Folder, Video, PDF, Image) and review submission age. Always evaluate CRITICAL items like drone flight feeds first.',
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

      const s = stepsData[step] || stepsData[1]!;

      set({
        teachData: {
          stepNumber: step > 4 ? 4 : step < 1 ? 1 : step,
          totalSteps: 4,
          stepTitle: s.title,
          instruction: s.instruction,
          operatorChecklist: s.checklist,
          tipForOperator: s.tip,
          promptVersion: 'v1.0.0',
          fallback: true,
        },
        isFallback: true,
        isLoading: false,
      });
    }
  },

  fetchGreeting: async (operatorName = 'Operator') => {
    set({ isLoading: true, error: null });
    try {
      const data = await api.getGreeting(operatorName);
      set({
        greetingData: data,
        isFallback: !!data.fallback,
        isLoading: false,
      });
    } catch (err: unknown) {
      console.warn('Backend greeting offline; serving context fallback', err);
      set({
        greetingData: {
          greeting: `Welcome back, ${operatorName}. You currently have 4 approvals pending, with 1 critical drone flight review.`,
          queueContext: '4 items pending | 1 CRITICAL (Drone Patrol) | SLA: 18h remaining',
          suggestedPrompt: 'Which of these needs my attention first and why?',
          promptVersion: 'v1.0.0',
          fallback: true,
        },
        isFallback: true,
        isLoading: false,
      });
    }
  },
}));
