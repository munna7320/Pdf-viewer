
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Maximize2, Minimize2 } from 'lucide-react';
import { StudyPDF } from '../types';

interface PDFViewerProps {
  pdf: StudyPDF;
  onClose: () => void;
  onPageChange: (pdfId: string, page: number) => void;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ pdf, onClose, onPageChange }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // We'll use the browser's native PDF viewer in an iframe.
  // This ensures images, fonts, and layout are rendered correctly.
  // We append #page=N to the URL to try and force the browser to open at the last page.
  const viewerUrl = `${pdf.fileUrl}#page=${pdf.lastPage || 1}`;

  // Since we use native iframe, swiping logic is limited to the container overlay 
  // because the iframe captures its own events. We provide clear buttons.
  
  return (
    <div className={`fixed inset-0 z-50 flex flex-col transition-all duration-300 ${isFullscreen ? 'p-0' : 'p-4 md:p-8 bg-black/80 backdrop-blur-md'}`}>
      <div className={`flex flex-col h-full bg-white shadow-2xl rounded-2xl overflow-hidden transition-all duration-500 ${isFullscreen ? 'rounded-none' : ''}`}>
        
        {/* Toolbar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-4">
            <button 
              onClick={onClose} 
              className="p-2.5 hover:bg-slate-100 rounded-xl transition-all text-slate-500 active:scale-95"
              title="Close viewer"
            >
              <X className="w-5 h-5" />
            </button>
            <div>
              <h2 className="font-bold text-slate-800 truncate max-w-[200px] md:max-w-md leading-tight">{pdf.name}</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Resume from page {pdf.lastPage || 1}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-slate-500">NATIVE VIEWER ACTIVE</span>
            </div>

            <button 
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2.5 hover:bg-slate-100 rounded-xl text-slate-500 transition-all active:scale-95"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Content Area - Using iframe for real rendering */}
        <div className="flex-1 relative bg-slate-100 flex flex-col">
          <iframe 
            src={viewerUrl} 
            className="w-full h-full border-none shadow-inner"
            title={pdf.name}
          />
          
          {/* Instructions Overlay (Briefly shown or togglable) */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md text-white px-6 py-2 rounded-full text-xs font-medium pointer-events-none opacity-0 hover:opacity-100 transition-opacity">
            Use the built-in browser controls to navigate pages.
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;
