import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ApprovalsWidget } from '../src/components/assistant/ApprovalsWidget';
import { useAssistantStore } from '../src/store/useAssistantStore';

describe('Component Test: ApprovalsWidget', () => {
  beforeEach(() => {
    useAssistantStore.setState({
      isOpen: true,
      isExpanded: false,
      activeView: 'idle',
      messages: [],
      streamingText: '',
      isStreaming: false,
      isLoading: false,
      error: null,
      isFallback: false,
    });
  });

  it('should render the Approvals widget header and 4 action cards', () => {
    render(<ApprovalsWidget />);

    expect(screen.getByText('Approvals')).toBeDefined();
    expect(screen.getByText('Present me Summary')).toBeDefined();
    expect(screen.getByText('Talk to me')).toBeDefined();
    expect(screen.getByText('Help me')).toBeDefined();
    expect(screen.getByText('Teach me')).toBeDefined();
    expect(screen.getByText('Replay Greeting')).toBeDefined();
  });

  it('should allow closing and reopening the widget via close button and FAB', () => {
    render(<ApprovalsWidget />);

    const closeBtn = screen.getByTitle('Close Assistant');
    fireEvent.click(closeBtn);

    // Widget should now show minimized FAB
    expect(screen.getByTitle('Open Approvals AI Assistant')).toBeDefined();
    expect(screen.getByText('ALLCAD')).toBeDefined();

    // Reopen
    const openBtn = screen.getByTitle('Open Approvals AI Assistant');
    fireEvent.click(openBtn);
    expect(screen.getByText('Present me Summary')).toBeDefined();
  });

  it('should switch to TalkView when clicking "Talk to me" card', () => {
    render(<ApprovalsWidget />);

    const talkCard = screen.getByText('Talk to me');
    fireEvent.click(talkCard);

    expect(screen.getByPlaceholderText('Ask anything about the approvals queue...')).toBeDefined();
    expect(screen.getByText('Back to Cards')).toBeDefined();
  });
});

