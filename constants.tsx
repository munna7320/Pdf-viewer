
import React from 'react';
import { BookOpen, FlaskConical, Globe, Calculator, Palette, Music } from 'lucide-react';
import { Subject } from './types';

export const INITIAL_SUBJECTS: Subject[] = [
  { id: 'math', name: 'Mathematics', color: 'bg-blue-100 text-blue-600', icon: 'Calculator' },
  { id: 'science', name: 'Science', color: 'bg-green-100 text-green-600', icon: 'FlaskConical' },
  { id: 'history', name: 'History', color: 'bg-orange-100 text-orange-600', icon: 'Globe' },
  { id: 'literature', name: 'Literature', color: 'bg-purple-100 text-purple-600', icon: 'BookOpen' },
  { id: 'art', name: 'Art', color: 'bg-pink-100 text-pink-600', icon: 'Palette' },
  { id: 'music', name: 'Music', color: 'bg-indigo-100 text-indigo-600', icon: 'Music' },
];

export const ICON_MAP: Record<string, React.ReactNode> = {
  Calculator: <Calculator className="w-5 h-5" />,
  FlaskConical: <FlaskConical className="w-5 h-5" />,
  Globe: <Globe className="w-5 h-5" />,
  BookOpen: <BookOpen className="w-5 h-5" />,
  Palette: <Palette className="w-5 h-5" />,
  Music: <Music className="w-5 h-5" />,
};
