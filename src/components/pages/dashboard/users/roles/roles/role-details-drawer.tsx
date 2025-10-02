'use client';

import { useState, useEffect } from 'react';
import { X, Users, Lock, Loader as Loader2 } from 'lucide-react';
import { RoleDetails, fetchRoleDetails } from '@/lib/mock-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';

interface RoleDetailsDrawerProps {
  roleId: string | null;
  open: boolean;
  onClose: () => void;
}

export function RoleDetailsDrawer({ roleId, open, onClose }: RoleDetailsDrawerProps) {
  const [roleDetails, setRoleDetails] = useState<RoleDetails | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (roleId && open) {
      setLoading(true);
      fetchRoleDetails(roleId)
        .then(setRoleDetails)
        .finally(() => setLoading(false));
    }
  }, [roleId, open]);

  const groupedPermissions = roleDetails?.permissions.reduce((acc, permission) => {
    if (!acc[permission.module]) {
      acc[permission.module] = [];
    }
    acc[permission.module].push(permission);
    return acc;
  }, {} as Record<string, typeof roleDetails.permissions>);

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : roleDetails ? (
          <>
            <SheetHeader className="space-y-4 pb-6 border-b">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <SheetTitle className="text-2xl font-bold text-gray-900">
                    {roleDetails.name}
                  </SheetTitle>
                  <p className="text-sm text-gray-600">{roleDetails.description}</p>
                </div>
                <Badge
                  variant={roleDetails.status === 'active' ? 'default' : 'secondary'}
                  className={
                    roleDetails.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }
                >
                  {roleDetails.status === 'active' ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </SheetHeader>

            <Tabs defaultValue="users" className="mt-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="users" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Users ({roleDetails.users.length})
                </TabsTrigger>
                <TabsTrigger value="permissions" className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Permissions ({roleDetails.permissions.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="users" className="mt-6 space-y-4">
                {roleDetails.users.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No users assigned to this role</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {roleDetails.users.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                            {user.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500 truncate">{user.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="permissions" className="mt-6 space-y-6">
                {roleDetails.permissions.length === 0 ? (
                  <div className="text-center py-12">
                    <Lock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No permissions assigned to this role</p>
                  </div>
                ) : (
                  Object.entries(groupedPermissions || {}).map(([module, permissions]) => (
                    <div key={module} className="space-y-4">
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Lock className="w-4 h-4 text-gray-400" />
                        {module}
                      </h3>
                      <div className="space-y-3 pl-6">
                        {permissions.map((permission) => (
                          <div
                            key={permission.id}
                            className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl"
                          >
                            <Checkbox
                              checked={permission.enabled}
                              disabled
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{permission.name}</p>
                              <p className="text-sm text-gray-500">{permission.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
