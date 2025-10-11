"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoveHorizontal as MoreHorizontal, Mail } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DataTable,
  DataTableFilter,
} from "@/components/ui/data-table/data-Table-Client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import userServices from "@/lib/http/userService";
import { useModal } from "@/contexts/modal-context";
import { permissionCategory } from "./mock";
import permissionServices from "@/lib/http/permissionServices";
import { Permission, permissionList } from "@/types/permissions";
import PermissionForm from "./form";
import Breadcrumbs from "@/components/layout/common/breadcrumb";
import { usePermissions } from "@/hooks/usePermissions";

export type User = {
  id: string;
  name: string;
  email: string;
  status: "active" | "inactive" | "pending";
  role: "admin" | "user" | "moderator";
  createdAt: string;
};

const filters: DataTableFilter[] = [
  {
    id: "category",
    label: "Category",
    type: "select",
    options: permissionCategory,
  },
];

export function PermissionDataTable() {
  const { data: session } = useSession();
  const { showConfirm, showAlert, showCustom } = useModal();
  const { hasPermission } = usePermissions();
  const deleteRequest = async (id: any) => {
    return await permissionServices.delete(id, session?.accessToken);
  };
  const handleDelete = async (data: any) => {
    const confirmed = await showConfirm({
      title: "Delete Item",
      description:
        "Are you sure you want to delete this item? This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "destructive",
      onConfirm: async () => {
        deleteRequest(data.id);
      },
    });
    if (confirmed) {
      await showAlert({
        title: "Success",
        description: "Item has been deleted successfully.",
        variant: "success",
      });
    }
  };

  const handleUpdate: any = async (p: any) => {
    showCustom({
      title: `Edit Permission: ${p.name}`,
      content: <PermissionForm p={p} id={p._id} />,
    });
  };

  function handleCreate(): void {
    showCustom({
      title: `Create New Permission`,
      content: <PermissionForm />,
    });
  }

  const handleExport = (rows: permissionList[]) => {
    console.log("Exporting users:", rows);
  };

  const columns: ColumnDef<permissionList>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "key",
      header: "Permission key",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("key")}</div>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.getValue("description")}
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: "Module",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.getValue("category")}
        </div>
      ),
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">{row.getValue("action")}</div>
      ),
    },
    {
      accessorKey: "isActive",
      header: "Is Active",
      cell: ({ row }) => (
        <div className="text-muted-foreground">
          {row.getValue("isActive") ? "Yes" : "No"}
        </div>
      ),
    },
    {
      accessorKey: "isDefault",
      header: "Is Default",
      cell: ({ row }) => (
        <div className="text-muted-foreground">
          {row.getValue("isDefault") ? "Yes" : "No"}
        </div>
      ),
    },
    {
      accessorKey: "updatedAt",
      header: "Last Updated",
      cell: ({ row }) => {
        const date = new Date(row.getValue("updatedAt"));
        return <div>{date.toLocaleString()}</div>;
      },
    },
    {
      id: "actions",

      cell: ({ row }) => {
        const p = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(p._id)}
              >
                Copy ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              {hasPermission("permission:update") && (
                <DropdownMenuItem onClick={() => handleUpdate(p)}>
                  Update
                </DropdownMenuItem>
              )}
              {hasPermission("permission:delete") && (
                <DropdownMenuItem
                  className="text-red-500"
                  onClick={() => handleDelete(p)}
                >
                  Remove
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className=" mx-auto px-2 py-4">
      <Breadcrumbs
        heading={"All Permissions"}
        btn={{
          event: handleCreate,
          show: hasPermission("permission:create") && true,
        }}
      ></Breadcrumbs>
      <div className="space-y-4">
        <DataTable
          columns={columns}
          endpoint="/permission"
          token={session?.accessToken}
          filters={filters}
          enableRowSelection={true}
          enableMultiRowSelection={true}
          onDelete={handleDelete}
          onExport={handleExport}
          //   pageSize={10}
          refreshInterval={3000000}
          searchPlaceholder="Search Permission name..."
          emptyMessage="No Permission found."
        />
      </div>
    </div>
  );
}
