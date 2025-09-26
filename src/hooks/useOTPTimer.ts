"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface UseOTPTimerOptions {
  initialSeconds?: number;
  onExpire?: () => void;
  autoStart?: boolean;
}

export function useOTPTimer(options: UseOTPTimerOptions = {}) {
  const { initialSeconds = 60, onExpire, autoStart = false } = options;
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [hasExpired, setHasExpired] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const onExpireRef = useRef(onExpire);

  // Update the ref when onExpire changes
  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  const startTimer = useCallback(
    (customSeconds?: number) => {
      const duration = customSeconds ?? initialSeconds;
      setSeconds(duration);
      setSeconds(initialSeconds);
      setIsActive(true);
      setHasExpired(false);
    },
    [initialSeconds]
  );

  const resetTimer = useCallback(() => {
    setSeconds(0);
    setIsActive(false);
    setHasExpired(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const pauseTimer = useCallback(() => {
    setIsActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const resumeTimer = useCallback(() => {
    if (seconds > 0 && !hasExpired) {
      setIsActive(true);
    }
  }, [seconds, hasExpired]);

  // Auto-start timer if enabled
  useEffect(() => {
    if (autoStart) {
      startTimer();
    }
  }, [autoStart, startTimer]);

  useEffect(() => {
    if (isActive && seconds > 0) {
      intervalRef.current = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds <= 1) {
            setIsActive(false);
            setHasExpired(true);
            // Call onExpire callback if provided
            if (onExpireRef.current) {
              onExpireRef.current();
            }
            return 0;
          }
          return prevSeconds - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, seconds, onExpire]);

  const formatTime = useCallback((totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  }, []);

  return {
    seconds,
    isActive,
    hasExpired,
    canResend: !isActive && seconds === 0 && hasExpired,
    formattedTime: formatTime(seconds),
    startTimer,
    resetTimer,
    pauseTimer,
    resumeTimer,
  };
}
