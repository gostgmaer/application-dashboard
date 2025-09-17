"use client";

import { useModal } from '@/contexts/modal-context';

// Hook for common modal patterns
export const useModalActions = () => {
  const { showConfirm, showAlert, showCustom } = useModal();

  // Delete confirmation
  const confirmDelete = async (itemName?: string) => {
    return await showConfirm({
      title: 'Delete Item',
      description: `Are you sure you want to delete ${itemName || 'this item'}? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'destructive'
    });
  };

  // Save confirmation
  const confirmSave = async (hasUnsavedChanges: boolean = true) => {
    if (!hasUnsavedChanges) return true;
    
    return await showConfirm({
      title: 'Save Changes',
      description: 'You have unsaved changes. Do you want to save them?',
      confirmText: 'Save',
      cancelText: 'Discard',
      variant: 'default'
    });
  };

  // Logout confirmation
  const confirmLogout = async () => {
    return await showConfirm({
      title: 'Sign Out',
      description: 'Are you sure you want to sign out?',
      confirmText: 'Sign Out',
      cancelText: 'Stay',
      variant: 'secondary'
    });
  };

  // Success alert
  const showSuccess = async (message: string, title: string = 'Success') => {
    await showAlert({
      title,
      description: message,
      variant: 'success'
    });
  };

  // Error alert
  const showError = async (message: string, title: string = 'Error') => {
    await showAlert({
      title,
      description: message,
      variant: 'destructive'
    });
  };

  // Warning alert
  const showWarning = async (message: string, title: string = 'Warning') => {
    await showAlert({
      title,
      description: message,
      variant: 'warning'
    });
  };

  return {
    confirmDelete,
    confirmSave,
    confirmLogout,
    showSuccess,
    showError,
    showWarning,
    showConfirm,
    showAlert,
    showCustom
  };
};