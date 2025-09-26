'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CircleAlert as AlertCircle, CircleCheck as CheckCircle2, Clock, Shield, Smartphone, Mail as MailIcon } from 'lucide-react';
import { OTPInput } from './OTPInput';
import { useOTPTimer } from '@/hooks/useOTPTimer';
import { cn } from '@/lib/utils/utils';

interface OTPModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (otp: string) => Promise<void>;
  onResend?: () => Promise<void>;
  method: 'totp' | 'sms' | 'email';
  email?: string;
  phone?: string;
  isLoading?: boolean;
  error?: string;
  remainingAttempts?: number;
  maxAttempts?: number;
  lockoutUntil?: string;
  sessionExpiry?: string;
}

const ERROR_MESSAGES = {
  INVALID_OTP: 'Invalid verification code. Please check and try again.',
  EXPIRED_OTP: 'Verification code has expired. Please request a new one.',
  MAX_ATTEMPTS_EXCEEDED: 'Too many failed attempts. Please try again later.',
  RATE_LIMITED: 'Too many requests. Please wait before trying again.',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
};

export function OTPModal({
  isOpen,
  onClose,
  onVerify,
  onResend,
  method,
  email,
  phone,
  isLoading = false,
  error,
  remainingAttempts,
  maxAttempts = 5,
  lockoutUntil,
  sessionExpiry,
}: OTPModalProps) {
  const [otpValue, setOtpValue] = useState<string[]>(Array(6).fill(''));
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [internalError, setInternalError] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const maxResendAttempts = 3;
  const verifyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const sessionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // OTP expiry timer (typically 5-10 minutes)
  const otpTimer = useOTPTimer({
    initialSeconds: 300, // 5 minutes
    onExpire: () => {
      setInternalError('Verification code has expired. Please request a new one.');
      setOtpValue(Array(6).fill(''));
    },
  });

  // Resend cooldown timer
  const resendTimer = useOTPTimer({
    initialSeconds: 60,
  });

  // Lockout timer
  const lockoutTimer = useOTPTimer({
    onExpire: () => {
      setIsLocked(false);
      setInternalError('');
    },
  });

  // Session expiry timer
  const sessionTimer = useOTPTimer({
    onExpire: () => {
      setSessionExpired(true);
      setInternalError('Your session has expired. Please log in again.');
    },
  });

  // Initialize timers when modal opens
  useEffect(() => {
    if (isOpen) {
      // Start OTP expiry timer
      otpTimer.startTimer();
      
      // Start resend cooldown if method supports resend
      if (method === 'sms' || method === 'email') {
        resendTimer.startTimer();
      }

      // Handle lockout
      if (lockoutUntil) {
        const lockoutTime = new Date(lockoutUntil).getTime();
        const now = Date.now();
        const remainingLockout = Math.max(0, Math.floor((lockoutTime - now) / 1000));
        
        if (remainingLockout > 0) {
          setIsLocked(true);
          lockoutTimer.startTimer(remainingLockout);
        }
      }

      // Handle session expiry
      if (sessionExpiry) {
        const expiryTime = new Date(sessionExpiry).getTime();
        const now = Date.now();
        const remainingSession = Math.max(0, Math.floor((expiryTime - now) / 1000));
        
        if (remainingSession > 0) {
          sessionTimer.startTimer(remainingSession);
        } else {
          setSessionExpired(true);
        }
      }
    }
  }, [isOpen, method, lockoutUntil, sessionExpiry]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setOtpValue(Array(6).fill(''));
      setSuccessMessage('');
      setInternalError('');
      setIsLocked(false);
      setSessionExpired(false);
      setResendCount(0);
      otpTimer.resetTimer();
      resendTimer.resetTimer();
      lockoutTimer.resetTimer();
      sessionTimer.resetTimer();
      
      // Clear any pending timeouts
      if (verifyTimeoutRef.current) {
        clearTimeout(verifyTimeoutRef.current);
      }
      if (sessionTimeoutRef.current) {
        clearTimeout(sessionTimeoutRef.current);
      }
    }
  }, [isOpen]);

  // Clear internal error when OTP changes
  useEffect(() => {
    if (otpValue.some(digit => digit !== '')) {
      setInternalError('');
    }
  }, [otpValue]);

  // Auto-verify when OTP is complete
  const handleOTPComplete = useCallback(async (otp: string) => {
    if (isVerifying || isLocked || sessionExpired || successMessage) return;
    
    // Add small delay to prevent double submission
    verifyTimeoutRef.current = setTimeout(() => {
      handleVerify(otp);
    }, 100);
  }, [isVerifying, isLocked, sessionExpired, successMessage]);

  const handleVerify = async (otp?: string) => {
    const otpCode = otp || otpValue.join('');
    
    if (otpCode.length !== 6) {
      setInternalError('Please enter a complete 6-digit code.');
      return;
    }
    
    if (isLocked) {
      setInternalError('Account is temporarily locked. Please wait.');
      return;
    }
    
    if (sessionExpired) {
      setInternalError('Your session has expired. Please log in again.');
      return;
    }

    if (otpTimer.hasExpired) {
      setInternalError('Verification code has expired. Please request a new one.');
      return;
    }

    if (!otp || otp.length !== 6) return;

    setIsVerifying(true);
    setInternalError('');
    
    try {
      await onVerify(otpCode);
      setSuccessMessage('Verification successful!');
      
      // Auto-close modal after success
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error('OTP verification error:', error);
      
      // Handle specific error types
      if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase();
        
        if (errorMessage.includes('expired')) {
          setInternalError(ERROR_MESSAGES.EXPIRED_OTP);
          setOtpValue(Array(6).fill(''));
        } else if (errorMessage.includes('invalid')) {
          setInternalError(ERROR_MESSAGES.INVALID_OTP);
          setOtpValue(Array(6).fill(''));
        } else if (errorMessage.includes('attempts')) {
          setInternalError(ERROR_MESSAGES.MAX_ATTEMPTS_EXCEEDED);
          setIsLocked(true);
        } else if (errorMessage.includes('rate')) {
          setInternalError(ERROR_MESSAGES.RATE_LIMITED);
        } else if (errorMessage.includes('session')) {
          setInternalError(ERROR_MESSAGES.SESSION_EXPIRED);
          setSessionExpired(true);
        } else {
          setInternalError(ERROR_MESSAGES.UNKNOWN_ERROR);
        }
      } else {
        setInternalError(ERROR_MESSAGES.NETWORK_ERROR);
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!onResend || !resendTimer.canResend || isResending || resendCount >= maxResendAttempts) return;
    
    if (sessionExpired) {
      setInternalError('Your session has expired. Please log in again.');
      return;
    }
    
    setIsResending(true);
    setInternalError('');
    
    try {
      await onResend();
      setResendCount(prev => prev + 1);
      resendTimer.startTimer();
      otpTimer.startTimer(); // Reset OTP expiry timer
      setOtpValue(Array(6).fill('')); // Clear current OTP
      
      const methodText = method === 'sms' ? 'SMS' : 'email';
      setSuccessMessage(`New code sent via ${methodText}!`);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Resend OTP error:', error);
      
      if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase();
        
        if (errorMessage.includes('rate')) {
          setInternalError('Too many resend attempts. Please wait before trying again.');
        } else if (errorMessage.includes('daily')) {
          setInternalError('Daily resend limit reached. Please try again tomorrow.');
        } else if (errorMessage.includes('session')) {
          setInternalError('Your session has expired. Please log in again.');
          setSessionExpired(true);
        } else {
          setInternalError('Failed to resend code. Please try again.');
        }
      } else {
        setInternalError('Network error. Please check your connection.');
      }
    } finally {
      setIsResending(false);
    }
  };

  const handleClose = () => {
    if (isVerifying || isResending) return;
    onClose();
  };

  const getMethodText = () => {
    switch (method) {
      case 'totp':
        return 'authenticator app';
      case 'sms':
        return 'SMS';
      case 'email':
        return 'email';
      default:
        return 'device';
    }
  };

  const getMethodIcon = () => {
    switch (method) {
      case 'totp':
        return <Shield className="w-5 h-5" />;
      case 'sms':
        return <Smartphone className="w-5 h-5" />;
      case 'email':
        return <MailIcon className="w-5 h-5" />;
      default:
        return <Shield className="w-5 h-5" />;
    }
  };

  const getDescription = () => {
    if (method === 'totp') {
      return 'Enter the 6-digit code from your authenticator app.';
    }
    
    const destination = method === 'email' 
      ? (email ? `email (${email.replace(/(.{2})(.*)(@.*)/, '$1***$3')})` : 'email')
      : (phone ? `phone (***-***-${phone.slice(-4)})` : 'phone');
    
    return `Enter the 6-digit code sent to your ${destination}.`;
  };

  const currentError = error || internalError;
  const isDisabled = isVerifying || isResending || Boolean(successMessage) || isLocked || sessionExpired;
  const canResendNow = resendTimer.canResend && resendCount < maxResendAttempts && !sessionExpired;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          
          {/* Modal */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative w-full max-w-md"
          >
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 relative">
              {/* Close Button */}
              <button
                onClick={handleClose}
                disabled={isDisabled}
                className={cn(
                  'absolute top-4 right-4 p-2 rounded-full transition-all duration-200',
                  'hover:bg-gray-100 dark:hover:bg-gray-800',
                  'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300',
                  isDisabled && 'opacity-50 cursor-not-allowed'
                )}
              >
                <X size={20} />
              </button>

              {/* Header */}
              <div className="text-center mb-8">
                {/* Method Icon */}
                <div className="w-16 h-16 bg-black dark:bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-white dark:text-black">
                    {getMethodIcon()}
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold text-black dark:text-white mb-2">
                  Verify Your Identity
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {getDescription()}
                </p>
                
                {/* Timer Display */}
                {!otpTimer.hasExpired && otpTimer.seconds > 0 && (
                  <div className="flex items-center justify-center gap-2 mt-3 text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>Code expires in {otpTimer.formattedTime}</span>
                  </div>
                )}
                
                {/* Session Expiry Warning */}
                {sessionTimer.seconds > 0 && sessionTimer.seconds < 300 && (
                  <div className="flex items-center justify-center gap-2 mt-2 text-sm text-orange-500 dark:text-orange-400">
                    <AlertCircle className="w-4 h-4" />
                    <span>Session expires in {sessionTimer.formattedTime}</span>
                  </div>
                )}
              </div>

              {/* Lockout Message */}
              {isLocked && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center gap-2 mb-6 text-red-500 dark:text-red-400 text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800"
                >
                  <AlertCircle size={20} />
                  <div>
                    <p className="font-medium">Account Temporarily Locked</p>
                    <p className="text-sm mt-1">
                      Too many failed attempts. Try again in {lockoutTimer.formattedTime}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Session Expired Message */}
              {sessionExpired && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center gap-2 mb-6 text-orange-500 dark:text-orange-400 text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800"
                >
                  <AlertCircle size={20} />
                  <div>
                    <p className="font-medium">Session Expired</p>
                    <p className="text-sm mt-1">Please close this dialog and log in again</p>
                  </div>
                </motion.div>
              )}

              {/* Success Message */}
              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center gap-2 mb-6 text-green-600 dark:text-green-400"
                >
                  <CheckCircle2 size={20} />
                  <span className="font-medium">{successMessage}</span>
                </motion.div>
              )}

              {/* OTP Input */}
              {!isLocked && !sessionExpired && (
                <div className="mb-6">
                <OTPInput
                  value={otpValue}
                  onChange={setOtpValue}
                    onComplete={handleOTPComplete}
                    disabled={isDisabled}
                    error={Boolean(currentError)}
                    autoFocus={!isDisabled}
                />
                </div>
              )}

              {/* Error Message */}
              {currentError && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-2 text-red-500 dark:text-red-400 text-sm mb-6 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800"
                >
                  <AlertCircle size={16} />
                  <span>{currentError}</span>
                </motion.div>
              )}

              {/* Remaining Attempts */}
              {remainingAttempts !== undefined && remainingAttempts < maxAttempts && remainingAttempts > 0 && (
                <div className="text-center mb-4">
                  <p className="text-sm text-orange-500 dark:text-orange-400">
                    {remainingAttempts} attempt{remainingAttempts !== 1 ? 's' : ''} remaining
                  </p>
                </div>
              )}

              {/* Actions */}
              {!sessionExpired && (
                <div className="space-y-4">
                {/* Verify Button */}
                  {!isLocked && (
                <button
                      onClick={() => handleVerify()}
                  disabled={
                        otpValue.join('').length !== 6 || 
                        isDisabled
                  }
                  className={cn(
                    'w-full rounded-xl px-4 py-3 font-medium transition-all duration-200',
                    'bg-black dark:bg-white text-white dark:text-black',
                    'hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:ring-offset-2 dark:focus:ring-offset-gray-900',
                    'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:opacity-50',
                    'flex items-center justify-center gap-2'
                  )}
                >
                  {isVerifying && (
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  )}
                  {isVerifying ? 'Verifying...' : 'Verify Code'}
                </button>
                  )}

                {/* Resend Button (only for SMS/Email) */}
                  {(method === 'sms' || method === 'email') && onResend && !isLocked && (
                  <button
                    onClick={handleResend}
                      disabled={!canResendNow || isResending || Boolean(successMessage)}
                    className={cn(
                      'w-full rounded-xl px-4 py-3 font-medium transition-all duration-200',
                      'border border-gray-300 dark:border-gray-600',
                      'text-gray-700 dark:text-gray-300',
                      'hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500',
                      'focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:ring-offset-2 dark:focus:ring-offset-gray-900',
                      'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent dark:disabled:hover:bg-transparent',
                      'flex items-center justify-center gap-2'
                    )}
                  >
                    {isResending && (
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    )}
                      {isResending ? (
                        'Sending...'
                      ) : canResendNow ? (
                        resendCount >= maxResendAttempts ? (
                          'Maximum resends reached'
                        ) : (
                          `Resend Code (${maxResendAttempts - resendCount} left)`
                        )
                      ) : (
                        `Resend in ${resendTimer.seconds}s`
                      )}
                  </button>
                )}
                </div>
              )}

              {/* Helper Text */}
              <div className="mt-6 text-center">
                {sessionExpired ? (
                  <button
                    onClick={handleClose}
                    className="text-sm text-black dark:text-white hover:opacity-80 transition-opacity font-medium"
                  >
                    Close and Login Again
                  </button>
                ) : (
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {method === 'totp' 
                      ? 'Open your authenticator app to get the current code.'
                      : 'Didn\'t receive the code? Check your spam folder or try resending.'
                    }
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}