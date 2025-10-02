'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils/utils';
import { TypingIndicator as TypingIndicatorType } from '@/types';

interface TypingIndicatorProps {
  user: TypingIndicatorType;
}

export default function TypingIndicator({ user }: TypingIndicatorProps) {
  return (
    <div className="flex gap-3 animate-pulse">
      <Avatar className="h-8 w-8">
        <AvatarFallback className="text-xs">
          {user.userName.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground mb-1 ml-1">
          {user.userName}
        </span>
        
        <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-2">
          <div className="flex items-center space-x-1">
            <div className="flex space-x-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce",
                    `animation-delay-${i * 200}ms`
                  )}
                  style={{
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: '1s',
                    animationIterationCount: 'infinite'
                  }}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground ml-2">typing...</span>
          </div>
        </div>
      </div>
    </div>
  );
}