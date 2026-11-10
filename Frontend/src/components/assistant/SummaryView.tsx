import React from 'react';
import { Volume2, VolumeX, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { useAssistantStore } from '../../store/useAssistantStore';
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis';
import { Badge } from '../ui/Badge';
import { FallbackNotice } from './FallbackNotice';

export const SummaryView: React.FC = () => {
  const { summaryData, setActiveView, isFallback, isLoading } = useAssistantStore();
  const { speak, stop, isSpeaking, isSupported } = useSpeechSynthesis();

  const handleSpeak = () => {
    if (isSpeaking) {
      stop();
    } else if (summaryData?.spokenSummary) {
      speak(summaryData.spokenSummary);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center space-y-3 text-slate-500">
        <div className="w-8 h-8 border-3 border-purple-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-semibold">Analyzing approvals queue urgency...</span>
      </div>
    );
  }

  if (!summaryData) {
    return (
      <div className="p-4 text-center text-xs text-slate-400">
        No summary generated yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto p-3 text-xs">
      {/* Top return bar */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
        <button
          onClick={() => setActiveView('idle')}
          className="flex items-center text-slate-600 hover:text-slate-900 font-semibold"
        >
          <ArrowLeft size={13} className="mr-1" />
          Back to Cards
        </button>

        {isSupported && (
          <button
            onClick={handleSpeak}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
              isSpeaking
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
            }`}
          >
            {isSpeaking ? <VolumeX size={13} /> : <Volume2 size={13} />}
            <span>{isSpeaking ? 'Stop Audio' : 'Listen Out Loud'}</span>
          </button>
        )}
      </div>

      {isFallback && <FallbackNotice />}

      {/* Structured Headline */}
      <div className="bg-slate-900 text-white p-3 rounded-lg shadow-sm mb-3">
        <div className="text-[10px] uppercase tracking-wider text-purple-300 font-bold mb-1">
          Executive Queue Analysis
        </div>
        <h3 className="font-bold text-xs text-slate-100 leading-snug">
          {summaryData.headline}
        </h3>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2 text-[10px] text-slate-300">
          <span>● Total Pending: {summaryData.totalPending}</span>
          <span className="text-rose-400 font-bold">
            ● Critical: {summaryData.criticalCount}
          </span>
        </div>
      </div>

      {/* Spoken Summary Paragraph */}
      <div className="p-3 bg-purple-50/70 border border-purple-100 rounded-lg mb-3">
        <div className="text-[10px] font-bold text-purple-800 uppercase tracking-wide mb-1">
          Operator Spoken Briefing
        </div>
        <p className="text-slate-700 text-[11px] leading-relaxed">
          {summaryData.spokenSummary}
        </p>
      </div>

      {/* Prioritized Breakdown Items */}
      <div className="space-y-2 mb-3">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Urgency Breakdown (Zod Validated JSON)
        </div>
        {summaryData.items.map((item) => (
          <div
            key={item.id}
            className="p-2.5 bg-white border border-slate-200 rounded-lg shadow-2xs hover:border-purple-300 transition-colors"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-slate-900 text-[11px]">
                {item.name}
              </span>
              <Badge
                variant={
                  item.urgency === 'CRITICAL'
                    ? 'critical'
                    : item.urgency === 'HIGH'
                    ? 'high'
                    : 'medium'
                }
              >
                {item.urgency}
              </Badge>
            </div>
            <p className="text-[10px] text-slate-500 mb-1.5">{item.reason}</p>
            <div className="flex items-center text-[10px] text-purple-700 font-medium bg-purple-50 px-2 py-0.5 rounded">
              <CheckCircle size={10} className="mr-1 text-purple-600" />
              <span>Action: {item.recommendedAction}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Suggested Next Step Banner */}
      {summaryData.suggestedNextStep && (
        <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 text-[11px] flex items-center space-x-2">
          <AlertCircle size={13} className="text-emerald-600 flex-shrink-0" />
          <span>
            <strong className="font-semibold">Next Action:</strong> {summaryData.suggestedNextStep}
          </span>
        </div>
      )}
    </div>
  );
};

