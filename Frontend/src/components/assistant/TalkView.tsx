import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Sparkles, StopCircle, RefreshCw } from 'lucide-react';
import { useAssistantStore } from '../../store/useAssistantStore';
import { useAIStream } from '../../hooks/useAIStream';

export const TalkView: React.FC = () => {
  const [input, setInput] = useState('');
  const { messages, streamingText, isStreaming, setActiveView, clearChat } =
    useAssistantStore();
  const { sendQuery, abortStream, isSending } = useAIStream();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll on new message or streaming token
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingText]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;
    const query = input.trim();
    setInput('');
    sendQuery(query);
  };

  const handleSuggestedPrompt = (promptText: string) => {
    if (isSending) return;
    sendQuery(promptText);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 text-xs">
      {/* Top Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-white border-b border-slate-200 flex-shrink-0">
        <button
          onClick={() => setActiveView('idle')}
          className="flex items-center text-slate-600 hover:text-slate-900 font-semibold text-xs"
        >
          <ArrowLeft size={13} className="mr-1" />
          Back to Cards
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={clearChat}
            title="Reset Conversation"
            className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-800 transition-colors"
          >
            <RefreshCw size={12} />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-3 overflow-y-auto space-y-3 min-h-0">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${
              m.role === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`max-w-[88%] p-2.5 rounded-xl text-xs leading-relaxed shadow-2xs ${
                m.role === 'user'
                  ? 'bg-purple-600 text-white rounded-br-none'
                  : m.fallback
                  ? 'bg-amber-50 border border-amber-200 text-amber-900 rounded-bl-none'
                  : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
              }`}
            >
              {m.content}
            </div>
            <span className="text-[9px] text-slate-400 mt-0.5 px-1">
              {m.role === 'user' ? 'Operator' : 'AI Copilot'} • {m.timestamp}
            </span>
          </div>
        ))}

        {/* Streaming Token Rendering */}
        {isStreaming && (
          <div className="flex flex-col items-start">
            <div className="max-w-[88%] p-2.5 rounded-xl rounded-bl-none bg-white border border-purple-200 text-slate-800 text-xs leading-relaxed shadow-sm">
              <span>{streamingText}</span>
              <span className="inline-block w-1.5 h-3.5 bg-purple-600 ml-1 animate-pulse align-middle" />
            </div>
            <span className="text-[9px] text-purple-600 font-medium mt-0.5 px-1 animate-pulse">
              Streaming response token-by-token...
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      {messages.length <= 2 && !isStreaming && (
        <div className="px-3 py-1.5 bg-white border-t border-slate-100 flex items-center space-x-1.5 overflow-x-auto text-[10px] flex-shrink-0">
          <span className="text-slate-400 flex items-center font-semibold">
            <Sparkles size={11} className="mr-1 text-purple-500" />
            Suggested:
          </span>
          <button
            onClick={() =>
              handleSuggestedPrompt('Which of these needs my attention first and why?')
            }
            className="px-2 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-full font-medium whitespace-nowrap transition-colors"
          >
            Which needs my attention first?
          </button>
          <button
            onClick={() =>
              handleSuggestedPrompt('What are the risks with the drone demo video?')
            }
            className="px-2 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-full font-medium whitespace-nowrap transition-colors"
          >
            Drone flight risks?
          </button>
        </div>
      )}

      {/* User Input Form */}
      <form
        onSubmit={handleSubmit}
        className="p-2.5 bg-white border-t border-slate-200 flex items-center space-x-2 flex-shrink-0"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about the approvals queue..."
          disabled={isSending}
          className="flex-1 px-3 py-2 bg-slate-100 focus:bg-white border border-slate-200 rounded-lg text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all disabled:opacity-50"
        />

        {isStreaming ? (
          <button
            type="button"
            onClick={abortStream}
            className="p-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors shadow-sm"
            title="Stop Generation"
          >
            <StopCircle size={15} />
          </button>
        ) : (
          <button
            type="submit"
            disabled={!input.trim() || isSending}
            className="p-2 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-lg transition-colors shadow-sm"
            title="Send Message"
          >
            <Send size={15} />
          </button>
        )}
      </form>
    </div>
  );
};

