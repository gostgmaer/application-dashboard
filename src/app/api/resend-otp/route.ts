import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { headers } from 'next/headers';
import type { ResendOTPResponse } from '@/types/auth';
import authService from '@/lib/http/authService';

// Rate limiting for resend requests
const resendRateLimitStore = new Map<string, { count: number; resetTime: number; lastResend: number }>();
const MAX_RESENDS_PER_HOUR = 5;
const MAX_RESENDS_PER_DAY = 10;
const MIN_RESEND_INTERVAL = 60 * 1000; // 1 minute
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const DAILY_LIMIT_WINDOW = 24 * 60 * 60 * 1000; // 24 hours

function getResendRateLimitKey(userId: string, method: string): string {
  return `resend_otp:${userId}:${method}`;
}

function checkResendRateLimit(key: string): { 
  allowed: boolean; 
  remaining: number; 
  resetTime: number; 
  nextResendAt?: number;
  error?: string;
} {
  const now = Date.now();
  const record = resendRateLimitStore.get(key);
  
  if (!record) {
    // First resend request
    const newRecord = { 
      count: 1, 
      resetTime: now + RATE_LIMIT_WINDOW,
      lastResend: now 
    };
    resendRateLimitStore.set(key, newRecord);
    return { 
      allowed: true, 
      remaining: MAX_RESENDS_PER_HOUR - 1, 
      resetTime: newRecord.resetTime 
    };
  }
  
  // Check if enough time has passed since last resend
  const timeSinceLastResend = now - record.lastResend;
  if (timeSinceLastResend < MIN_RESEND_INTERVAL) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime,
      nextResendAt: record.lastResend + MIN_RESEND_INTERVAL,
      error: 'Please wait before requesting another code'
    };
  }
  
  // Reset hourly counter if window has passed
  if (now > record.resetTime) {
    const newRecord = { 
      count: 1, 
      resetTime: now + RATE_LIMIT_WINDOW,
      lastResend: now 
    };
    resendRateLimitStore.set(key, newRecord);
    return { 
      allowed: true, 
      remaining: MAX_RESENDS_PER_HOUR - 1, 
      resetTime: newRecord.resetTime 
    };
  }
  
  // Check hourly limit
  if (record.count >= MAX_RESENDS_PER_HOUR) {
    return { 
      allowed: false, 
      remaining: 0, 
      resetTime: record.resetTime,
      error: 'Hourly resend limit exceeded'
    };
  }
  
  // Update record
  record.count++;
  record.lastResend = now;
  resendRateLimitStore.set(key, record);
  
  return { 
    allowed: true, 
    remaining: MAX_RESENDS_PER_HOUR - record.count, 
    resetTime: record.resetTime 
  };
}

function validateResendMethod(method: string): { valid: boolean; error?: string } {
  if (!method) {
    return { valid: false, error: 'Resend method is required' };
  }
  
  if (!['sms', 'email'].includes(method)) {
    return { valid: false, error: 'Invalid resend method. Must be "sms" or "email"' };
  }
  
  return { valid: true };
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for logging
    const headersList = await headers();
    const forwarded = headersList.get('x-forwarded-for');
    const clientIP = forwarded ? forwarded.split(',')[0].trim() : 
                     headersList.get('x-real-ip') || 
                     'unknown';

    const session = await getServerSession();
    
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
    const body = await request.json();
    const { method } = body; // 'sms' or 'email'

    // Validate method
    const validation = validateResendMethod(method);
    if (!validation.valid) {
      return NextResponse.json(
        { 
          success: false, 
          message: validation.error,
          error_code: 'INVALID_METHOD'
        },
        { status: 400 }
      );
    }

    // Check rate limiting
    const rateLimitKey = getResendRateLimitKey(userId, method);
    const rateLimit = checkResendRateLimit(rateLimitKey);
    
    if (!rateLimit.allowed) {
      const waitTime = rateLimit.nextResendAt ? 
        Math.ceil((rateLimit.nextResendAt - Date.now()) / 1000) : 
        Math.ceil((rateLimit.resetTime - Date.now()) / 1000);
        
      return NextResponse.json(
        { 
          success: false, 
          message: rateLimit.error || 'Rate limit exceeded',
          error_code: 'RATE_LIMITED',
          rate_limit: {
            remaining: rateLimit.remaining,
            reset_time: rateLimit.resetTime
          },
          next_resend_at: rateLimit.nextResendAt ? new Date(rateLimit.nextResendAt).toISOString() : undefined,
          wait_seconds: waitTime
        },
        { status: 429 }
      );
    }

    try {
      // Replace with your actual backend resend OTP endpoint

       const response = await authService.resendOTP({
          user_id: userId,
          method: method.toLowerCase(),
          timestamp: new Date().toISOString(),
        },session.accessToken)

    //   const response = await fetch(`${process.env.BACKEND_URL}/auth/resend-otp`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Authorization': `Bearer ${(session as any).accessToken}`,
    //       'X-Client-IP': clientIP,
    //       'X-Request-ID': crypto.randomUUID(),
    //     },
    //     body: JSON.stringify({
    //       user_id: userId,
    //       method: method.toLowerCase(),
    //       timestamp: new Date().toISOString(),
    //     }),
    //   });

      const data: ResendOTPResponse = response.data

      if (!response.success) {
        // Map backend error codes to client-friendly messages
        let errorMessage = response.message || 'Failed to resend OTP';
        let errorCode = response.error || 'UNKNOWN_ERROR';
        
        switch (response.error) {
          case 'RATE_LIMITED':
            errorMessage = 'Too many resend requests. Please wait before trying again.';
            break;
          case 'MAX_DAILY_LIMIT':
            errorMessage = 'Daily resend limit reached. Please try again tomorrow.';
            break;
          case 'SESSION_EXPIRED':
            errorMessage = 'Your session has expired. Please log in again.';
            break;
          case 'INVALID_METHOD':
            errorMessage = 'Invalid delivery method selected.';
            break;
        }
        
        return NextResponse.json(
          { 
            success: false, 
            message: errorMessage,
            error_code: errorCode,
            rate_limit: data.rate_limit,
            next_resend_at: data.next_resend_at
          },
          { status: response.success ? 200 : 400  }
        );
      }

      return NextResponse.json(
        {
          success: true,
          message: `OTP sent successfully via ${method}`,
          rate_limit: {
            remaining: rateLimit.remaining,
            reset_time: rateLimit.resetTime
          }
        }
      );

    } catch (fetchError) {
      console.error('Backend request failed:', fetchError);
      
      return NextResponse.json(
        { 
          success: false, 
          message: 'Unable to send OTP. Please check your connection and try again.',
          error_code: 'NETWORK_ERROR'
        },
        { status: 503 } // Service Unavailable
      );
    }

  } catch (error) {
    console.error('Resend OTP error:', error);
    
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
      max_resends_per_hour: MAX_RESENDS_PER_HOUR,
      max_resends_per_day: MAX_RESENDS_PER_DAY,
      min_resend_interval_seconds: MIN_RESEND_INTERVAL / 1000
    }
  });
}