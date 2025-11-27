import React, { useRef, useState, useEffect } from 'react';
import { AnalysisScope } from '../types';

interface InputSectionProps {
  onImageSelected: (base64: string) => void;
  onUrlChange: (url: string) => void;
  urlValue: string;
  currentImage: string | null;
  onClear: () => void;
  scope: AnalysisScope;
  onScopeChange: (scope: AnalysisScope) => void;
}

export const InputSection: React.FC<InputSectionProps> = ({ 
  onImageSelected, 
  onUrlChange, 
  urlValue,
  currentImage,
  onClear,
  scope,
  onScopeChange
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        onImageSelected(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (items) {
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf('image') !== -1) {
            const blob = items[i].getAsFile();
            if (blob) handleFile(blob);
          }
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  return (
    <div className="flex flex-col gap-4 h-full">
      
      {/* Scope Selector */}
      <div className="bg-slate-50 p-1 rounded-lg border border-slate-200 flex gap-1">
        <button
          onClick={() => onScopeChange('page')}
          className={`flex-1 py-1.5 px-3 rounded-md text-sm font-medium transition-all
            ${scope === 'page' 
              ? 'bg-white text-brand-600 shadow-sm border border-slate-200' 
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
            }`}
        >
          Single Page
        </button>
        <button
          onClick={() => onScopeChange('site')}
          className={`flex-1 py-1.5 px-3 rounded-md text-sm font-medium transition-all
            ${scope === 'site' 
              ? 'bg-white text-brand-600 shadow-sm border border-slate-200' 
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
            }`}
        >
          Entire Website
        </button>
      </div>

      {/* 1. URL Input */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          Target Website (Context)
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <input
              type="text"
              value={urlValue}
              onChange={(e) => onUrlChange(e.target.value)}
              placeholder="https://example.com"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* 2. Image Area (Optional) */}
      <div 
        className={`flex-1 relative flex flex-col rounded-xl transition-all duration-300 overflow-hidden
          ${currentImage 
            ? 'bg-slate-900 border border-slate-800 shadow-md' 
            : `border-2 border-dashed bg-slate-50 ${isDragging ? 'border-brand-500 bg-brand-50' : 'border-slate-300 hover:border-brand-400 hover:bg-slate-100'}`
          }`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        {currentImage ? (
          <>
             <div className="absolute inset-0 flex items-center justify-center p-4 bg-pattern">
               <img 
                 src={currentImage} 
                 alt="Analysis Target" 
                 className="max-w-full max-h-full object-contain shadow-2xl rounded-md" 
               />
             </div>
             <div className="absolute top-2 right-2 flex gap-2">
                <button 
                  onClick={onClear}
                  className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg backdrop-blur-md transition-colors"
                  title="Remove Image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
             </div>
          </>
        ) : (
          <div 
            className="flex-1 flex flex-col items-center justify-center text-center p-8 cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) handleFile(e.target.files[0]);
              }}
            />
            
            <div className={`p-5 rounded-full mb-4 transition-transform duration-300 ${isDragging ? 'scale-110 bg-brand-100 text-brand-600' : 'bg-white shadow-sm text-slate-400'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
            </div>
            <h3 className="text-base font-semibold text-slate-700 mb-1">
              Upload Page Screenshot
            </h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
              Drag & drop or paste (Ctrl+V) a screenshot here. 
              <br/><span className="text-slate-400 mt-1 block">(Optional if URL provided)</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};