
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
}
