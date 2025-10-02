'use client';

import { Users, Lock, MoveVertical as MoreVertical, Eye, CreditCard as Edit, Settings, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { Role } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface RoleTableProps {
  roles: Role[];
  onViewRole: (roleId: string) => void;
}

export function RoleTable({ roles, onViewRole }: RoleTableProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {roles.map((role) => (
        <Card
          key={role.id}
          className="p-6 bg-white hover:shadow-lg transition-all cursor-pointer group"
          onClick={() => onViewRole(role.id)}
        >
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                  {role.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {role.description}
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 -mt-1 -mr-2">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewRole(role.id);
                    }}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Role
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                    <Settings className="mr-2 h-4 w-4" />
                    Manage Permissions
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center gap-4 pt-2 border-t">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Users</p>
                  <p className="text-sm font-semibold text-gray-900">{role.userCount}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-2 bg-green-50 rounded-lg">
                  <Lock className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Permissions</p>
                  <p className="text-sm font-semibold text-gray-900">{role.permissionCount}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t">
              <Badge
                variant={role.status === 'active' ? 'default' : 'secondary'}
                className={
                  role.status === 'active'
                    ? 'bg-green-100 text-green-800 hover:bg-green-100'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-100'
                }
              >
                {role.status === 'active' ? 'Active' : 'Inactive'}
              </Badge>

              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                <span>{format(new Date(role.updatedAt), 'MMM d, yyyy')}</span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
