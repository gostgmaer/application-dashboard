import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { headers } from 'next/headers';
import type { OTPVerifyResponse } from '@/types/auth';
import authService from '@/helper/services/authService';
import { authOptions } from '../auth/authOptions';

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const MAX_ATTEMPTS_PER_HOUR = 10;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

// Failed attempts tracking
const failedAttemptsStore = new Map<string, { count: number; lockoutUntil?: number }>();
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

function getRateLimitKey(userId: string, ip: string): string {
    return `otp_verify:${userId}:${ip}`;
}

function getFailedAttemptsKey(userId: string): string {
    return `failed_attempts:${userId}`;
}

function checkRateLimit(key: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const record = rateLimitStore.get(key);

    if (!record || now > record.resetTime) {
        // Reset or create new record
        const newRecord = { count: 1, resetTime: now + RATE_LIMIT_WINDOW };
        rateLimitStore.set(key, newRecord);
        return { allowed: true, remaining: MAX_ATTEMPTS_PER_HOUR - 1, resetTime: newRecord.resetTime };
    }

    if (record.count >= MAX_ATTEMPTS_PER_HOUR) {
        return { allowed: false, remaining: 0, resetTime: record.resetTime };
    }

    record.count++;
    rateLimitStore.set(key, record);
    return { allowed: true, remaining: MAX_ATTEMPTS_PER_HOUR - record.count, resetTime: record.resetTime };
}

function checkFailedAttempts(userId: string): { allowed: boolean; remaining: number; lockoutUntil?: number } {
    const key = getFailedAttemptsKey(userId);
    const now = Date.now();
    const record = failedAttemptsStore.get(key);

    if (!record) {
        return { allowed: true, remaining: MAX_FAILED_ATTEMPTS };
    }

    // Check if lockout has expired
    if (record.lockoutUntil && now < record.lockoutUntil) {
        return { allowed: false, remaining: 0, lockoutUntil: record.lockoutUntil };
    }

    // Reset if lockout has expired
    if (record.lockoutUntil && now >= record.lockoutUntil) {
        failedAttemptsStore.delete(key);
        return { allowed: true, remaining: MAX_FAILED_ATTEMPTS };
    }

    return { allowed: record.count < MAX_FAILED_ATTEMPTS, remaining: MAX_FAILED_ATTEMPTS - record.count };
}

function recordFailedAttempt(userId: string): void {
    const key = getFailedAttemptsKey(userId);
    const now = Date.now();
    const record = failedAttemptsStore.get(key) || { count: 0 };

    record.count++;

    if (record.count >= MAX_FAILED_ATTEMPTS) {
        record.lockoutUntil = now + LOCKOUT_DURATION;
    }

    failedAttemptsStore.set(key, record);
}

function clearFailedAttempts(userId: string): void {
    const key = getFailedAttemptsKey(userId);
    failedAttemptsStore.delete(key);
}

function validateOTPFormat(otp: string): { valid: boolean; error?: string } {
    if (!otp) {
        return { valid: false, error: 'OTP is required' };
    }

    if (typeof otp !== 'string') {
        return { valid: false, error: 'OTP must be a string' };
    }

    if (otp.length !== 6) {
        return { valid: false, error: 'OTP must be exactly 6 digits' };
    }

    if (!/^\d{6}$/.test(otp)) {
        return { valid: false, error: 'OTP must contain only numbers' };
    }

    return { valid: true };
}

