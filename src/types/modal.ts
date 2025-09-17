export interface ModalOptions {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive' | 'secondary';
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
}

export interface CustomModalOptions {
  title?: string;
  content: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  onClose?: () => void;
}

export interface AlertModalOptions {
  title?: string;
  description?: string;
  confirmText?: string;
  variant?: 'default' | 'destructive' | 'warning' | 'success';
  onConfirm?: () => void;
}

export type ModalType = 'confirm' | 'alert' | 'custom';

export interface ModalState {
  isOpen: boolean;
  type: ModalType | null;
  options: ModalOptions | AlertModalOptions | CustomModalOptions;
}