"use client"

import React, { useEffect } from 'react'
import { useDialog } from '@/hooks/use-dialog'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils/utils'


export function ReusableDialog() {
  const { isOpen, closeDialog, content, options } = useDialog()

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && options.closeOnEscape !== false) {
        closeDialog()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, closeDialog, options.closeOnEscape])

  const getSizeClasses = () => {
    switch (options.size) {
      case 'sm':
        return 'max-w-md'
      case 'md':
        return 'max-w-lg'
      case 'lg':
        return 'max-w-2xl'
      case 'xl':
        return 'max-w-4xl'
      case 'full':
        return 'max-w-[95vw] max-h-[95vh] w-full h-full'
      default:
        return 'max-w-lg'
    }
  }

  const getVariantClasses = () => {
    switch (options.variant) {
      case 'destructive':
        return 'border-red-200 dark:border-red-800'
      case 'success':
        return 'border-green-200 dark:border-green-800'
      case 'warning':
        return 'border-amber-200 dark:border-amber-800'
      default:
        return 'border-gray-200 dark:border-gray-800'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeDialog()}>
      <DialogContent 
        className={cn(
          getSizeClasses(),
          getVariantClasses(),
          options.className,
          "p-0 gap-0 overflow-hidden"
        )}
        onPointerDownOutside={(e) => {
          if (options.closeOnOverlayClick === false) {
            e.preventDefault()
          }
        }}
      >
        {content}
      </DialogContent>
    </Dialog>
  )
}

interface FormDialogProps {
  title: string
  children: React.ReactNode
  onSubmit: () => void | Promise<void>
  onCancel: () => void
  submitText?: string
  cancelText?: string
  isSubmitting?: boolean
  submitDisabled?: boolean
  description?: string
}

export function FormDialog({
  title,
  children,
  onSubmit,
  onCancel,
  submitText = 'Submit',
  cancelText = 'Cancel',
  isSubmitting = false,
  submitDisabled = false,
  description
}: FormDialogProps) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit()
  }

  return (
    <div className="flex flex-col max-h-[80vh]">
      <DialogHeader className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
        <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
          {title}
        </DialogTitle>
        {description && (
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            {description}
          </DialogDescription>
        )}
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="flex flex-col flex-1">
        <div className="px-6 py-4 flex-1 overflow-y-auto">
          {children}
        </div>
        
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-3">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            {cancelText}
          </Button>
          <Button 
            type="submit" 
            disabled={submitDisabled || isSubmitting}
          >
            {isSubmitting ? 'Loading...' : submitText}
          </Button>
        </div>
      </form>
    </div>
  )
}

interface InfoDialogProps {
  title: string
  children: React.ReactNode
  onClose: () => void
  actions?: React.ReactNode
  description?: string
}

export function InfoDialog({
  title,
  children,
  onClose,
  actions,
  description
}: InfoDialogProps) {
  return (
    <div className="flex flex-col max-h-[80vh]">
      <DialogHeader className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
        <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
          {title}
        </DialogTitle>
        {description && (
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            {description}
          </DialogDescription>
        )}
      </DialogHeader>
      
      <div className="px-6 py-4 flex-1 w-auto overflow-y-auto">
        {children}
      </div>
      
      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-3">
        {actions}
        <Button onClick={onClose}>Close</Button>
      </div>
    </div>
  )
}

interface CustomDialogProps {
  children: React.ReactNode
  showHeader?: boolean
  title?: string
  description?: string
  showFooter?: boolean
  footer?: React.ReactNode
}

export function CustomDialog({
  children,
  showHeader = false,
  title,
  description,
  showFooter = false,
  footer
}: CustomDialogProps) {
  return (
    <div className="flex flex-col w-auto max-h-[80vh]">
      {showHeader && (
        <DialogHeader className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
          {title && (
            <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
              {title}
            </DialogTitle>
          )}
          {description && (
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
      )}
      
      <div className="flex-1 overflow-y-auto p-4">
        {children}
      </div>
      
      {showFooter && footer && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex-shrink-0">
          {footer}
        </div>
      )}
    </div>
  )
}