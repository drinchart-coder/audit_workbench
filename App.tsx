
import React, { useState, useMemo } from 'react';
import { Layout } from './components/Layout';
import { LeftPanel } from './components/LeftPanel';
import { MiddlePanel } from './components/MiddlePanel';
import { RightPanel } from './components/RightPanel';
import { Sidebar } from './components/Sidebar';
import { FilePreviewModal } from './components/FilePreviewModal';
import { AuditFile, WorkingPaper, AnalysisResult, ThemeType, AUDIT_PROCEDURES, ProcedureState, ChatMessage } from './types';

const App: React.FC = () => {
  const [theme, setTheme] = useState<ThemeType>('grey');
  const [activeProcedureId, setActiveProcedureId] = useState(AUDIT_PROCEDURES[0].id);
  const [activePreviewFile, setActivePreviewFile] = useState<AuditFile | null>(null);

  // Initialize data mapping for all procedures
  const initialDataMap = useMemo(() => {
    const map: Record<string, ProcedureState> = {};
    AUDIT_PROCEDURES.forEach(p => {
      map[p.id] = {
        files: [],
        workingPaper: {
          name: '审计工作底稿',
          refNumber: 'WP-2024-' + Math.floor(Math.random() * 9000 + 1000),
          auditee: '某大型科技有限公司',
          matter: '',
          basis: '',
          program: p.name,
          process: '',
          results: '',
          confirmationGenerated: false
        },
        analysisHistory: [],
        chatMessages: []
      };
    });
    return map;
  }, []);

  const [proceduresData, setProceduresData] = useState<Record<string, ProcedureState>>(initialDataMap);

  // Helper to update current procedure state
  const updateCurrentState = (updater: (prev: ProcedureState) => ProcedureState) => {
    setProceduresData(prev => ({
      ...prev,
      [activeProcedureId]: updater(prev[activeProcedureId])
    }));
  };

  const currentData = proceduresData[activeProcedureId];

  // Derived current procedure
  const currentProcedure = useMemo(() => 
    AUDIT_PROCEDURES.find(p => p.id === activeProcedureId) || AUDIT_PROCEDURES[0]
  , [activeProcedureId]);

  const handleAddFile = (newFile: AuditFile) => {
    updateCurrentState(prev => ({ ...prev, files: [newFile, ...prev.files] }));
  };

  const handleDeleteFile = (id: string) => {
    updateCurrentState(prev => ({ ...prev, files: prev.files.filter(f => f.id !== id) }));
  };

  const handleRenameFile = (id: string, newName: string) => {
    updateCurrentState(prev => ({
      ...prev,
      files: prev.files.map(f => f.id === id ? { ...f, name: newName } : f)
    }));
  };

  const handleToggleFileSelection = (id: string) => {
    updateCurrentState(prev => ({
      ...prev,
      files: prev.files.map(f => f.id === id ? { ...f, isSelected: !f.isSelected } : f)
    }));
  };

  const handleSelectFile = (id: string, selected: boolean) => {
    updateCurrentState(prev => ({
      ...prev,
      files: prev.files.map(f => f.id === id ? { ...f, isSelected: selected } : f)
    }));
  };

  const handleSaveWorkingPaper = (data: WorkingPaper) => {
    updateCurrentState(prev => ({ ...prev, workingPaper: { ...data, name: '审计工作底稿' } }));
  };

  const handleAddAnalysisResult = (result: AnalysisResult) => {
    updateCurrentState(prev => ({
      ...prev,
      analysisHistory: [result, ...prev.analysisHistory],
      workingPaper: {
        ...prev.workingPaper,
        process: prev.workingPaper.process + `\n\n[自动引用：非现场分析结论 - ${result.title} / 已存证]`
      }
    }));
  };

  const handleAddChatMessage = (msg: ChatMessage) => {
    updateCurrentState(prev => ({
      ...prev,
      chatMessages: [...prev.chatMessages, msg]
    }));
  };

  const handleSelectProcedure = (id: string) => {
    setActiveProcedureId(id);
  };

  const handlePreviewFileById = (id: string) => {
    const file = currentData.files.find(f => f.id === id);
    if (file) setActivePreviewFile(file);
  };

  const themeStyles = {
    white: {
      bg: 'bg-[#F5F5F7] text-[#1D1D1F]',
      header: 'bg-white/80 backdrop-blur-md border-[#D2D2D7] text-[#1D1D1F]',
      panel: 'bg-white border-[#D2D2D7]',
      middle: 'bg-[#F5F5F7]',
      textMain: 'text-[#1D1D1F]',
      textSub: 'text-[#86868B]'
    },
    blue: {
      bg: 'bg-[#000C14] text-[#F5F5F7]',
      header: 'bg-[#001424]/90 backdrop-blur-md border-[#003354] text-white',
      panel: 'bg-[#001424] border-[#003354]',
      middle: 'bg-[#000C14]',
      textMain: 'text-white',
      textSub: 'text-[#00A3FF]'
    },
    grey: {
      bg: 'bg-[#161617] text-[#EDEDED]',
      header: 'bg-[#1D1D1F]/90 backdrop-blur-md border-[#333333] text-white',
      panel: 'bg-[#1D1D1F] border-[#333333]',
      middle: 'bg-[#161617]',
      textMain: 'text-[#F5F5F7]',
      textSub: 'text-[#A1A1A6]'
    }
  }[theme];

  return (
    <div className={`flex h-screen w-full overflow-hidden font-sans transition-colors duration-700 ${themeStyles.bg}`}>
      <Sidebar 
        activeProcedureId={activeProcedureId}
        onSelectProcedure={handleSelectProcedure}
        theme={theme}
        onThemeChange={setTheme}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <header className={`h-16 border-b flex items-center justify-between px-6 shrink-0 z-30 transition-all ${themeStyles.header}`}>
          <div className="flex items-center space-x-4">
            <div className="relative group cursor-pointer">
              <div className={`absolute -inset-1 rounded-lg blur opacity-25 group-hover:opacity-60 transition duration-1000 ${theme === 'blue' ? 'bg-blue-400' : 'bg-zinc-400'}`}></div>
              <div className={`relative w-9 h-9 rounded-lg flex items-center justify-center font-black border shadow-sm transition-colors ${theme === 'white' ? 'bg-white text-blue-600 border-[#D2D2D7]' : 'bg-black text-blue-400 border-zinc-800'}`}>
                AP
              </div>
            </div>
            <div>
              <h1 className="text-sm font-black tracking-tight uppercase">AuditPro <span className="font-normal opacity-60">Workbench</span></h1>
              <p className={`text-[10px] font-semibold uppercase tracking-widest mt-0.5 ${themeStyles.textSub}`}>
                {currentProcedure.name}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className={`flex items-center space-x-2.5 px-3 py-1.5 rounded-full border shadow-sm transition-all ${theme === 'white' ? 'bg-white/10 border-[#D2D2D7]' : 'bg-white/5 border-white/10'}`}>
              <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${themeStyles.textSub}`}>AI Engine Active</span>
            </div>
            <div className={`flex items-center space-x-3 border-l pl-6 transition-colors ${theme === 'white' ? 'border-[#D2D2D7]' : 'border-white/10'}`}>
               <div className="text-right">
                  <p className={`text-[10px] font-bold ${themeStyles.textMain}`}>审计专员 042</p>
                  <p className={`text-[9px] font-medium uppercase tracking-tighter ${themeStyles.textSub}`}>Certified Auditor</p>
               </div>
               <div className={`w-10 h-10 rounded-full border flex items-center justify-center overflow-hidden transition-all shadow-sm ${theme === 'white' ? 'bg-white border-[#D2D2D7]' : 'bg-white/10 border-white/20'}`}>
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=audit&backgroundColor=b6e3f4" alt="avatar" className="w-8 h-8" />
               </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-hidden">
          <Layout
            theme={theme}
            left={
              <LeftPanel 
                theme={theme}
                files={currentData.files} 
                onAddFile={handleAddFile} 
                onDeleteFile={handleDeleteFile} 
                onPreviewFile={setActivePreviewFile} 
                onToggleSelect={handleToggleFileSelection}
                onRenameFile={handleRenameFile}
              />
            }
            middle={
              <MiddlePanel 
                theme={theme}
                data={currentData.workingPaper} 
                onSave={handleSaveWorkingPaper}
                onPreviewFileById={handlePreviewFileById}
              />
            }
            right={
              <RightPanel 
                theme={theme}
                selectedFiles={currentData.files.filter(f => f.isSelected)} 
                analysisHistory={currentData.analysisHistory} 
                messages={currentData.chatMessages}
                onAddAnalysis={handleAddAnalysisResult}
                onAddChatMessage={handleAddChatMessage}
                onSelectFile={handleSelectFile}
              />
            }
          />
        </main>
      </div>

      {activePreviewFile && (
        <FilePreviewModal 
          theme={theme}
          file={activePreviewFile} 
          onClose={() => setActivePreviewFile(null)} 
        />
      )}
    </div>
  );
};

export default App;
