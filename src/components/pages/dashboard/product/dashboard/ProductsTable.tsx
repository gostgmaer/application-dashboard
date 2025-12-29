"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoveHorizontal as MoreHorizontal, Mail } from "lucide-react";
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
import { Product } from "@/types/product";
import productService from "@/lib/http/ProductServices";
import { usePermissions } from "@/hooks/usePermissions";

export type User = {
  id: string;
  name: string;
  email: string;
  status: "active" | "inactive" | "pending";
  role: "admin" | "user" | "moderator";
  createdAt: string;
};



export function ProductsTable({ category }: any) {
  const { data: session } = useSession();
  const { showConfirm, showAlert, showCustom } = useModal();
  const { hasPermission } = usePermissions();


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
      { label: "Published", value: "published" },
      { label: "Archived", value: "archived" },
      { label: "Draft", value: "draft" },
    ],
  },
  {
    id: "category",
    label: "Category",
    type: "select",
    options: category
  },
  {
    id: "isArchive",
    label: "Archive",
    type: "select",
    options: [
      { label: "Yes", value: "true" },
      { label: "No", value: "false" },
    ],
  }
  
];

  const handleDeleteRow = (rows: Product[]) => {
    // console.log("Deleting users:", rows);
    alert(`Deleting ${rows.length} user(s)`);
  };
  const deleteRequest = async (id: any) => {
    return await productService.remove(id, session?.accessToken);
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
  const handleExport = (rows: Product[]) => {
    console.log("Exporting users:", rows);
  };
  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "title",
      header: "Name",
      cell: ({ row }) => (
        <>
          {hasPermission("product:view") ? (
            <div className="font-medium">
              <Link href={`/dashboard/products/${row.original["id"]}`}>
                {row.getValue("title")}
              </Link>
            </div>
          ) : (
            <div className="font-medium">{row.getValue("title")}</div>
          )}
        </>
        //  <div className="font-medium">{user.fullName}</div>
      ),
    },
    {
      accessorKey: "sku",
      header: "SKU",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span>{row.getValue("sku")}</span>
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => {
        const category: any = row.getValue("category");
        return <div>{category.title}</div>;
      },
    },

    {
      accessorKey: "finalPrice",
      header: "Price",
      cell: ({ row }) => {
        const finalPrice = row.getValue("finalPrice") as number;
        return <div>${finalPrice.toFixed(2)} </div>;
      },
    },
    {
      accessorKey: "basePrice",
      header: "Listing",
      cell: ({ row }) => {
        const basePrice = row.getValue("basePrice") as number;
        return <div>${basePrice.toFixed(2)} </div>;
      },
    },
    {
      accessorKey: "inventory",
      header: "Stock",
      cell: ({ row }) => {
        const inventory = row.getValue("inventory") as string;
        return <div>{inventory}</div>;
      },
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
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"));
        return <div>{date.toLocaleString()}</div>;
      },
    },
    {
      id: "actions",

      cell: ({ row }) => {
        const p = row.original;

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
                onClick={() => navigator.clipboard.writeText(p.id)}
              >
                Copy Product ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              {hasPermission("product:update") && (
                <DropdownMenuItem>
                  <Link href={`/dashboard/ecommerce/products/${p["id"]}/update`}>
                    Edit{" "}
                  </Link>
                </DropdownMenuItem>
              )}
              {hasPermission("product:delete") && (
                <DropdownMenuItem
                  className="text-red-500"
                  onClick={() => handleDelete(p)}
                >
                  Remove
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  return (
     <div className="space-y-4">
        <DataTable
          columns={columns}
          endpoint="/products"
          token={session?.accessToken}
          filters={filters}
          enableRowSelection={true}
          enableMultiRowSelection={true}
          onDelete={handleDeleteRow}
          onExport={handleExport}
          searchPlaceholder="Search title, sku, category..."
          emptyMessage="No products found."
        />
      </div>
  );
}
