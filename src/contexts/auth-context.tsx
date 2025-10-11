'use client';

import React, { createContext, useContext, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { AuthContextValue, Permission, Role, User } from '@/types/auth';

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  const user: User | null = session?.user || null;
  const isAuthenticated = !!session?.user;
  const isLoading = status === 'loading';

  // Permission checking utilities
  const hasPermission = useCallback((
    permission: Permission | Permission[], 
    operator: 'AND' | 'OR' = 'OR'
  ): boolean => {
    if (!user) return false;

    // Only check actual permissions from backend - no hardcoded role logic
    const userPermissions = user.permissions || [];
    const permissions = Array.isArray(permission) ? permission : [permission];

    if (operator === 'AND') {
      return permissions.every(p => userPermissions.includes(p));
    } else {
      return permissions.some(p => userPermissions.includes(p));
    }
  }, [user]);

  const hasRole = useCallback((role: Role | Role[]): boolean => {
    if (!user) return false;
    
    const roles = Array.isArray(role) ? role : [role];
    return roles.includes(user.role);
  }, [user]);

  const isSpecialRole = useCallback((role: string): boolean => {
    return user?.role === role;
  }, [user]);

  const value: AuthContextValue = {
    user,
    isAuthenticated,
    isLoading,
    hasPermission,
    hasRole,
    isSpecialRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}