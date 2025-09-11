'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { verifyEmailStart, verifyEmailSuccess, verifyEmailFailure } from '@/store/slices/authSlice';
import { useSearchParams } from "next/navigation";
interface EmailVerificationProps {
  token?: string;
}

export function EmailVerification() {
    const searchParams = useSearchParams();
  const token = searchParams.get("token") || undefined;
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        setError('Verification token is missing');
        dispatch(verifyEmailFailure('Verification token is missing'));
        return;
      }

      dispatch(verifyEmailStart());

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // For demo purposes, let's say the verification is successful
        dispatch(verifyEmailSuccess());
        setStatus('success');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to verify email';
        dispatch(verifyEmailFailure(errorMessage));
        setStatus('error');
        setError(errorMessage);
      }
    };

    verifyEmail();
  }, [token, dispatch]);

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center py-10 space-y-4">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <h1 className="text-2xl font-bold">Verifying your email...</h1>
        <p className="text-muted-foreground">Please wait while we confirm your email address.</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center py-10 space-y-6">
        <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/30">
          <XCircle className="h-10 w-10 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold">Email Verification Failed</h1>
        
        {error && (
          <Alert variant="destructive" className="max-w-md">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <p className="text-muted-foreground max-w-md text-center">
          We couldn&apos;t verify your email address. The link might be expired or invalid.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={() => router.push('/register')}>
            Try Registering Again
          </Button>
          <Button variant="outline" onClick={() => router.push('/login')}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-10 space-y-6">
      <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
        <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
      </div>
      <h1 className="text-2xl font-bold">Email Verified Successfully!</h1>
      <p className="text-muted-foreground max-w-md text-center">
        Your email address has been verified. You can now login to your account and enjoy all features.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={() => router.push('/login')}>
          Go to Login
        </Button>
        <Button variant="outline" onClick={() => router.push('/')}>
          Back to Home
        </Button>
      </div>
    </div>
  );
}