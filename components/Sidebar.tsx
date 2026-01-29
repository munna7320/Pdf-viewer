
import React, { useState } from 'react';
import { Home, FolderOpen, Settings, Info, Plus, ChevronDown, ChevronRight } from 'lucide-react';
import { Subject } from '../types';
import { ICON_MAP } from '../constants';

interface SidebarProps {
  subjects: Subject[];
  activeSubjectId: string | null;
  onSubjectClick: (id: string | null) => void;
  onAddSubject: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ subjects, activeSubjectId, onSubjectClick, onAddSubject }) => {
  const [isSubjectsOpen, setIsSubjectsOpen] = useState(true);

  return (
    <div className="w-64 bg-white border-r border-slate-200 h-screen flex flex-col p-4">
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
          <FolderOpen className="text-white w-5 h-5" />
        </div>
        <h1 className="font-bold text-lg text-slate-800 tracking-tight leading-tight">Dotxbrain HUB</h1>
      </div>

      <nav className="flex-1 overflow-y-auto space-y-1">
        <button
          onClick={() => onSubjectClick(null)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${!activeSubjectId ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          <Home className="w-5 h-5" />
          <span className="font-semibold text-sm">Dashboard</span>
        </button>

        <div className="pt-4">
          <button 
            onClick={() => setIsSubjectsOpen(!isSubjectsOpen)}
            className="w-full flex items-center justify-between px-3 mb-2 group"
          >
            <div className="flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Subjects</span>
            </div>
            {isSubjectsOpen ? <ChevronDown className="w-4 h-4 text-slate-300" /> : <ChevronRight className="w-4 h-4 text-slate-300" />}
          </button>
          
          {isSubjectsOpen && (
            <div className="space-y-1 animate-in slide-in-from-top-1 duration-200">
              {subjects.map((subject) => (
                <button
                  key={subject.id}
                  onClick={() => onSubjectClick(subject.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${activeSubjectId === subject.id ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <span className={`p-1.5 rounded-lg shadow-sm ${subject.color}`}>
                    {ICON_MAP[subject.icon]}
                  </span>
                  <span className="font-medium text-sm">{subject.name}</span>
                </button>
              ))}
              <button 
                onClick={onAddSubject}
                className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-xl transition-all border border-transparent hover:border-indigo-100 mt-2 border-dashed"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">New Subject</span>
              </button>
            </div>
          )}
        </div>
      </nav>

      <div className="mt-auto pt-4 border-t border-slate-100 space-y-1">
        <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-500 hover:bg-slate-50 rounded-xl transition-colors">
          <Settings className="w-5 h-5" />
          <span className="font-medium text-sm">Settings</span>
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-500 hover:bg-slate-50 rounded-xl transition-colors">
          <Info className="w-5 h-5" />
          <span className="font-medium text-sm">Support</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
