
export interface StudyPDF {
  id: string;
  name: string;
  subjectId: string;
  fileUrl: string; // Blob URL or base64 for session persistence
  lastPage: number;
  totalPages: number;
  uploadDate: number;
}

export interface Subject {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface AppState {
  subjects: Subject[];
  pdfs: StudyPDF[];
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}
