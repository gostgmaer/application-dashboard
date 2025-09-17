"use client";

import React from 'react';
import { useModal } from '@/contexts/modal-context';
import ConfirmModal from './confirm-modal';
import AlertModal from './alert-modal';
import CustomModal from './custom-modal';
import { ModalOptions, AlertModalOptions, CustomModalOptions } from '@/types/modal';

const ModalManager: React.FC = () => {
  const { state, closeModal } = useModal();

  const renderModal = () => {
    switch (state.type) {
      case 'confirm':
        return (
          <ConfirmModal
            isOpen={state.isOpen}
            onClose={closeModal}
            options={state.options as ModalOptions}
          />
        );
      case 'alert':
        return (
          <AlertModal
            isOpen={state.isOpen}
            onClose={closeModal}
            options={state.options as AlertModalOptions}
          />
        );
      case 'custom':
        return (
          <CustomModal
            isOpen={state.isOpen}
            onClose={closeModal}
            options={state.options as CustomModalOptions}
          />
        );
      default:
        return null;
    }
  };

  return <>{renderModal()}</>;
};

export default ModalManager;