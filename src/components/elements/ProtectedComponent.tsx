// components/ProtectedComponent.tsx
"use client";
import { usePermissions } from "@/hooks/usePermissions";
import { ReactNode } from "react";

interface Props {
  permission: string | string[];
  children: ReactNode;
  mode?: "OR" | "AND";
}

export const ProtectedComponent = ({ permission, children, mode = "OR" }: Props) => {
  const { hasPermission } = usePermissions();

  if (!hasPermission(permission, { mode })) return null;

  return <>{children}</>;
};
