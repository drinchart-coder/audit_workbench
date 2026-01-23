
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { AuditFile, ChatMessage, AnalysisResult, AUDIT_AGENTS } from '../types';

interface RightPanelProps {
  selectedFiles: AuditFile[];
  analysisHistory: AnalysisResult[];
  onAddAnalysis: (res: AnalysisResult) => void;
}

export const RightPanel: React.FC<RightPanelProps> = ({ selectedFiles, analysisHistory, onAddAnalysis }) => {
  const [activeTab, setActiveTab] = useState<'AI' | 'ANALYSIS'>('AI');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState(AUDIT_AGENTS[0].id);

  const selectedAgent = AUDIT_AGENTS.find(a => a.id === selectedAgentId) || AUDIT_AGENTS[0];

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Create a new GoogleGenAI instance right before making an API call to ensure it uses the latest API key.
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

      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: 'err', role: 'assistant', content: 'AI服务响应超时，请检查API配置。', timestamp: Date.now()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const runAnalysis = () => {
    setIsTyping(true);
    // Simulate real delay
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

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#0a0a0a]">
      {/* Navigation */}
      <div className="flex px-4 pt-4 border-b border-zinc-800 bg-[#0f0f0f]">
        <button
          onClick={() => setActiveTab('AI')}
          className={`flex-1 pb-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all border-b-2 ${activeTab === 'AI' ? 'text-blue-500 border-blue-500' : 'text-zinc-600 border-transparent hover:text-zinc-400'}`}
        >
          AI 智能交互
        </button>
        <button
          onClick={() => setActiveTab('ANALYSIS')}
          className={`flex-1 pb-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all border-b-2 ${activeTab === 'ANALYSIS' ? 'text-purple-500 border-purple-500' : 'text-zinc-600 border-transparent hover:text-zinc-400'}`}
        >
          非现场交互
        </button>
      </div>

      <div className="flex-1 overflow-hidden relative flex flex-col">
        {activeTab === 'AI' ? (
          <div className="flex flex-col h-full p-4">
            {/* Agent & Context Selector */}
            <div className="flex space-x-2 mb-4">
              <div className="flex-1">
                <label className="text-[9px] font-bold text-zinc-600 uppercase mb-1 block pl-1">选择专家智能体</label>
                <select 
                  value={selectedAgentId}
                  onChange={e => setSelectedAgentId(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1.5 text-[11px] text-zinc-300 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                >
                  {AUDIT_AGENTS.map(agent => (
                    <option key={agent.id} value={agent.id}>{agent.name}</option>
                  ))}
                </select>
              </div>
              <div className="w-24">
                <label className="text-[9px] font-bold text-zinc-600 uppercase mb-1 block pl-1">上下文状态</label>
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1.5 text-[11px] text-blue-500 font-bold flex items-center justify-center">
                  {selectedFiles.length} 个文件
                </div>
              </div>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1 custom-scrollbar">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center px-8 opacity-40">
                  <div className="w-16 h-16 bg-blue-600/5 rounded-full flex items-center justify-center mb-4 border border-blue-500/10">
                     <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </div>
                  <h4 className="text-xs font-bold text-white mb-2 tracking-widest uppercase">等待提问...</h4>
                  <p className="text-[10px] text-zinc-500 leading-relaxed max-w-[180px]">请从左侧勾选文件，或直接描述您的审计难题。</p>
                </div>
              ) : (
                messages.map(m => (
                  <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[92%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none shadow-lg' : 'bg-zinc-800/60 text-zinc-200 rounded-tl-none border border-zinc-700/50 backdrop-blur-sm'}`}>
                      {m.content}
                      <div className={`text-[8px] mt-2 opacity-40 ${m.role === 'user' ? 'text-right' : ''}`}>
                        {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))
              )}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-zinc-800/40 rounded-2xl px-4 py-3 rounded-tl-none border border-zinc-700/30">
                    <div className="flex space-x-1.5">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-.15s]"></div>
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-.3s]"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="relative pt-2">
              <div className="absolute left-3 -top-1 px-2 bg-[#0a0a0a] text-[8px] font-black text-blue-500 uppercase tracking-widest z-10 border border-zinc-800 rounded">
                Prompt Interface
              </div>
              <textarea
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                placeholder="键入审计指令..."
                rows={3}
                className="w-full bg-zinc-950 border border-zinc-800/80 rounded-2xl px-4 py-4 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500/40 transition-all placeholder:text-zinc-700 resize-none pr-14 shadow-inner"
              />
              <button 
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="absolute right-3 bottom-3 p-2.5 rounded-xl bg-blue-600 text-white disabled:bg-zinc-900 disabled:text-zinc-700 hover:bg-blue-500 transition-all shadow-lg active:scale-95"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full p-6 overflow-y-auto custom-scrollbar">
            <div className="bg-gradient-to-br from-purple-900/10 to-transparent border border-purple-500/20 rounded-3xl p-8 flex flex-col items-center justify-center text-center mb-8 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-purple-600/10 transition-colors"></div>
               <div className="w-16 h-16 bg-purple-600/10 rounded-3xl flex items-center justify-center mb-5 border border-purple-500/20 rotate-12 group-hover:rotate-0 transition-transform duration-500">
                  <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a2 2 0 00-1.96 1.414l-.722 2.528a2 2 0 00.747 2.227l1.246.831a2 2 0 002.421-.112l1.677-1.4a2 2 0 00.046-2.965l-1.046-1.046zM15.428 19.428a2 2 0 00.547-1.022l.477-2.387a2 2 0 00-1.414-1.96l-2.528-.722a2 2 0 00-2.227.747l-.831 1.246a2 2 0 00.112 2.421l1.4 1.677a2 2 0 002.965.046l1.046-1.046z" /></svg>
               </div>
               <h4 className="text-sm font-black text-white mb-2 uppercase tracking-widest">非现场海量数据透视</h4>
               <p className="text-[11px] text-zinc-500 leading-relaxed mb-8 max-w-[220px]">深度扫描全量业务明细，自动构建风险热力图与异常趋势模型。</p>
               <button 
                 onClick={runAnalysis}
                 className="w-full py-4 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-black uppercase tracking-widest shadow-[0_8px_30px_-5px_rgba(147,51,234,0.4)] transition-all active:scale-[0.98]"
               >
                 启动全量分析引擎
               </button>
            </div>

            <div className="space-y-5">
              <div className="flex items-center space-x-2 px-1">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse"></div>
                <h5 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">数字审计存证库</h5>
              </div>
              
              {analysisHistory.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-zinc-800 rounded-2xl">
                   <p className="text-[10px] text-zinc-700 font-bold uppercase tracking-widest">暂无分析序列</p>
                </div>
              ) : (
                analysisHistory.map(res => (
                  <div key={res.id} className="bg-zinc-900/30 border border-zinc-800 hover:border-zinc-600 rounded-2xl p-4 transition-all group">
                    <div className="flex justify-between items-start mb-3">
                      <div className="min-w-0 pr-4">
                        <p className="text-xs font-bold text-zinc-200 truncate pr-2">{res.title}</p>
                        <p className="text-[9px] text-zinc-600 mt-1 font-mono uppercase">{res.timestamp}</p>
                      </div>
                      <div className="bg-purple-600/10 text-purple-400 text-[8px] px-1.5 py-0.5 rounded border border-purple-500/20 font-black">COMPLETED</div>
                    </div>
                    <div className="relative rounded-xl overflow-hidden h-28 mb-4 border border-zinc-800 group-hover:border-zinc-700 transition-all">
                       <img src={res.screenshot} className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-80 transition-all duration-700" alt="Analysis preview" />
                       <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                          <button className="px-4 py-2 bg-white text-black text-[10px] font-black rounded-lg transform translate-y-2 group-hover:translate-y-0 transition-all">查看交互报告</button>
                       </div>
                    </div>
                    <button 
                      onClick={() => alert('存证已成功挂接至底稿第 02 节')}
                      className="w-full py-2.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white text-[10px] font-bold transition-all border border-zinc-700 active:scale-95"
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
