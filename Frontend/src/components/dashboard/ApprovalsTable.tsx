import React, { useState } from 'react';
import {
  ArrowLeft,
  Info,
  Plus,
  Search,
  ListFilter,
  Folder,
  Video,
  FileText,
  Image as ImageIcon,
  MoreVertical,
  Network,
  CheckCircle2,
  XCircle,
  FolderTree,
  ChevronRight,
  User,
  Calendar,
} from 'lucide-react';
import { useApprovalsStore } from '../../store/useApprovalsStore';
import { useAssistantStore } from '../../store/useAssistantStore';
import { ApprovalItem } from '../../types/approvals';

export const ApprovalsTable: React.FC = () => {
  const {
    items,
    selectedItem,
    selectItem,
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    updateStatus,
  } = useApprovalsStore();

  const { setActiveView, setOpen } = useAssistantStore();
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const filteredItems = items.filter((item) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.submittedBy.toLowerCase().includes(q) ||
      item.folderPath.toLowerCase().includes(q)
    );
  });

  const getItemVisuals = (type: ApprovalItem['type']) => {
    switch (type) {
      case 'Folder':
        return {
          icon: <Folder size={17} className="text-amber-500 fill-amber-100" />,
          boxStyle: 'bg-amber-50/80 border-amber-200/80',
          badgeIcon: <Folder size={12} className="text-slate-600 mr-1.5" />,
        };
      case 'Video':
        return {
          icon: <Video size={17} className="text-rose-500 fill-rose-100" />,
          boxStyle: 'bg-rose-50/80 border-rose-200/80',
          badgeIcon: <Video size={12} className="text-slate-600 mr-1.5" />,
        };
      case 'Pdf':
        return {
          icon: <FileText size={17} className="text-blue-500 fill-blue-100" />,
          boxStyle: 'bg-blue-50/80 border-blue-200/80',
          badgeIcon: <FileText size={12} className="text-slate-600 mr-1.5" />,
        };
      case 'Image':
        return {
          icon: <ImageIcon size={17} className="text-emerald-500 fill-emerald-100" />,
          boxStyle: 'bg-emerald-50/80 border-emerald-200/80',
          badgeIcon: <ImageIcon size={12} className="text-slate-600 mr-1.5" />,
        };
    }
  };

  const handleOpenHelp = () => {
    setOpen(true);
    setActiveView('help');
  };

  return (
    <div className="flex-1 flex flex-col p-3.5 sm:p-5 lg:p-6 overflow-y-auto bg-[#fafafc] w-full min-w-0">
      {/* 1. Top Navigation Row */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3.5 sm:mb-4">
        <div className="flex items-center space-x-2 sm:space-x-3.5">
          <button
            onClick={() => setSearchQuery('')}
            className="flex items-center text-[11px] sm:text-xs font-semibold text-slate-700 bg-white border border-slate-200 px-2.5 sm:px-3 py-1.5 rounded-md hover:bg-slate-50 transition-colors shadow-2xs"
            title="Reset search / view"
          >
            <ArrowLeft size={13} className="mr-1 text-slate-500" />
            <span className="hidden xs:inline">Back to</span> Dashboard
          </button>
          <div className="flex items-center space-x-1.5">
            <h1 className="text-base sm:text-[17px] font-bold text-slate-900 tracking-tight">
              Approvals & Review
            </h1>
            <Info size={14} className="text-slate-400 cursor-pointer hover:text-slate-600 ml-0.5" />
          </div>
        </div>

        {/* Add help opens Assistant 'Help me' */}
        <button
          onClick={handleOpenHelp}
          className="flex items-center text-xs font-semibold bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-3 sm:px-3.5 py-1.5 rounded-md shadow-xs transition-colors cursor-pointer ml-auto"
        >
          <Plus size={14} className="mr-1" />
          Add help
        </button>
      </div>

      {/* 2. Global Search Input */}
      <div className="relative mb-3.5 sm:mb-5">
        <Search
          size={15}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search approvals by title, author, folder..."
          className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200/90 rounded-md text-xs placeholder-slate-400 text-slate-700 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 shadow-2xs transition-all"
        />
      </div>

      {/* 3. Section Subheader: Queue / Hierarchy toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-2 select-none">
        <div className="flex items-center space-x-2">
          {/* Pink/Magenta 3-horizontal bars icon */}
          <div className="flex flex-col space-y-0.5">
            <span className="w-3.5 h-0.5 bg-pink-500 rounded-full" />
            <span className="w-2.5 h-0.5 bg-pink-500 rounded-full" />
            <span className="w-1.5 h-0.5 bg-pink-500 rounded-full" />
          </div>
          <span className="text-[11px] font-bold tracking-wider text-slate-800 uppercase">
            PENDING REQUESTS
          </span>
          <span className="text-[11px] bg-slate-100/90 text-slate-500 font-medium px-2 py-0.5 rounded-full border border-slate-200/60">
            {filteredItems.length}
          </span>
        </div>

        {/* View mode toggle pill */}
        <div className="flex items-center bg-slate-100/80 p-0.5 rounded-md border border-slate-200/80 text-xs self-start sm:self-auto">
          <button
            onClick={() => setViewMode('queue')}
            className={`flex items-center px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'queue'
                ? 'bg-white text-slate-900 shadow-2xs border border-slate-200/50'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <ListFilter size={13} className="mr-1.5 text-slate-500" />
            Queue View
          </button>
          <button
            onClick={() => setViewMode('hierarchy')}
            className={`flex items-center px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'hierarchy'
                ? 'bg-white text-slate-900 shadow-2xs border border-slate-200/50'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Network size={13} className="mr-1.5 text-slate-400" />
            Hierarchy View
          </button>
        </div>
      </div>

      {/* 4. Approvals View (Queue View vs Hierarchy View) */}
      {viewMode === 'hierarchy' ? (
        <div className="bg-white rounded-lg border border-slate-200/80 p-3 sm:p-4 shadow-2xs">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-800 mb-3 pb-2 border-b border-slate-100">
            <FolderTree size={16} className="text-purple-600" />
            <span>Digital Twin Hierarchy Explorer</span>
          </div>
          <div className="space-y-2.5 font-mono text-xs">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => selectItem(item)}
                className={`p-2.5 rounded-md border cursor-pointer transition-all ${
                  selectedItem?.id === item.id
                    ? 'bg-purple-50/70 border-purple-300'
                    : 'bg-slate-50/50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center space-x-2 font-sans font-semibold text-slate-900 text-xs">
                  <span>📂</span>
                  <span className="break-all">{item.folderPath}</span>
                </div>
                <div className="mt-1 pl-6 text-[11px] text-slate-600 font-sans flex flex-wrap items-center justify-between gap-1">
                  <span>↳ {item.name} ({item.type})</span>
                  <span className="font-semibold text-orange-600">{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* MOBILE VIEW (< md): Card-Based Approvals List */}
          <div className="md:hidden space-y-2.5">
            {filteredItems.map((item) => {
              const isSelected = selectedItem?.id === item.id;
              const visuals = getItemVisuals(item.type);

              return (
                <div
                  key={item.id}
                  onClick={() => selectItem(item)}
                  className={`bg-white rounded-xl border p-3.5 shadow-2xs transition-all cursor-pointer relative ${
                    isSelected
                      ? 'border-purple-400 ring-2 ring-purple-100 bg-purple-50/20'
                      : 'border-slate-200/90 hover:border-slate-300'
                  }`}
                >
                  {/* Top card row: Type badge, Status badge, 3-dots menu */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded border border-slate-200 bg-slate-50 text-[10px] font-medium text-slate-700">
                        {visuals.badgeIcon}
                        <span>{item.type}</span>
                      </span>

                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                          item.status === 'Approved'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : item.status === 'Rejected'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-[#ffedd5] text-[#ea580c] border-orange-200/60'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    {/* Action 3-dots Menu on Mobile */}
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(activeMenuId === item.id ? null : item.id);
                        }}
                        className="p-1 text-slate-400 hover:text-slate-600 rounded"
                        title="Actions"
                      >
                        <MoreVertical size={16} />
                      </button>

                      {activeMenuId === item.id && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="absolute right-0 top-7 w-36 bg-white border border-slate-200 rounded-lg shadow-lg z-30 py-1 text-left text-xs"
                        >
                          <button
                            onClick={() => {
                              updateStatus(item.id, 'Approved');
                              setActiveMenuId(null);
                            }}
                            className="w-full px-3 py-1.5 flex items-center space-x-1.5 text-emerald-700 hover:bg-emerald-50 font-semibold"
                          >
                            <CheckCircle2 size={13} />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => {
                              updateStatus(item.id, 'Rejected');
                              setActiveMenuId(null);
                            }}
                            className="w-full px-3 py-1.5 flex items-center space-x-1.5 text-rose-700 hover:bg-rose-50 font-semibold"
                          >
                            <XCircle size={13} />
                            <span>Reject</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Middle row: Icon + Title & Folder path */}
                  <div className="flex items-start space-x-3 mb-2.5">
                    <div
                      className={`w-9 h-9 rounded-lg border flex items-center justify-center flex-shrink-0 ${visuals.boxStyle}`}
                    >
                      {visuals.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-slate-900 text-xs sm:text-sm leading-snug">
                        {item.name}
                      </h3>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {item.folderPath}
                      </p>
                    </div>
                  </div>

                  {/* Bottom row: Submitter, Date & Quick Decision buttons */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center text-slate-600 font-medium">
                        <User size={11} className="mr-1 text-slate-400" />
                        {item.submittedBy}
                      </span>
                      <span className="flex items-center text-slate-400">
                        <Calendar size={11} className="mr-1" />
                        {item.submittedDate}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateStatus(item.id, 'Approved');
                        }}
                        className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded text-[10px] font-bold transition-colors"
                      >
                        ✓ Approve
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateStatus(item.id, 'Rejected');
                        }}
                        className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded text-[10px] font-bold transition-colors"
                      >
                        ✕ Reject
                      </button>
                    </div>
                  </div>

                  {/* View Details Hint */}
                  <div className="mt-2 text-right">
                    <span className="inline-flex items-center text-[10px] text-purple-700 font-semibold">
                      Inspect details <ChevronRight size={12} className="ml-0.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* DESKTOP / TABLET VIEW (md+): Full Scrollable Table */}
          <div className="hidden md:block bg-white rounded-lg border border-slate-200/80 overflow-x-auto shadow-2xs">
            <table className="w-full text-left border-collapse min-w-[620px]">
              <thead>
                <tr className="border-b border-slate-100 bg-[#fbfbfd] text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-2.5 px-4 font-semibold">FOLDER / CONTENT NAME</th>
                  <th className="py-2.5 px-3 font-semibold">TYPE</th>
                  <th className="py-2.5 px-3 font-semibold">SUBMITTED BY</th>
                  <th className="py-2.5 px-3 font-semibold">DATE</th>
                  <th className="py-2.5 px-3 font-semibold">STATUS</th>
                  <th className="py-2.5 px-3 text-right font-semibold">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredItems.map((item) => {
                  const isSelected = selectedItem?.id === item.id;
                  const visuals = getItemVisuals(item.type);

                  return (
                    <tr
                      key={item.id}
                      onClick={() => selectItem(item)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-[#faf5ff] border-l-[3px] border-l-[#8b5cf6]'
                          : 'hover:bg-slate-50/80 border-l-[3px] border-l-transparent'
                      }`}
                    >
                      {/* Name + Folder Path */}
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-8 h-8 rounded-md border flex items-center justify-center flex-shrink-0 ${visuals.boxStyle}`}
                          >
                            {visuals.icon}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-slate-900 text-xs truncate">
                              {item.name}
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5 truncate font-normal">
                              {item.folderPath}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Type Outline Box */}
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded border border-slate-200 bg-white text-[11px] font-medium text-slate-700 shadow-3xs">
                          {visuals.badgeIcon}
                          <span>{item.type}</span>
                        </span>
                      </td>

                      {/* Submitted By */}
                      <td className="py-3 px-3 text-slate-600 text-[11px] font-medium">
                        {item.submittedBy}
                      </td>

                      {/* Date */}
                      <td className="py-3 px-3 text-slate-500 text-[11px]">
                        {item.submittedDate}
                      </td>

                      {/* Status: Peach / Soft Orange Pill */}
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
                            item.status === 'Approved'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : item.status === 'Rejected'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-[#ffedd5] text-[#ea580c] border-orange-200/60'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      {/* Action 3-dots Menu */}
                      <td className="py-3 px-3 text-right relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuId(activeMenuId === item.id ? null : item.id);
                          }}
                          title="Item Actions"
                          className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"
                        >
                          <MoreVertical size={15} />
                        </button>

                        {/* Dropdown Action Menu */}
                        {activeMenuId === item.id && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="absolute right-3 top-10 w-36 bg-white border border-slate-200 rounded-lg shadow-lg z-30 py-1 text-left text-xs"
                          >
                            <button
                              onClick={() => {
                                updateStatus(item.id, 'Approved');
                                setActiveMenuId(null);
                              }}
                              className="w-full px-3 py-1.5 flex items-center space-x-1.5 text-emerald-700 hover:bg-emerald-50 font-semibold"
                            >
                              <CheckCircle2 size={13} />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => {
                                updateStatus(item.id, 'Rejected');
                                setActiveMenuId(null);
                              }}
                              className="w-full px-3 py-1.5 flex items-center space-x-1.5 text-rose-700 hover:bg-rose-50 font-semibold"
                            >
                              <XCircle size={13} />
                              <span>Reject</span>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};
