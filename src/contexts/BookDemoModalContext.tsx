'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface BookDemoModalPrefill {
  schoolName?: string;
  designation?: string;
  note?: string;
  source?: string;
  title?: string;
  subtitle?: string;
  hideExtraFields?: boolean;
}

interface BookDemoModalContextType {
  isOpen: boolean;
  openDemoModal: (prefill?: BookDemoModalPrefill) => void;
  closeDemoModal: () => void;
  prefillData: BookDemoModalPrefill;
}

const BookDemoModalContext = createContext<BookDemoModalContextType | undefined>(undefined);

export const BookDemoModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [prefillData, setPrefillData] = useState<BookDemoModalPrefill>({});

  const openDemoModal = (prefill?: BookDemoModalPrefill) => {
    if (prefill) {
      setPrefillData(prefill);
    } else {
      setPrefillData({});
    }
    setIsOpen(true);
  };

  const closeDemoModal = () => {
    setIsOpen(false);
  };

  return (
    <BookDemoModalContext.Provider value={{ isOpen, openDemoModal, closeDemoModal, prefillData }}>
      {children}
    </BookDemoModalContext.Provider>
  );
};

export const useBookDemoModal = () => {
  const context = useContext(BookDemoModalContext);
  if (!context) {
    throw new Error('useBookDemoModal must be used within a BookDemoModalProvider');
  }
  return context;
};
