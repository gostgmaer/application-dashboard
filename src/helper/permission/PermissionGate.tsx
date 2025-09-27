
// components/PermissionGate.tsx - Utility component for conditional rendering
import React, { ReactNode } from 'react';
import { usePermissions } from './usePermissions';


interface PermissionGateProps {
  resource: string;
  action: string;
  children: ReactNode;
  fallback?: ReactNode;
  loading?: ReactNode;
}

export function PermissionGate({ 
  resource, 
  action, 
  children, 
  fallback = null,
  loading = <div>Checking permissions...</div>
}: PermissionGateProps) {
  const { hasPermission, isLoading } = usePermissions();

  if (isLoading) {
    return <>{loading}</>;
  }

  if (!hasPermission(resource, action)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// Multi-permission gate
interface MultiPermissionGateProps {
  permissions: string[]; // Array of "resource:action" strings
  requireAll?: boolean; // Default: false (require any)
  children: ReactNode;
  fallback?: ReactNode;
  loading?: ReactNode;
}

export function MultiPermissionGate({
  permissions,
  requireAll = false,
  children,
  fallback = null,
  loading = <div>Checking permissions...</div>
}: MultiPermissionGateProps) {
  const { hasAnyPermission, hasPermission, isLoading } = usePermissions();

  if (isLoading) {
    return <>{loading}</>;
  }

  const hasAccess = requireAll 
    ? permissions.every(perm => {
        const [resource, action] = perm.split(':');
        return hasPermission(resource, action);
      })
    : hasAnyPermission(permissions);

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// Permission debug component (for development)
export function PermissionDebug() {
  const { permissions, isLoading } = usePermissions();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  if (isLoading) {
    return <div>Loading permissions...</div>;
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      background: '#f0f0f0',
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '5px',
      fontSize: '12px',
      maxWidth: '300px',
      zIndex: 9999
    }}>
      <h4>Current Permissions:</h4>
      {permissions.map(perm => (
        <div key={perm.id}>
          <strong>{perm.resource}:</strong> {perm.actions.join(', ')}
        </div>
      ))}
    </div>
  );
}
