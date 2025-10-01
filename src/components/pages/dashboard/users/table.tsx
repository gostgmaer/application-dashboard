"use client";
import { Suspense } from "react";
import { DataTable } from "@/components/elements/data-table/data-table";
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
import { ColumnFilter } from "@/components/elements/data-table/column-filter";
import { TableState, ServerResponse } from "@/types/table";
import { useDialog } from "@/hooks/use-dialog";
import { CustomDialog } from "@/components/layout/dialog";
import Link from "next/link";
import Breadcrumbs from "@/components/layout/common/breadcrumb";
import { useModal } from "@/contexts/modal-context";
import userServices from "@/lib/http/userService";
import { useSession } from "next-auth/react";
import { Checkbox } from "@/components/ui/checkbox";

interface User {
  id: string;
  fullName: string;
  email: string;
  status: "active" | "inactive" | "pending";
  role: string;
  lastLogin: string;
  avatar?: string;
}

export default function UsersTable({ props }: any) {
  console.log(props);

  const { showConfirm, showAlert, showCustom } = useModal();
  const { data: session } = useSession();

  const fetch = async (state: TableState): Promise<ServerResponse<unknown>> => {
    return {
      data: props.users || [],
      totalCount: props.pagination.totalUsers || 0,
      pageCount: props.pagination.totalPages,
    };
  };

  const deleteRequest = async (id: any) => {
    return await userServices.remove(id, session?.accessToken);
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

  const columns: ColumnDef<User>[] = [
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
      accessorKey: "fullName",
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
          <ColumnFilter column={column} title="fullName" />
        </div>
      ),
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar} alt={user?.fullName} />
              <AvatarFallback>{user?.avatar}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{user.fullName}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-3 h-8 data-[state=open]:bg-accent"
          >
            Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
          <ColumnFilter column={column} title="Email" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-muted-foreground">{row.getValue("email")}</div>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-3 h-8 data-[state=open]:bg-accent"
          >
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
          <ColumnFilter column={column} title="Status" />
        </div>
      ),
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const variant =
          status === "active"
            ? "default"
            : status === "inactive"
            ? "destructive"
            : "secondary";
        return (
          <Badge variant={variant} className="capitalize">
            {status}
          </Badge>
        );
      },
    },

    {
      accessorKey: "lastLoginAttempt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-3 h-8 data-[state=open]:bg-accent"
        >
          Last login
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const lastLoginAttempt = row.getValue("lastLoginAttempt") as string;
        return <div className="text-muted-foreground">{lastLoginAttempt}</div>;
      },
    },
    {
      accessorKey: "rolename",
      header: ({ column }) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-3 h-8 data-[state=open]:bg-accent"
          >
            Role
            {/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
          </Button>
          {/* <ColumnFilter column={column} title="Role" /> */}
        </div>
      ),
      cell: ({ row }) => {
        const rolename = row.getValue("rolename") as string;
        return <div className="text-muted-foreground">{rolename}</div>;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original;

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
                onClick={() => navigator.clipboard.writeText(user.id)}
              >
                Copy ID
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href={`/dashboard/users/${user["id"]}/update`}>Edit</Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-500"
                onClick={() => handleDelete(user)}
              >
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
        heading={"User Dashboard"}
        btn={{ show: true }}
      ></Breadcrumbs>

      <div className="rounded-md border  p-4   shadow-sm overflow-auto max-h-screen">
        <DataTable
          columns={columns}
          fetchData={fetch}
          searchPlaceholder="Search..."
          limitOptions={[10, 20, 50, 100]}
          defaultSorting={[{ id: "createdAt", desc: true }]}
          exportFileName="users-export"
        />
      </div>
    </>
  );
}
