
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { AuditFile, ChatMessage, AnalysisResult, AUDIT_AGENTS, ThemeType } from '../types';

interface RightPanelProps {
  theme: ThemeType;
  selectedFiles: AuditFile[];
  analysisHistory: AnalysisResult[];
  messages: ChatMessage[];
  onAddAnalysis: (res: AnalysisResult) => void;
  onAddChatMessage: (msg: ChatMessage) => void;
  onSelectFile: (id: string, selected: boolean) => void;
}

export const RightPanel: React.FC<RightPanelProps> = ({ 
  theme, selectedFiles, analysisHistory, messages, onAddAnalysis, onAddChatMessage, onSelectFile 
}) => {
  const [activeTab, setActiveTab] = useState<'AI' | 'ANALYSIS'>('AI');
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState(AUDIT_AGENTS[0].id);
  const [isDragOverPrompt, setIsDragOverPrompt] = useState(false);

  const selectedAgent = AUDIT_AGENTS.find(a => a.id === selectedAgentId) || AUDIT_AGENTS[0];

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: Date.now()
    };

    onAddChatMessage(userMsg);
    setInputValue('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const fileContext = selectedFiles.length > 0 
        ? `。当前选中的审计上下文文件包括: ${selectedFiles.map(f => f.name).join(', ')}。`
        : '';

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `你当前作为 "${selectedAgent.name}"。用户询问: ${inputValue}${fileContext}`,
        config: {
          systemInstruction: `你是一站式审计工作台的AI辅助专家。当前身份是：${selectedAgent.name}（${selectedAgent.description}）。你的回复必须：1. 极其专业严谨；2. 引用提供的文件内容（如果有）；3. 提供可执行的审计建议。`,
        },
      });

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.text || '对不起，我暂时无法回答。',
        timestamp: Date.now()
      };

      onAddChatMessage(assistantMsg);
    } catch (error) {
      console.error(error);
      onAddChatMessage({
        id: 'err-' + Date.now(), role: 'assistant', content: 'AI服务响应超时，请检查API配置。', timestamp: Date.now()
      });
    } finally {
      setIsTyping(false);
    }
  };

  const runAnalysis = () => {
    setIsTyping(true);
    setTimeout(() => {
      const result: AnalysisResult = {
        id: Math.random().toString(),
        title: `全量数据异常扫描报告_${new Date().getHours()}${new Date().getMinutes()}`,
        link: '#',
        screenshot: `https://picsum.photos/seed/${Math.random()}/600/400`,
        timestamp: new Date().toLocaleString()
      };
      onAddAnalysis(result);
      setIsTyping(false);
      alert('非现场数据分析已完成，结果已存证。');
    }, 2000);
  };

  const onPromptDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOverPrompt(false);
    const fileData = e.dataTransfer.getData('application/audit-file');
    if (fileData) {
      const file: AuditFile = JSON.parse(fileData);
      onSelectFile(file.id, true);
      const referenceText = `关于文件《${file.name}》的审计点：`;
      setInputValue(prev => referenceText + (prev ? '\n' : '') + prev);
    }
  };

  const colors = {
    white: {
      navBg: 'bg-white/80',
      border: 'border-[#D2D2D7]',
      input: 'bg-white border-[#D2D2D7] text-[#1D1D1F] shadow-inner',
      msgAssistant: 'bg-[#F5F5F7] text-[#1D1D1F] border-[#D2D2D7]',
      label: 'text-[#86868B]',
      card: 'bg-white border-[#D2D2D7] shadow-lg',
      textSub: 'text-[#86868B]',
      btnSecondary: 'bg-[#F5F5F7] text-[#1D1D1F] border-[#D2D2D7] hover:bg-[#E8E8ED]'
    },
    blue: {
      navBg: 'bg-[#001424]/90',
      border: 'border-[#003354]',
      input: 'bg-[#000C14] border-[#003354] text-white shadow-inner',
      msgAssistant: 'bg-[#003354]/40 text-blue-100 border-[#003354]',
      label: 'text-blue-400',
      card: 'bg-[#001424] border-[#003354] shadow-xl',
      textSub: 'text-blue-300',
      btnSecondary: 'bg-[#003354]/40 text-blue-100 border-[#003354] hover:bg-[#003354]'
    },
    grey: {
      navBg: 'bg-[#1D1D1F]/90',
      border: 'border-zinc-800',
      input: 'bg-zinc-950 border-zinc-800 text-zinc-100 shadow-inner',
      msgAssistant: 'bg-zinc-800/50 text-zinc-200 border-zinc-700/50',
      label: 'text-zinc-600',
      card: 'bg-zinc-900/60 border-zinc-800 shadow-xl',
      textSub: 'text-zinc-500',
      btnSecondary: 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700'
    }
  }[theme];

  return (
    <div className={`flex flex-col h-full overflow-hidden transition-all duration-700`}>
      <div className={`flex px-6 pt-5 border-b shrink-0 backdrop-blur-md ${colors.navBg} ${colors.border}`}>
        <button
          onClick={() => setActiveTab('AI')}
          className={`flex-1 pb-4 text-[10px] font-black uppercase tracking-[0.25em] transition-all border-b-[3px] relative ${activeTab === 'AI' ? 'text-blue-500 border-blue-500' : 'text-zinc-500 border-transparent hover:text-blue-400/50'}`}
        >
          AI 智能交互
          {activeTab === 'AI' && <div className="absolute -bottom-[3px] left-0 right-0 h-[3px] bg-blue-500 blur-[2px] opacity-50" />}
        </button>
        <button
          onClick={() => setActiveTab('ANALYSIS')}
          className={`flex-1 pb-4 text-[10px] font-black uppercase tracking-[0.25em] transition-all border-b-[3px] relative ${activeTab === 'ANALYSIS' ? 'text-purple-500 border-purple-500' : 'text-zinc-500 border-transparent hover:text-purple-400/50'}`}
        >
          非现场交互
          {activeTab === 'ANALYSIS' && <div className="absolute -bottom-[3px] left-0 right-0 h-[3px] bg-purple-500 blur-[2px] opacity-50" />}
        </button>
      </div>

      <div className="flex-1 overflow-hidden relative flex flex-col">
        {activeTab === 'AI' ? (
          <div className="flex flex-col h-full p-5">
            <div className="flex space-x-3 mb-5">
              <div className="flex-1">
                <label className={`text-[9px] font-black uppercase mb-1.5 block pl-1 tracking-widest ${colors.label}`}>Expert Agent</label>
                <select 
                  value={selectedAgentId}
                  onChange={e => setSelectedAgentId(e.target.value)}
                  className={`w-full rounded-xl px-3 py-2 text-[11px] font-black focus:outline-none focus:ring-2 focus:ring-blue-500/30 border transition-all appearance-none cursor-pointer ${colors.input}`}
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23666'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center', backgroundSize: '12px' }}
                >
                  {AUDIT_AGENTS.map(agent => (
                    <option key={agent.id} value={agent.id}>{agent.name}</option>
                  ))}
                </select>
              </div>
              <div className="w-28">
                <label className={`text-[9px] font-black uppercase mb-1.5 block pl-1 tracking-widest ${colors.label}`}>Context</label>
                <div className={`rounded-xl px-3 py-2 text-[10px] font-black flex items-center justify-center border transition-all ${colors.input} !text-blue-500`}>
                  {selectedFiles.length} FILES
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-5 mb-5 pr-1 custom-scrollbar">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center px-10 opacity-30">
                  <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mb-6 border-2 border-dashed ${colors.border} transition-all`}>
                     <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </div>
                  <h4 className={`text-xs font-black mb-2 uppercase tracking-[0.2em] ${theme === 'white' ? 'text-zinc-900' : 'text-white'}`}>等待指令注入</h4>
                  <p className={`text-[10px] leading-relaxed font-medium uppercase tracking-tighter ${colors.textSub}`}>勾选左侧资料后，即可开启多智能体协同审计分析。</p>
                </div>
              ) : (
                messages.map(m => (
                  <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                    <div className={`max-w-[90%] rounded-[1.5rem] px-5 py-4 text-xs leading-relaxed shadow-xl ${m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : `rounded-tl-none border backdrop-blur-sm ${colors.msgAssistant}`}`}>
                      <div className="font-medium whitespace-pre-wrap">{m.content}</div>
                      <div className={`text-[8px] mt-3 font-black uppercase tracking-widest opacity-40 ${m.role === 'user' ? 'text-right' : ''}`}>
                        {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))
              )}
              {isTyping && (
                <div className="flex justify-start">
                  <div className={`rounded-[1.5rem] px-5 py-4 rounded-tl-none border backdrop-blur-sm ${colors.msgAssistant}`}>
                    <div className="flex space-x-1.5">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-.15s]"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-.3s]"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div 
              className={`relative pt-3 transition-all ${isDragOverPrompt ? 'scale-[1.02]' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setIsDragOverPrompt(true); }}
              onDragLeave={() => setIsDragOverPrompt(false)}
              onDrop={onPromptDrop}
            >
              <div className={`absolute left-4 -top-0.5 px-2 text-[8px] font-black text-blue-500 uppercase tracking-widest z-10 border rounded shadow-sm transition-all ${isDragOverPrompt ? 'bg-blue-500 text-white' : theme === 'white' ? 'bg-white border-[#D2D2D7]' : 'bg-[#1D1D1F] border-zinc-800'}`}>
                {isDragOverPrompt ? '放手关联文件' : 'Audit Prompt'}
              </div>
              <textarea
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                placeholder="键入审计指令... (支持从资料库拖入文件)"
                rows={4}
                className={`w-full rounded-[1.8rem] px-6 py-5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all resize-none pr-16 border shadow-inner ${isDragOverPrompt ? 'ring-4 ring-blue-500/50' : ''} ${colors.input}`}
              />
              <button 
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="absolute right-4 bottom-4 p-3 rounded-2xl bg-blue-600 text-white disabled:opacity-30 hover:bg-blue-500 transition-all shadow-xl active:scale-90"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full p-8 overflow-y-auto custom-scrollbar transition-all duration-700">
            <div className={`border rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center mb-10 relative overflow-hidden group transition-all duration-500 ${theme === 'white' ? 'bg-purple-500/5 border-purple-500/20 shadow-xl' : 'bg-gradient-to-br from-purple-900/20 to-transparent border-purple-500/30 shadow-2xl'}`}>
               <div className="absolute top-0 right-0 w-40 h-40 bg-purple-600/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-purple-600/20 transition-all duration-700"></div>
               <div className="w-20 h-20 bg-purple-600/10 rounded-[2rem] flex items-center justify-center mb-6 border border-purple-500/20 rotate-12 group-hover:rotate-0 transition-transform duration-700 shadow-lg">
                  <svg className="w-10 h-10 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a2 2 0 00-1.96 1.414l-.722 2.528a2 2 0 00.747 2.227l1.246.831a2 2 0 002.421-.112l1.677-1.4a2 2 0 00.046-2.965l-1.046-1.046zM15.428 19.428a2 2 0 00.547-1.022l.477-2.387a2 2 0 00-1.414-1.96l-2.528-.722a2 2 0 00-2.227.747l-.831 1.246a2 2 0 00.112 2.421l1.4 1.677a2 2 0 002.965.046l1.046-1.046z" /></svg>
               </div>
               <h4 className={`text-sm font-black mb-3 uppercase tracking-[0.3em] ${theme === 'white' ? 'text-zinc-900' : 'text-white'}`}>全量数据透视引擎</h4>
               <p className={`text-[11px] leading-relaxed mb-10 max-w-[240px] font-medium uppercase tracking-tighter opacity-60 ${colors.textSub}`}>深度扫描全业务明细，自动化构建风险热力图与异常交易关联模型。</p>
               <button 
                 onClick={runAnalysis}
                 className="w-full py-5 rounded-[1.5rem] bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-purple-600/40 transition-all active:scale-95"
               >
                 启动全量审计引擎
               </button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-3 px-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(168,85,247,0.8)]"></div>
                <h5 className={`text-[10px] font-black uppercase tracking-[0.3em] ${colors.label}`}>数字审计存证库</h5>
              </div>
              
              {analysisHistory.length === 0 ? (
                <div className={`text-center py-24 border-2 border-dashed rounded-[2.5rem] transition-colors ${colors.border}`}>
                   <p className={`text-[10px] font-black uppercase tracking-[0.2em] opacity-30 ${colors.textSub}`}>No Analysis Records</p>
                </div>
              ) : (
                analysisHistory.map(res => (
                  <div key={res.id} className={`border rounded-[2rem] p-5 transition-all duration-300 group hover:scale-[1.02] ${colors.card} hover:border-purple-500/50`}>
                    <div className="flex justify-between items-start mb-4">
                      <div className="min-w-0 pr-4">
                        <p className={`text-xs font-black tracking-tight truncate pr-2 ${theme === 'white' ? 'text-zinc-900' : 'text-zinc-200'}`}>{res.title}</p>
                        <p className={`text-[9px] mt-1.5 font-black uppercase tracking-widest ${colors.textSub}`}>{res.timestamp}</p>
                      </div>
                      <div className="bg-purple-600/10 text-purple-400 text-[8px] px-2 py-1 rounded-lg border border-purple-500/20 font-black tracking-widest">VERIFIED</div>
                    </div>
                    <div className={`relative rounded-2xl overflow-hidden h-36 mb-5 border transition-all ${colors.border}`}>
                       <img src={res.screenshot} className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" alt="Analysis preview" />
                       <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 bg-black/40 backdrop-blur-sm">
                          <button className="px-6 py-2.5 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl transform translate-y-3 group-hover:translate-y-0 transition-all shadow-2xl">查看交互式报告</button>
                       </div>
                    </div>
                    <button 
                      onClick={() => alert('存证已成功挂接至底稿第 02 节')}
                      className={`w-full py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border active:scale-95 ${colors.btnSecondary}`}
                    >
                      挂接至审计底稿
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
