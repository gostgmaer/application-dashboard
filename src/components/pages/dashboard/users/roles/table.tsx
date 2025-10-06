"use client";
import { Suspense } from "react";
import { DataTable } from "@/components/ui/data-table/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ColumnFilter } from "@/components/ui/data-table/column-filter";
import { TableState, ServerResponse } from "@/types/table";
import { useDialog } from "@/hooks/use-dialog";
import { CustomDialog } from "@/components/layout/dialog";
import Link from "next/link";
import RoleForm from "./form";
import Breadcrumbs from "@/components/layout/common/breadcrumb";
import RolePermissionForm from "./assign";
// import authService from "@/lib/services/auth";
import roleServices from "@/lib/http/roleServices";
import { useSession } from "next-auth/react";
import { useModal } from "@/contexts/modal-context";
import { Checkbox } from "@/components/ui/checkbox";

interface Roles {
  _id: string;
  name: string;
  status: "active" | "inactive" | "pending";
  createdAt: string;
  avatar?: string;
}

export default function Table({ props }: any) {


  const { data: session } = useSession();

  const { openDialog, closeDialog, confirm, alert, options } = useDialog();
  const { showConfirm, showAlert, showCustom } = useModal();

  const fetch = async (state: TableState): Promise<ServerResponse<unknown>> => {
    return {
      data: props.roles || [],
      totalCount: props.pagination.totalItems || 0,
      pageCount: props.pagination.totalPages,
    };
  };

  const handleUpdate = (data: any) => {
    openDialog(
      <div>
        <CustomDialog showHeader title="Update Role">
          <RoleForm
            initialData={data}
            id={data._id}
            permissionData={props.permissions}
          />
        </CustomDialog>
      </div>,
      {
        size: "lg",
        showCloseButton: true,
        closeOnOverlayClick: false,
        closeOnEscape: true,
      }
    );
  };

  const deleteRequest = async (id: any) => {
    return await roleServices.remove(id, session?.accessToken);
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
        deleteRequest(data._id);
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

  const handlePermissionUI = (data: any) => {
    openDialog(
      <div>
        <CustomDialog showHeader title="Update Permissions">
          <RolePermissionForm
            initialData={data}
            id={data._id}
            permissionData={props.permissions}
          />
        </CustomDialog>
      </div>,
      {
        size: "lg",
        showCloseButton: true,
        closeOnOverlayClick: false,
        closeOnEscape: true,
      }
    );
  };

  const handleCreate = (data: any) => {
    openDialog(
      <div>
        <CustomDialog showHeader title="Create Role">
          <RoleForm
            initialData={data}
            id={undefined}
            permissionData={props.permissions}
          />
        </CustomDialog>
      </div>,
      {
        size: "lg",
        showCloseButton: true,
        closeOnOverlayClick: false,
        closeOnEscape: true,
      }
    );
  };

  const columns: ColumnDef<Roles>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-3 h-8 data-[state=open]:bg-accent"
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
          <ColumnFilter column={column} title="Name" />
        </div>
      ),
      cell: ({ row }) => {
        const role = row.original;
        return (
          <div className="flex items-center space-x-3">
            <div>
              <div className="font-medium">{role.name}</div>
            </div>
          </div>
        );
      },
    },

    {
      accessorKey: "description",
      header: ({ column }) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-3 h-8 data-[state=open]:bg-accent"
          >
            Description
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
          <ColumnFilter column={column} title="Description" />
        </div>
      ),
      cell: ({ row }) => {
        const description = row.getValue("description") as string;

        return (
          <div className="flex items-center space-x-3">
            <div>
              <div className="font-medium">{description}</div>
            </div>
          </div>
        );
      },
    },

    {
      accessorKey: "isActive",
      header: ({ column }) => (
        <div className="flex items-center space-x-2">
          {" "}
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-3 h-8 data-[state=open]:bg-accent"
          >
            Is Active?
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
          <ColumnFilter column={column} title="is Active" />
        </div>
      ),
      cell: ({ row }) => {
        const isActive = row.getValue("isActive") as boolean;

        return (
          <div className="text-muted-foreground">{isActive ? "Yes" : "No"}</div>
        );
      },
    },
    {
      accessorKey: "isDefault",
      header: ({ column }) => (
        <div className="flex items-center space-x-2">
          {" "}
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-3 h-8 data-[state=open]:bg-accent"
          >
            Is Default?
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ),
      cell: ({ row }) => {
        const isDefault = row.getValue("isDefault") as boolean;

        return (
          <div className="text-muted-foreground">
            {isDefault ? "Yes" : "No"}
          </div>
        );
      },
    },
    {
      accessorKey: "userCount",
      header: ({ column }) => (
        <div className="flex items-center space-x-2">
          {" "}
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-3 h-8 data-[state=open]:bg-accent"
          >
            User Assigned
            {/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
          </Button>
        </div>
      ),
      cell: ({ row }) => {
        const userCount = row.getValue("userCount") as number;

        return <div className="text-muted-foreground">{userCount}</div>;
      },
    },
    {
      accessorKey: "permissionsCount",
      header: ({ column }) => (
        <div className="flex items-center space-x-2">
          {" "}
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-3 h-8 data-[state=open]:bg-accent"
          >
            Total Permission?
            {/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
          </Button>
        </div>
      ),
      cell: ({ row }) => {
        const permissionsCount = row.getValue("permissionsCount") as number;

        return <div className="text-muted-foreground">{permissionsCount}</div>;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const role = row.original;

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
                onClick={() => navigator.clipboard.writeText(role._id)}
              >
                Copy ID
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleUpdate(role)}>
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlePermissionUI(role)}>
                Check Permissions
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => handleDelete(role)}>
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  return (
    <>
      <Breadcrumbs
        heading={"All Roles"}
        btn={{ event: ()=>handleCreate, show: true }}
      ></Breadcrumbs>

      <div className="rounded-md border  p-4   shadow-sm overflow-auto max-h-screen">
        <DataTable
          columns={columns}
          fetchData={fetch}
          searchPlaceholder="Search..."
          limitOptions={[10, 20, 50, 100]}
          defaultSorting={[{ id: "createdAt", desc: true }]}
          exportFileName="roles-export"
        />
      </div>
    </>
  );
}
