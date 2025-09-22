// components/ui/Badge.tsx
import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'destructive' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Badge({ 
  children, 
  variant = 'secondary', 
  size = 'md',
  className = '' 
}: BadgeProps) {
  const baseClasses = 'inline-flex items-center font-medium border rounded-full';
  
  const variants = {
    success: 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200',
    warning: 'bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200',
    destructive: 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200',
    secondary: 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2 py-1 text-xs',
    lg: 'px-3 py-1 text-sm'
  };

  return (
    <span className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
}