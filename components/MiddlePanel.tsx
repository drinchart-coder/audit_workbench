
import React, { useState, useEffect, useRef } from 'react';
import { WorkingPaper, PaperTemplate, ThemeType, AuditFile } from '../types';

interface MiddlePanelProps {
  theme: ThemeType;
  data: WorkingPaper;
  onSave: (data: WorkingPaper) => void;
  onPreviewFileById: (id: string) => void;
}

const TEMPLATES: PaperTemplate[] = [
  { 
    id: '1', 
    name: '收入循环审计模板', 
    program: '核查销售收入的真实性、完整性', 
    process: '1. 抽取销售发票样本\n2. 检查发货记录与收款凭证\n3. 执行收入截止性测试',
    matter: '销售收入真实性与截止性审计',
    basis: '《中国注册会计师审计准则第1101号》、企业会计准则'
  },
  { 
    id: '2', 
    name: '固定资产实务审计模板', 
    program: '核实固定资产账面价值与实物一致性', 
    process: '1. 获取固定资产明细表\n2. 现场观察实物并核对标签\n3. 记录折旧计提是否合规',
    matter: '固定资产实物完整性盘点',
    basis: '固定资产管理制度、实物资产盘点指引'
  },
  { 
    id: '3', 
    name: '货币资金合规审计模板', 
    program: '验证银行对账单与日记账一致性', 
    process: '1. 获取银行询证函回函\n2. 核对银行存款余额调节表\n3. 检查大额资金往来授权',
    matter: '货币资金安全与合规性审查',
    basis: '《中国注册会计师审计准则第1312号——函证》'
  }
];

