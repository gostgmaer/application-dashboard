"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useActivityLogs,
  useMyActivity,
  useSecurityLogs,
} from "@/hooks/use-user-settings";
import { format, formatDistanceToNow } from "date-fns";
import {
  Activity,
  Shield,
  Download,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader as Loader2,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { useSetting } from "@/contexts/SettingContext";
import { useSession } from "next-auth/react";
import {
  DataTable,
  DataTableFilter,
} from "@/components/ui/data-table/data-Table-Client";
import { useModal } from "@/contexts/modal-context";
import { ColumnDef } from "@tanstack/react-table";
import { ActivityLog, securityEvent } from "@/types/user";

const ITEMS_PER_PAGE = 10;

export function SecurityLogsTable(props: any) {
  const { data: session } = useSession();
  const { showConfirm, showAlert, showCustom } = useModal();
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
        { label: "Deleted", value: "deleted" },
        { label: "Archived", value: "archived" },
        { label: "Draft", value: "draft" },
      ],
    },
  ];

  const handleView = async (data: any) => {
    console.log(data);
  };

  const columns: ColumnDef<securityEvent>[] = [
    // {
    //   accessorKey: "id",
    //   header: "ID",
    //   cell: ({ row }) => {
    //     return (
    //       //  <div className="font-medium">{user.fullName}</div>

    //       <div className="font-medium flex items-center gap-2">
    //         {row.original.id}
    //       </div>
    //     );
    //   },
    // },
    {
      accessorKey: "detectedAt",
      header: "Timestamp",
      cell: ({ row }) => {
        const date = new Date(row.getValue("detectedAt"));
        return <div>{date.toLocaleString()}</div>;
      },
    },
    {
      accessorKey: "ipAddress",
      header: "ip Address",
      cell: ({ row }) => {
        return row.getValue("ipAddress");
      },
    },
    {
      accessorKey: "device",
      header: "Device",
      cell: ({ row }) => {
        const device: any = row.getValue("device");
        return (
          <div className="flex text-sm">
            <span className="">
              <strong>Vendor:</strong>{" "}
              {device?.vendor || <span className="text-gray-400">Unknown</span>}
            </span>
            <span>
              <strong>Model:</strong>{" "}
              {device?.model || <span className="text-gray-400">Unknown</span>}
            </span>
            <span>
              <strong>Type:</strong>{" "}
              {device?.type || <span className="text-gray-400">Unknown</span>}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "loginTime",
      header: "Last Login Time",
      cell: ({ row }) => {
        const lastLogin = row.getValue("loginTime") as string;
        return (
          <div> {formatDistanceToNow(lastLogin, { addSuffix: true })}</div>
        );
      },
    },
    {
      accessorKey: "os",
      header: "Operating System",
      cell: ({ row }) => {
        const os: any = row.getValue("os");
        return (
          <div className="flex text-sm">
            <span>
              <strong>Name:</strong>{" "}
              {os.name || <span className="text-gray-400">Unknown</span>}
            </span>
            <span>
              <strong>Version:</strong>{" "}
              {os.version || <span className="text-gray-400">Unknown</span>}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "browser",
      header: "Browser",
      cell: ({ row }) => {
        const browser: any = row.getValue("browser");
        return (
          <div className="flex text-sm">
            <span>
              <strong>Name:</strong>{" "}
              {browser.name || <span className="text-gray-400">Unknown</span>}
            </span>
            <span>
              <strong>Version:</strong>{" "}
              {browser.version || (
                <span className="text-gray-400">Unknown</span>
              )}
            </span>
          </div>
        );
      },
    },
    {
      id: "actions",

      cell: ({ row }) => {
        const user = row.original;

        return (
          <div className="text-red-500" onClick={() => handleView(user)}>
            <Eye className="mr-2 h-4 w-4" />
            View
          </div>
        );
      },
    },
  ];
  return (
    <div className=" mx-auto py-10">
      <div className="space-y-4">
        <DataTable
          columns={columns}
          endpoint="/auth/security-logs"
          token={session?.accessToken}
          filters={filters}
          enableRowSelection={true}
          enableMultiRowSelection={true}
          refreshInterval={3000000}
          searchPlaceholder="Search users by name, email..."
          emptyMessage="No users found."
        />
      </div>
    </div>
  );
}

export function ActivityLogsTable(props: any) {
  const { data: session } = useSession();
  const { showConfirm, showAlert, showCustom } = useModal();
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
        { label: "Deleted", value: "deleted" },
        { label: "Archived", value: "archived" },
        { label: "Draft", value: "draft" },
      ],
    },
  ];

  const handleView = async (data: any) => {
    console.log(data);
  };

  const columns: ColumnDef<ActivityLog>[] = [
    // {
    //   accessorKey: "_id",
    //   header: "Event ID",
    //   cell: ({ row }) => (
    //     <div className="font-mono text-xs text-gray-600 truncate max-w-[160px]">
    //       {row.getValue("_id")}
    //     </div>
    //   ),
    // },
    {
      accessorKey: "timestamp",
      header: "Timestamp",
      cell: ({ row }) => {
        const date = new Date(row.getValue("timestamp"));
        return (
          <div className="text-sm text-gray-700">
            {date.toLocaleString()} <br />
            <span className="text-xs text-gray-400">
              ({formatDistanceToNow(date, { addSuffix: true })})
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => (
        <div className="capitalize font-medium">{row.getValue("action")}</div>
      ),
    },
    {
      accessorKey: "method",
      header: "Method",
      cell: ({ row }) => {
        const method = row.getValue("method") as string;
        const color =
          method === "GET"
            ? "text-blue-500"
            : method === "POST"
            ? "text-green-500"
            : method === "PUT"
            ? "text-yellow-500"
            : method === "DELETE"
            ? "text-red-500"
            : "text-gray-500";
        return <span className={`font-semibold ${color}`}>{method}</span>;
      },
    },
    {
      accessorKey: "route",
      header: "Route",
      cell: ({ row }) => (
        <div className="text-gray-700 text-sm">{row.getValue("route")}</div>
      ),
    },
    {
      accessorKey: "ip",
      header: "IP Address",
      cell: ({ row }) => (
        <div className="text-gray-600 font-mono">{row.getValue("ip")}</div>
      ),
    },
    {
      accessorKey: "browser",
      header: "Browser",
      cell: ({ row }) => {
        const browser: any = row.getValue("browser");
        return (
          <div className="flex text-sm">
            <span>
              <strong>Name:</strong>{" "}
              {browser?.name || <span className="text-gray-400">Unknown</span>}
            </span>
            <span>
              <strong>Version:</strong>{" "}
              {browser?.version || (
                <span className="text-gray-400">Unknown</span>
              )}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "os",
      header: "Operating System",
      cell: ({ row }) => {
        const os: any = row.getValue("os");
        return (
          <div className="flex flex-col text-sm">
            <span>
              <strong>Name:</strong>{" "}
              {os?.name || <span className="text-gray-400">Unknown</span>}
            </span>
            <span>
              <strong>Version:</strong>{" "}
              {os?.version || <span className="text-gray-400">Unknown</span>}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "device",
      header: "Device Info",
      cell: ({ row }) => {
        const device: any = row.getValue("device");
        return (
          <div className="flex text-sm">
            <span>
              <strong>Vendor:</strong>{" "}
              {device?.vendor || <span className="text-gray-400">Unknown</span>}
            </span>
            <span>
              <strong>Model:</strong>{" "}
              {device?.model || <span className="text-gray-400">Unknown</span>}
            </span>
            <span>
              <strong>Type:</strong>{" "}
              {device?.type || <span className="text-gray-400">Unknown</span>}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "statusCode",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("statusCode") as number;
        const color =
          status >= 200 && status < 300
            ? "text-green-600"
            : status >= 400
            ? "text-red-600"
            : "text-gray-600";
        return <span className={`font-semibold ${color}`}>{status}</span>;
      },
    },
    // {
    //   accessorKey: "summary",
    //   header: "Summary",
    //   cell: ({ row }) => (
    //     <div className="text-sm text-gray-700">{row.getValue("summary")}</div>
    //   ),
    // },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const event = row.original;
        return (
          <button
            onClick={() => handleView(event)}
            className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
          >
            <Eye className="mr-1 h-4 w-4" /> View
          </button>
        );
      },
    },
  ];

  return (
    <div className=" mx-auto py-10">
      <div className="space-y-4">
        <DataTable
          columns={columns}
          endpoint="/activity-logs/my-activities"
          token={session?.accessToken}
          filters={filters}
          enableRowSelection={true}
          enableMultiRowSelection={true}
          refreshInterval={3000000}
          searchPlaceholder="Search users by name, email..."
          emptyMessage="No users found."
        />
      </div>
    </div>
  );
}

export function ActivitySettings() {
  const [activeTab, setActiveTab] = useState("activity");

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Account Logs</CardTitle>
              <CardDescription>
                View and manage your account activity history
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="activity" className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Activity Logs
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Security Logs
              </TabsTrigger>
            </TabsList>

            <TabsContent value="activity" className="space-y-4">
              <ActivityLogsTable></ActivityLogsTable>
            </TabsContent>

            <TabsContent value="security" className="space-y-4">
              <SecurityLogsTable></SecurityLogsTable>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
