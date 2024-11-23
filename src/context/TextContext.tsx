import React, { createContext, useContext, useState } from 'react';

interface TextContextType {
  extractedText: string;
  summary: string;
  answer: string;
  setExtractedText: (text: string) => void;
  setSummary: (summary: string) => void;
  setAnswer: (answer: string) => void;
}

const TextContext = createContext<TextContextType | undefined>(undefined);

export function TextProvider({ children }: { children: React.ReactNode }) {
  const [extractedText, setExtractedText] = useState('');
  const [summary, setSummary] = useState('');
  const [answer, setAnswer] = useState('');

  return (
    <TextContext.Provider value={{
      extractedText,
      summary,
      answer,
      setExtractedText,
      setSummary,
      setAnswer
    }}>
      {children}
    </TextContext.Provider>
  );
}

export function useText() {
  const context = useContext(TextContext);
  if (context === undefined) {
    throw new Error('useText must be used within a TextProvider');
  }
  return context;
}