// hooks/usePermissions.ts
"use client";

import { useUser } from "@/contexts/UserProvider";


export const usePermissions = () => {
  const { user } = useUser();

  const hasPermission = (
    permissionKeys: string | string[],
    options: { mode?: "OR" | "AND" } = {}
  ) => {
    if (!user) return false;
    const { permissions, role } = user;

    // Super admin has all permissions
    if (role === "super_admin") return true;

    // Admin has all except settings
    if (role === "admin") {
      if (Array.isArray(permissionKeys)) {
        return !permissionKeys.some((p) => p.startsWith("settings:"));
      }
      return !permissionKeys.startsWith("settings:");
    }

    const keys = Array.isArray(permissionKeys) ? permissionKeys : [permissionKeys];

    if (options.mode === "AND") {
      return keys.every((k) => permissions.includes(k));
    }

    return keys.some((k) => permissions.includes(k));
  };

  return { hasPermission };
};
