import React from 'react';
import {
  RotateCcw,
  RotateCw,
  Maximize2,
  MessageSquare,
  Settings,
  Bell,
  Menu,
} from 'lucide-react';
import { useApprovalsStore } from '../../store/useApprovalsStore';
import { useAssistantStore } from '../../store/useAssistantStore';

export const Header: React.FC = () => {
  const { toggleMobileSidebar } = useApprovalsStore();
  const { setOpen, setActiveView } = useAssistantStore();

  const handleOpenChat = () => {
    setOpen(true);
    setActiveView('talk');
  };

  return (
    <header className="h-12 bg-white border-b border-slate-200/80 px-3 sm:px-6 flex items-center justify-between select-none z-20 flex-shrink-0">
      {/* Left: Mobile hamburger menu toggle & Brand logo & tagline */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Mobile menu drawer trigger */}
        <button
          onClick={toggleMobileSidebar}
          className="md:hidden p-1.5 -ml-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          title="Open Navigation Menu"
          aria-label="Open Navigation Menu"
        >
          <Menu size={20} />
        </button>

        <div className="flex items-center space-x-2">
          {/* Brand icon / dot indicator */}
          <div className="w-2.5 h-2.5 rounded-full bg-purple-600 shadow-xs ring-2 ring-purple-200 animate-pulse hidden xs:block" />
          <div>
            <div className="font-extrabold text-[14px] sm:text-[15px] tracking-tight text-slate-900 leading-none">
              OomniEye
            </div>
            <div className="text-[8px] sm:text-[9px] tracking-wider text-slate-500 font-bold uppercase mt-0.5 hidden sm:block">
              DIGITAL TWIN SOLUTIONS
            </div>
          </div>
        </div>
      </div>

      {/* Right-side quick controls */}
      <div className="flex items-center space-x-1 sm:space-x-2.5 md:space-x-3.5 text-slate-600">
        {/* Undo/Redo circular button with red indicator dot (hidden on small mobile) */}
        <button
          title="Reset View"
          className="hidden md:inline-flex relative p-1.5 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-slate-700"
        >
          <RotateCcw size={15} />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-rose-500 ring-1 ring-white" />
        </button>

        {/* Sync refresh (hidden on small mobile) */}
        <button
          title="Sync Digital Twin"
          className="hidden md:inline-flex p-1.5 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-slate-700"
        >
          <RotateCw size={15} />
        </button>

        {/* Fullscreen (hidden on mobile) */}
        <button
          title="Toggle Fullscreen"
          className="hidden lg:inline-flex p-1.5 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-slate-700"
        >
          <Maximize2 size={15} />
        </button>

        {/* Support Chat / AI Copilot */}
        <button
          onClick={handleOpenChat}
          title="Operator Chat & AI Assistant"
          className="p-1.5 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-purple-600"
        >
          <MessageSquare size={16} />
        </button>

        {/* Notifications with black '3' badge */}
        <div className="relative">
          <button
            title="Approvals Inbox (3 pending)"
            className="p-1.5 hover:bg-slate-100 rounded-full transition-colors text-slate-700"
          >
            <Bell size={16} />
          </button>
          <span className="absolute -top-0.5 -right-0.5 bg-slate-900 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
            3
          </span>
        </div>

        {/* Settings gear (hidden on small mobile, inside drawer) */}
        <button
          title="Settings"
          className="hidden sm:inline-flex p-1.5 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-slate-700"
        >
          <Settings size={16} />
        </button>

        {/* Bell Alert with red badge (hidden on mobile, inside drawer) */}
        <div className="relative hidden sm:block">
          <button
            title="System Alerts"
            className="p-1.5 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-slate-700"
          >
            <Bell size={16} />
          </button>
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-rose-500 ring-1 ring-white" />
        </div>

        {/* Operator Profile Avatar 'R' */}
        <div
          title="Operator Sam HelpAdmin"
          className="w-7 h-7 rounded-full bg-[#f59e0b] text-white font-bold text-xs flex items-center justify-center cursor-pointer shadow-xs hover:ring-2 hover:ring-amber-300 transition-all ml-1"
        >
          R
        </div>
      </div>
    </header>
  );
};
