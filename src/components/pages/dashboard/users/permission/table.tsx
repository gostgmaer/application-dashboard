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

import { ColumnFilter } from "@/components/elements/data-table/column-filter";
import { TableState, ServerResponse } from "@/types/table";
import { useDialog } from "@/hooks/use-dialog";
import { CustomDialog } from "@/components/layout/dialog";
import Breadcrumbs from "@/components/layout/common/breadcrumb";
import PermissionForm from "./form";

interface permission {
  _id: string;
  name: string;
  category: string;
  isDefault: string;
  isActive: string;
  description: string;
}

export default function Table({ props }: any) {
  const { openDialog, closeDialog, confirm, alert, options } = useDialog();
  const fetch = (state: TableState) => {
    return {
      data: props.results,
      totalCount: props.total,
      pageCount: Math.ceil(props.total / state.pagination["limit"]),
    };
  };

  const handleUpdate = (data: any) => {
    openDialog(
      <div>
        <CustomDialog showHeader title="Update Permission">
          <PermissionForm data={data} id={data._id} />
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
        <CustomDialog showHeader title="Create Permission">
          <PermissionForm data={data} id={undefined} />
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

  const columns: ColumnDef<permission>[] = [
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
      accessorKey: "isActive",
      header: ({ column }) => (
        <div className="flex items-center space-x-2">   <Button
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
          <div className="text-muted-foreground">
            {isActive?"Yes":"No"}
          </div>
        );
      },
    },
     {
      accessorKey: "isDefault",
      header: ({ column }) => (
        <div className="flex items-center space-x-2">   <Button
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
            {isDefault?"Yes":"No"}
          </div>
        );
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
