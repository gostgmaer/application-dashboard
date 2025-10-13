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

import Link from "next/link";
import Breadcrumbs from "@/components/layout/common/breadcrumb";
import { BrandForm } from "./form";
import { Checkbox } from "@/components/ui/checkbox";

interface brands {
  _id: string;
  name: string;

  status: "active" | "inactive" | "pending";

  descriptions: string;
  image?: string;
}

export default function Table({ props }: any) {


  const fetch = async (state: TableState): Promise<ServerResponse<unknown>> => {
    return {
      data: props.results || [],
      totalCount: props.total || 0,
      pageCount: Math.ceil(props.total / state.pagination["pageSize"]),
    };
  };

  const handleUpdate = (data: any) => {
  //  <BrandForm data={data} id={data._id} />
  };

  const handleCreate = (data: any) => {
    //  <BrandForm data={data} id={undefined} />
  };

  const columns: ColumnDef<brands>[] = [
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
            Title
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
          <ColumnFilter column={column} title="name" />
        </div>
      ),
      cell: ({ row }) => {
        const brand = row.original;

        return (
          <div className="flex items-center space-x-3">
            <div>
              <div className="font-medium">{brand?.name}</div>
            </div>
          </div>
        );
      },
    },

    {
      accessorKey: "descriptions",
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
          <ColumnFilter column={column} title="descriptions" />
        </div>
      ),
      cell: ({ row }) => {
        const descriptions = row.getValue("descriptions") as string;

        return (
          <div className="flex items-center space-x-3">
            <div>
              <div className="font-medium">{descriptions}</div>
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
        const brand = row.original;
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
                onClick={() => navigator.clipboard.writeText(brand._id)}
              >
                Copy ID
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleUpdate(brand)}>
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
      <Breadcrumbs btn={{ event: ()=>handleCreate }}></Breadcrumbs>

      <div className="rounded-md border  p-4 bg-gray-50  shadow-sm overflow-auto max-h-screen">
        <DataTable
          columns={columns}
          fetchData={fetch}
          searchPlaceholder="Search..."
          limitOptions={[10, 20, 50, 100]}
          defaultSorting={[{ id: "createdAt", desc: true }]}
          exportFileName="brands-export"
        />
      </div>
    </>
  );
}
