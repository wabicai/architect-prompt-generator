export enum AnalysisStatus {
  IDLE = 'IDLE',
  PREPARING = 'PREPARING', // Simulating URL fetch/screenshot
  UPLOADING = 'UPLOADING',
  ANALYZING = 'ANALYZING',
  GENERATING = 'GENERATING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}

export type AnalysisScope = 'page' | 'site';

export interface PromptTemplate {
  id: string;
  name: string;
  content: string;
}

export interface AppSettings {
  apiKey: string;
  activeTemplateId: string;
  templates: PromptTemplate[];
}

export interface AnalysisResult {
  originalImage: string | null;
  generatedPrompt: string;
  uiAnalysis: string; // Brief summary
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  url: string;
  scope: AnalysisScope;
  templateName: string;
  result: string;
  // We do not store the base64 image to avoid localStorage limits
}