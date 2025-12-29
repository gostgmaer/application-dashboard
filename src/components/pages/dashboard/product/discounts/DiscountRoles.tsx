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
import { format } from "date-fns";
import Breadcrumbs from "@/components/layout/common/breadcrumb";

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
  {
    id: "isActive",
    label: "Status",
    type: "select",
    options: [
      { label: "Active", value: "true" },
      { label: "Inactive", value: "false" },
    ],
  },
  {
    id: "isArchive",
    label: "Archive",
    type: "select",
    options: [
      { label: "Yes", value: "true" },
      { label: "No", value: "false" },
    ],
  },
];

type ApplyDiscountRuleProps = {
  d: Discount;
  token?: string;
};

export function DiscountRulesTable({ statics }: any) {
  const { data: session } = useSession();
  const { showConfirm, showAlert, showCustom } = useModal();
  const { hasPermission } = usePermissions();

  const deleteRequest = async (id: any) => {
    try {
      const res = await discountServices.removeDiscountRule(
        id,
        session?.accessToken
      );
      toast({ title: "Success", description: res.message,variant:"default"});
      return res;
    } catch (error) {
      toast({
        title: "Failed",
        description: "Deleted Failed!",
        variant: "destructive",
      });
    } finally {
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
        content: <DiscountForm discount={discount} statics={statics} />,
      });
  };

  const handleExport = (rows: Discount[]) => {
    console.log("Exporting users:", rows);
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
        return (
          <div>
            {row.getValue("startDate")
              ? format(
                  new Date(row.getValue("startDate") as string),
                  "MMM dd, yyyy"
                )
              : "-"}
          </div>
        );
      },
    },
    {
      accessorKey: "endDate",
      header: "End Date",
      cell: ({ row }) => {
        return (
          <div>
            {row.getValue("endDate")
              ? format(
                  new Date(row.getValue("endDate") as string),
                  "MMM dd, yyyy"
                )
              : "-"}
          </div>
        );
      },
    },
    {
      accessorKey: "updatedAt",
      header: "Last Updated",
      cell: ({ row }) => {
        return (
          <div>
            {row.getValue("updatedAt")
              ? format(
                  new Date(row.getValue("updatedAt") as string),
                  "MMM dd, yyyy"
                )
              : "-"}
          </div>
        );
      },
    },
    {
      accessorKey: "in_use",
      header: "Currently Used",
      cell: ({ row }) => {
        const in_use = row.getValue("in_use") as boolean;
        return (
          <Badge variant={in_use ? "default" : "destructive"} className="">
            {in_use ? "Yes" : "No"}
          </Badge>
        );
      },
    },
    {
      id: "apply",
      cell: ({ row }) => {
        const d = row.original;

        return <ApplyDiscountRule d={d} token={session?.accessToken} />;
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

  const handleCreate: any = async () => {
    showCustom({
      title: `Create New Discount Rule`,
      content: <DiscountForm statics={statics} />,
    });
  };
  return (
    <div className=" mx-auto px-2 py-4">
      <Breadcrumbs
        heading="Role Dashboard"
        desc="Manage user roles, permissions, and access control across your organization"
        btn={{
          event: handleCreate,
          show: hasPermission("role:create") && true,
        }}
      />

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

const ApplyDiscountRule = ({ d, token }: ApplyDiscountRuleProps) => {
  const [loading, setLoading] = useState(false);

  const handleApplyRule = async (discount: Discount): Promise<void> => {
    setLoading(true);
    try {
      const response = await discountServices.applyDiscountRule(
        discount._id,
        token
      );

      toast({
        title: "Success",
        description: response.message ?? "Discount rule applied successfully",
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to apply discount rule";

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button
        size="sm"
        variant="outline"
        onClick={() => handleApplyRule(d)}
        disabled={d.in_use || loading || d.isActive === false}
        className="text-blue-600 border-blue-200 hover:bg-blue-50 flex items-center gap-1"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Applying...
          </>
        ) : (
          <>
            <Play className="h-3 w-3" />
            Apply Rule
          </>
        )}
      </Button>
    </div>
  );
};
