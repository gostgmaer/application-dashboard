"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ModalState, ModalOptions, AlertModalOptions, CustomModalOptions } from '@/types/modal';

interface ModalContextType {
  state: ModalState;
  showConfirm: (options: ModalOptions) => Promise<boolean>;
  showAlert: (options: AlertModalOptions) => Promise<void>;
  showCustom: (options: CustomModalOptions) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [state, setState] = useState<ModalState>({
    isOpen: false,
    type: null,
    options: {}
  });

  const closeModal = () => {
    setState({
      isOpen: false,
      type: null,
      options: {}
    });
  };

  const showConfirm = (options: ModalOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setState({
        isOpen: true,
        type: 'confirm',
        options: {
          ...options,
          onConfirm: async () => {
            if (options.onConfirm) {
              await options.onConfirm();
            }
            closeModal();
            resolve(true);
          },
          onCancel: () => {
            if (options.onCancel) {
              options.onCancel();
            }
            closeModal();
            resolve(false);
          }
        }
      });
    });
  };

  const showAlert = (options: AlertModalOptions): Promise<void> => {
    return new Promise((resolve) => {
      setState({
        isOpen: true,
        type: 'alert',
        options: {
          ...options,
          onConfirm: () => {
            if (options.onConfirm) {
              options.onConfirm();
            }
            closeModal();
            resolve();
          }
        }
      });
    });
  };

  const showCustom = (options: CustomModalOptions) => {
    setState({
      isOpen: true,
      type: 'custom',
      options: {
        ...options,
        onClose: () => {
          if (options.onClose) {
            options.onClose();
          }
          closeModal();
        }
      }
    });
  };

  return (
    <ModalContext.Provider value={{
      state,
      showConfirm,
      showAlert,
      showCustom,
      closeModal
    }}>
      {children}
    </ModalContext.Provider>
  );
};