export const MiddlePanel: React.FC<MiddlePanelProps> = ({ theme, data, onSave, onPreviewFileById }) => {
  const [form, setForm] = useState<WorkingPaper>(data);
  const [showTemplates, setShowTemplates] = useState(false);
  const [lastSaved, setLastSaved] = useState<string>('从未');
  const [isEditingProcess, setIsEditingProcess] = useState(false);
  const [isDragOverProcess, setIsDragOverProcess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [evidenceCount, setEvidenceCount] = useState(0);

  useEffect(() => {
    setForm(data);
  }, [data]);

  const handleApplyTemplate = (tpl: PaperTemplate) => {
    setForm(prev => ({
      ...prev,
      program: tpl.program,
      process: tpl.process,
      matter: tpl.matter || prev.matter,
      basis: tpl.basis || prev.basis,
    }));
    setShowTemplates(false);
  };

  const handleSave = () => {
    onSave(form);
    setLastSaved(new Date().toLocaleTimeString());
  };

  const handleExport = () => {
    const textContent = `
底稿名称: ${form.name}
编号: ${form.refNumber}
被审计对象: ${form.auditee}
审计事项: ${form.matter}
审计依据: ${form.basis}
审计程序: ${form.program}

审计过程:
${form.process}

审计结果:
${form.results}
    `;
    const blob = new Blob([textContent.trim()], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${form.name}_${form.refNumber}.txt`;
    a.click();
  };

  const handleEvidenceUpload = () => {
    fileInputRef.current?.click();
  };

  const onProcessDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOverProcess(false);
    const fileData = e.dataTransfer.getData('application/audit-file');
    if (fileData) {
      const file: AuditFile = JSON.parse(fileData);
      const reference = `[REF:${file.id}|${file.name}]`;
      setForm(prev => ({
        ...prev,
        process: prev.process + (prev.process ? '\n' : '') + reference
      }));
    }
  };

  // Helper to render text with clickable file links
  const renderProcessText = (text: string) => {
    if (!text) return <span className="opacity-40 italic">尚未填写审计过程...</span>;
    
    const parts = text.split(/(\[REF:[^|]+\|[^\]]+\])/g);
    return parts.map((part, i) => {
      const match = part.match(/\[REF:([^|]+)\|([^\]]+)\]/);
      if (match) {
        const [, id, name] = match;
        return (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); onPreviewFileById(id); }}
            className="mx-1 px-2 py-0.5 rounded bg-blue-500/20 border border-blue-500/30 text-blue-500 font-bold hover:bg-blue-500/30 transition-all text-xs"
          >
            📎 {name}
          </button>
        );
      }
      return <span key={i} className="whitespace-pre-wrap">{part}</span>;
    });
  };

  const colors = {
    white: {
      input: 'bg-white border-[#D2D2D7] text-[#1D1D1F] placeholder-[#D2D2D7]',
      label: 'text-[#86868B]',
      secondaryBtn: 'bg-white border-[#D2D2D7] text-[#1D1D1F] hover:bg-[#F5F5F7] shadow-sm',
      card: 'bg-white border-[#D2D2D7] shadow-2xl',
      textMain: 'text-[#1D1D1F]',
      textSub: 'text-[#86868B]',
      exportBtn: 'bg-[#1D1D1F] text-white hover:bg-black',
      sectionBg: 'bg-white/50 border-white/80 backdrop-blur-sm',
      metaLabel: 'bg-[#F5F5F7] text-[#86868B]'
    },
    blue: {
      input: 'bg-[#000C14] border-[#003354] text-white placeholder-blue-900/50',
      label: 'text-blue-400',
      secondaryBtn: 'bg-[#001424] border-[#003354] text-blue-100 hover:bg-[#003354] shadow-lg shadow-blue-900/20',
      card: 'bg-[#001424] border-[#003354] shadow-2xl',
      textMain: 'text-white',
      textSub: 'text-blue-300',
      exportBtn: 'bg-white text-black hover:bg-blue-400',
      sectionBg: 'bg-[#001424]/30 border-blue-900/20 backdrop-blur-sm',
      metaLabel: 'bg-[#001424] text-blue-400/80'
    },
    grey: {
      input: 'bg-[#0a0a0a] border-zinc-800/80 text-zinc-100 placeholder-zinc-800',
      label: 'text-zinc-500',
      secondaryBtn: 'bg-zinc-900/80 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:border-zinc-600 shadow-lg shadow-black/20',
      card: 'bg-zinc-900 border-zinc-700 shadow-2xl',
      textMain: 'text-white',
      textSub: 'text-zinc-500',
      exportBtn: 'bg-white text-black hover:bg-blue-500',
      sectionBg: 'bg-zinc-900/20 border-zinc-800/50 backdrop-blur-sm',
      metaLabel: 'bg-zinc-900 text-zinc-600'
    }
  }[theme];

  return (
    <div className="h-full flex flex-col p-10 max-w-6xl mx-auto w-full overflow-y-auto relative custom-scrollbar transition-all duration-700">
      {showTemplates && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xl z-[100] flex items-center justify-center p-8 animate-in fade-in zoom-in-95 duration-300">
           <div className={`max-w-2xl w-full border rounded-[2.5rem] p-8 ${colors.card}`}>
              <div className="flex justify-between items-center mb-8">
                 <div>
                   <h3 className={`text-xl font-black tracking-tight ${colors.textMain}`}>底稿预设模板</h3>
                   <p className={`text-[10px] uppercase font-bold tracking-widest mt-1 ${colors.textSub}`}>Working Paper Templates</p>
                 </div>
                 <button onClick={() => setShowTemplates(false)} className={`${colors.textSub} hover:text-red-500 transition-colors p-2 rounded-full hover:bg-black/5`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                 </button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                 {TEMPLATES.map(t => (
                   <button 
                     key={t.id}
                     onClick={() => handleApplyTemplate(t)}
                     className={`w-full text-left p-6 rounded-3xl border transition-all duration-300 group hover:scale-[1.02] active:scale-[0.98] ${colors.secondaryBtn}`}
                   >
                      <div className="flex justify-between items-center mb-2">
                        <h4 className={`text-sm font-black group-hover:text-blue-500 transition-colors uppercase tracking-tight`}>{t.name}</h4>
                        <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                        </div>
                      </div>
                      <p className={`text-xs leading-relaxed ${colors.textSub}`}>{t.program}</p>
                   </button>
                 ))}
              </div>
           </div>
        </div>
      )}

      <div className="flex items-end justify-between mb-12">
        <div className="flex-1">
          <input
            type="text"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className={`text-4xl font-black tracking-tighter bg-transparent border-none focus:outline-none w-full ${colors.textMain}`}
          />
          <div className="flex items-center space-x-3 mt-3">
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border ${colors.secondaryBtn}`}>Draft Edition 1.0</span>
            <div className={`w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse`}></div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setShowTemplates(true)}
            className={`flex items-center space-x-2.5 px-6 py-3.5 text-xs font-black uppercase tracking-widest rounded-2xl transition-all border group ${colors.secondaryBtn}`}
          >
            <svg className="w-4 h-4 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            <span>导入底稿模板</span>
          </button>
          <button 
            onClick={handleSave}
            className="px-8 py-3.5 text-xs font-black uppercase tracking-widest bg-blue-600 text-white rounded-2xl hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20 active:scale-95"
          >
            保存当前版本
          </button>
        </div>
      </div>

      <div className="space-y-10 pb-24">
        {/* Working Paper Metadata Grid */}
        <div className={`grid grid-cols-3 gap-6 p-8 rounded-[2rem] border transition-all duration-500 ${colors.sectionBg}`}>
          <div className="space-y-2">
            <label className={`text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded ${colors.metaLabel}`}>编号 / Serial No.</label>
            <input
              type="text"
              value={form.refNumber}
              onChange={e => setForm(f => ({ ...f, refNumber: e.target.value }))}
              className={`w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all text-xs font-black border ${colors.input}`}
            />
          </div>
          <div className="col-span-2 space-y-2">
            <label className={`text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded ${colors.metaLabel}`}>被审计对象 / Auditee</label>
            <input
              type="text"
              value={form.auditee}
              onChange={e => setForm(f => ({ ...f, auditee: e.target.value }))}
              className={`w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all text-xs font-black border ${colors.input}`}
            />
          </div>
          <div className="col-span-3 space-y-2">
            <label className={`text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded ${colors.metaLabel}`}>审计事项 / Audit Matter</label>
            <input
              type="text"
              value={form.matter}
              onChange={e => setForm(f => ({ ...f, matter: e.target.value }))}
              placeholder="请输入本次审计针对的具体事项"
              className={`w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all text-xs font-black border ${colors.input}`}
            />
          </div>
          <div className="col-span-3 space-y-2">
            <label className={`text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded ${colors.metaLabel}`}>审计依据 / Audit Basis</label>
            <input
              type="text"
              value={form.basis}
              onChange={e => setForm(f => ({ ...f, basis: e.target.value }))}
              placeholder="列明适用的法律、法规、准则或制度"
              className={`w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all text-xs font-black border ${colors.input}`}
            />
          </div>
        </div>

        <section className={`p-8 rounded-[2rem] border transition-all duration-500 ${colors.sectionBg}`}>
          <label className={`text-[10px] font-black uppercase tracking-[0.3em] pl-1 block mb-5 transition-colors ${colors.label}`}>01. 审计程序录入</label>
          <input
            type="text"
            value={form.program}
            onChange={e => setForm(f => ({ ...f, program: e.target.value }))}
            placeholder="例如：2024年度固定资产减值准备复核"
            className={`w-full rounded-2xl px-6 py-5 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all text-sm font-black tracking-tight border shadow-inner ${colors.input}`}
          />
        </section>

        <section className={`p-8 rounded-[2rem] border transition-all duration-500 ${colors.sectionBg}`}>
          <label className={`text-[10px] font-black uppercase tracking-[0.3em] pl-1 block mb-5 transition-colors ${colors.label}`}>02. 审计证据上传</label>
          <div 
            onClick={handleEvidenceUpload}
            className={`flex flex-col items-center justify-center py-10 border-2 border-dashed rounded-3xl cursor-pointer transition-all group ${colors.secondaryBtn}`}
          >
            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 mb-3 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
            </div>
            <p className="text-xs font-black uppercase tracking-widest mb-1">点击或拖拽上传审计证据</p>
            <p className={`text-[10px] ${colors.textSub}`}>支持 PDF, Excel, Word, 图片等格式 (当前已链接 {evidenceCount} 个文件)</p>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={(e) => setEvidenceCount(prev => prev + (e.target.files?.length || 0))} 
              multiple 
            />
          </div>
        </section>

        <section 
          className={`p-8 rounded-[2rem] border transition-all duration-500 relative ${isDragOverProcess ? 'ring-4 ring-blue-500/50 scale-[1.01] bg-blue-500/5' : colors.sectionBg}`}
          onDragOver={(e) => { e.preventDefault(); setIsDragOverProcess(true); }}
          onDragLeave={() => setIsDragOverProcess(false)}
          onDrop={onProcessDrop}
        >
          <div className="flex justify-between items-center mb-5">
            <label className={`text-[10px] font-black uppercase tracking-[0.3em] pl-1 block transition-colors ${colors.label}`}>03. 审计过程记录</label>
            <button 
              onClick={() => setIsEditingProcess(!isEditingProcess)}
              className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
            >
              {isEditingProcess ? '完成编辑' : '点击编辑'}
            </button>
          </div>
          
          <div className="relative">
            {isEditingProcess ? (
              <textarea
                rows={14}
                autoFocus
                value={form.process}
                onBlur={() => setIsEditingProcess(false)}
                onChange={e => setForm(f => ({ ...f, process: e.target.value }))}
                placeholder="请详述审计步骤、证据获取过程、抽样逻辑等关键信息... (拖入左侧文件可自动关联引用)"
                className={`w-full rounded-2xl px-6 py-5 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all resize-none text-sm leading-relaxed border shadow-inner font-medium ${colors.input}`}
              />
            ) : (
              <div 
                onClick={() => setIsEditingProcess(true)}
                className={`w-full min-h-[350px] rounded-2xl px-6 py-5 text-sm leading-relaxed border shadow-inner font-medium cursor-text ${colors.input}`}
              >
                {renderProcessText(form.process)}
              </div>
            )}
            <div className={`absolute right-6 bottom-6 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${colors.secondaryBtn}`}>
              {form.process.length} CHARS
            </div>
          </div>
          {isDragOverProcess && (
            <div className="absolute inset-0 flex items-center justify-center bg-blue-500/10 backdrop-blur-sm rounded-[2rem] z-10 pointer-events-none">
              <div className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl">
                投放以引用文件
              </div>
            </div>
          )}
        </section>

        <section className={`p-8 rounded-[2rem] border transition-all duration-500 ${colors.sectionBg}`}>
          <label className={`text-[10px] font-black uppercase tracking-[0.3em] pl-1 block mb-5 transition-colors ${colors.label}`}>04. 审计结论生成</label>
          <textarea
            rows={5}
            value={form.results}
            onChange={e => setForm(f => ({ ...f, results: e.target.value }))}
            placeholder="请输入最终审计意见与后续待跟进事项..."
            className={`w-full rounded-2xl px-6 py-5 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all resize-none text-sm font-black border shadow-inner tracking-tight ${colors.input}`}
          />
        </section>

        <div className={`pt-12 border-t flex justify-between items-center transition-colors ${theme === 'white' ? 'border-[#D2D2D7]' : 'border-white/5'}`}>
          <button 
            onClick={() => setForm(prev => ({ ...prev, confirmationGenerated: true }))}
            className={`flex items-center space-x-4 px-8 py-5 rounded-2xl border text-[11px] font-black uppercase tracking-widest transition-all shadow-sm ${form.confirmationGenerated ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:scale-[1.02] hover:shadow-lg'} ${colors.secondaryBtn}`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${form.confirmationGenerated ? 'bg-green-500 text-white' : 'bg-black/5 text-zinc-400'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span>{form.confirmationGenerated ? '确认单已推送至审核' : '一键生成审计确认单'}</span>
          </button>
          
          <div className="flex items-center space-x-6">
             <div className="text-right">
                <p className={`text-[9px] font-black uppercase tracking-widest opacity-50 mb-1 ${colors.textSub}`}>Last Auto-Save</p>
                <p className={`text-xs font-black font-mono transition-colors ${colors.textMain}`}>{lastSaved}</p>
             </div>
             <button 
               onClick={handleExport}
               className={`group relative px-10 py-5 text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all hover:scale-[1.05] active:scale-[0.98] shadow-2xl ${colors.exportBtn}`}
             >
               导出审计成果
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};
