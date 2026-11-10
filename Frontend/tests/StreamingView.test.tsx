import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { TalkView } from '../src/components/assistant/TalkView';
import { SummaryView } from '../src/components/assistant/SummaryView';
import { useAssistantStore } from '../src/store/useAssistantStore';

describe('Component Test: Assistant Views (Loading, Streaming, and Fallback States)', () => {
  beforeEach(() => {
    useAssistantStore.setState({
      isOpen: true,
      activeView: 'talk',
      messages: [],
      streamingText: '',
      isStreaming: false,
      isLoading: false,
      error: null,
      isFallback: false,
      summaryData: null,
    });
  });

  it('should render active streaming token feedback in TalkView', () => {
    useAssistantStore.setState({
      activeView: 'talk',
      isStreaming: true,
      streamingText: 'The Level 2 Drone Patrol Video Demo requires immediate...',
    });

    render(<TalkView />);

    expect(screen.getByText(/Streaming response token-by-token/i)).toBeDefined();
    expect(
      screen.getByText('The Level 2 Drone Patrol Video Demo requires immediate...')
    ).toBeDefined();
  });

  it('should visibly render fallback banner when graceful degradation is active in SummaryView', () => {
    useAssistantStore.setState({
      activeView: 'summary',
      isFallback: true,
      isLoading: false,
      summaryData: {
        headline: 'Offline/Fallback Summary: 4 Pending Items in Queue',
        totalPending: 4,
        criticalCount: 1,
        spokenSummary: 'Attention Operator: The AI layer is in fallback mode.',
        items: [
          {
            id: 'appr-002',
            name: 'Level 2 Drone Patrol Video Demo',
            type: 'Video',
            submittedBy: 'Alex HelpAdmin',
            urgency: 'CRITICAL',
            recommendedAction: 'Inspect geofence margins',
            reason: 'Active perimeter test',
          },
        ],
        suggestedNextStep: 'Check drone flight',
        generatedAt: new Date().toISOString(),
        promptVersion: 'v1.0.0',
        fallback: true,
      },
    });

    render(<SummaryView />);

    expect(screen.getByText(/Offline Fallback Engaged:/i)).toBeDefined();
    expect(screen.getByText('Offline/Fallback Summary: 4 Pending Items in Queue')).toBeDefined();
    expect(screen.getByText('CRITICAL')).toBeDefined();
  });

  it('should display loading spinner in SummaryView while AI layer is processing', () => {
    useAssistantStore.setState({
      activeView: 'summary',
      isLoading: true,
      summaryData: null,
    });

    render(<SummaryView />);

    expect(screen.getByText(/Analyzing approvals queue urgency.../i)).toBeDefined();
  });
});

