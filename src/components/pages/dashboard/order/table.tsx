"use client";
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
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  DataTable,
  DataTableFilter,
} from "@/components/ui/data-table/data-Table-Client";
import { useModal } from "@/contexts/modal-context";
import { usePermissions } from "@/hooks/usePermissions";
import orderServices from "@/lib/http/OrderServices";
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

const ORDER_STATUS_OPTIONS = [
  { label: "Pending", value: "pending" },
  { label: "Processing", value: "processing" },
  { label: "Completed", value: "completed" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Canceled", value: "canceled" },
  { label: "Returned", value: "returned" },
  { label: "Failed", value: "failed" },
  { label: "Refunded", value: "refunded" },

  { label: "On Hold", value: "on-hold" },
  { label: "Awaiting Payment", value: "awaiting-payment" },
  { label: "Payment Received", value: "payment-received" },
  { label: "Payment Failed", value: "payment-failed" },

  { label: "Dispatched", value: "dispatched" },
  { label: "In Transit", value: "in-transit" },
  { label: "Out for Delivery", value: "out-for-delivery" },

  { label: "Partially Shipped", value: "partially-shipped" },
  { label: "Partially Delivered", value: "partially-delivered" },
  { label: "Partially Refunded", value: "partially-refunded" },

  { label: "Order Accepted", value: "order-accepted" },
  { label: "Order Declined", value: "order-declined" },

  { label: "Awaiting Fulfillment", value: "awaiting-fulfillment" },
  { label: "Awaiting Confirmation", value: "awaiting-confirmation" },
  { label: "Awaiting Shipment", value: "awaiting-shipment" },

  { label: "Ready for Pickup", value: "ready-for-pickup" },
  { label: "Backordered", value: "backordered" },

  { label: "Packaging", value: "packaging" },
  { label: "Quality Checked", value: "quality-checked" },
];

const filters: DataTableFilter[] = [
  {
    id: "status",
    label: "Status",
    type: "select",
    options: ORDER_STATUS_OPTIONS,
  },
  {
    id: "payment_method",
    label: "Payment Method",
    type: "select",
    options: [
      { label: "Credit Card", value: "credit_card" },
      { label: "Debit Card", value: "debit_card" },
      { label: "PayPal", value: "paypal" },
      { label: "Bank Transfer", value: "bank_transfer" },
      { label: "Cash on Delivery", value: "cod" },
      { label: "Wallet", value: "wallet" },
    ],
  },
  {
    id: "payment_status",
    label: "Payment Status",
    type: "select",
    options: [
      { label: "Unpaid", value: "unpaid" },
      { label: "Paid", value: "paid" },
      { label: "Failed", value: "failed" },
      { label: "Refunded", value: "refunded" },
      { label: "Partially Paid", value: "partial" },
      { label: "Pending", value: "pending" },
    ],
  },
];

export default function Table({ props }: any) {
  const { data: session } = useSession();
  const { showConfirm, showAlert, showCustom } = useModal();
  const { hasPermission } = usePermissions();

  const columns: ColumnDef<order>[] = [
    {
      accessorKey: "order_id",
      header: "Order ID",
      cell: ({ row }) => {
        const order = row.original;
        return (
          <div className="flex items-center space-x-3">
            <Link
              href={`/dashboard/ecommerce/orders/${order._id}?order_id=${order.order_id}`}
              className=" text-blue-500"
            >
              {order.order_id}
            </Link>
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Order Date",
      cell: ({ row }) => {
        const createdAt = row.getValue("createdAt") as string;
        return <div className="flex items-center space-x-3">{createdAt}</div>;
      },
    },
    {
      accessorKey: "payment_status",
      header: "Payment Status",
      cell: ({ row }) => {
        const payment_status = row.getValue("payment_status") as string;

        return (
          <div className="flex items-center space-x-3">
            <div className={`font-medium capitalize status-${payment_status}`}>
              {payment_status}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "payment_method",
      header: "Payment Method",

      cell: ({ row }) => {
        const payment_method = row.getValue("payment_method") as string;
        return (
          <div className="flex items-center space-x-3">{payment_method}</div>
        );
      },
    },
    {
      accessorKey: "totalPrice",
      header: "Price",

      cell: ({ row }) => {
        const totalPrice = row.getValue("totalPrice") as Number;
        console.log(totalPrice);

        return (
          <div className="flex items-center space-x-3">
            {totalPrice.toFixed(2)}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",

      cell: ({ row }) => {
        const status = row.getValue("status") as string;

        return (
          <div className="flex items-center space-x-3">
            <div className={`font-medium capitalize status-${status}`}>
              {status}
            </div>
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

  const handleDeleteRow = (rows: order[]) => {
    // console.log("Deleting users:", rows);
    alert(`Deleting ${rows.length} user(s)`);
  };
  const deleteRequest = async (id: any) => {
    return await orderServices.deleteOrder(id, session?.accessToken);
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
  const handleExport = (rows: order[]) => {
    console.log("Exporting users:", rows);
  };

  return (
    <>
      <div className="space-y-4">
        <DataTable
          columns={columns}
          endpoint="/orders"
          token={session?.accessToken}
          filters={filters}
          enableRowSelection={true}
          enableMultiRowSelection={true}
          onDelete={handleDeleteRow}
          onExport={handleExport}
          searchPlaceholder="Search... "
          emptyMessage="No products found."
        />
      </div>
    </>
  );
}
