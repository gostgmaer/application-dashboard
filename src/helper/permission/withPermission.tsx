
// components/withPermission.tsx - Simplified HOC
import React, { ComponentType, useEffect, useState } from 'react';
import { permissionService } from './permissionService';

interface WithPermissionOptions {
  resource: string;
  action: string;
  fallbackComponent?: ComponentType;
  loadingComponent?: ComponentType;
}

export function withPermission<P extends object>(
  WrappedComponent: ComponentType<P>,
  options: WithPermissionOptions
) {
  const { resource, action, fallbackComponent: FallbackComponent, loadingComponent: LoadingComponent } = options;

  const WithPermissionComponent = (props: P) => {
    const [hasAccess, setHasAccess] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const checkPermission = async () => {
        try {
          await permissionService.fetchPermissions();
          setHasAccess(permissionService.hasPermission(resource, action));
        } catch (error) {
          console.error('Permission check failed:', error);
          setHasAccess(false);
        } finally {
          setIsLoading(false);
        }
      };

      checkPermission();
    }, []);

    if (isLoading) {
      return LoadingComponent ? <LoadingComponent /> : <div>Loading...</div>;
    }

    if (!hasAccess) {
      return FallbackComponent ? <FallbackComponent /> : <div>Access Denied</div>;
    }

    return <WrappedComponent {...props} />;
  };

  WithPermissionComponent.displayName = `withPermission(${WrappedComponent.displayName || WrappedComponent.name})`;
  return WithPermissionComponent;
}
