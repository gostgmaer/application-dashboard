"use client";
import { Suspense } from "react";
import { DataTable } from "@/components/elements/data-table/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCommonModal } from "@/components/layout/common/commonModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ColumnFilter } from "@/components/elements/data-table/column-filter";
import { TableState, ServerResponse } from "@/types/table";
import { useDialog } from "@/hooks/use-dialog";
import { CustomDialog } from "@/components/layout/dialog";
import Breadcrumbs from "@/components/layout/common/breadcrumb";
import PermissionForm from "./form";
import permissionServices from "@/lib/http/permissionServices";
import { useSession } from "next-auth/react";
import { toast } from "@/hooks/useToast";
import { useModal } from "@/contexts/modal-context";
import { Checkbox } from "@/components/ui/checkbox";

interface permission {
  _id: string;
  name: string;
  category: string;
  action: string;
  isDefault: string;
  isActive: string;
  description: string;
}

export default function Table({ props }: any) {

  console.log(props);
  
  // const { openDialog, closeDialog, confirm,monfirmModal, alert, options } = useDialog();
  const { showConfirm, showAlert, showCustom } = useModal();
  const { data: session } = useSession();
  const fetch = async (state: TableState): Promise<ServerResponse<unknown>> => {
    return {
      data: props.data || [],
      totalCount: props.pagination.total || 0,
      pageCount: props.pagination.pages,
    };
  };

  const handleUpdate = (data: any) => {
    showCustom({
      title: `Edit Permission: ${data.name}`,
      content: <PermissionForm p={data} id={data._id} />,
      footer: (
        <>
          <Button variant="outline">Cancel</Button>
          <Button>Save Changes</Button>
        </>
      ),
    });
  };

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

  const handleDeleteNew = async (data: any) => {
    // const confirmed = await confirm({
    //   title: "Delete Item",
    //   description: "This action cannot be undone. Are you sure?",
    //   confirmText: "Delete",
    //   cancelText: "Cancel",
    //   variant: "destructive",
    // });
    // if (confirmed) {
    //   try {
    //     // Your API call
    //     const res = await permissionServices.delete(
    //       data._id,
    //       session?.accessToken
    //     );
    //     if (res.status!="OK") throw new Error("Failed to delete");
    //      toast({
    //       title: "Deleted",
    //       description: "The item has been deleted successfully."
    //     });
    //   } catch (err: any) {
    //      toast({
    //       title: "Error",
    //       description: err.message,
    //       variant:'destructive'
    //     });
    //   }
    // }
  };

  const handleCreate = (data: any) => {
    showCustom({
      title: `Create New Permission`,
      content: <PermissionForm p={data} id={undefined} />,
      footer: (
        <>
          <Button variant="outline">Cancel</Button>
          <Button>Save Changes</Button>
        </>
      ),
    });
  };

  const columns: ColumnDef<permission>[] = [
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
        const p = row.original;
        return (
          <div className="flex items-center space-x-3">
            <div>
              <div className="font-medium">{p.description}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "category",
      header: ({ column }) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-3 h-8 data-[state=open]:bg-accent"
          >
            Category
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
          <ColumnFilter column={column} title="category" />
        </div>
      ),
      cell: ({ row }) => {
        const p = row.original;
        return (
          <div className="flex items-center space-x-3">
            <div>
              <div className="font-medium">{p.category}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "action",
      header: ({ column }) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-3 h-8 data-[state=open]:bg-accent"
          >
            Permission Action
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
          <ColumnFilter column={column} title="Action" />
        </div>
      ),
      cell: ({ row }) => {
        const p = row.original;
        return (
          <div className="flex items-center space-x-3">
            <div className="font-medium capitalize">{p.action}</div>
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
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const permission = row.original;

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
                onClick={() => navigator.clipboard.writeText(permission._id)}
              >
                Copy ID
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleUpdate(permission)}>
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(permission)}>
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
        heading={"All Permissions"}
        btn={{ event: handleCreate, show: true }}
      ></Breadcrumbs>

      <div className="rounded-md border  p-4   shadow-sm overflow-auto max-h-screen">
        <DataTable
          columns={columns}
          fetchData={fetch}
          searchPlaceholder="Search..."
          limitOptions={[10, 20, 50, 100]}
          defaultSorting={[{ id: "createdAt", desc: true }]}
          exportFileName="permissions-export"
        />
      </div>
    </>
  );
}
