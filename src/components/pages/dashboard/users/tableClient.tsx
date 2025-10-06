"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoveHorizontal as MoreHorizontal, Mail, Copy, Pencil, Trash2 } from "lucide-react";
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
    id: "status",
    label: "Status",
    type: "select",
    options: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
      { label: "Pending", value: "pending" },
      { label: "Banned", value: "banned" },
      { label: "Deleted", value: "deleted" },
      { label: "Archived", value: "archived" },
      { label: "Draft", value: "draft" },
    ],
  },
  {
    id: "role",
    label: "Role",
    type: "select",
    options: [
      { label: "Admin", value: "68cad41d910cd01177761561" },
      { label: "Customer", value: "68c6d03c29eec30453bd0f54" },
      { label: "Super Admin", value: "68c6af5c9258bead9173e84b" },
    ],
  },
  {
    id: "email",
    label: "Email",
    type: "input",
    placeholder: "Filter by email...",
  },
];

export function DataTableExample() {
  const { data: session } = useSession();
  const { showConfirm, showAlert, showCustom } = useModal();
  const handleDeleteRow = (rows: User[]) => {
    // console.log("Deleting users:", rows);
    alert(`Deleting ${rows.length} user(s)`);
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

  const handleExport = (rows: User[]) => {
    console.log("Exporting users:", rows);
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "fullName",
      header: "Name",
      cell: ({ row }) => (
        //  <div className="font-medium">{user.fullName}</div>
        <div className="font-medium">
          <Link href={`/dashboard/users/${row.original["id"]}`}>
            {row.getValue("fullName")}
          </Link>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span>{row.getValue("email")}</span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge
            variant={
              status === "active"
                ? "default"
                : status === "inactive"
                ? "secondary"
                : "outline"
            }
          >
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "rolename",
      header: "Role",
      cell: ({ row }) => {
        const rolename = row.getValue("rolename") as string;
        return <Badge variant="outline">{rolename}</Badge>;
      },
    },
    {
      accessorKey: "lastLogin",
      header: "Last Login Time",
      cell: ({ row }) => {
        const lastLogin = row.getValue("lastLogin") as string;
        return <div>{lastLogin} Ago</div>;
      },
    },
    {
      accessorKey: "createdAt",
      header: "Joined",
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"));
        return <div>{date.toLocaleString()}</div>;
      },
    },
    {
      id: "actions",

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
                <Copy className="mr-2 h-4 w-4 text-gray-600 dark:text-gray-300" />
                Copy user ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              <DropdownMenuItem>
                <Link href={`/dashboard/users/${user["id"]}/update`} className="flex items-center">
                 <Pencil className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-500"
                onClick={() => handleDelete(user)}
              >
                  <Trash2 className="mr-2 h-4 w-4" />
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  return (
    <div className="container mx-auto py-10">
      <div className="space-y-4">
        <DataTable
          columns={columns}
          endpoint="/users"
          token={session?.accessToken}
          filters={filters}
          enableRowSelection={true}
          enableMultiRowSelection={true}
          onDelete={handleDelete}
          onExport={handleExport}
          //   pageSize={10}
          refreshInterval={3000000}
          searchPlaceholder="Search users by name, email..."
          emptyMessage="No users found."
        />
      </div>
    </div>
  );
}
