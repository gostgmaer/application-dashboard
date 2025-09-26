'use client';

import { cn } from '@/lib/utils/utils';
import React, { useRef, useEffect, KeyboardEvent, useCallback } from 'react';


interface OTPInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  length?: number;
  disabled?: boolean;
  error?: boolean;
  autoFocus?: boolean;
  onComplete?: (otp: string) => void;
  placeholder?: string;
}

export function OTPInput({
  value,
  onChange,
  length = 6,
  disabled = false,
  error = false,
  autoFocus = true,
  onComplete,
  placeholder = '',
}: OTPInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  // Auto-focus first input on mount
  useEffect(() => {
    if (autoFocus && inputRefs.current[0] && !disabled) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus, disabled]);

  // Check if OTP is complete and call onComplete
  useEffect(() => {
    const otp = value.join('');
    if (otp.length === length && onComplete && !disabled) {
      onComplete(otp);
    }
  }, [value, length, onComplete, disabled]);

  const clearAllInputs = useCallback(() => {
    const newValue = Array(length).fill('');
    onChange(newValue);
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [length, onChange]);

  const handleChange = (index: number, inputValue: string) => {
    if (disabled) return;

    // Allow only numeric input
    const sanitizedValue = inputValue.replace(/[^0-9]/g, '').slice(0, 1);
    if (sanitizedValue.length > 1) return;

    const newValue = [...value];
    newValue[index] = sanitizedValue;
    onChange(newValue);

    // Auto-focus next input
    if (sanitizedValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (e.key === 'Backspace') {
      e.preventDefault();
      const newValue = [...value];
      
      if (value[index]) {
        // Clear current input
        newValue[index] = '';
        onChange(newValue);
      } else if (index > 0) {
        // Move to previous input and clear it
        newValue[index - 1] = '';
        onChange(newValue);
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'Delete') {
      e.preventDefault();
      const newValue = [...value];
      newValue[index] = '';
      onChange(newValue);
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    } else if (e.key === 'Home') {
      inputRefs.current[0]?.focus();
    } else if (e.key === 'End') {
      inputRefs.current[length - 1]?.focus();
    } else if (e.key === 'Escape') {
      clearAllInputs();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    if (disabled) return;

    const pastedData = e.clipboardData
      .getData('text')
      .replace(/[^0-9]/g, '')
      .slice(0, length);
    
    const newValue = [...value];
    
    for (let i = 0; i < Math.min(pastedData.length, length); i++) {
      newValue[i] = pastedData[i];
    }
    
    onChange(newValue);
    
    // Focus the next empty input or the last input
    const nextIndex = Math.min(pastedData.length, length - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleFocus = (index: number) => {
    // Select all text when focusing (for easier replacement)
    const input = inputRefs.current[index];
    if (input && input.value) {
      input.select();
    }
  };

  return (
    <div className="flex gap-2 justify-center" role="group" aria-label="OTP Input">
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          ref={(el) => { inputRefs.current[index] = el; }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          autoComplete="one-time-code"
          aria-label={`OTP digit ${index + 1}`}
          value={value[index] || ''}
          placeholder={placeholder}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={() => handleFocus(index)}
          disabled={disabled}
          className={cn(
            'w-12 h-12 text-center text-lg font-semibold rounded-xl border-2 transition-all duration-200',
            'bg-white dark:bg-gray-900 text-black dark:text-white',
            'border-gray-300 dark:border-gray-600',
            'focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent',
            'hover:border-gray-400 dark:hover:border-gray-500',
            'placeholder:text-gray-400 dark:placeholder:text-gray-500',
            error && 'border-red-500 dark:border-red-400 focus:ring-red-500 dark:focus:ring-red-400',
            disabled && 'opacity-50 cursor-not-allowed',
          )}
        />
      ))}
    </div>
  );
}