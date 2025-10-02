'use client';

import { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';
import { Role, fetchRoles } from '@/lib/mock-data';
import { RoleTableSkeleton, StatCardsSkeleton } from '@/components/pages/dashboard/users/roles/roles/loading-skeleton';
import { StatCards } from '@/components/pages/dashboard/users/roles/roles/stat-cards';
import { RoleTable } from '@/components/pages/dashboard/users/roles/roles/role-table';
import { RoleDetailsDrawer } from '@/components/pages/dashboard/users/roles/roles/role-details-drawer';


export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    fetchRoles()
      .then(setRoles)
      .finally(() => setLoading(false));
  }, []);

  const handleViewRole = (roleId: string) => {
    setSelectedRoleId(roleId);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setTimeout(() => setSelectedRoleId(null), 300);
  };

  const totalUsers = roles.reduce((sum, role) => sum + role.userCount, 0);
  const totalPermissions = roles.reduce((sum, role) => sum + role.permissionCount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-8">
       
        <div className="space-y-6">
          {loading ? (
            <>
              <StatCardsSkeleton />
              <RoleTableSkeleton />
            </>
          ) : (
            <>
              <StatCards
                totalRoles={roles.length}
                totalUsers={totalUsers}
                totalPermissions={totalPermissions}
              />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">All Roles</h2>
                  <p className="text-sm text-gray-500">
                    {roles.length} {roles.length === 1 ? 'role' : 'roles'} total
                  </p>
                </div>
                <RoleTable roles={roles} onViewRole={handleViewRole} />
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
