import React, { useState } from 'react';
import { ArrowLeft, Search, HelpCircle, BookOpen, Quote } from 'lucide-react';
import { useAssistantStore } from '../../store/useAssistantStore';
import { FallbackNotice } from './FallbackNotice';

export const HelpView: React.FC = () => {
  const [question, setQuestion] = useState('');
  const { helpData, fetchHelp, setActiveView, isFallback, isLoading } =
    useAssistantStore();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;
    fetchHelp(question.trim());
  };

  const sampleQuestions = [
    'What is the maximum flight altitude for drone patrol?',
    'What are the calibration requirements for IoT sensors?',
    'How should we mitigate camera blindness in Zone 4?',
    'What is the approval turnaround SLA?',
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50 text-xs overflow-y-auto p-3">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
        <button
          onClick={() => setActiveView('idle')}
          className="flex items-center text-slate-600 hover:text-slate-900 font-semibold text-xs"
        >
          <ArrowLeft size={13} className="mr-1" />
          Back to Cards
        </button>
        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
          RAG Policy Grounded
        </span>
      </div>

      {/* Query Search Form */}
      <form onSubmit={handleSearch} className="mb-3">
        <div className="relative">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask an SOP policy question (e.g. drone altitude limit)..."
            className="w-full pl-9 pr-16 py-2 bg-white border border-slate-200 rounded-lg text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-2xs"
          />
          <HelpCircle
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <button
            type="submit"
            disabled={!question.trim() || isLoading}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 text-white rounded text-[11px] font-semibold transition-colors"
          >
            {isLoading ? '...' : 'Ask'}
          </button>
        </div>
      </form>

      {/* Sample Quick Questions */}
      {!helpData && !isLoading && (
        <div className="space-y-1.5 mb-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Suggested Policy Questions
          </span>
          <div className="flex flex-col space-y-1">
            {sampleQuestions.map((sq, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQuestion(sq);
                  fetchHelp(sq);
                }}
                className="text-left px-2.5 py-1.5 bg-white hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-300 rounded text-slate-700 text-[11px] transition-all"
              >
                ● {sq}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading Spinner */}
      {isLoading && (
        <div className="p-8 flex flex-col items-center justify-center space-y-2 text-slate-500">
          <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-[11px]">Searching in-memory policy chunks...</span>
        </div>
      )}

      {/* Fallback alert if triggered */}
      {isFallback && <FallbackNotice />}

      {/* Answer & Citations */}
      {helpData && !isLoading && (
        <div className="space-y-3">
          {/* Grounded Answer Card */}
          <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-2xs">
            <div className="flex items-center space-x-1.5 text-emerald-700 font-bold text-[11px] mb-1.5">
              <BookOpen size={13} />
              <span>Policy Compliance Answer</span>
            </div>
            <p className="text-slate-800 text-[11px] leading-relaxed">
              {helpData.answer}
            </p>
          </div>

          {/* Citations Box */}
          {helpData.citations.length > 0 && (
            <div className="p-2.5 bg-emerald-50/60 border border-emerald-100 rounded-lg">
              <div className="flex items-center space-x-1 text-[10px] font-bold text-emerald-800 uppercase tracking-wide mb-1.5">
                <Quote size={11} />
                <span>Referenced Policy Chunks ({helpData.citations.length})</span>
              </div>
              <div className="space-y-2">
                {helpData.citations.map((cite) => (
                  <div
                    key={cite.chunkId}
                    className="p-2 bg-white rounded border border-emerald-200/70 text-[10px]"
                  >
                    <div className="flex items-center justify-between font-semibold text-emerald-900 mb-0.5">
                      <span>{cite.sectionTitle}</span>
                      <span className="text-[9px] text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">
                        Score: {cite.similarityScore}
                      </span>
                    </div>
                    <p className="text-slate-600 italic">"{cite.snippet}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

