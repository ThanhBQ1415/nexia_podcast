'use client'
import { createContext, useContext, useState, ReactNode } from 'react';

interface AudiobookContextType {
  isMarked: boolean;
  activeTab: string;
  setIsMarked: (value: boolean) => void;
  setActiveTab: (tab: string) => void;
  handleMarkBook: () => void;
  handleTabChange: (tab: string) => void;
}

const AudiobookContext = createContext<AudiobookContextType | undefined>(undefined);

export function AudiobookProvider({ children }: { children: ReactNode }) {
  const [isMarked, setIsMarked] = useState(false);
  const [activeTab, setActiveTab] = useState('gioithieu');

  const handleMarkBook = () => {
    setIsMarked(!isMarked);
    // Implement API call to mark/unmark book
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <AudiobookContext.Provider 
      value={{ 
        isMarked, 
        activeTab,
        setIsMarked,
        setActiveTab,
        handleMarkBook,
        handleTabChange
      }}
    >
      {children}
    </AudiobookContext.Provider>
  );
}

export function useAudiobook() {
  const context = useContext(AudiobookContext);
  if (context === undefined) {
    throw new Error('useAudiobook must be used within an AudiobookProvider');
  }
  return context;
}