"use client";

import {
  Users,
  Lock,
  MoveVertical as MoreVertical,
  Eye,
  CreditCard as Edit,
  Settings,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import { Role } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import roleServices from "@/lib/http/roleServices";
import { useSession } from "next-auth/react";
import { useModal } from "@/contexts/modal-context";
import RoleForm from "../form";

interface RoleTableProps {
  roles: Role[];
  permissions: [];
  onViewRole: (roleId: string) => void;
}

export function RoleTable({ roles, onViewRole, permissions }: RoleTableProps) {
  const { showConfirm, showAlert, showCustom } = useModal();
  const { data: session } = useSession();

  const handleUpdate: any = async (role: any) => {
    showCustom({
      title: `Edit Role: ${role.name}`,
      content: <RoleForm permissionData={permissions} id={role._id} />,
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {roles.map((role) => (
        <Card
          key={role._id}
          className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:shadow-lg dark:hover:shadow-gray-800 transition-all cursor-pointer group"
          onClick={() => handleUpdate(role)}
        >
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 truncate capitalize group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {role.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                  {role.description}
                </p>
              </div>

              {/* <DropdownMenu>
                <DropdownMenuTrigger
                  asChild
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 -mt-1 -mr-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-48 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800"
                >
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewRole(role._id);
                    }}
                    className="dark:text-gray-200 dark:hover:bg-gray-800"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => e.stopPropagation()}
                    className="dark:text-gray-200 dark:hover:bg-gray-800"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Role
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => e.stopPropagation()}
                    className="dark:text-gray-200 dark:hover:bg-gray-800"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Manage Permissions
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu> */}
            </div>

            {/* Stats Section */}
            <div className="flex items-center gap-4 pt-2 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Users
                  </p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {role.userCount}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-2 bg-green-50 dark:bg-green-950 rounded-lg">
                  <Lock className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Permissions
                  </p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {role.permissionsCount}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
              <Badge
                variant={role.isActive ? "default" : "secondary"}
                className={
                  role.isActive
                    ? "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-300"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300"
                }
              >
                {role.isActive ? "Active" : "Inactive"}
              </Badge>

              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <Clock className="w-3 h-3" />
                <span>
                  {format(
                    new Date(role.updatedAt || new Date()),
                    "MMM d, yyyy"
                  )}
                </span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
