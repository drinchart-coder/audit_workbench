
import React, { useRef, useState } from 'react';
import { AuditFile, FileSource } from '../types';

interface LeftPanelProps {
  files: AuditFile[];
  onAddFile: (file: AuditFile) => void;
  onDeleteFile: (id: string) => void;
  onPreviewFile: (file: AuditFile) => void;
  onToggleSelect: (id: string) => void;
  onRenameFile: (id: string, newName: string) => void;
}

export const LeftPanel: React.FC<LeftPanelProps> = ({ 
  files, onAddFile, onDeleteFile, onPreviewFile, onToggleSelect, onRenameFile 
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
      // Explicitly type 'file' as File to resolve 'unknown' property access errors (name, size).
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

  const sources = [
    { name: FileSource.OFFLINE, icon: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12' },
    { name: FileSource.INTERNET, icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9-3-9m-9 9a9 9 0 019-9' },
    { name: FileSource.PROJECT, icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    { name: FileSource.KNOWLEDGE_BASE, icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
  ];

  return (
    <div className="flex flex-col h-full p-4 space-y-6">
      <div>
        <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-4 px-1">资料库上传</h3>
        <div className="grid grid-cols-2 gap-2">
          {sources.map(s => (
            <button
              key={s.name}
              onClick={handleUploadClick}
              className="group flex flex-col items-center justify-center p-3 rounded-xl border border-zinc-800 bg-zinc-900/30 hover:bg-zinc-800/50 hover:border-zinc-600 transition-all text-zinc-400 hover:text-blue-400"
            >
              <svg className="w-5 h-5 mb-2 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={s.icon} />
              </svg>
              <span className="text-[10px] font-semibold">{s.name}</span>
            </button>
          ))}
          <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple className="hidden" />
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex justify-between items-center mb-4 px-1">
          <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">审计文件列表</h3>
          <span className="text-[10px] bg-zinc-800/80 text-zinc-400 px-2 py-0.5 rounded-full border border-zinc-700">{files.length} 个文件</span>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
          {files.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-zinc-700 border border-dashed border-zinc-800/50 rounded-2xl">
              <svg className="w-12 h-12 mb-3 opacity-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-xs font-medium opacity-40">拖拽文件或点击上方按钮</p>
            </div>
          ) : (
            files.map(file => (
              <div 
                key={file.id} 
                className={`group relative flex flex-col p-3 rounded-xl border transition-all ${file.isSelected ? 'bg-blue-600/5 border-blue-500/40 shadow-[0_0_15px_-5px_rgba(59,130,246,0.3)]' : 'bg-zinc-900/20 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/40'}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 min-w-0 flex-1">
                    <input 
                      type="checkbox" 
                      checked={file.isSelected} 
                      onChange={() => onToggleSelect(file.id)}
                      className="mt-1 rounded bg-zinc-800 border-zinc-700 text-blue-600 focus:ring-blue-600 focus:ring-offset-zinc-950 w-3.5 h-3.5" 
                    />
                    <div className="min-w-0 flex-1">
                      {editingId === file.id ? (
                        <input
                          autoFocus
                          value={editName}
                          onChange={e => setEditName(e.target.value)}
                          onBlur={() => handleRenameSubmit(file.id)}
                          onKeyDown={e => e.key === 'Enter' && handleRenameSubmit(file.id)}
                          className="bg-zinc-800 text-xs text-white px-2 py-1 rounded w-full outline-none border border-blue-500"
                        />
                      ) : (
                        <p className="text-xs font-semibold text-zinc-200 truncate cursor-pointer" onClick={() => onPreviewFile(file)}>
                          {file.name}
                        </p>
                      )}
                      
                      <div className="flex items-center space-x-2 mt-1.5">
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-500 border border-zinc-700 font-mono">{file.type}</span>
                        <span className="text-[9px] text-zinc-600 font-medium">{file.size}</span>
                        <span className="text-[9px] text-zinc-700">•</span>
                        <span className="text-[9px] text-zinc-600">{file.category}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions Overlay */}
                <div className="flex justify-end space-x-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button 
                     onClick={() => { setEditingId(file.id); setEditName(file.name); }}
                     className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-zinc-300"
                     title="重命名"
                   >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                   </button>
                   <button 
                     onClick={() => onPreviewFile(file)}
                     className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-zinc-300"
                     title="预览"
                   >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                   </button>
                   <button 
                     onClick={() => onDeleteFile(file.id)}
                     className="p-1.5 hover:bg-red-900/20 rounded-lg text-red-500/50 hover:text-red-500"
                     title="删除"
                   >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
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
