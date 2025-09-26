'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CircleAlert as AlertCircle, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils/utils';

const errorMessages: Record<string, string> = {
  Configuration: 'There is a problem with the server configuration.',
  AccessDenied: 'You do not have permission to sign in.',
  Verification: 'The verification token is invalid or has expired.',
  Default: 'An error occurred during authentication.',
  Signin: 'Try signing in with a different account.',
  OAuthSignin: 'Try signing in with a different account.',
  OAuthCallback: 'Try signing in with a different account.',
  OAuthCreateAccount: 'Try signing in with a different account.',
  EmailCreateAccount: 'Try signing in with a different account.',
  Callback: 'Try signing in with a different account.',
  OAuthAccountNotLinked: 'To confirm your identity, sign in with the same account you used originally.',
  EmailSignin: 'Check your email for the sign in link.',
  CredentialsSignin: 'Sign in failed. Check the details you provided are correct.',
  SessionRequired: 'Please sign in to access this page.',
};

export default function AuthErrorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams?.get('error') || 'Default';
  
  const errorMessage = errorMessages[error] || errorMessages.Default;

  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-800 text-center">
          {/* Error Icon */}
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-500 dark:text-red-400" />
          </div>

          {/* Error Message */}
          <h1 className="text-2xl font-bold text-black dark:text-white mb-4">
            Authentication Error
          </h1>
          
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            {errorMessage}
          </p>

          {/* Error Code */}
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl mb-8">
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Error Code: <span className="font-mono">{error}</span>
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() => router.push('/login')}
              className={cn(
                'w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl font-medium transition-all duration-200',
                'bg-black dark:bg-white text-white dark:text-black',
                'hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:ring-offset-2 dark:focus:ring-offset-gray-900'
              )}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </button>
            
            <button
              onClick={() => router.push('/')}
              className={cn(
                'w-full py-3 px-4 rounded-xl font-medium transition-all duration-200',
                'border border-gray-300 dark:border-gray-600',
                'text-gray-700 dark:text-gray-300',
                'hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500',
                'focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:ring-offset-2 dark:focus:ring-offset-gray-900'
              )}
            >
              Go to Home
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
            <p className="text-xs text-gray-500 dark:text-gray-500">
              If this error persists, please contact support for assistance.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}