
import React, { useRef, useState } from 'react';
import { AuditFile, FileSource, ThemeType } from '../types';

interface LeftPanelProps {
  theme: ThemeType;
  files: AuditFile[];
  onAddFile: (file: AuditFile) => void;
  onDeleteFile: (id: string) => void;
  onPreviewFile: (file: AuditFile) => void;
  onToggleSelect: (id: string) => void;
  onRenameFile: (id: string, newName: string) => void;
}

export const LeftPanel: React.FC<LeftPanelProps> = ({ 
  theme, files, onAddFile, onDeleteFile, onPreviewFile, onToggleSelect, onRenameFile 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      Array.from(selectedFiles).forEach((file: File) => {
        onAddFile({
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
          type: file.name.split('.').pop()?.toUpperCase() || 'UNKNOWN',
          source: FileSource.OFFLINE,
          category: '未分类',
          uploadTime: new Date().toLocaleString(),
          isSelected: false
        });
      });
    }
  };

  const handleRenameSubmit = (id: string) => {
    if (editName.trim()) {
      onRenameFile(id, editName);
    }
    setEditingId(null);
  };

  const handleDragStart = (e: React.DragEvent, file: AuditFile) => {
    e.dataTransfer.setData('application/audit-file', JSON.stringify(file));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const sources = [
    { name: FileSource.OFFLINE, icon: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12' },
    { name: FileSource.INTERNET, icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9-3-9m-9 9a9 9 0 019-9' },
    { name: FileSource.PROJECT, icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    { name: FileSource.KNOWLEDGE_BASE, icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
  ];

  const colors = {
    white: {
      btn: 'bg-white border-[#D2D2D7] text-[#1D1D1F] hover:bg-[#F5F5F7] shadow-sm',
      fileBg: 'bg-white border-[#D2D2D7]',
      fileText: 'text-[#1D1D1F]',
      subText: 'text-[#86868B]',
      input: 'bg-white border-[#D2D2D7] text-[#1D1D1F]',
      label: 'text-[#86868B]',
      badge: 'bg-[#F5F5F7] border-[#D2D2D7] text-[#1D1D1F]'
    },
    blue: {
      btn: 'bg-[#003354]/40 border-[#003354] text-blue-100 hover:bg-[#003354]/70 shadow-lg shadow-blue-900/10',
      fileBg: 'bg-[#001424]/80 border-[#003354]',
      fileText: 'text-white',
      subText: 'text-blue-300/60',
      input: 'bg-[#000C14] border-[#003354] text-white',
      label: 'text-blue-400/80',
      badge: 'bg-[#000C14] border-[#003354] text-blue-200'
    },
    grey: {
      btn: 'bg-zinc-800/40 border-zinc-700/50 text-zinc-300 hover:bg-zinc-800/80 hover:border-zinc-600',
      fileBg: 'bg-zinc-900/40 border-zinc-800',
      fileText: 'text-zinc-200',
      subText: 'text-zinc-500',
      input: 'bg-zinc-950 border-zinc-800 text-zinc-100',
      label: 'text-zinc-500',
      badge: 'bg-zinc-950 border-zinc-800 text-zinc-400'
    }
  }[theme];

  return (
    <div className="flex flex-col h-full p-5 space-y-7">
      <div>
        <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] mb-4 px-1 ${colors.label}`}>资料库上传</h3>
        <div className="grid grid-cols-2 gap-2.5">
          {sources.map(s => (
            <button
              key={s.name}
              onClick={handleUploadClick}
              className={`group flex flex-col items-center justify-center p-3.5 rounded-2xl border transition-all duration-300 ${colors.btn}`}
            >
              <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-2 transition-all group-hover:bg-blue-500 group-hover:text-white group-hover:scale-110">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={s.icon} />
                </svg>
              </div>
              <span className="text-[10px] font-black uppercase tracking-tight">{s.name}</span>
            </button>
          ))}
          <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple className="hidden" />
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex justify-between items-center mb-5 px-1">
          <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] ${colors.label}`}>审计文件列表</h3>
          <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${colors.badge}`}>{files.length} ITEMS</span>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 custom-scrollbar">
          {files.length === 0 ? (
            <div className={`flex flex-col items-center justify-center py-16 border border-dashed rounded-3xl ${colors.subText} opacity-40 transition-colors`}>
              <div className="w-12 h-12 mb-3 rounded-2xl bg-black/5 flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest">No Documents Found</p>
            </div>
          ) : (
            files.map(file => (
              <div 
                key={file.id} 
                draggable
                onDragStart={(e) => handleDragStart(e, file)}
                className={`group relative flex flex-col p-4 rounded-2xl border transition-all duration-300 cursor-grab active:cursor-grabbing ${file.isSelected ? 'ring-2 ring-blue-500/50 shadow-xl' : 'hover:scale-[1.01] hover:shadow-lg'} ${colors.fileBg}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 min-w-0 flex-1">
                    <div className="relative flex items-center mt-0.5">
                      <input 
                        type="checkbox" 
                        checked={file.isSelected} 
                        onChange={() => onToggleSelect(file.id)}
                        className="rounded border-zinc-700 text-blue-600 w-4 h-4 transition-all focus:ring-0 cursor-pointer" 
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      {editingId === file.id ? (
                        <input
                          autoFocus
                          value={editName}
                          onChange={e => setEditName(e.target.value)}
                          onBlur={() => handleRenameSubmit(file.id)}
                          onKeyDown={e => e.key === 'Enter' && handleRenameSubmit(file.id)}
                          className={`text-xs px-3 py-1.5 rounded-xl w-full outline-none border border-blue-500 shadow-inner ${colors.input}`}
                        />
                      ) : (
                        <p className={`text-xs font-black tracking-tight truncate cursor-pointer transition-colors hover:text-blue-500 ${colors.fileText}`} onClick={() => onPreviewFile(file)}>
                          {file.name}
                        </p>
                      )}
                      
                      <div className="flex items-center space-x-3 mt-2">
                        <span className={`text-[8px] px-2 py-0.5 rounded-lg border font-black uppercase tracking-widest ${colors.badge}`}>{file.type}</span>
                        <span className={`text-[9px] font-bold uppercase tracking-tight ${colors.subText}`}>{file.size}</span>
                        <div className={`w-1 h-1 rounded-full ${colors.subText} opacity-30`}></div>
                        <span className={`text-[9px] font-bold uppercase tracking-tight ${colors.subText}`}>{file.category}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-1.5 mt-3 opacity-0 group-hover:opacity-100 transition-all transform translate-y-1 group-hover:translate-y-0">
                   <button 
                     onClick={() => { setEditingId(file.id); setEditName(file.name); }}
                     className={`p-2 rounded-xl transition-all ${colors.subText} hover:bg-blue-500/10 hover:text-blue-500`}
                   >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                   </button>
                   <button 
                     onClick={() => onPreviewFile(file)}
                     className={`p-2 rounded-xl transition-all ${colors.subText} hover:bg-blue-500/10 hover:text-blue-500`}
                   >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                   </button>
                   <button 
                     onClick={() => onDeleteFile(file.id)}
                     className="p-2 hover:bg-red-500/10 rounded-xl text-red-500/50 hover:text-red-500 transition-all"
                   >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                   </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
