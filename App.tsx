import React, { useState, useEffect } from 'react';
import { AnalysisStatus, AppSettings, AnalysisScope, HistoryItem } from './types';
import { DEFAULT_SETTINGS } from './constants';
import { analyzeImage } from './services/geminiService';
import { SettingsModal } from './components/SettingsModal';
import { InputSection } from './components/InputSection';
import { ResultViewer } from './components/ResultViewer';
import { HistoryDrawer } from './components/HistoryDrawer';

const App: React.FC = () => {
  // --- State ---
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [url, setUrl] = useState<string>('');
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [scope, setScope] = useState<AnalysisScope>('page');
  const [resultText, setResultText] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // --- Effects ---
  useEffect(() => {
    // Load settings
    const savedSettings = localStorage.getItem('app_settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }

    // Load history
    const savedHistory = localStorage.getItem('app_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // --- Handlers ---
  const handleSaveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    localStorage.setItem('app_settings', JSON.stringify(newSettings));
  };

  const saveToHistory = (result: string, currentUrl: string, currentScope: AnalysisScope, templateName: string) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      url: currentUrl,
      scope: currentScope,
      templateName: templateName,
      result: result
    };
    
    const newHistory = [newItem, ...history]; // Prepend
    setHistory(newHistory);
    localStorage.setItem('app_history', JSON.stringify(newHistory));
  };

  const handleDeleteHistory = (id: string) => {
    const newHistory = history.filter(h => h.id !== id);
    setHistory(newHistory);
    localStorage.setItem('app_history', JSON.stringify(newHistory));
  };

  const handleSelectHistory = (item: HistoryItem) => {
    setResultText(item.result);
    setUrl(item.url);
    setScope(item.scope);
    // We cannot restore the image as it is not saved
    setCurrentImage(null); 
    setStatus(AnalysisStatus.COMPLETE);
    setIsHistoryOpen(false);
  };

  const handleImageSelected = (base64: string) => {
    setCurrentImage(base64);
    setStatus(AnalysisStatus.IDLE);
    setResultText('');
    setErrorMsg('');
  };

  const handleAnalyze = async () => {
    if (!currentImage && !url) {
      alert("Please provide either a URL or a Screenshot to proceed.");
      return;
    }
    if (!settings.apiKey) {
      setIsSettingsOpen(true);
      return;
    }

    const activeTemplate = settings.templates.find(t => t.id === settings.activeTemplateId) || settings.templates[0];
    const systemPrompt = activeTemplate.content;

    setErrorMsg('');
    
    // Simulate Progress Steps
    setStatus(AnalysisStatus.PREPARING);
    await new Promise(r => setTimeout(r, 600)); 
    
    setStatus(AnalysisStatus.UPLOADING);
    await new Promise(r => setTimeout(r, 600));

    setStatus(AnalysisStatus.ANALYZING);

    try {
      const result = await analyzeImage(settings.apiKey, currentImage, url, systemPrompt, scope);
      setResultText(result);
      setStatus(AnalysisStatus.COMPLETE);
      
      // Auto-save to history
      saveToHistory(result, url, scope, activeTemplate.name);

    } catch (err: any) {
      setStatus(AnalysisStatus.ERROR);
      setErrorMsg(err.message || 'An unexpected error occurred during analysis.');
    }
  };

  const handleClear = () => {
    setCurrentImage(null);
    setResultText('');
    setStatus(AnalysisStatus.IDLE);
  };

  // --- Render Helpers ---
  const getProgressMessage = () => {
    switch (status) {
      case AnalysisStatus.PREPARING: return "Reading context inputs...";
      case AnalysisStatus.UPLOADING: return "Processing data...";
      case AnalysisStatus.ANALYZING: return "Gemini 2.5 is analyzing design patterns...";
      case AnalysisStatus.GENERATING: return "Generating developer specifications...";
      default: return "";
    }
  };

  const renderStatusOverlay = () => {
    if (status === AnalysisStatus.IDLE || status === AnalysisStatus.COMPLETE) return null;

    if (status === AnalysisStatus.ERROR) {
       return (
          <div className="absolute inset-0 z-20 bg-white/90 backdrop-blur flex items-center justify-center p-6 text-center rounded-2xl">
            <div className="max-w-md">
              <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Analysis Failed</h3>
              <p className="text-slate-600 mb-6">{errorMsg}</p>
              <button onClick={() => setStatus(AnalysisStatus.IDLE)} className="px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700">Dismiss</button>
            </div>
          </div>
       );
    }

    // Loading State
    return (
      <div className="absolute inset-0 z-20 bg-white/95 backdrop-blur flex flex-col items-center justify-center rounded-2xl">
        <div className="relative w-24 h-24 mb-6">
          <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-brand-500 rounded-full border-t-transparent animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-12 h-12 bg-brand-50 rounded-full flex items-center justify-center animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
             </div>
          </div>
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">AI Processing</h3>
        <p className="text-slate-500 animate-pulse">{getProgressMessage()}</p>
      </div>
    );
  };

  const activeTemplateName = settings.templates.find(t => t.id === settings.activeTemplateId)?.name || 'Unknown Template';

  return (
    <div className="min-h-screen flex flex-col items-center bg-slate-50 text-slate-900 font-sans selection:bg-brand-100 selection:text-brand-900 overflow-x-hidden">
      
      {/* Navbar */}
      <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 rounded-xl shadow-sm flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900 leading-none">UI/UX Architect</h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Browser Extension Mode</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
             {/* Template Indicator */}
             <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full border border-slate-200 mr-2">
                <span className="w-2 h-2 rounded-full bg-brand-500"></span>
                <span className="text-xs font-semibold text-slate-600 truncate max-w-[150px]">{activeTemplateName}</span>
             </div>

             <button
              onClick={() => setIsHistoryOpen(true)}
              className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:text-brand-600 hover:bg-slate-100 rounded-lg transition-all text-sm font-medium"
              title="History"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              <span className="hidden sm:inline">History</span>
            </button>

             <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
              title="Settings & Templates"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-6xl mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-64px)]">
        
        {/* Left Column: Input Panel */}
        <div className="lg:col-span-5 flex flex-col gap-4 h-full">
           <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-1 flex-1 flex flex-col relative overflow-hidden">
              {renderStatusOverlay()}
              <div className="flex-1 p-3">
                <InputSection 
                  urlValue={url}
                  onUrlChange={setUrl}
                  currentImage={currentImage}
                  onImageSelected={handleImageSelected}
                  onClear={handleClear}
                  scope={scope}
                  onScopeChange={setScope}
                />
              </div>
              
              <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-xl">
                <button
                  onClick={handleAnalyze}
                  disabled={status !== AnalysisStatus.IDLE && status !== AnalysisStatus.COMPLETE && status !== AnalysisStatus.ERROR}
                  className={`w-full py-3 px-6 rounded-xl font-bold text-white shadow-sm transition-all transform active:scale-95 flex items-center justify-center gap-2
                    ${(status !== AnalysisStatus.IDLE && status !== AnalysisStatus.COMPLETE && status !== AnalysisStatus.ERROR)
                      ? 'bg-slate-300 cursor-not-allowed text-slate-500' 
                      : 'bg-brand-600 hover:bg-brand-700 shadow-brand-500/20'
                    }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>
                  Analyze & Generate
                </button>
                <p className="text-center text-xs text-slate-400 mt-2">
                  Uses Gemini 2.5 Flash • {activeTemplateName}
                </p>
              </div>
           </div>
        </div>

        {/* Right Column: Output */}
        <div className="lg:col-span-7 h-full flex flex-col min-h-0">
           {resultText ? (
             <ResultViewer content={resultText} />
           ) : (
             <div className="h-full bg-white border border-slate-200 border-dashed rounded-2xl flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-600 mb-1">Waiting for Input</h3>
                <p className="text-sm max-w-sm">
                  Enter a URL or upload a screenshot to generate your Technical Design Document.
                </p>
             </div>
           )}
        </div>

      </main>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        settings={settings}
        onSave={handleSaveSettings}
      />

      <HistoryDrawer 
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelect={handleSelectHistory}
        onDelete={handleDeleteHistory}
      />
    </div>
  );
};

export default App;