import React, { useState } from 'react';

interface ResultViewerProps {
  content: string;
}

export const ResultViewer: React.FC<ResultViewerProps> = ({ content }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col h-full shadow-sm">
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"></div>
          <span className="text-sm font-semibold text-slate-700">Technical Design Document</span>
        </div>
        <button
          onClick={handleCopy}
          className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 border
            ${copied 
              ? 'bg-green-50 text-green-600 border-green-200' 
              : 'bg-white text-slate-600 border-slate-200 hover:border-brand-300 hover:text-brand-600'
            }`}
        >
          {copied ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              Copied!
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              Copy TDD
            </>
          )}
        </button>
      </div>
      <div className="flex-1 overflow-auto p-6 custom-scrollbar bg-white">
        <div className="prose prose-sm prose-slate max-w-none">
          <pre className="font-mono text-sm text-slate-700 whitespace-pre-wrap break-words leading-relaxed">
            {content}
          </pre>
        </div>
      </div>
    </div>
  );
};