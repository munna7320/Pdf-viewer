
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import PDFViewer from './components/PDFViewer';
import AIChat from './components/AIChat';
import { Subject, StudyPDF } from './types';
import { INITIAL_SUBJECTS, ICON_MAP } from './constants';
import { Plus, Upload, FileText, Search, Sparkles, ChevronLeft, Folder } from 'lucide-react';

const App: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem('lumina_subjects');
    return saved ? JSON.parse(saved) : INITIAL_SUBJECTS;
  });

  const [pdfs, setPdfs] = useState<StudyPDF[]>(() => {
    const saved = localStorage.getItem('lumina_pdfs');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeSubjectId, setActiveSubjectId] = useState<string | null>(null);
  const [selectedPdf, setSelectedPdf] = useState<StudyPDF | null>(null);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Persistence
  useEffect(() => {
    localStorage.setItem('lumina_subjects', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem('lumina_pdfs', JSON.stringify(pdfs));
  }, [pdfs]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    
    const newPdf: StudyPDF = {
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      subjectId: activeSubjectId || 'other',
      fileUrl: URL.createObjectURL(file),
      lastPage: 1,
      totalPages: 0, // In standard browser viewer, we don't always know this ahead of time
      uploadDate: Date.now(),
    };

    setPdfs(prev => [newPdf, ...prev]);
  };

  const updatePdfPage = (pdfId: string, page: number) => {
    setPdfs(prev => prev.map(p => p.id === pdfId ? { ...p, lastPage: page } : p));
  };

  const filteredPdfs = pdfs.filter(pdf => {
    const matchesSubject = activeSubjectId ? pdf.subjectId === activeSubjectId : true;
    const matchesSearch = pdf.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  const activeSubject = subjects.find(s => s.id === activeSubjectId);

  const getPdfCount = (subjectId: string) => pdfs.filter(p => p.subjectId === subjectId).length;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-inter">
      <Sidebar 
        subjects={subjects} 
        activeSubjectId={activeSubjectId} 
        onSubjectClick={setActiveSubjectId}
        onAddSubject={() => {}} 
      />

      <main className="flex-1 overflow-y-auto p-6 md:p-10 relative">
        <div className="max-w-7xl mx-auto">
          
          {/* DASHBOARD VIEW - Dotxbrain HUB Branding */}
          {!activeSubjectId && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-2">
                  <span className="h-0.5 w-12 bg-indigo-600 rounded-full"></span>
                  <span className="text-xs font-black text-indigo-600 uppercase tracking-[0.3em]">Dotxbrain HUB</span>
                </div>
                <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-none mb-4">Study Dashboard</h1>
                <p className="text-slate-500 text-xl font-medium">Access all your learning materials in one centralized hub.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {subjects.map((subject) => {
                  const count = getPdfCount(subject.id);
                  return (
                    <div 
                      key={subject.id}
                      onClick={() => setActiveSubjectId(subject.id)}
                      className="group relative bg-white rounded-[2rem] p-10 border border-slate-200 hover:border-indigo-400 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all cursor-pointer overflow-hidden active:scale-[0.98]"
                    >
                      <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-8 transition-transform group-hover:scale-110 shadow-lg ${subject.color}`}>
                        <div className="scale-125">{ICON_MAP[subject.icon]}</div>
                      </div>
                      
                      <h3 className="text-2xl font-black text-slate-800 mb-3">{subject.name}</h3>
                      <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">
                        {count === 0 ? 'No resources' : `${count} ${count === 1 ? 'Resource' : 'Resources'}`}
                      </p>

                      <div className="mt-10 flex items-center text-indigo-600 text-sm font-bold opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                        View materials <ChevronLeft className="w-4 h-4 ml-2 rotate-180 stroke-[3px]" />
                      </div>

                      <Folder className="absolute -bottom-6 -right-6 w-32 h-32 text-indigo-600 opacity-[0.02] group-hover:opacity-[0.06] transition-opacity" />
                    </div>
                  );
                })}

                {/* Parallel Styled Action Button */}
                <div className="bg-white/50 rounded-[2rem] p-10 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:bg-white hover:text-indigo-600 hover:border-indigo-300 transition-all cursor-pointer group active:scale-95 shadow-sm hover:shadow-md">
                  <div className="w-16 h-16 rounded-full border-2 border-slate-200 flex items-center justify-center mb-4 group-hover:border-indigo-200 group-hover:bg-indigo-50 transition-all">
                    <Plus className="w-8 h-8 stroke-[3px]" />
                  </div>
                  <span className="font-bold text-base tracking-tight">Create New Subject</span>
                </div>
              </div>
            </div>
          )}

          {/* SUBJECT VIEW */}
          {activeSubjectId && activeSubject && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                <div className="flex items-center gap-6">
                  <button 
                    onClick={() => setActiveSubjectId(null)}
                    className="p-4 bg-white border border-slate-200 rounded-[1.25rem] hover:bg-slate-50 transition-all text-slate-600 shadow-sm hover:shadow-md active:scale-95 group"
                  >
                    <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                  </button>
                  <div>
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-2xl shadow-md ${activeSubject.color}`}>
                        {ICON_MAP[activeSubject.icon]}
                      </div>
                      <h1 className="text-4xl font-black text-slate-900 tracking-tight">{activeSubject.name}</h1>
                    </div>
                    <p className="text-slate-400 font-bold uppercase tracking-widest mt-2 ml-1 text-xs">Organized Materials &bull; {getPdfCount(activeSubject.id)} files</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Find a document..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-[1.25rem] text-sm font-medium focus:ring-4 focus:ring-indigo-500/10 outline-none w-full md:w-80 transition-all shadow-sm"
                    />
                  </div>
                  <label className="flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-[1.25rem] hover:bg-indigo-700 transition-all cursor-pointer shadow-xl shadow-indigo-200 font-black text-sm uppercase tracking-wider active:scale-95">
                    <Upload className="w-5 h-5" />
                    Upload
                    <input type="file" accept="application/pdf" className="hidden" onChange={handleFileUpload} />
                  </label>
                </div>
              </div>

              {/* PDF GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredPdfs.length > 0 ? (
                  filteredPdfs.map((pdf) => {
                    return (
                      <div 
                        key={pdf.id}
                        onClick={() => setSelectedPdf(pdf)}
                        className="group bg-white rounded-[2rem] border border-slate-200 overflow-hidden hover:shadow-[0_20px_50px_rgba(79,70,229,0.15)] hover:border-indigo-200 hover:-translate-y-2 transition-all cursor-pointer shadow-sm active:scale-[0.97]"
                      >
                        <div className="aspect-[3/4] bg-slate-50 flex items-center justify-center relative overflow-hidden p-10">
                           <FileText className="w-20 h-20 text-slate-100 group-hover:text-indigo-50 transition-all group-hover:scale-110 duration-700" />
                           <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                           {pdf.lastPage > 1 && (
                             <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md text-indigo-600 text-[11px] font-black px-4 py-2 rounded-2xl shadow-lg border border-indigo-100">
                               CONTINUE PG {pdf.lastPage}
                             </div>
                           )}
                           <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                             <div className="bg-indigo-600 text-white p-2 rounded-xl shadow-lg">
                               <FileText className="w-4 h-4" />
                             </div>
                           </div>
                        </div>
                        <div className="p-8">
                          <h3 className="font-black text-slate-800 truncate text-lg mb-1">{pdf.name}</h3>
                          <div className="flex items-center justify-between mt-4">
                            <span className="text-[11px] font-black text-slate-300 uppercase tracking-[0.2em]">
                              {new Date(pdf.uploadDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </span>
                            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-full py-40 flex flex-col items-center justify-center text-center">
                    <div className="w-32 h-32 bg-white rounded-[2.5rem] flex items-center justify-center mb-8 shadow-2xl shadow-indigo-500/5 border border-slate-50">
                      <Folder className="w-12 h-12 text-slate-200" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900">No materials found</h3>
                    <p className="text-slate-400 max-w-sm mt-4 text-lg font-medium leading-relaxed">
                      {searchQuery ? `We couldn't find "${searchQuery}" in this subject.` : `Start building your ${activeSubject.name} resource library.`}
                    </p>
                    {!searchQuery && (
                       <label className="mt-10 flex items-center gap-3 px-10 py-5 bg-indigo-600 text-white rounded-[1.5rem] hover:bg-indigo-700 transition-all cursor-pointer shadow-2xl shadow-indigo-200 font-black uppercase tracking-widest active:scale-95">
                          <Upload className="w-6 h-6" />
                          Add Documents
                          <input type="file" accept="application/pdf" className="hidden" onChange={handleFileUpload} />
                       </label>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Global Floating AI Button */}
        <button 
          onClick={() => setIsAIChatOpen(true)}
          className="fixed bottom-10 right-10 w-20 h-20 bg-indigo-600 text-white rounded-[2rem] flex items-center justify-center shadow-2xl shadow-indigo-500/40 hover:bg-indigo-700 hover:scale-110 transition-all group z-40 active:scale-95"
          title="Open AI Assistant"
        >
          <Sparkles className="w-8 h-8 group-hover:rotate-12 transition-transform" />
        </button>

        <AIChat 
          isOpen={isAIChatOpen} 
          onClose={() => setIsAIChatOpen(false)} 
          context={activeSubject?.name ? `Subject: ${activeSubject.name}${selectedPdf ? `, File: ${selectedPdf.name}` : ''}` : undefined}
        />

        {selectedPdf && (
          <PDFViewer 
            pdf={selectedPdf} 
            onClose={() => setSelectedPdf(null)}
            onPageChange={updatePdfPage}
          />
        )}
      </main>
    </div>
  );
};

export default App;
