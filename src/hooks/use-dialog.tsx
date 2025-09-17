"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface ConfirmModalProps {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  icon?: ReactNode;
  onCancel?: () => void;
  variant?: "default" | "destructive" | "success" | "warning";
  children: ReactNode;
}

interface DialogContextType {
  isOpen: boolean;
  openDialog: (content: ReactNode, options?: DialogOptions) => void;
  closeDialog: () => void;
  confirm: (options: ConfirmOptions) => Promise<boolean>;
   monfirmModal: (options: ConfirmOptions) => Promise<boolean>;
  alert: (options: AlertOptions) => Promise<void>;
  content: ReactNode;
  variant?: "default" | "destructive" | "success" | "warning";
  options: DialogOptions;
}

interface DialogOptions {
  size?: "sm" | "md" | "lg" | "xl" | "full";
  variant?: "default" | "destructive" | "success" | "warning";
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  className?: string;
}

interface ConfirmOptions {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive" | "success" | "warning";
  icon?: ReactNode;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

interface AlertOptions {
  title: string;
  description?: string;
  confirmText?: string;
  variant?: "default" | "destructive" | "success" | "warning" | "info";
  icon?: ReactNode;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export function DialogProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<ReactNode>(null);
  const [options, setOptions] = useState<DialogOptions>({});
  const [promiseResolve, setPromiseResolve] = useState<
    ((value: any) => void) | null
  >(null);

  const openDialog = useCallback(
    (dialogContent: ReactNode, dialogOptions: DialogOptions = {}) => {
      setContent(dialogContent);
      setOptions({
        size: "md",
        showCloseButton: true,
        closeOnOverlayClick: true,
        closeOnEscape: true,
        ...dialogOptions,
      });
      setIsOpen(true);
    },
    []
  );

  const closeDialog = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => {
      setContent(null);
      setOptions({});
      if (promiseResolve) {
        promiseResolve(false);
        setPromiseResolve(null);
      }
    }, 150); // Wait for animation
  }, [promiseResolve]);

  const confirm = useCallback(
    (options: ConfirmOptions): Promise<boolean> => {
      return new Promise((resolve) => {
        setPromiseResolve(() => resolve);

        const confirmContent = (
          <ConfirmDialog
            {...options}
            onConfirm={() => {
              resolve(true);
              setPromiseResolve(null);
              closeDialog();
            }}
            onCancel={() => {
              resolve(false);
              setPromiseResolve(null);
              closeDialog();
            }}
          />
        );

        openDialog(confirmContent, {
          size: "sm",
          variant: options.variant,
          closeOnOverlayClick: options.closeOnOverlayClick ?? false,
          closeOnEscape: options.closeOnEscape ?? false,
          showCloseButton: false,
        });
      });
    },
    [openDialog, closeDialog]
  );

  const monfirmModal = useCallback(
    (options: ConfirmOptions): Promise<boolean> => {
      return new Promise((resolve) => {
        setPromiseResolve(() => resolve);

        const confirmContent = (
          <ConfirmModal
            {...options}
            onConfirm={() => {
              resolve(true);
              setPromiseResolve(null);
              closeDialog();
            }}
            onCancel={() => {
              resolve(false);
              setPromiseResolve(null);
              closeDialog();
            }}
          >
            {children}
          </ConfirmModal>
        );

        openDialog(confirmContent, {
          size: "sm",
          variant: options.variant,
          closeOnOverlayClick: options.closeOnOverlayClick ?? false,
          closeOnEscape: options.closeOnEscape ?? false,
          showCloseButton: false,
        });
      });
    },
    [openDialog, closeDialog,children]
  );
  const alert = useCallback(
    (options: AlertOptions): Promise<void> => {
      return new Promise((resolve) => {
        const alertContent = (
          <AlertD
            {...options}
            onConfirm={() => {
              resolve();
              closeDialog();
            }}
          />
        );

        openDialog(alertContent, {
          size: "sm",
          closeOnOverlayClick: options.closeOnOverlayClick ?? false,
          closeOnEscape: options.closeOnEscape ?? true,
          showCloseButton: false,
        });
      });
    },
    [openDialog, closeDialog]
  );

  const value: DialogContextType = {
    isOpen,
    openDialog,
    closeDialog,
    confirm,
    monfirmModal,
    alert,
    content,
    options,
  };

  return (
    <DialogContext.Provider value={value}>{children}</DialogContext.Provider>
  );
}

export function useDialog() {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return context;
}

// Internal components for confirm and alert dialogs

import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";

function ConfirmDialog({
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  icon,
  onConfirm,
  onCancel,
}: ConfirmOptions & {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const getIcon = () => {
    if (icon) return icon;

    switch (variant) {
      case "destructive":
        return <XCircle className="h-6 w-6 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-6 w-6 text-amber-500" />;
      case "success":
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      default:
        return <Info className="h-6 w-6 text-blue-500" />;
    }
  };

  const getConfirmButtonVariant = () => {
    switch (variant) {
      case "destructive":
        return "destructive";
      case "success":
        return "default";
      default:
        return "default";
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-start gap-4 mb-6">
        {getIcon()}
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {title}
          </h2>
          {description && (
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onCancel}>
          {cancelText}
        </Button>
        <Button variant={getConfirmButtonVariant()} onClick={onConfirm}>
          {confirmText}
        </Button>
      </div>
    </div>
  );
}

function ConfirmModal({
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  icon,
  onConfirm,
  onCancel,
  variant = "default",
  children,
}: ConfirmModalProps) {
  return (
    <AlertDialog>
      {/* <AlertDialogTrigger asChild>{children}</AlertDialogTrigger> */}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>{cancelText}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={
              variant === "destructive"
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : ""
            }
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function AlertD({
  title,
  description,
  confirmText = "OK",
  variant = "info",
  icon,
  onConfirm,
}: AlertOptions & {
  onConfirm: () => void;
}) {
  const getIcon = () => {
    if (icon) return icon;

    switch (variant) {
      case "destructive":
        return <XCircle className="h-6 w-6 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-6 w-6 text-amber-500" />;
      case "success":
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case "info":
      default:
        return <Info className="h-6 w-6 text-blue-500" />;
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-start gap-4 mb-6">
        {getIcon()}
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {title}
          </h2>
          {description && (
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={onConfirm}>{confirmText}</Button>
      </div>
    </div>
  );
}
