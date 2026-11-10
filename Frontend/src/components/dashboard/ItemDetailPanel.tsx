import React from 'react';
import { Eye, Folder, Sparkles, ArrowLeft } from 'lucide-react';
import { useApprovalsStore } from '../../store/useApprovalsStore';

export const ItemDetailPanel: React.FC = () => {
  const { selectedItem, updateStatus, setIsMobileDetailOpen } = useApprovalsStore();

  if (!selectedItem) {
    return (
      <div className="w-full lg:w-[400px] flex-shrink-0 lg:border-l border-slate-200/80 bg-white p-6 flex flex-col items-center justify-center text-xs text-slate-400">
        <div className="text-center">
          <p className="mb-3">Select an approval item to preview</p>
          <button
            onClick={() => setIsMobileDetailOpen(false)}
            className="lg:hidden px-3 py-1.5 bg-purple-50 text-purple-700 rounded-md font-semibold text-xs"
          >
            ← Back to Approvals Queue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-[400px] flex-shrink-0 lg:border-l border-slate-200/80 bg-white flex flex-col justify-between overflow-y-auto select-none min-w-0">
      <div>
        {/* Mobile-only Header Bar with Back button */}
        <div className="lg:hidden flex items-center justify-between p-3 bg-slate-50 border-b border-slate-200">
          <button
            onClick={() => setIsMobileDetailOpen(false)}
            className="flex items-center text-xs font-semibold text-purple-700 hover:text-purple-900 bg-white border border-purple-200/80 px-2.5 py-1.5 rounded-md shadow-2xs transition-colors"
          >
            <ArrowLeft size={14} className="mr-1.5" />
            <span>Back to Queue</span>
          </button>

          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
              selectedItem.status === 'Approved'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : selectedItem.status === 'Rejected'
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : 'bg-orange-50 text-orange-700 border-orange-200'
            }`}
          >
            {selectedItem.status}
          </span>
        </div>

        <div className="p-4 lg:p-5">
          {/* Breadcrumb path */}
          <div className="text-[11px] text-slate-400 font-medium truncate mb-2">
            {selectedItem.folderPath}
          </div>

          {/* Title */}
          <h2 className="text-base font-bold text-slate-900 leading-snug mb-1.5">
            {selectedItem.name}
          </h2>

          {/* Description */}
          <p className="text-xs text-slate-500 leading-relaxed mb-4">
            {selectedItem.description}
          </p>

          {/* Action Toggle Buttons */}
          <div className="flex items-center space-x-2.5 mb-5">
            <button className="flex items-center text-xs font-semibold px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-md transition-colors shadow-2xs">
              <Eye size={13} className="mr-1.5 text-slate-500" />
              Snapshot & Control
            </button>
            <button className="flex items-center text-xs font-semibold px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-md transition-colors shadow-2xs">
              <Folder size={13} className="mr-1.5 text-slate-400" />
              Media / Content
            </button>
          </div>

          {/* Screen Snapshot Target Section */}
          <div className="mb-4">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-purple-700 mb-2.5">
              <Sparkles size={14} className="text-purple-600" />
              <span>Screen Snapshot Target</span>
            </div>

            {/* High-Fidelity UI Screenshot Mockup (Matches reference visual) */}
            <div className="rounded-lg border border-slate-300 bg-[#1e2029] overflow-hidden shadow-xs text-[10px] min-w-0">
              {/* Top Bar of the Mockup */}
              <div className="bg-[#12141a] px-3 py-1.5 flex items-center justify-between text-slate-400 border-b border-slate-800">
                <div className="flex items-center space-x-2 truncate">
                  <span className="font-bold text-slate-200 flex-shrink-0">Site Time Machine</span>
                  <span className="text-[9px] bg-purple-900/80 text-purple-300 px-1.5 py-0.2 rounded font-semibold truncate hidden sm:inline">
                    Site Patrol Onboarding & Checklists
                  </span>
                </div>
                <div className="text-[9px] text-slate-500 flex-shrink-0">Twin Engine</div>
              </div>

              {/* Sub-tabs inside mockup */}
              <div className="bg-[#181a22] px-3 py-1 flex items-center justify-between border-b border-slate-800 text-[9px] text-slate-400">
                <div className="flex items-center space-x-2.5 truncate">
                  <span className="text-slate-300 font-medium">Drawings</span>
                  <span className="text-purple-400 font-bold border-b border-purple-400 pb-0.5">
                    Videos
                  </span>
                  <span className="hidden sm:inline">Recordings</span>
                </div>
                <span className="text-slate-400 flex-shrink-0">Apr 28 ›</span>
              </div>

              {/* Mock Table Body with Purple Selection Box */}
              <div className="relative p-2.5 bg-[#12141d] font-mono text-[9px] text-slate-300 flex overflow-x-auto min-w-0">
                {/* Left Data Table */}
                <div className="flex-1 pr-2 min-w-[190px]">
                  <div className="mb-1 text-slate-500 flex justify-between text-[8px]">
                    <span>Search patrols...</span>
                    <span>Session 1</span>
                  </div>

                  {/* Table Header */}
                  <div className="grid grid-cols-4 gap-1 text-[8px] text-slate-400 font-bold border-b border-slate-800 pb-1 mb-1">
                    <span>ID</span>
                    <span>Date</span>
                    <span>Name</span>
                    <span>Sess</span>
                  </div>

                  {/* Rows */}
                  <div className="space-y-1 text-[8.5px]">
                    <div className="grid grid-cols-4 gap-1 text-slate-300">
                      <span className="text-purple-400 font-semibold">P-4</span>
                      <span className="truncate">May 1, 6:05p</span>
                      <span className="truncate text-slate-400">KL-Arch...</span>
                      <span>S-002</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1 text-slate-300">
                      <span className="text-purple-400 font-semibold">P-3</span>
                      <span className="truncate">May 1, 4:22p</span>
                      <span className="truncate text-slate-400">KL-Arch...</span>
                      <span>S-001</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1 text-slate-300">
                      <span className="text-purple-400 font-semibold">P-2</span>
                      <span className="truncate">Apr 30, 6:08p</span>
                      <span className="truncate text-slate-400">KL-Arch...</span>
                      <span>S-002</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1 text-slate-300">
                      <span className="text-purple-400 font-semibold">P-1</span>
                      <span className="truncate">Apr 30, 6:02p</span>
                      <span className="truncate text-slate-400">KL-Arch...</span>
                      <span>S-001</span>
                    </div>
                  </div>
                </div>

                {/* Purple Highlight / Selection Bounding Box */}
                <div className="absolute top-2 left-6 sm:left-10 w-24 sm:w-28 h-14 border-2 border-purple-500 bg-purple-500/15 rounded flex items-center justify-center pointer-events-none shadow-sm">
                  <span className="text-[7.5px] font-sans font-bold text-purple-200 bg-purple-900/90 px-1 py-0.2 rounded truncate max-w-[90%]">
                    Site Patrol Checklists
                  </span>
                </div>

                {/* Right Side Video/Camera Preview Box */}
                <div className="w-20 sm:w-24 border-l border-slate-800 pl-2 flex flex-col justify-between flex-shrink-0">
                  <div className="text-[8px] text-slate-400 font-sans font-bold">
                    Video View
                  </div>
                  <div className="h-14 bg-slate-800 rounded border border-slate-700 flex items-center justify-center text-[8px] text-slate-400">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse mr-1" />
                    <span>CAM-01</span>
                  </div>
                  <div className="text-[7px] text-slate-500 font-mono">
                    1080p FEED
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Operator Quick Decision Controls */}
          <div className="flex items-center space-x-2.5 pt-2">
            <button
              onClick={() => updateStatus(selectedItem.id, 'Approved')}
              className={`flex-1 py-2 sm:py-1.5 px-3 rounded-md text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer ${
                selectedItem.status === 'Approved'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs'
              }`}
            >
              <span>✓</span>
              <span>{selectedItem.status === 'Approved' ? 'Approved' : 'Approve'}</span>
            </button>
            <button
              onClick={() => updateStatus(selectedItem.id, 'Rejected')}
              className={`flex-1 py-2 sm:py-1.5 px-3 rounded-md text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer ${
                selectedItem.status === 'Rejected'
                  ? 'bg-rose-700 text-white shadow-xs'
                  : 'bg-rose-600 hover:bg-rose-700 text-white shadow-2xs'
              }`}
            >
              <span>✕</span>
              <span>{selectedItem.status === 'Rejected' ? 'Rejected' : 'Reject'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Panel Footer SLA Notice */}
      <div className="p-3 sm:p-3.5 bg-slate-50/80 border-t border-slate-200/80 text-[10px] sm:text-[11px] text-slate-500 flex items-center justify-between">
        <span>Help Admin View — Approvals and rejections are final.</span>
      </div>
    </div>
  );
};
