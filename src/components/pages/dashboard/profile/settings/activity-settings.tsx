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
import { format } from "date-fns";
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
import { securityEvent } from "@/types/user";

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
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => {
        return (
          //  <div className="font-medium">{user.fullName}</div>

          <div className="font-medium flex items-center gap-2">
            {row.original.id}
          </div>
        );
      },
    },
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
        const device: any = row.getValue("device") as string;
        return (
          <div className="flex flex-col text-sm">
            <span>
              <strong>Vendor:</strong>{" "}
              {device.vendor || <span className="text-gray-400">Unknown</span>}
            </span>
            <span>
              <strong>Model:</strong>{" "}
              {device.model || <span className="text-gray-400">Unknown</span>}
            </span>
            <span>
              <strong>Type:</strong>{" "}
              {device.type || <span className="text-gray-400">Unknown</span>}
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
        return <div>{lastLogin} Ago</div>;
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
          <div className="flex flex-col text-sm">
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

export function ActivitySettings() {
  const {
    activityLogs,
    activityTotal,
    securityTotal,
    fetchActivityLogs,
    fetchSecurityLogs,
  } = useActivityLogs();
  const { securityLogs } = useSecurityLogs();

  const { loading } = useSetting();

  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("activity");

  // const handlePageChange = (page: number) => {
  //   setCurrentPage(page);
  //   if (activeTab === "activity") {
  //     fetchActivityLogs(page);
  //   } else {
  //     fetchSecurityLogs(page);
  //   }
  // };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "warning":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Activity & Logs</h1>
        <p className="text-muted-foreground mt-2">
          Monitor your account activity and security events
        </p>
      </div>

      <Card className="border-0 shadow-sm bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Account Logs</CardTitle>
              <CardDescription>
                View and manage your account activity history
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button variant="outline" size="sm">
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Logs
              </Button>
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
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              ) : (
                <>
                  <div className="rounded-lg border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Action</TableHead>
                          <TableHead>Device / IP</TableHead>
                          <TableHead>Timestamp</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {activityLogs.map((log, index) => (
                          <motion.tr
                            key={log.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="hover:bg-muted/50"
                          >
                            <TableCell className="font-medium">
                              {log.action}
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="text-sm">{log.deviceType}</p>
                                <p className="text-xs text-muted-foreground">
                                  {log.ip}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              {format(
                                new Date(log.timestamp),
                                "MMM dd, yyyy HH:mm a"
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="secondary"
                                className={cn(
                                  "capitalize"
                                  // getStatusColor(log.statusCode)
                                )}
                              >
                                {/* {log.status} */}
                              </Badge>
                            </TableCell>
                          </motion.tr>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  {/* {renderPagination(activityTotal)} */}
                </>
              )}
            </TabsContent>

            <TabsContent value="security" className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              ) : (
                <>
                  <div className="rounded-lg border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Action</TableHead>
                          <TableHead>Device / IP</TableHead>
                          <TableHead>Timestamp</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {securityLogs.map((log, index) => (
                          <motion.tr
                            key={log.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="hover:bg-muted/50"
                          >
                            <TableCell className="font-medium">
                              {log.action}
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="text-sm">{log.device}</p>
                                <p className="text-xs text-muted-foreground">
                                  {log.ip}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              {format(
                                new Date(log.detectedAt),
                                "MMM dd, yyyy HH:mm"
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="secondary"
                                className={cn(
                                  "capitalize",
                                  getStatusColor(log.status)
                                )}
                              >
                                {log.status}
                              </Badge>
                            </TableCell>
                          </motion.tr>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
