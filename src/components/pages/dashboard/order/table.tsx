"use client";
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
import { TableState } from "@/types/table";
import { useDialog } from "@/hooks/use-dialog";
import Link from "next/link";
import Breadcrumbs from "@/components/layout/common/breadcrumb";
// import { BrandForm } from "./form";

interface order {
  _id: string;
  order_id: string;
  status: string;
  descriptions: string;
  image?: string;
  createdAt: Date;
  first_name: string;
  totalPrice: number;
  last_name: string;
  payment_status: string;
  payment_method: string;

  customer: object;
  user: object;
}

export default function Table({ props }: any) {
  const { openDialog, closeDialog, confirm, alert, options } = useDialog();

  const fetch = (state: TableState) => {
    // console.log(state);

    return {
      data: props.results || [],
      totalCount: props.total || 0,
      pageCount: Math.ceil(props.total / state.pagination["limit"]),
    };
  };

  const columns: ColumnDef<order>[] = [
    {
      accessorKey: "order_id",
      header: ({ column }) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-3 h-8 data-[state=open]:bg-accent"
          >
            Order ID
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
          <ColumnFilter column={column} title="order_id" />
        </div>
      ),
      cell: ({ row }) => {
        const order = row.original;

        return (
          <div className="flex items-center space-x-3">
             <Link href={`/dashboard/ecommerce/orders/${order._id}?order_id=${order.order_id}`}>
               
               {order.order_id}
                </Link>
          </div>
        );
      },
    },

    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-3 h-8 data-[state=open]:bg-accent"
          >
            Order Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
          <ColumnFilter column={column} title="Order Date" />
        </div>
      ),
      cell: ({ row }) => {
        const createdAt = row.getValue("createdAt") as string;

        return (
          <div className="flex items-center space-x-3">
            <div>
              <div className="font-medium">{createdAt}</div>
            </div>
          </div>
        );
      },
    },
  {
      accessorKey: "payment_status",
      header: ({ column }) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-3 h-8 data-[state=open]:bg-accent"
          >
            Payment Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
          <ColumnFilter column={column} title="Payment Status" />
        </div>
      ),
      cell: ({ row }) => {
        const payment_status = row.getValue("payment_status") as string;

        return (
          <div className="flex items-center space-x-3">
            <div>
              <div className={`font-medium capitalize status-${payment_status}`}>{payment_status}</div>
            </div>
          </div>
        );
      },
    },
{
      accessorKey: "payment_method",
      header: ({ column }) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-3 h-8 data-[state=open]:bg-accent"
          >
            Payment Method
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
          <ColumnFilter column={column} title="Payment Method" />
        </div>
      ),
      cell: ({ row }) => {
        const payment_method = row.getValue("payment_method") as string;

        return (
          <div className="flex items-center space-x-3">
            <div>
              <div className="font-medium">{payment_method}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "totalPrice",
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
          <ColumnFilter column={column} title="Price" />
        </div>
      ),
      cell: ({ row }) => {
        const totalPrice = row.getValue("totalPrice") as Number;
console.log(totalPrice);

        return (
          <div className="flex items-center space-x-3">
            <div>
              <div className="font-medium">{totalPrice.toFixed(2)}</div>
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
         <div className="flex items-center space-x-3">
           <div className={`font-medium capitalize status-${status}`}>{status}</div>
          </div>
        );
      },
    },

    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const order = row.original;
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
                onClick={() => navigator.clipboard.writeText(order._id)}
              >
                Copy ID
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href={`/dashboard/ecommerce/orders/${order._id}`}>
               
                  View
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
      <Breadcrumbs btn={{ show: false }}></Breadcrumbs>

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
