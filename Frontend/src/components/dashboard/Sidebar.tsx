import React from 'react';
import {
  FileText,
  LayoutGrid,
  UserCheck,
  Users,
  Ticket,
  Home,
  BarChart2,
  FlaskConical,
  X,
  RotateCcw,
  RotateCw,
  Layers,
} from 'lucide-react';
import { useApprovalsStore } from '../../store/useApprovalsStore';

export const Sidebar: React.FC = () => {
  const { isMobileSidebarOpen, setIsMobileSidebarOpen } = useApprovalsStore();

  const navItems = [
    {
      icon: FileText,
      label: 'Documentation & Logs',
      iconColor: 'text-slate-400 group-hover:text-slate-600',
      active: false,
    },
    {
      icon: LayoutGrid,
      label: 'Digital Twin Modules',
      iconColor: 'text-cyan-500 group-hover:text-cyan-600',
      active: false,
    },
    {
      icon: UserCheck,
      label: 'Approvals & Review',
      iconColor: 'text-purple-600 group-hover:text-purple-700',
      active: true,
    },
    {
      icon: Users,
      label: 'Operators & Teams',
      iconColor: 'text-pink-500 group-hover:text-pink-600',
      active: false,
    },
    {
      icon: Ticket,
      label: 'Work Orders & Tickets',
      iconColor: 'text-emerald-500 group-hover:text-emerald-600',
      active: false,
    },
    {
      icon: Home,
      label: 'Facilities & Sites',
      iconColor: 'text-amber-500 group-hover:text-amber-600',
      active: false,
    },
    {
      icon: BarChart2,
      label: 'Telemetry & Metrics',
      iconColor: 'text-purple-500 group-hover:text-purple-600',
      active: false,
    },
    {
      icon: FlaskConical,
      label: 'Simulations & Lab',
      iconColor: 'text-pink-600 group-hover:text-pink-700',
      active: false,
    },
  ];

  return (
    <>
      {/* 1. Desktop Icon Rail (visible on medium & desktop screens) */}
      <aside className="hidden md:flex flex-col w-13 bg-white border-r border-slate-200/80 items-center py-4 space-y-3.5 select-none z-10 flex-shrink-0">
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              title={item.label}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                item.active
                  ? 'bg-purple-50 border border-purple-200 shadow-2xs font-semibold'
                  : 'hover:bg-slate-50'
              }`}
            >
              <Icon size={19} className={item.iconColor} strokeWidth={1.75} />
            </button>
          );
        })}
      </aside>

      {/* 2. Mobile Responsive Off-Canvas Drawer (visible only on mobile when toggled) */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            onClick={() => setIsMobileSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-fade-in"
          />

          {/* Drawer Content */}
          <div className="relative w-72 max-w-[82vw] bg-white h-full shadow-2xl flex flex-col justify-between z-10 animate-slide-in">
            {/* Drawer Header */}
            <div>
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center shadow-xs">
                    <Layers size={17} />
                  </div>
                  <div>
                    <h2 className="font-extrabold text-sm text-slate-900 leading-tight">
                      OomniEye
                    </h2>
                    <p className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">
                      Twin Command Engine
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Navigation Items with Full Text Labels */}
              <div className="py-2 px-3 space-y-1 overflow-y-auto max-h-[calc(100vh-210px)]">
                <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Navigation Modules
                </div>
                {navItems.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => setIsMobileSidebarOpen(false)}
                      className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all group ${
                        item.active
                          ? 'bg-purple-50 text-purple-900 border border-purple-200/80 shadow-2xs'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 ${
                          item.active ? 'bg-purple-100' : 'bg-slate-100 group-hover:bg-slate-200/70'
                        }`}
                      >
                        <Icon size={16} className={item.iconColor} strokeWidth={2} />
                      </div>
                      <span className="truncate">{item.label}</span>
                      {item.active && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-600" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Drawer Bottom Quick Controls */}
            <div className="p-3 border-t border-slate-100 bg-slate-50/80 space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
                System Quick Actions
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="flex items-center space-x-1.5 p-2 bg-white rounded-md border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium"
                >
                  <RotateCw size={13} className="text-slate-500" />
                  <span className="text-[11px]">Sync Twin</span>
                </button>
                <button
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="flex items-center space-x-1.5 p-2 bg-white rounded-md border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium"
                >
                  <RotateCcw size={13} className="text-slate-500" />
                  <span className="text-[11px]">Reset View</span>
                </button>
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 px-1">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Telemetry Live</span>
                </div>
                <span>v1.0.4</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
