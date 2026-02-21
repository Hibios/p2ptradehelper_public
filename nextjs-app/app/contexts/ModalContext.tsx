"use client"

import { ModalContextProps } from '@/types/components';
import { useDisclosure } from '@heroui/react';
import { createContext, useContext, useState, ReactNode } from 'react';

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [header, setHeader] = useState('');
  const [body, setBody] = useState('');
  const [buttonText, setButtonText] = useState('Ок');
  const [onConfirm, setOnConfirm] = useState<(() => void) | undefined>(undefined);
  const [inputPlaceholder, setInputPlaceholder] = useState<string>('');

  const openModal = (header: string, body: string, onConfirm?: (value: string) => void, buttonText?: string, inputPlaceholder?: string) => {
    setHeader(header);
    setBody(body)
    if (buttonText) setButtonText(buttonText);
    else setButtonText('Ок');
    onOpen();
    setOnConfirm(() => onConfirm);
    setInputPlaceholder(inputPlaceholder || '');
  };

  return (
    <ModalContext.Provider value={{ isOpen, onOpenChange, header, body, buttonText, onConfirm, inputPlaceholder, openModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};


