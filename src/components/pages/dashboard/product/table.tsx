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
import { Checkbox } from "@/components/ui/checkbox";

interface category {
  _id: string;
  title: string;
}

interface products {
  _id: string;
  title: string;
  sku: string;
  category: category;
  stock: string;
  price: string;

  retailPrice: string;
  status: "active" | "inactive" | "pending";

  createdAt: string;
  image?: string;
}

export default function Table({ props }: any) {
  const { openDialog, closeDialog, confirm, alert, options } = useDialog();
  console.log(props);

  const fetch = async (state: TableState): Promise<ServerResponse<unknown>> => {
    return {
      data: props.products || [],
      totalCount: props.pagination.totalProducts || 0,
      pageCount: props.pagination.totalPages,
    };
  };

  const columns: ColumnDef<products>[] = [
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
        const product = row.original;
        return (
          <div className="flex items-center space-x-3">
            <Link
              href={`/dashboard/ecommerce/products/${product["_id"]}/update`}
              className=" font-medium text-blue-500"
            >
              {product.title}
            </Link>
          </div>
        );
      },
    },
    {
      accessorKey: "sku",
      header: ({ column }) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-3 h-8 data-[state=open]:bg-accent"
          >
            SKU
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
          <ColumnFilter column={column} title="sku" />
        </div>
      ),
      cell: ({ row }) => {
        const sku = row.getValue("sku") as string;

        return (
          <div className="flex items-center space-x-3">
            <div>
              <div className="font-medium">{sku}</div>
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
        const product = row.original;

        return (
          <div className="flex items-center space-x-3">
            <div>
              <div className="font-medium">{product.category["title"]}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "retailPrice",
      header: ({ column }) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-3 h-8 data-[state=open]:bg-accent"
          >
            Price
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
          <ColumnFilter column={column} title="retailPrice" />
        </div>
      ),
      cell: ({ row }) => {
        const retailPrice = row.getValue("retailPrice") as string;

        return (
          <div className="flex items-center space-x-3">
            <div>
              <div className="font-medium">{retailPrice}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "basePrice",
      header: ({ column }) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-3 h-8 data-[state=open]:bg-accent"
          >
            Sale Price
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
          <ColumnFilter column={column} title="basePrice" />
        </div>
      ),
      cell: ({ row }) => {
        const basePrice = row.getValue("basePrice") as string;

        return (
          <div className="flex items-center space-x-3">
            <div>
              <div className="font-medium">{basePrice}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "inventory",
      header: ({ column }) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-3 h-8 data-[state=open]:bg-accent"
          >
            Stock
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
          <ColumnFilter column={column} title="inventory" />
        </div>
      ),
      cell: ({ row }) => {
        const inventory = row.getValue("inventory") as string;

        return (
          <div className="flex items-center space-x-3">
            <div>
              <div className="font-medium">{inventory}</div>
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
        const product = row.original;
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
                onClick={() => navigator.clipboard.writeText(product._id)}
              >
                Copy ID
              </DropdownMenuItem>

              <DropdownMenuItem>
                <Link
                  href={`/dashboard/ecommerce/products/${product["_id"]}/update`}
                >
                  Edit
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  return (
    <>
      <Breadcrumbs heading={"All Products"} btn={{ show: true }}></Breadcrumbs>

      <div className="rounded-md border  p-4 bg-gray-50  shadow-sm overflow-auto max-h-screen">
        <DataTable
          columns={columns}
          fetchData={fetch}
          searchPlaceholder="Search..."
          limitOptions={[10, 20, 50, 100]}
          defaultSorting={[{ id: "createdAt", desc: true }]}
          exportFileName="products-export"
        />
      </div>
    </>
  );
}
