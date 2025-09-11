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
import RoleForm from "./form";
import Breadcrumbs from "@/components/layout/common/breadcrumb";

interface Roles {
  _id: string;
  name: string;
 
  status: "active" | "inactive" | "pending";

  createdAt: string;
  avatar?: string;
}

export default function Table({props}:any) {
  const { openDialog, closeDialog, confirm, alert, options } = useDialog();
  const fetch =(state: TableState)=>{
    return {
    data:props.results,
    totalCount:props.total,
    pageCount: Math.ceil(props.total / state.pagination["limit"])
  };
  }

  const handleUpdate = (category: any) => {
     openDialog(
       <div>
         <CustomDialog showHeader title="Update Role">
           <RoleForm data={category} id={category._id} />
         </CustomDialog>
       </div>,
       {
         size: "lg",
         showCloseButton: true,
          closeOnOverlayClick: false,
         closeOnEscape: true
       }
     );
   };
 
   const handleCreate = (category: any) => {
     openDialog(
       <div>
         <CustomDialog showHeader title="Create Role">
           <RoleForm data={category} id={undefined} />
         </CustomDialog>
       </div>,
       {
         size: "lg",
         showCloseButton: true,
           closeOnOverlayClick: false,
         closeOnEscape: true
       }
     );
   };

  const columns: ColumnDef<Roles>[] = [
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
      accessorKey: "createdAt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-3 h-8 data-[state=open]:bg-accent"
        >
          Created
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"));
        return (
          <div className="text-muted-foreground">
            {date.toLocaleDateString()}
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
                Copy  ID
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
         <Breadcrumbs heading={"All Roles"}  btn={{ event: handleCreate,show: true }}></Breadcrumbs>
   
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

