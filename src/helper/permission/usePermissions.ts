
// hooks/usePermissions.ts - Simplified for your needs
import { useState, useEffect, useCallback } from 'react';
// import { permissionService } from '@/lib/permissionService';
import { Permission } from '@/types/permissions';
import { permissionService } from './permissionService';

export function usePermissions() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPermissions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const perms = await permissionService.fetchPermissions();
      setPermissions(perms);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load permissions');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPermissions();
  }, [loadPermissions]);

  const hasPermission = useCallback((resource: string, action: string) => {
    return permissionService.hasPermission(resource, action);
  }, []);

  const hasAnyPermission = useCallback((requiredPermissions: string[]) => {
    return permissionService.hasAnyPermission(requiredPermissions);
  }, []);

  const getResourcePermissions = useCallback((resource: string) => {
    return permissionService.getResourcePermissions(resource);
  }, []);

  return {
    permissions,
    isLoading,
    error,
    hasPermission,
    hasAnyPermission,
    getResourcePermissions,
    refreshPermissions: loadPermissions,
  };
}

// Hook for checking a specific permission
export function usePermission(resource: string, action: string) {
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkPermission = async () => {
      try {
        await permissionService.fetchPermissions();
        setHasAccess(permissionService.hasPermission(resource, action));
      } catch (error) {
        console.error('Error checking permission:', error);
        setHasAccess(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkPermission();
  }, [resource, action]);

  return { hasPermission: hasAccess, isLoading };
}
