
import React, { useState } from 'react';
import { AuditFile, ThemeType } from '../types';

interface FilePreviewModalProps {
  theme: ThemeType;
  file: AuditFile;
  onClose: () => void;
}

export const FilePreviewModal: React.FC<FilePreviewModalProps> = ({ theme, file, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(`这是文件 "${file.name}" 的预览内容。\n\n在真实环境中，这里会根据文件类型（PDF/Excel/Word）渲染对应的阅读器或编辑器。\n\n审计要点：\n1. 检查是否存在异常交易额\n2. 核实签字的完整性\n3. 对比历史年度数据的增长率`);

  const colors = {
    white: {
      bg: 'bg-white',
      header: 'bg-[#F5F5F7] border-[#D2D2D7]',
      textMain: 'text-[#1D1D1F]',
      textSub: 'text-[#86868B]',
      btn: 'bg-white border-[#D2D2D7] text-[#1D1D1F] hover:bg-[#F5F5F7]',
      editor: 'bg-white text-[#1D1D1F]'
    },
    blue: {
      bg: 'bg-[#000C14]',
      header: 'bg-[#001424] border-[#003354]',
      textMain: 'text-white',
      textSub: 'text-blue-300',
      btn: 'bg-[#003354] border-[#003354] text-white hover:bg-[#004466]',
      editor: 'bg-[#000C14] text-white'
    },
    grey: {
      bg: 'bg-[#050505]',
      header: 'bg-[#111111] border-zinc-800',
      textMain: 'text-zinc-100',
      textSub: 'text-zinc-500',
      btn: 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700',
      editor: 'bg-[#050505] text-zinc-300'
    }
  }[theme];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className={`border w-full h-full rounded-2xl shadow-2xl flex flex-col overflow-hidden max-w-6xl max-h-[90vh] transition-colors duration-500 ${colors.bg} ${colors.header.split(' ')[1]}`}>
        <div className={`h-14 border-b px-6 flex items-center justify-between shrink-0 ${colors.header}`}>
          <div className="flex items-center space-x-3">
             <div className={`p-1.5 rounded transition-colors ${theme === 'white' ? 'bg-zinc-200 text-zinc-600' : 'bg-zinc-800 text-zinc-400'}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
             </div>
             <div>
                <h3 className={`text-sm font-semibold ${colors.textMain}`}>{file.name}</h3>
                <p className={`text-[10px] uppercase tracking-widest ${colors.textSub}`}>{file.type} • {file.size} • {file.source}</p>
             </div>
          </div>
          <div className="flex items-center space-x-2">
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className={`px-3 py-1.5 text-xs font-medium rounded border transition-colors ${colors.btn}`}
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
            <button className={`px-3 py-1.5 text-xs font-medium rounded border transition-colors ${colors.btn}`}>
               导出文件
            </button>
            <div className={`w-px h-6 mx-2 ${theme === 'white' ? 'bg-[#D2D2D7]' : 'bg-zinc-800'}`}></div>
            <button 
              onClick={onClose}
              className={`p-1.5 hover:bg-red-500/10 text-zinc-500 hover:text-red-500 rounded transition-colors`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        <div className={`flex-1 overflow-auto p-12 transition-colors duration-500 ${colors.editor.split(' ')[0]}`}>
           <div className="max-w-4xl mx-auto h-full">
              {isEditing ? (
                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  className={`w-full h-full bg-transparent border-none focus:outline-none font-mono text-sm leading-relaxed resize-none ${colors.textMain}`}
                />
              ) : (
                <div className={`whitespace-pre-wrap font-mono text-sm leading-relaxed ${colors.textMain}`}>
                  {content}
                </div>
              )}
           </div>
        </div>

        <div className={`h-10 border-t px-6 flex items-center justify-between text-[10px] font-medium ${colors.header}`}>
           <div className={`flex items-center space-x-4 ${colors.textSub}`}>
              <span>状态: 就绪</span>
              <span>版本: V1.0.4</span>
           </div>
           <div className={colors.textSub}>最后编辑: {file.uploadTime}</div>
        </div>
      </div>
    </div>
  );
};
