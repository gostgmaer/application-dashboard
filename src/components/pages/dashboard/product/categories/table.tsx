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
import Breadcrumbs from "@/components/layout/common/breadcrumb";
import { CategoryCreate } from "./form";
import { Checkbox } from "@/components/ui/checkbox";

interface categorys {
  _id: string;
  title: string;

  status: "active" | "inactive" | "pending";

  total: string;
  image?: string;
}

export default function Table({ props }:any) {
  const { openDialog, closeDialog, confirm, alert, options } = useDialog();
    const fetch = async (state: TableState): Promise<ServerResponse<unknown>> => {
    return {
      data: props.data || [],
      totalCount: props.total || 0,
      pageCount: props.totalPages,
    };
  };


  const handleUpdate = (category: any) => {
    openDialog(
      <div>
        <CustomDialog showHeader title="Update Category">
          <CategoryCreate data={category} id={category._id} />
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
        <CustomDialog showHeader title="Create Category">
          <CategoryCreate data={category} id={undefined} />
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
  const columns: ColumnDef<categorys>[] = [
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
      accessorKey: "title",
      header: ({ column }) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-3 h-8 data-[state=open]:bg-accent"
          >
            Title
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
          <ColumnFilter column={column} title="Title" />
        </div>
      ),
      cell: ({ row }) => {
        const category = row.original;
        console.log(category?.title);

        return (
          <div className="flex items-center space-x-3">
            <div>
              <div className="font-medium">{category?.title}</div>
            </div>
          </div>
        );
      },
    },
     {
      accessorKey: "slug",
      header: ({ column }) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-3 h-8 data-[state=open]:bg-accent"
          >
            Slag
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
          <ColumnFilter column={column} title="Slug" />
        </div>
      ),
      cell: ({ row }) => {
        const slug = row.getValue("slug") as string;

        return (
          <div className="flex items-center space-x-3">
             <div className="font-medium">{slug}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "productCount",
      header: ({ column }) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-3 h-8 data-[state=open]:bg-accent"
          >
            Total Items
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
          <ColumnFilter column={column} title="Items" />
        </div>
      ),
      cell: ({ row }) => {
        const productCount = row.getValue("productCount") as string;

        return (
          <div className="flex items-center space-x-3">
            <div>
              <div className="font-medium">{productCount}</div>
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
          <ColumnFilter column={column} title="description" />
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
          <ColumnFilter column={column} title="status" />
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
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const category = row.original;
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
                onClick={() => navigator.clipboard.writeText(category._id)}
              >
                Copy ID
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleUpdate(category)}
              >
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
      <Breadcrumbs btn={{show:true, event: handleCreate }} ></Breadcrumbs>

      <div className="rounded-md border  p-4 bg-gray-50  shadow-sm overflow-auto max-h-screen">
        <DataTable
          columns={columns}
          fetchData={fetch}
          searchPlaceholder="Search..."
          limitOptions={[10, 20, 50, 100]}
          defaultSorting={[{ id: "createdAt", desc: true }]}
          exportFileName="categories-export"
        />
      </div>
    </>
  );
}
