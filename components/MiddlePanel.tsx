
import React, { useState, useEffect } from 'react';
import { WorkingPaper, PaperTemplate } from '../types';

interface MiddlePanelProps {
  data: WorkingPaper;
  onSave: (data: WorkingPaper) => void;
}

const TEMPLATES: PaperTemplate[] = [
  { id: '1', name: '收入循环审计模板', program: '核查销售收入的真实性、完整性', process: '1. 抽取销售发票样本\n2. 检查发货记录与收款凭证\n3. 执行收入截止性测试' },
  { id: '2', name: '固定资产实物盘点模板', program: '核实固定资产账面价值与实物一致性', process: '1. 获取固定资产明细表\n2. 现场观察实物并核对标签\n3. 记录折旧计提是否合规' },
  { id: '3', name: '货币资金合规审计模板', program: '验证银行对账单与日记账一致性', process: '1. 获取银行询证函回函\n2. 核对银行存款余额调节表\n3. 检查大额资金往来授权' }
];

export const MiddlePanel: React.FC<MiddlePanelProps> = ({ data, onSave }) => {
  const [form, setForm] = useState<WorkingPaper>(data);
  const [showTemplates, setShowTemplates] = useState(false);
  const [lastSaved, setLastSaved] = useState<string>('从未');

  useEffect(() => {
    setForm(data);
  }, [data]);

  const handleApplyTemplate = (tpl: PaperTemplate) => {
    setForm(prev => ({
      ...prev,
      program: tpl.program,
      process: tpl.process
    }));
    setShowTemplates(false);
  };

  const handleSave = () => {
    onSave(form);
    setLastSaved(new Date().toLocaleTimeString());
  };

  const handleExport = () => {
    const blob = new Blob([`审计程序: ${form.program}\n\n审计过程:\n${form.process}\n\n审计结果:\n${form.results}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `审计底稿_${new Date().getTime()}.txt`;
    a.click();
  };

  return (
    <div className="h-full flex flex-col p-8 max-w-5xl mx-auto w-full overflow-y-auto relative custom-scrollbar">
      {/* Templates Drawer Overlay */}
      {showTemplates && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md z-20 p-8 animate-in fade-in zoom-in duration-300">
           <div className="max-w-xl mx-auto bg-zinc-900 border border-zinc-700 rounded-3xl shadow-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-lg font-bold text-white">选择底稿模板</h3>
                 <button onClick={() => setShowTemplates(false)} className="text-zinc-500 hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                 </button>
              </div>
              <div className="space-y-3">
                 {TEMPLATES.map(t => (
                   <button 
                     key={t.id}
                     onClick={() => handleApplyTemplate(t)}
                     className="w-full text-left p-4 rounded-2xl bg-zinc-800/50 hover:bg-blue-600/10 border border-zinc-700 hover:border-blue-500/50 transition-all group"
                   >
                      <h4 className="text-sm font-semibold text-zinc-200 group-hover:text-blue-400">{t.name}</h4>
                      <p className="text-[10px] text-zinc-500 mt-1 line-clamp-1">{t.program}</p>
                   </button>
                 ))}
              </div>
           </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">审计底稿工作区</h2>
          <p className="text-zinc-500 text-sm mt-2 font-medium">Drafting & Review • V1.0</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowTemplates(true)}
            className="flex items-center space-x-2 px-5 py-2.5 text-xs font-bold bg-zinc-900 text-zinc-300 rounded-xl hover:bg-zinc-800 transition-all border border-zinc-800"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            <span>导入底稿模板</span>
          </button>
          <button 
            onClick={handleSave}
            className="px-6 py-2.5 text-xs font-bold bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-all shadow-[0_4px_20px_-5px_rgba(37,99,235,0.4)]"
          >
            保存当前版本
          </button>
        </div>
      </div>

      <div className="space-y-8 pb-20">
        {/* Audit Program */}
        <section className="space-y-3 group">
          <label className="text-[11px] font-black text-zinc-500 uppercase tracking-widest pl-1 group-focus-within:text-blue-500 transition-colors">01. 审计程序录入</label>
          <input
            type="text"
            value={form.program}
            onChange={e => setForm(f => ({ ...f, program: e.target.value }))}
            placeholder="例如：2024年度固定资产减值准备复核"
            className="w-full bg-[#0a0a0a] border border-zinc-800/80 rounded-2xl px-5 py-4 text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/30 transition-all placeholder:text-zinc-800 text-sm font-medium"
          />
        </section>

        {/* Audit Process */}
        <section className="space-y-3 group">
          <label className="text-[11px] font-black text-zinc-500 uppercase tracking-widest pl-1 group-focus-within:text-blue-500 transition-colors">02. 审计过程记录</label>
          <div className="relative">
            <textarea
              rows={12}
              value={form.process}
              onChange={e => setForm(f => ({ ...f, process: e.target.value }))}
              placeholder="请详述审计步骤、证据获取过程、抽样逻辑等关键信息..."
              className="w-full bg-[#0a0a0a] border border-zinc-800/80 rounded-2xl px-5 py-4 text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/30 transition-all placeholder:text-zinc-800 resize-none text-sm leading-relaxed"
            />
            <div className="absolute right-4 bottom-4 text-[10px] text-zinc-700 font-mono">
              {form.process.length} 字
            </div>
          </div>
        </section>

        {/* Audit Results */}
        <section className="space-y-3 group">
          <label className="text-[11px] font-black text-zinc-500 uppercase tracking-widest pl-1 group-focus-within:text-blue-500 transition-colors">03. 审计结论生成</label>
          <textarea
            rows={4}
            value={form.results}
            onChange={e => setForm(f => ({ ...f, results: e.target.value }))}
            placeholder="请输入最终审计意见与后续待跟进事项..."
            className="w-full bg-[#0a0a0a] border border-zinc-800/80 rounded-2xl px-5 py-4 text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/30 transition-all placeholder:text-zinc-800 resize-none text-sm font-medium"
          />
        </section>

        {/* Footer Actions */}
        <div className="pt-8 border-t border-zinc-900 flex justify-between items-center">
          <button 
            onClick={() => setForm(prev => ({ ...prev, confirmationGenerated: true }))}
            className={`flex items-center space-x-3 px-6 py-4 rounded-2xl border text-xs font-bold transition-all shadow-sm ${form.confirmationGenerated ? 'bg-zinc-800/50 text-zinc-500 border-zinc-700' : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-500 hover:text-white'}`}
          >
            <svg className={`w-5 h-5 ${form.confirmationGenerated ? 'text-green-500' : 'text-zinc-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{form.confirmationGenerated ? '确认单已推送至审核' : '一键生成审计确认单'}</span>
          </button>
          
          <div className="flex items-center space-x-4">
             <div className="text-right">
                <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-tighter">最后自动保存</p>
                <p className="text-xs text-zinc-400 font-mono">{lastSaved}</p>
             </div>
             <button 
               onClick={handleExport}
               className="group relative px-8 py-4 text-xs font-black bg-white text-black rounded-2xl transition-all hover:bg-blue-400 hover:scale-[1.02] active:scale-[0.98]"
             >
               导出审计成果
               <div className="absolute inset-0 rounded-2xl border-2 border-white group-hover:border-blue-400 group-hover:scale-105 opacity-0 group-hover:opacity-100 transition-all"></div>
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};
