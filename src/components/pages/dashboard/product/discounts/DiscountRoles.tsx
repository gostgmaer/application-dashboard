"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MoveHorizontal as MoreHorizontal,
  Mail,
  Play,
  Loader2,
} from "lucide-react";
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
import { useModal } from "@/contexts/modal-context";
import { usePermissions } from "@/hooks/usePermissions";
import discountServices from "@/lib/http/discountServices";
import { toast } from "@/hooks/useToast";
import { Discount } from "@/types/discount";
import { DiscountForm } from "./DiscountForm";
import { useState } from "react";

const filters: DataTableFilter[] = [
  {
    id: "discountType",
    label: "Discount Type",
    type: "select",
    options: [
      { label: "Percentage", value: "percentage" },
      { label: "Fixed", value: "fixed" },
    ],
  },
];

export function DiscountRulesTable({statics}:any) {

  const { data: session } = useSession();
  const { showConfirm, showAlert, showCustom } = useModal();
  const { hasPermission } = usePermissions();
  const [loading, setLoading] = useState(false);

  const deleteRequest = async (id: any) => {
    setLoading(true);
    try {
      const res = await discountServices.removeDiscountRule(
        id,
        session?.accessToken
      );
      toast({ title: "Success", description: "Deleted SuccessFul!" });
      return res;
    } catch (error) {
      toast({
        title: "Failed",
        description: "Deleted Failed!",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (data: any) => {
    await showConfirm({
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
  };

  const handleUpdate: any = async (discount: any) => {
    hasPermission("discount:update") &&
      showCustom({
        title: `Update Discount Rule: ${discount.name}`,
        content: <DiscountForm discount={discount} />,
      });
  };

  const handleExport = (rows: Discount[]) => {
    console.log("Exporting users:", rows);
  };

  const handleApplyRule:any = async (discount: Discount) => {
    setLoading(true);
    try {
      const response = await discountServices.applyDiscountRule(
        discount._id,
        session?.accessToken
      );
        toast({ title: "Success", description: response.message });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to apply discount rule";
    } finally {
      setLoading(false);
    }
  };

  const formatValue = (discount: Discount) => {
    return discount.discountType === "percentage"
      ? `${discount?.discountValue}%`
      : `$${discount?.discountValue.toFixed(2)}`;
  };

  const columns: ColumnDef<Discount>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <>
          <div className="font-medium">{row.getValue("name")}</div>
        </>
      ),
    },
    {
      accessorKey: "discountType",
      header: "Type",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.getValue("discountType")}
        </div>
      ),
    },
    {
      accessorKey: "discountValue",
      header: "Value",
      cell: ({ row }) => {
        return <div> {formatValue(row.original)}</div>;
      },
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("isActive") as boolean;
        return (
          <Badge variant={status ? "default" : "destructive"} className="">
            {status ? "Active" : "Inactive"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "startDate",
      header: "Start Date",
      cell: ({ row }) => {
        const date = new Date(row.getValue("startDate"));
        return <div>{date.toLocaleString()}</div>;
      },
    },
    {
      accessorKey: "endDate",
      header: "End Date",
      cell: ({ row }) => {
        const date = new Date(row.getValue("endDate"));
        return <div>{date.toLocaleString()}</div>;
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
      accessorKey: "updatedAt",
      header: "Last Updated",
      cell: ({ row }) => {
        const date = new Date(row.getValue("updatedAt"));
        return <div>{date.toLocaleString()}</div>;
      },
    },
    {
      id: "apply",
      cell: ({ row }) => {
        const d = row.original;

        return (
          <div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleApplyRule(d)}
              disabled={d.in_use || loading}
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Play className="h-3 w-3 mr-1" />
              )}
              {loading ? "Applying..." : "Apply Rule"}
            </Button>
          </div>
        );
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
                onClick={() => navigator.clipboard.writeText(p._id)}
              >
                Copy Discount ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              {hasPermission("discount:update") && (
                <DropdownMenuItem onClick={() => handleUpdate(p)}>
                  Edit
                </DropdownMenuItem>
              )}
              {hasPermission("discount:delete") && (
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
    <div className="container mx-auto py-10">
      <div className="space-y-4">
        <DataTable
          columns={columns}
          endpoint="/discounts/rules"
          token={session?.accessToken}
          filters={filters}
          enableRowSelection={true}
          enableMultiRowSelection={true}
          onDelete={handleDelete}
          onExport={handleExport}
          searchPlaceholder="Search by name..."
          emptyMessage="No Discount Rule found."
        />
      </div>
    </div>
  );
}
