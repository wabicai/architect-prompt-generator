import React, { useState, useEffect } from 'react';
import { AppSettings, PromptTemplate } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSave: (newSettings: AppSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
}) => {
  const [apiKey, setApiKey] = useState(settings.apiKey);
  const [templates, setTemplates] = useState<PromptTemplate[]>(settings.templates);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(settings.activeTemplateId);
  const [editingTemplate, setEditingTemplate] = useState<PromptTemplate | null>(null);

  useEffect(() => {
    if (isOpen) {
      setApiKey(settings.apiKey);
      setTemplates(settings.templates);
      setSelectedTemplateId(settings.activeTemplateId);
      
      // Load the active template into the editor by default
      const active = settings.templates.find(t => t.id === settings.activeTemplateId);
      if (active) setEditingTemplate({ ...active });
    }
  }, [isOpen, settings]);

  const handleSave = () => {
    // Save current changes in editor to the list
    let finalTemplates = [...templates];
    if (editingTemplate) {
      const index = finalTemplates.findIndex(t => t.id === editingTemplate.id);
      if (index > -1) {
        finalTemplates[index] = editingTemplate;
      } else {
        finalTemplates.push(editingTemplate);
      }
    }

    onSave({ 
      apiKey, 
      templates: finalTemplates,
      activeTemplateId: selectedTemplateId 
    });
    onClose();
  };

  const handleCreateNew = () => {
    const newTemplate: PromptTemplate = {
      id: Date.now().toString(),
      name: 'New Custom Template',
      content: 'Describe your instructions for the AI here...'
    };
    setTemplates([...templates, newTemplate]);
    setEditingTemplate(newTemplate);
    setSelectedTemplateId(newTemplate.id);
  };

  const handleDelete = (id: string) => {
    if (templates.length <= 1) {
      alert("You must have at least one template.");
      return;
    }
    const newTemplates = templates.filter(t => t.id !== id);
    setTemplates(newTemplates);
    
    // If we deleted the one we were editing, switch to the first available
    if (editingTemplate?.id === id) {
      setEditingTemplate(newTemplates[0]);
      setSelectedTemplateId(newTemplates[0].id);
    }
  };

  const handleSelectTemplate = (t: PromptTemplate) => {
    // If we were editing another one, save it in the list first (in memory)
    if (editingTemplate) {
       setTemplates(prev => prev.map(pt => pt.id === editingTemplate.id ? editingTemplate : pt));
    }
    setSelectedTemplateId(t.id);
    setEditingTemplate({ ...t });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Configuration</h2>
            <p className="text-sm text-slate-500">Manage API keys and Prompt Templates</p>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors bg-white p-2 rounded-full shadow-sm border border-slate-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          
          {/* Sidebar: Template List */}
          <div className="w-1/3 bg-slate-50 border-r border-slate-200 flex flex-col">
            <div className="p-4 border-b border-slate-200">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                API Key
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Gemini API Key"
                className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>
            
            <div className="p-4 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Templates</span>
              <button 
                onClick={handleCreateNew}
                className="text-xs flex items-center gap-1 text-brand-600 hover:text-brand-700 font-semibold"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                New
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-1">
              {templates.map(t => (
                <div 
                  key={t.id}
                  onClick={() => handleSelectTemplate(t)}
                  className={`group flex items-center justify-between px-3 py-3 rounded-lg cursor-pointer transition-all border
                    ${selectedTemplateId === t.id 
                      ? 'bg-white border-brand-200 shadow-sm ring-1 ring-brand-500/20' 
                      : 'border-transparent hover:bg-slate-200/50'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${selectedTemplateId === t.id ? 'bg-brand-500' : 'bg-slate-300'}`}></div>
                    <span className={`text-sm font-medium ${selectedTemplateId === t.id ? 'text-brand-700' : 'text-slate-600'}`}>
                      {t.name}
                    </span>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDelete(t.id); }}
                    className={`opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 transition-opacity`}
                    title="Delete Template"
                  >
                     <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Main Area: Editor */}
          <div className="w-2/3 flex flex-col bg-white">
            {editingTemplate ? (
              <div className="flex-1 flex flex-col p-6 h-full">
                <div className="mb-4">
                   <label className="block text-sm font-medium text-slate-700 mb-1">Template Name</label>
                   <input 
                      type="text" 
                      value={editingTemplate.name}
                      onChange={(e) => setEditingTemplate({...editingTemplate, name: e.target.value})}
                      className="w-full text-lg font-bold text-slate-800 bg-white border-b border-slate-200 pb-2 focus:border-brand-500 outline-none placeholder:text-slate-300 transition-colors"
                      placeholder="e.g. React + Tailwind"
                   />
                </div>
                
                <div className="flex-1 flex flex-col">
                  <label className="block text-sm font-medium text-slate-700 mb-2">System Prompt</label>
                  <textarea
                    value={editingTemplate.content}
                    onChange={(e) => setEditingTemplate({...editingTemplate, content: e.target.value})}
                    className="flex-1 w-full bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm font-mono text-slate-600 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none resize-none leading-relaxed"
                    placeholder="Instructions for the AI..."
                  />
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-400">
                Select a template to edit
              </div>
            )}
          </div>

        </div>

        <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-white">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors text-sm font-medium"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="px-6 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium shadow-lg shadow-brand-500/20 transition-all flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};