export async function POST(request: NextRequest) {
    try {
        // Get client IP for rate limiting
        const headersList = await headers();
        const forwarded = headersList.get('x-forwarded-for');
        const clientIP = forwarded ? forwarded.split(',')[0].trim() :
            headersList.get('x-real-ip') ||
            'unknown';

        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Unauthorized',
                    error_code: 'SESSION_EXPIRED'
                },
                { status: 401 }
            );
        }

        const userId = session.user.id;

        // Check rate limiting
        const rateLimitKey = getRateLimitKey(userId, clientIP);
        const rateLimit = checkRateLimit(rateLimitKey);

        if (!rateLimit.allowed) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Too many verification attempts. Please try again later.',
                    error_code: 'RATE_LIMITED',
                    rate_limit: {
                        remaining: rateLimit.remaining,
                        reset_time: rateLimit.resetTime
                    }
                },
                { status: 429 }
            );
        }

        // Check failed attempts and lockout
        const failedAttempts = checkFailedAttempts(userId);

        if (!failedAttempts.allowed) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Too many failed attempts. Account temporarily locked.',
                    error_code: 'MAX_ATTEMPTS_EXCEEDED',
                    lockout_until: failedAttempts.lockoutUntil ? new Date(failedAttempts.lockoutUntil).toISOString() : undefined
                },
                { status: 423 } // Locked
            );
        }

        const body = await request.json();
        const { otp } = body;

        // Validate OTP format
        const validation = validateOTPFormat(otp);
        if (!validation.valid) {
            recordFailedAttempt(userId);
            return NextResponse.json(
                {
                    success: false,
                    message: validation.error,
                    error_code: 'INVALID_OTP',
                    remaining_attempts: Math.max(0, failedAttempts.remaining - 1)
                },
                { status: 400 }
            );
        }

        try {
            // Replace with your actual backend OTP verification endpoint
            // const response = await fetch(`${process.env.BACKEND_URL}/auth/verify-otp`, {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'Authorization': `Bearer ${(session as any).accessToken}`,
            //         'X-Client-IP': clientIP,
            //         'X-Request-ID': crypto.randomUUID(),
            //     },
            //     body: JSON.stringify({
            //         user_id: userId,
            //         otp: otp.trim(),
            //         timestamp: new Date().toISOString(),
            //     }),
            // });

            const response = await authService.verifyOTPAndLogin({
                user_id: userId,
                otp: otp.trim(),
                timestamp: new Date().toISOString(),

                tempToken: session.user["tempToken"]
            }, session.accessToken)

            const data: OTPVerifyResponse = await response.data

            if (!response.success) {
                // Record failed attempt for client-side errors
                // if (response.error >= 400 && response.status < 500) {
                //     recordFailedAttempt(userId);
                // }

                // Map backend error codes to client-friendly messages
                let errorMessage = data.message || 'OTP verification failed';
                let errorCode = data.error_code || 'UNKNOWN_ERROR';

                switch (data.error_code) {
                    case 'INVALID_OTP':
                        errorMessage = 'Invalid verification code. Please check and try again.';
                        break;
                    case 'EXPIRED_OTP':
                        errorMessage = 'Verification code has expired. Please request a new one.';
                        break;
                    case 'MAX_ATTEMPTS_EXCEEDED':
                        errorMessage = 'Too many failed attempts. Please try again later.';
                        break;
                    case 'SESSION_EXPIRED':
                        errorMessage = 'Your session has expired. Please log in again.';
                        break;
                }

                return NextResponse.json(
                    {
                        success: false,
                        message: errorMessage,
                        error_code: errorCode,
                        remaining_attempts: data.remaining_attempts || Math.max(0, failedAttempts.remaining - 1),
                        lockout_until: data.lockout_until
                    },
                    { status: response.success ? 200 : 400 }
                );
            }

            // Success - clear failed attempts
            clearFailedAttempts(userId);

            return NextResponse.json(
                {
                    success: true,
                    message: 'OTP verified successfully',
                    tokens: data.tokens,
                }
            );

        } catch (fetchError) {
            console.error('Backend request failed:', fetchError);

            // Don't record failed attempt for network errors
            return NextResponse.json(
                {
                    success: false,
                    message: 'Unable to verify OTP. Please check your connection and try again.',
                    error_code: 'NETWORK_ERROR'
                },
                { status: 503 } // Service Unavailable
            );
        }

    } catch (error) {
        console.error('OTP verification error:', error);

        return NextResponse.json(
            {
                success: false,
                message: 'An unexpected error occurred. Please try again.',
                error_code: 'INTERNAL_ERROR'
            },
            { status: 500 }
        );
    }
}

// Health check endpoint
export async function GET() {
    return NextResponse.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        rate_limits: {
            max_attempts_per_hour: MAX_ATTEMPTS_PER_HOUR,
            max_failed_attempts: MAX_FAILED_ATTEMPTS,
            lockout_duration_minutes: LOCKOUT_DURATION / (60 * 1000)
        }
    });
}