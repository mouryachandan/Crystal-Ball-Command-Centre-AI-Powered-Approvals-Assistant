'use client';

import React, { useEffect } from 'react';
import { Header } from '../components/dashboard/Header';
import { Sidebar } from '../components/dashboard/Sidebar';
import { ApprovalsTable } from '../components/dashboard/ApprovalsTable';
import { ItemDetailPanel } from '../components/dashboard/ItemDetailPanel';
import { ApprovalsWidget } from '../components/assistant/ApprovalsWidget';
import { useApprovalsStore } from '../store/useApprovalsStore';

export default function ApprovalsPage() {
  const { fetchQueue, isMobileDetailOpen } = useApprovalsStore();

  useEffect(() => {
    fetchQueue();
  }, [fetchQueue]);

  return (
    <div className="flex flex-col h-screen h-[100dvh] w-full overflow-hidden bg-[#fafafc] relative">
      {/* 1. Global Application Header */}
      <Header />

      {/* 2. Main Workspace Layout: Sidebar Rail / Drawer + Approvals Table + Preview Panel */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left vertical icon rail & Off-canvas Mobile Drawer */}
        <Sidebar />

        {/* Center Workspace */}
        <main className="flex-1 flex overflow-hidden relative">
          {/* Main Approvals Table:
              On desktop (lg+): always visible (flex-1)
              On mobile (< lg): visible when detail is not opened
          */}
          <div
            className={`flex-1 flex flex-col overflow-hidden min-w-0 ${
              isMobileDetailOpen ? 'hidden lg:flex' : 'flex'
            }`}
          >
            <ApprovalsTable />
          </div>

          {/* Right Inspector & Screen Snapshot Target Panel:
              On desktop (lg+): always visible side-by-side
              On mobile (< lg): visible full screen when an item is selected
          */}
          <div
            className={`overflow-hidden min-w-0 ${
              isMobileDetailOpen ? 'flex flex-1 lg:flex-none' : 'hidden lg:flex'
            }`}
          >
            <ItemDetailPanel />
          </div>
        </main>
      </div>

      {/* 3. Floating Approvals AI Assistant Widget (Responsive bottom-sheet on mobile) */}
      <ApprovalsWidget />

      {/* 4. Bottom System Status Bar */}
      <footer className="h-6 bg-white border-t border-slate-200/80 px-3 sm:px-6 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400 select-none z-10 flex-shrink-0">
        <div className="flex items-center space-x-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-slate-500 font-medium">Ready</span>
        </div>
        <div className="text-slate-400 font-normal hidden sm:block">
          © 2026 OomniEye. All rights reserved.
        </div>
        <div className="w-12 sm:w-16" /> {/* Spacer for ALLCAD button */}
      </footer>
    </div>
  );
}
