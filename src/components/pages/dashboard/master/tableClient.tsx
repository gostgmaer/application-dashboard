"use client";
import { ColumnDef } from "@tanstack/react-table";
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
import { useModal } from "@/contexts/modal-context";
import Breadcrumbs from "@/components/layout/common/breadcrumb";
import { usePermissions } from "@/hooks/usePermissions";
import Form from "./form";
import masterServices from "@/lib/http/master";
import { Master } from "@/types/global";

const filters: DataTableFilter[] = [
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

export function MasterDataTable() {
  const { data: session } = useSession();
  const { showConfirm, showAlert, showCustom } = useModal();
  const { hasPermission } = usePermissions();
  const deleteRequest = async (ids: any | any[]) => {
    if (Array.isArray(ids)) {
      const idArray = ids.map((item: any) => item._id);
      return await masterServices.bulkDelete({ids:idArray}, session?.accessToken);
    }
    return await masterServices.softDelete(ids._id, session?.accessToken);
  };
  const handleDelete = async (data: any | any[]) => {
    const isBulk = Array.isArray(data);
    const itemCount = isBulk ? data.length : 1;

    const confirmed = await showConfirm({
      title: isBulk ? `Delete ${itemCount} Items` : "Delete Item",
      description: isBulk
        ? `Are you sure you want to delete these ${itemCount} items? This action cannot be undone.`
        : "Are you sure you want to delete this item? This action cannot be undone.",
      confirmText: isBulk ? `Delete ${itemCount}` : "Delete",
      cancelText: "Cancel",
      variant: "destructive",
      onConfirm: async () => {
        await deleteRequest(data);
      },
    });

    if (confirmed) {
      await showAlert({
        title: "Success",
        description: isBulk
          ? `${itemCount} items have been deleted successfully.`
          : "Item has been deleted successfully.",
        variant: "success",
      });
    }
  };

  const handleUpdate: any = async (p: any) => {
    showCustom({
      title: `Update Master Data: ${p.code}`,
      content: <Form p={p} id={p._id} />,
    });
  };

  function handleCreate(): void {
    showCustom({
      title: `Create New Master Data`,
      content: <Form />,
    });
  }

  const handleExport = (rows: Master[]) => {
    console.log("Exporting Master Data:", rows);
  };

  const columns: ColumnDef<Master>[] = [
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("type")}</div>
      ),
    },
    {
      accessorKey: "code",
      header: "key",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("code")}</div>
      ),
    },
    {
      accessorKey: "label",
      header: "Value",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("label")}</div>
      ),
    },
    // {
    //   accessorKey: "description",
    //   header: "Description",
    //   cell: ({ row }) => (
    //     <div className="flex items-center gap-2">
    //       {row.getValue("description")}
    //     </div>
    //   ),
    // },

    {
      accessorKey: "tenantId",
      header: "Tenant",
      cell: ({ row }) => {
        // const tenantId = row.getValue("tenantId") as Tenant;
        return (
          <div className="flex items-center gap-2">
            {row.getValue("tenantId")}
          </div>
        );
      },
    },
    {
      accessorKey: "isActive",
      header: "Is Active",
      cell: ({ row }) => (
        <div className="text-muted-foreground">
          {row.getValue("isActive") ? "Yes" : "No"}
        </div>
      ),
    },
    {
      accessorKey: "isDefault",
      header: "Is Default",
      cell: ({ row }) => (
        <div className="text-muted-foreground">
          {row.getValue("isDefault") ? "Yes" : "No"}
        </div>
      ),
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
                Copy ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              {hasPermission("master:update") && (
                <DropdownMenuItem onClick={() => handleUpdate(p)}>
                  Update
                </DropdownMenuItem>
              )}
              {hasPermission("master:delete") && (
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
    <div className=" mx-auto px-2 py-4">
      <Breadcrumbs
        heading={"All Master Data"}
        btn={{
          event: handleCreate,
          show: hasPermission("master:create") && true,
        }}
      ></Breadcrumbs>
      <div className="space-y-4">
        <DataTable
          columns={columns}
          endpoint="/masters/list"
          token={session?.accessToken}
          filters={filters}
          enableRowSelection={true}
          enableMultiRowSelection={true}
          onDelete={handleDelete}
          onExport={handleExport}
          //   pageSize={10}
          refreshInterval={3000000}
          searchPlaceholder="Search Master Data..."
          emptyMessage="No Data found."
        />
      </div>
    </div>
  );
}
