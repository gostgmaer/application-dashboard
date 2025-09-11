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

interface products {
  _id: string;
  title: string;
  sku: string;
  category: string;
  stock: string;
  price: string;

  retailPrice: string;
  status: "active" | "inactive" | "pending";

  createdAt: string;
  image?: string;
}

export default function Table({ props }) {
  const { openDialog, closeDialog, confirm, alert, options } = useDialog();
  console.log(props);

  const fetch = (state: TableState) => {
    return {
      data: props.results||[],
      totalCount: props.total||0,
      pageCount: Math.ceil(props.total||0 / state.pagination["limit"]),
    };
  };

  const handleFullScreenDialog = (product: any) => {
    console.log(product);

    openDialog(
      <div>
        {" "}
        <CustomDialog
          showHeader
          title="Dashboard Analytics"
          showFooter
          footer={
            <div className="flex justify-between w-full">
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Export
                </Button>
                <Button variant="outline" size="sm">
                  Share
                </Button>
              </div>
              <Button onClick={closeDialog}>Close Dashboard</Button>
            </div>
          }
        >
          <div>{JSON.stringify(product)}</div>
        </CustomDialog>{" "}
      </div>,
      {
        size: "lg",
        showCloseButton: true,
      }
    );
  };

  const columns: ColumnDef<products>[] = [
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
            <div>
              <div className="font-medium">{product.title}</div>
            </div>
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
      accessorKey: "price",
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
          <ColumnFilter column={column} title="price" />
        </div>
      ),
      cell: ({ row }) => {
        const price = row.getValue("price") as string;

        return (
          <div className="flex items-center space-x-3">
            <div>
              <div className="font-medium">{price}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "stock",
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
          <ColumnFilter column={column} title="stock" />
        </div>
      ),
      cell: ({ row }) => {
        const stock = row.getValue("stock") as string;

        return (
          <div className="flex items-center space-x-3">
            <div>
              <div className="font-medium">{stock}</div>
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
              <DropdownMenuItem onClick={() => handleFullScreenDialog(product)}>
                View
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href={`/dashboard/products/${product["_id"]}/update`}>
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
    <DataTable
      columns={columns}
      fetchData={fetch}
      searchPlaceholder="Search..."
      limitOptions={[10, 20, 50, 100]}
      defaultSorting={[{ id: "createdAt", desc: true }]}
      exportFileName="products-export"
    />
  );
}
