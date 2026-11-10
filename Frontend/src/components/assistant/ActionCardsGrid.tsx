import React from 'react';
import { useAssistantStore } from '../../store/useAssistantStore';
import {
  SummaryIllustration,
  TalkIllustration,
  HelpIllustration,
  TeachIllustration,
} from './Illustrations';

export const ActionCardsGrid: React.FC = () => {
  const { setActiveView, fetchSummary, fetchTeachStep } = useAssistantStore();

  const cards = [
    {
      id: 'summary',
      title: 'Present me Summary',
      illustration: <SummaryIllustration />,
      onClick: () => {
        fetchSummary();
      },
    },
    {
      id: 'talk',
      title: 'Talk to me',
      illustration: <TalkIllustration />,
      onClick: () => {
        setActiveView('talk');
      },
    },
    {
      id: 'help',
      title: 'Help me',
      illustration: <HelpIllustration />,
      onClick: () => {
        setActiveView('help');
      },
    },
    {
      id: 'teach',
      title: 'Teach me',
      illustration: <TeachIllustration />,
      onClick: () => {
        fetchTeachStep(1);
      },
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 p-3 sm:p-4 flex-1 overflow-y-auto">
      {cards.map((card) => (
        <button
          key={card.id}
          onClick={card.onClick}
          className="flex flex-col items-center justify-between py-3.5 sm:py-5 px-2 sm:px-3 bg-white hover:bg-slate-50/80 border border-slate-200/90 hover:border-purple-300 rounded-xl transition-all shadow-2xs hover:shadow-xs group cursor-pointer"
        >
          {/* Card Illustration */}
          <div className="flex-1 flex items-center justify-center transform group-hover:scale-105 transition-transform duration-200 max-h-24 sm:max-h-28">
            {card.illustration}
          </div>

          {/* Card Title */}
          <span className="text-[11px] sm:text-xs font-bold text-slate-800 group-hover:text-purple-700 tracking-tight transition-colors mt-2 text-center">
            {card.title}
          </span>
        </button>
      ))}
    </div>
  );
};
