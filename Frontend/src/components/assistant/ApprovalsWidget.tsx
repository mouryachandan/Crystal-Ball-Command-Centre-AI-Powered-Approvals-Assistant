import React from 'react';
import {
  X,
  Maximize2,
  Minimize2,
  Info,
  Home,
  ExternalLink,
} from 'lucide-react';
import { useAssistantStore } from '../../store/useAssistantStore';
import { ApprovalsAvatar } from './Illustrations';
import { ActionCardsGrid } from './ActionCardsGrid';
import { SummaryView } from './SummaryView';
import { TalkView } from './TalkView';
import { HelpView } from './HelpView';
import { TeachView } from './TeachView';

export const ApprovalsWidget: React.FC = () => {
  const {
    isOpen,
    setOpen,
    isExpanded,
    toggleExpand,
    activeView,
    setActiveView,
    fetchGreeting,
  } = useAssistantStore();

  return (
    <>
      {/* Mobile Backdrop for AI Assistant */}
      {isOpen && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-2xs z-40 sm:hidden transition-opacity"
        />
      )}

      {/* Floating Approvals Assistant Panel / Bottom Sheet */}
      {isOpen && (
        <div
          className={`fixed z-50 bg-white shadow-2xl border border-slate-300/80 flex flex-col transition-all duration-200 overflow-hidden ${
            /* Mobile Bottom Sheet vs Desktop Floating Window */
            'inset-x-0 bottom-0 sm:inset-x-auto sm:bottom-16 sm:right-6 rounded-t-2xl sm:rounded-xl'
          } ${
            isExpanded
              ? 'h-[92dvh] sm:h-[680px] sm:w-[500px] max-h-[calc(100vh-60px)] sm:max-h-[calc(100vh-80px)]'
              : 'h-[85dvh] sm:h-[500px] w-full sm:w-[360px] md:w-[400px] max-h-[calc(100vh-70px)] sm:max-h-[calc(100vh-90px)]'
          }`}
        >
          {/* Mobile Drag Handle */}
          <div className="w-10 h-1 bg-slate-500/50 rounded-full mx-auto my-1.5 sm:hidden flex-shrink-0" />

          {/* 1. Header Bar: Deep Navy (matches reference UI) */}
          <div className="bg-[#0c1427] text-white px-3.5 py-2.5 flex items-center justify-between select-none flex-shrink-0">
            <div className="flex items-center space-x-2">
              <ApprovalsAvatar className="w-5 h-5" />
              <span className="font-bold text-xs tracking-wide">Approvals Assistant</span>
            </div>

            <div className="flex items-center space-x-2 text-slate-400">
              <button
                title="Assistant Info"
                className="hover:text-white transition-colors p-1"
              >
                <Info size={14} />
              </button>
              <button
                onClick={toggleExpand}
                title={isExpanded ? 'Restore Size' : 'Expand Panel'}
                className="hidden sm:inline-flex hover:text-white transition-colors p-1"
              >
                {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              </button>
              <button
                onClick={() => setOpen(false)}
                title="Close Assistant"
                className="hover:text-white transition-colors p-1"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* 2. Subheader Bar: Breadcrumb + Replay Greeting */}
          <div className="bg-white border-b border-slate-100 px-3.5 py-2 flex items-center justify-between select-none text-[11px] flex-shrink-0">
            <button
              onClick={() => setActiveView('idle')}
              className="flex items-center text-slate-500 hover:text-slate-900 font-medium transition-colors"
            >
              <Home size={12} className="mr-1.5 text-slate-400" />
              <span>Approvals</span>
            </button>

            <button
              onClick={() => {
                fetchGreeting();
                setActiveView('talk');
              }}
              className="font-medium text-[#ea580c] hover:text-[#c2410c] transition-colors"
            >
              Replay Greeting
            </button>
          </div>

          {/* 3. Main Dynamic Content Body */}
          <div className="flex-1 overflow-hidden flex flex-col bg-white min-h-0">
            {activeView === 'idle' && <ActionCardsGrid />}
            {activeView === 'summary' && <SummaryView />}
            {activeView === 'talk' && <TalkView />}
            {activeView === 'help' && <HelpView />}
            {activeView === 'teach' && <TeachView />}
          </div>

          {/* 4. Widget Footer Bar */}
          <div className="bg-white border-t border-slate-100 px-3.5 py-2.5 flex items-center justify-between text-[11px] text-slate-400 select-none flex-shrink-0">
            <span>26 folders / items</span>
            <button className="flex items-center text-slate-600 hover:text-purple-700 font-medium transition-colors">
              <span>HMS Panel</span>
              <ExternalLink size={11} className="ml-1" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Bottom-Right Corner ALLCAD Button (Always accessible) */}
      <div className="fixed bottom-3 right-4 sm:right-5 z-40 sm:z-50 flex flex-col items-center select-none">
        <button
          onClick={() => setOpen(!isOpen)}
          className="w-10 h-10 rounded-full bg-[#0c1427] hover:bg-slate-800 text-white shadow-xl flex items-center justify-center transition-transform hover:scale-105 border border-slate-700/80 cursor-pointer"
          title={isOpen ? 'Close Approvals AI Assistant' : 'Open Approvals AI Assistant'}
          aria-label="Toggle Approvals AI Assistant"
        >
          {/* CAD cross mark icon */}
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="5" y1="5" x2="19" y2="19" />
            <line x1="19" y1="5" x2="5" y2="19" />
          </svg>
        </button>
        <span className="text-[9px] font-black tracking-wider text-emerald-600 uppercase mt-0.5 font-mono">
          ALLCAD
        </span>
      </div>
    </>
  );
};
