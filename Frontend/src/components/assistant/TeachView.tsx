import React, { useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, CheckSquare, Lightbulb, MessageSquare } from 'lucide-react';
import { useAssistantStore } from '../../store/useAssistantStore';
import { FallbackNotice } from './FallbackNotice';

export const TeachView: React.FC = () => {
  const [followUp, setFollowUp] = useState('');
  const { teachData, fetchTeachStep, setActiveView, isFallback, isLoading } =
    useAssistantStore();

  const currentStep = teachData?.stepNumber || 1;
  const totalSteps = teachData?.totalSteps || 4;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      fetchTeachStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      fetchTeachStep(currentStep - 1);
    }
  };

  const handleFollowUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUp.trim() || isLoading) return;
    fetchTeachStep(currentStep, followUp.trim());
    setFollowUp('');
  };

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
        <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-full">
          Step {currentStep} of {totalSteps}
        </span>
      </div>

      {isFallback && <FallbackNotice />}

      {isLoading ? (
        <div className="p-8 flex flex-col items-center justify-center space-y-2 text-slate-500">
          <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-[11px]">Adapting operator training module...</span>
        </div>
      ) : teachData ? (
        <div className="space-y-3">
          {/* Step Title & Instruction */}
          <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-2xs">
            <h3 className="font-bold text-slate-900 text-xs mb-1">
              {teachData.stepTitle}
            </h3>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              {teachData.instruction}
            </p>
          </div>

          {/* Operator Checklist */}
          {teachData.operatorChecklist.length > 0 && (
            <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-2xs">
              <div className="flex items-center space-x-1 text-slate-800 font-bold text-[11px] mb-2">
                <CheckSquare size={13} className="text-purple-600" />
                <span>Verification Checklist</span>
              </div>
              <ul className="space-y-1.5">
                {teachData.operatorChecklist.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start space-x-2 text-[11px] text-slate-700"
                  >
                    <input
                      type="checkbox"
                      id={`chk-${idx}`}
                      className="mt-0.5 rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
                    />
                    <label htmlFor={`chk-${idx}`} className="cursor-pointer">
                      {item}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Pro Tip */}
          {teachData.tipForOperator && (
            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-[10px] text-amber-900 flex items-start space-x-2">
              <Lightbulb size={13} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <span>{teachData.tipForOperator}</span>
            </div>
          )}

          {/* Interactive Step Navigation */}
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={handlePrev}
              disabled={currentStep <= 1 || isLoading}
              className="flex items-center px-2.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 rounded text-slate-700 font-semibold text-[11px] transition-colors"
            >
              <ChevronLeft size={13} className="mr-0.5" />
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={currentStep >= totalSteps || isLoading}
              className="flex items-center px-2.5 py-1.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 rounded text-white font-semibold text-[11px] transition-colors"
            >
              Next Step
              <ChevronRight size={13} className="ml-0.5" />
            </button>
          </div>

          {/* Follow-up Question Adaptive Input */}
          <form onSubmit={handleFollowUpSubmit} className="pt-2 border-t border-slate-200">
            <div className="relative">
              <input
                type="text"
                value={followUp}
                onChange={(e) => setFollowUp(e.target.value)}
                placeholder="Confused? Ask a follow-up for this step..."
                className="w-full pl-8 pr-16 py-1.5 bg-white border border-slate-200 rounded text-xs placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
              <MessageSquare size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <button
                type="submit"
                disabled={!followUp.trim() || isLoading}
                className="absolute right-1 top-1/2 -translate-y-1/2 px-2 py-0.5 bg-purple-600 text-white rounded text-[10px] font-semibold"
              >
                Ask
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
};

