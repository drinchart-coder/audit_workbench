
export enum FileSource {
  OFFLINE = '离线文件',
  INTERNET = '互联网网页',
  PROJECT = '项目资料',
  KNOWLEDGE_BASE = '知识库'
}

export interface AuditFile {
  id: string;
  name: string;
  size: string;
  type: string;
  source: FileSource;
  category: string;
  uploadTime: string;
  isSelected?: boolean;
}

export interface WorkingPaper {
  name: string;
  refNumber: string;
  auditee: string;
  matter: string;
  basis: string;
  program: string;
  process: string;
  results: string;
  confirmationGenerated: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface AnalysisResult {
  id: string;
  title: string;
  link: string;
  screenshot: string;
  timestamp: string;
}

export interface AuditAgent {
  id: string;
  name: string;
  description: string;
}

export const AUDIT_AGENTS: AuditAgent[] = [
  { id: 'risk', name: '风险识别智能体', description: '自动扫描文档中的潜在审计风险点' },
  { id: 'compliance', name: '合规校验智能体', description: '对比最新法规进行准则符合性检查' },
  { id: 'logic', name: '数据逻辑智能体', description: '核对财务报表间的勾稽关系' }
];

export interface PaperTemplate {
  id: string;
  name: string;
  program: string;
  process: string;
  matter?: string;
  basis?: string;
}

export type ThemeType = 'white' | 'blue' | 'grey';

export interface AuditProcedure {
  id: string;
  name: string;
  icon: string;
  category: string;
}

export const AUDIT_PROCEDURES: AuditProcedure[] = [
  { id: 'p1', name: '收入循环审计', category: '财务审计', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { id: 'p2', name: '采购与付款审计', category: '财务审计', icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z' },
  { id: 'p3', name: '固定资产实务审计', category: '资产审计', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
  { id: 'p4', name: '人力资源与薪酬', category: '合规审计', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
  { id: 'p5', name: '环境与社会责任', category: 'ESG审计', icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z' }
];

export interface ProcedureState {
  files: AuditFile[];
  workingPaper: WorkingPaper;
  analysisHistory: AnalysisResult[];
  chatMessages: ChatMessage[];
}
