"use client";

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CustomModalOptions } from '@/types/modal';
import { cn } from '@/lib/utils/utils';

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  options: CustomModalOptions;
}

const CustomModal: React.FC<CustomModalProps> = ({ isOpen, onClose, options }) => {
  const {
    title,
    content,
    footer,
    className,
    onClose: handleClose
  } = options;

  const closeHandler = () => {
    if (handleClose) {
      handleClose();
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeHandler}>
      <DialogContent className={cn("sm:max-w-[625px]", className)}>
        {title && (
          <DialogHeader>
            <DialogTitle className=' capitalize'>{title}</DialogTitle>
            <DialogDescription>
              {/* This is here for accessibility, can be empty */}
            </DialogDescription>
          </DialogHeader>
        )}
        <div className="py-4 max-h-[85vh] overflow-y-auto">
          {content}
        </div>
        {footer && (
          <div className="flex justify-end gap-2">
            {footer}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CustomModal;