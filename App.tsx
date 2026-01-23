
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { LeftPanel } from './components/LeftPanel';
import { MiddlePanel } from './components/MiddlePanel';
import { RightPanel } from './components/RightPanel';
import { FilePreviewModal } from './components/FilePreviewModal';
import { AuditFile, WorkingPaper, AnalysisResult } from './types';

const App: React.FC = () => {
  const [files, setFiles] = useState<AuditFile[]>([]);
  const [activePreviewFile, setActivePreviewFile] = useState<AuditFile | null>(null);
  const [workingPaper, setWorkingPaper] = useState<WorkingPaper>({
    program: '',
    process: '',
    results: '',
    confirmationGenerated: false
  });
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisResult[]>([]);

  const handleAddFile = (newFile: AuditFile) => {
    setFiles(prev => [newFile, ...prev]);
  };

  const handleDeleteFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleRenameFile = (id: string, newName: string) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, name: newName } : f));
  };

  const handleToggleFileSelection = (id: string) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, isSelected: !f.isSelected } : f));
  };

  const handleSaveWorkingPaper = (data: WorkingPaper) => {
    setWorkingPaper(data);
    // Simulation of data persistence
  };

  const handleAddAnalysisResult = (result: AnalysisResult) => {
    setAnalysisHistory(prev => [result, ...prev]);
    setWorkingPaper(prev => ({
      ...prev,
      process: prev.process + `\n\n[自动引用：非现场分析结论 - ${result.title} / 已存证]`
    }));
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#050505] text-zinc-100 overflow-hidden font-sans">
      {/* Header */}
      <header className="h-16 border-b border-zinc-800/80 flex items-center justify-between px-6 shrink-0 bg-[#0a0a0a] backdrop-blur-xl z-30">
        <div className="flex items-center space-x-4">
          <div className="relative group cursor-pointer">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative w-9 h-9 bg-black rounded-lg flex items-center justify-center font-black text-blue-500 border border-zinc-800 shadow-2xl">
              AP
            </div>
          </div>
          <div>
            <h1 className="text-sm font-black tracking-[0.2em] text-white uppercase">AuditPro Workbench</h1>
            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-0.5">One-Stop Digital Audit Engine</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Server Core: Active</span>
          </div>
          <div className="flex items-center space-x-3 border-l border-zinc-800 pl-6">
             <div className="text-right">
                <p className="text-[10px] font-black text-white">审计专员 042</p>
                <p className="text-[9px] text-zinc-600 font-bold uppercase">Level 4 Auth</p>
             </div>
             <div className="w-10 h-10 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-500 overflow-hidden">
                <img src="https://api.dicebear.com/7.x/bottts/svg?seed=audit" alt="avatar" className="w-7 h-7" />
             </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <Layout
          left={
            <LeftPanel 
              files={files} 
              onAddFile={handleAddFile} 
              onDeleteFile={handleDeleteFile} 
              onPreviewFile={setActivePreviewFile} 
              onToggleSelect={handleToggleFileSelection}
              onRenameFile={handleRenameFile}
            />
          }
          middle={
            <MiddlePanel 
              data={workingPaper} 
              onSave={handleSaveWorkingPaper} 
            />
          }
          right={
            <RightPanel 
              selectedFiles={files.filter(f => f.isSelected)} 
              analysisHistory={analysisHistory} 
              onAddAnalysis={handleAddAnalysisResult} 
            />
          }
        />
      </main>

      {/* Modal Overlay */}
      {activePreviewFile && (
        <FilePreviewModal 
          file={activePreviewFile} 
          onClose={() => setActivePreviewFile(null)} 
        />
      )}
    </div>
  );
};

export default App;
