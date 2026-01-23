
import React, { useState } from 'react';
import { AuditFile } from '../types';

interface FilePreviewModalProps {
  file: AuditFile;
  onClose: () => void;
}

export const FilePreviewModal: React.FC<FilePreviewModalProps> = ({ file, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(`这是文件 "${file.name}" 的预览内容。\n\n在真实环境中，这里会根据文件类型（PDF/Excel/Word）渲染对应的阅读器或编辑器。\n\n审计要点：\n1. 检查是否存在异常交易额\n2. 核实签字的完整性\n3. 对比历史年度数据的增长率`);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0a0a0a] border border-zinc-800 w-full h-full rounded-2xl shadow-2xl flex flex-col overflow-hidden max-w-6xl max-h-[90vh]">
        {/* Modal Header */}
        <div className="h-14 bg-[#111111] border-b border-zinc-800 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
             <div className="bg-zinc-800 p-1.5 rounded text-zinc-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
             </div>
             <div>
                <h3 className="text-sm font-semibold text-zinc-100">{file.name}</h3>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{file.type} • {file.size} • {file.source}</p>
             </div>
          </div>
          <div className="flex items-center space-x-2">
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="px-3 py-1.5 text-xs font-medium bg-zinc-800 text-zinc-300 rounded border border-zinc-700 hover:bg-zinc-700"
              >
                编辑内容
              </button>
            ) : (
              <button 
                onClick={() => { setIsEditing(false); alert('内容已保存'); }}
                className="px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded hover:bg-blue-500"
              >
                保存修改
              </button>
            )}
            <button className="px-3 py-1.5 text-xs font-medium bg-zinc-800 text-zinc-300 rounded border border-zinc-700 hover:bg-zinc-700">
               导出文件
            </button>
            <div className="w-px h-6 bg-zinc-800 mx-2"></div>
            <button 
              onClick={onClose}
              className="p-1.5 hover:bg-red-900/20 text-zinc-500 hover:text-red-500 rounded transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-auto p-12 bg-[#050505]">
           <div className="max-w-4xl mx-auto h-full">
              {isEditing ? (
                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  className="w-full h-full bg-transparent border-none focus:outline-none text-zinc-300 font-mono text-sm leading-relaxed resize-none"
                />
              ) : (
                <div className="whitespace-pre-wrap text-zinc-300 font-mono text-sm leading-relaxed">
                  {content}
                </div>
              )}
           </div>
        </div>

        {/* Modal Footer (Status Bar) */}
        <div className="h-10 bg-[#0a0a0a] border-t border-zinc-800 px-6 flex items-center justify-between text-[10px] text-zinc-600 font-medium">
           <div className="flex items-center space-x-4">
              <span>状态: 就绪</span>
              <span>版本: V1.0.4</span>
           </div>
           <div>最后编辑: {file.uploadTime}</div>
        </div>
      </div>
    </div>
  );
};
