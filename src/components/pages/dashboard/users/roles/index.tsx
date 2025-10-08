"use client";

import { useState } from "react";
import { Package, Shield } from "lucide-react";
import { Role } from "@/lib/mock-data";
import {
  RoleTableSkeleton,
  StatCardsSkeleton,
} from "@/components/pages/dashboard/users/roles/roles/loading-skeleton";
import { StatCards } from "@/components/pages/dashboard/users/roles/roles/stat-cards";
import { RoleTable } from "@/components/pages/dashboard/users/roles/roles/role-table";
import { useApiSWR } from "@/hooks/useApiSWR";
import { useSession } from "next-auth/react";
import Breadcrumbs from "@/components/layout/common/breadcrumb";
import { useModal } from "@/contexts/modal-context";
import RoleForm from "./form";

export default function RolesPage({ props }: any) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { data: session } = useSession();
  const { showCustom } = useModal();

  const { data, error, isLoading } = useApiSWR(
    "/roles",
    props.token,
    undefined,
    undefined,
    undefined
  );

  const handleViewRole = (roleId: string) => {
    setSelectedRoleId(roleId);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setTimeout(() => setSelectedRoleId(null), 300);
  };

  const handleCreate: any = async () => {
    showCustom({
      title: `Create New Role`,
      content: <RoleForm permissionData={props?.permissions} />,
    });
  };

  const totalUsers = props?.stats?.summary?.totalUsersAssigned;
  const totalPermissions = props?.stats?.summary?.activePermissions;
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="relative">
            <Package className="h-16 w-16 mx-auto mb-6 animate-spin text-primary" />
            <div className="absolute inset-0 h-16 w-16 mx-auto animate-ping">
              <Package className="h-16 w-16 text-primary/20" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-3 text-gradient">
            Loading Dashboard
          </h2>
          <p className="text-muted-foreground text-lg">
            Preparing your analytics and insights...
          </p>
          <div className="mt-6 flex justify-center">
            <div className="flex space-x-1">
              <div
                className="w-2 h-2 bg-primary rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              ></div>
              <div
                className="w-2 h-2 bg-primary rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></div>
              <div
                className="w-2 h-2 bg-primary rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <>
      <Breadcrumbs
        heading="Role Dashboard"
        desc="Manage user roles, permissions, and access control across your organization"
        btn={{ event: handleCreate, show: true }}
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
        <div className="mx-auto py-8 px-4 md:px-6">
          <div className="space-y-6">
            {isLoading ? (
              <>
                <StatCardsSkeleton />
                <RoleTableSkeleton />
              </>
            ) : (
              <>
                <StatCards
                  totalRoles={props?.stats?.summary?.totalRoles}
                  totalUsers={totalUsers}
                  totalPermissions={totalPermissions}
                />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                      All Roles
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {props?.stats?.summary?.totalRoles}{" "}
                      {props?.stats?.summary?.totalRoles === 1
                        ? "role"
                        : "roles"}{" "}
                      total
                    </p>
                  </div>

                  <RoleTable
                    permissions={props?.permissions}
                    roles={data}
                    onViewRole={handleViewRole}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
