"use client";

import { useState, useEffect } from "react";
import { Shield } from "lucide-react";
import { Role } from "@/lib/mock-data";
import {
  RoleTableSkeleton,
  StatCardsSkeleton,
} from "@/components/pages/dashboard/users/roles/roles/loading-skeleton";
import { StatCards } from "@/components/pages/dashboard/users/roles/roles/stat-cards";
import { RoleTable } from "@/components/pages/dashboard/users/roles/roles/role-table";
import { RoleDetailsDrawer } from "@/components/pages/dashboard/users/roles/roles/role-details-drawer";
import { useApiSWR } from "@/hooks/useApiSWR";

export default function RolesPage({ props }: any) {

  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);



  const { data, error, isLoading, mutate } = useApiSWR(
    "/roles",
    props.token,
    undefined,
    undefined,
    undefined
  );
// console.log(data, error, isLoading, mutate);
  console.log("Server Response:", data,isLoading);
  // console.log("Query Params:", serverQueryParams);

  const handleViewRole = (roleId: string) => {
    setSelectedRoleId(roleId);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setTimeout(() => setSelectedRoleId(null), 300);
  };

  const totalUsers = props?.stats?.summary?.totalUsersAssigned;
  const totalPermissions = props?.stats?.summary?.activePermissions;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className=" mx-auto  py-8">
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
                  <h2 className="text-xl font-semibold text-gray-900">
                    All Roles
                  </h2>
                  <p className="text-sm text-gray-500">
                    {data.length} {data.length === 1 ? "role" : "roles"} total
                  </p>
                </div>
                <RoleTable roles={data} onViewRole={handleViewRole} />
              </div>
            </>
          )}
        </div>
      </div>

      <RoleDetailsDrawer
        roleId={selectedRoleId}
        open={drawerOpen}
        onClose={handleCloseDrawer}
      />
    </div>
  );
}
