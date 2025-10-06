"use client";

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';
import { ModalOptions } from '@/types/modal';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  options: ModalOptions;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, options }) => {
  const {
    title = 'Confirm Action',
    description = 'Are you sure you want to proceed?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'default',
    onConfirm,
    onCancel
  } = options;

  const getIcon = () => {
    switch (variant) {
      case 'destructive':
        return <AlertTriangle className="h-6 w-6 text-destructive" />;
      case 'secondary':
        return <Info className="h-6 w-6 text-blue-500" />;
      default:
        return <CheckCircle className="h-6 w-6 text-green-500" />;
    }
  };

  const getButtonVariant = () => {
    switch (variant) {
      case 'destructive':
        return 'destructive' as const;
      case 'secondary':
        return 'secondary' as const;
      default:
        return 'default' as const;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getIcon()}
            {title}
          </DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant={getButtonVariant()}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmModal;