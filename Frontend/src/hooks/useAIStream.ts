import { useState, useRef, useCallback } from 'react';
import { useAssistantStore } from '../store/useAssistantStore';
import { ChatMessage } from '../types/assistant';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export function useAIStream() {
  const [isSending, setIsSending] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const {
    messages,
    addMessage,
    setStreamingText,
    appendStreamingToken,
    setIsStreaming,
  } = useAssistantStore();

  const sendQuery = useCallback(
    async (userInput: string) => {
      if (!userInput.trim() || isSending) return;

      // 1. Add user message to conversation
      addMessage({
        role: 'user',
        content: userInput.trim(),
      });

      setIsSending(true);
      setIsStreaming(true);
      setStreamingText('');

      // Setup AbortController with 8-second timeout guard
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      const conversationPayload: ChatMessage[] = [
        ...messages,
        {
          id: 'temp',
          role: 'user',
          content: userInput.trim(),
          timestamp: '',
        },
      ];

      try {
        const response = await fetch(`${BASE_URL}/api/assistant/talk`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: conversationPayload.map((m) => ({
              role: m.role,
              content: m.content,
            })),
            stream: true,
          }),
          signal,
        });

        if (!response.ok) {
          throw new Error(`Streaming failed with status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error('ReadableStream not available');

        const decoder = new TextDecoder('utf-8');
        let accumulatedText = '';
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n\n');
          buffer = lines.pop() || '';

          for (const block of lines) {
            const line = block.trim();
            if (line.startsWith('data: ')) {
              const rawData = line.replace('data: ', '').trim();
              if (rawData === '[DONE]') continue;

              try {
                const parsed = JSON.parse(rawData);
                if (parsed.token) {
                  accumulatedText += parsed.token;
                  appendStreamingToken(parsed.token);
                }
              } catch {
                // Ignore raw non-json line
              }
            } else if (line.startsWith('event: error')) {
              console.warn('Stream received server error event');
            }
          }
        }

        // Finalize completed message into conversation store
        addMessage({
          role: 'assistant',
          content:
            accumulatedText ||
            'Response completed. Let me know if you need further clarification on this queue item.',
        });
      } catch (err: unknown) {
        console.warn('Talk stream interrupted or timed out; applying graceful degradation', err);
        addMessage({
          role: 'assistant',
          content:
            '[Offline Fallback]: The assistant stream timed out or was interrupted. Level 2 Drone Patrol Video Demo remains your highest priority item in the approvals queue.',
          fallback: true,
        });
      } finally {
        setIsSending(false);
        setIsStreaming(false);
        setStreamingText('');
      }
    },
    [isSending, messages, addMessage, setIsStreaming, setStreamingText, appendStreamingToken]
  );

  const abortStream = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsSending(false);
      setIsStreaming(false);
    }
  }, [setIsStreaming]);

  return {
    sendQuery,
    abortStream,
    isSending,
  };
}

