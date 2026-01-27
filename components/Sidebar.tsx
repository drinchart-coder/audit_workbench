
import React, { useState } from 'react';
import { AuditProcedure, AUDIT_PROCEDURES, ThemeType } from '../types';

interface SidebarProps {
  activeProcedureId: string;
  onSelectProcedure: (id: string) => void;
  theme: ThemeType;
  onThemeChange: (theme: ThemeType) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeProcedureId, 
  onSelectProcedure, 
  theme, 
  onThemeChange 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);

  const themeOptions: { id: ThemeType; name: string; color: string }[] = [
    { id: 'white', name: '冰川白', color: 'bg-white border-[#D2D2D7]' },
    { id: 'blue', name: '星际蓝', color: 'bg-[#003354] border-[#00A3FF]/30' },
    { id: 'grey', name: '深空灰', color: 'bg-[#1D1D1F] border-[#333333]' }
  ];

  const sidebarBg = theme === 'white' ? 'bg-white/80 border-[#D2D2D7]' : theme === 'blue' ? 'bg-[#001424]/80 border-[#003354]' : 'bg-[#1D1D1F]/80 border-[#333333]';
  const iconTextClass = theme === 'white' ? 'text-[#1D1D1F]' : 'text-zinc-400';

  return (
    <div className={`relative h-full flex flex-col shrink-0 transition-all duration-500 ease-in-out ${isOpen ? 'w-64' : 'w-16'} border-r backdrop-blur-xl z-50 ${sidebarBg}`}>
      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-16 flex items-center justify-center hover:bg-black/5 transition-colors text-zinc-400"
      >
        <svg className={`w-5 h-5 transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
        </svg>
      </button>

      {/* Procedures List */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden pt-4 custom-scrollbar">
        <div className="px-4 mb-3">
           <p className={`text-[10px] font-black text-zinc-500 uppercase tracking-widest transition-all duration-300 ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>审计库</p>
        </div>
        {AUDIT_PROCEDURES.map((p) => (
          <button
            key={p.id}
            onClick={() => onSelectProcedure(p.id)}
            className={`w-full flex items-center px-4 py-3.5 transition-all group relative ${activeProcedureId === p.id ? 'text-blue-500' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            {activeProcedureId === p.id && (
              <div className="absolute left-0 w-1 h-6 bg-blue-500 rounded-r-full shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
            )}
            <div className={`shrink-0 w-8 h-8 flex items-center justify-center rounded-xl border transition-all duration-300 ${activeProcedureId === p.id ? 'border-blue-500/30 bg-blue-500/10 scale-110' : 'border-zinc-800/40 bg-black/10 group-hover:border-zinc-500/30'}`}>
              <svg className={`w-4 h-4 transition-transform ${activeProcedureId === p.id ? 'scale-110' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={p.icon} />
              </svg>
            </div>
            <div className={`ml-4 transition-all duration-500 whitespace-nowrap overflow-hidden ${isOpen ? 'w-44 opacity-100 translate-x-0' : 'w-0 opacity-0 -translate-x-4'}`}>
              <p className={`text-xs font-bold text-left tracking-tight ${theme === 'white' && activeProcedureId !== p.id ? 'text-[#424245]' : ''}`}>{p.name}</p>
              <p className="text-[9px] font-medium opacity-50 text-left uppercase tracking-tighter">{p.category}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Theme Switcher */}
      <div className={`p-4 border-t transition-colors ${theme === 'white' ? 'border-[#D2D2D7]' : 'border-white/5'} relative`}>
        <button 
          onClick={() => setShowThemePicker(!showThemePicker)}
          className={`w-10 h-10 rounded-2xl flex items-center justify-center border transition-all shadow-sm active:scale-95 ${
            theme === 'white' ? 'bg-white border-[#D2D2D7]' : theme === 'blue' ? 'bg-[#003354] border-[#00A3FF]/30' : 'bg-[#1D1D1F] border-[#333333]'
          }`}
        >
           <svg className={`w-5 h-5 ${theme === 'white' ? 'text-[#1D1D1F]' : 'text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
           </svg>
        </button>

        {showThemePicker && (
          <div className="absolute bottom-16 left-4 w-44 bg-white/95 dark:bg-[#1D1D1F]/95 backdrop-blur-2xl border border-[#D2D2D7] dark:border-[#333333] rounded-3xl p-2 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300 z-[60]">
             {themeOptions.map((opt) => (
               <button
                 key={opt.id}
                 onClick={() => { onThemeChange(opt.id); setShowThemePicker(false); }}
                 className={`w-full flex items-center p-2.5 rounded-2xl transition-all ${theme === opt.id ? 'bg-blue-500/10 border border-blue-500/20' : 'hover:bg-black/5 border border-transparent'}`}
               >
                 <div className={`w-6 h-6 rounded-lg border shadow-sm ${opt.color}`}></div>
                 <span className={`ml-3 text-[10px] font-bold uppercase tracking-widest ${theme === 'white' ? 'text-[#1D1D1F]' : 'text-zinc-300'}`}>{opt.name}</span>
               </button>
             ))}
          </div>
        )}
      </div>
    </div>
  );
};
