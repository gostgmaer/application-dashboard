"use client";

import { ChartCard } from "@/components/pages/dashboard/users/ui/chart-card";
import { StatCard } from "@/components/pages/dashboard/users/ui/stat-card";
import { User } from "@/components/pages/dashboard/users/ui/user-table";
import {
  Users,
  UserCheck,
  UserX,
  UserPlus,
  TrendingUp,
  Activity,
  Globe,
  Clock,
  ShieldCheck,
  Mail,
  Package,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import UsersTable from "./table";
import { DataTableExample } from "./tableClient";
import Breadcrumbs from "@/components/layout/common/breadcrumb";
import { useApiSWR } from "@/hooks/useApiSWR";

const usersByRole = [
  { name: "Admin", value: 5, fill: "#3b82f6" },
  { name: "Customer", value: 1530, fill: "#10b981" },
  { name: "Vendor", value: 7, fill: "#f59e0b" },
];

const usersByDevice = [
  { device: "Mobile", users: 900 },
  { device: "Desktop", users: 600 },
  { device: "Tablet", users: 42 },
];

const mockUsers: User[] = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
    role: "Customer",
    status: "Active",
    lastActive: "2025-09-28",
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob@example.com",
    role: "Admin",
    status: "Inactive",
    lastActive: "2025-09-20",
  },
  {
    id: 3,
    name: "Charlie Brown",
    email: "charlie@example.com",
    role: "Vendor",
    status: "Active",
    lastActive: "2025-09-29",
  },
  {
    id: 4,
    name: "Diana Prince",
    email: "diana@example.com",
    role: "Customer",
    status: "Active",
    lastActive: "2025-09-30",
  },
  {
    id: 5,
    name: "Edward Norton",
    email: "edward@example.com",
    role: "Customer",
    status: "Inactive",
    lastActive: "2025-09-15",
  },
  {
    id: 6,
    name: "Fiona Gallagher",
    email: "fiona@example.com",
    role: "Vendor",
    status: "Active",
    lastActive: "2025-09-29",
  },
  {
    id: 7,
    name: "George Miller",
    email: "george@example.com",
    role: "Customer",
    status: "Active",
    lastActive: "2025-09-28",
  },
  {
    id: 8,
    name: "Hannah Montana",
    email: "hannah@example.com",
    role: "Admin",
    status: "Active",
    lastActive: "2025-10-01",
  },
];

export default function UserDashboard(token: any) {

    const { data, error, isLoading, mutate } = useApiSWR(
      "/users/stats-data",
      token,
      undefined,
      undefined,
      undefined
    );


     if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="relative">
            <Package className="h-16 w-16 mx-auto mb-6 animate-spin text-primary" />
            <div className="absolute inset-0 h-16 w-16 mx-auto animate-ping">
              <Package className="h-16 w-16 text-primary/20" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-3 text-gradient">
            Loading Dashboard
          </h2>
          <p className="text-muted-foreground text-lg">
            Preparing your analytics and insights...
          </p>
          <div className="mt-6 flex justify-center">
            <div className="flex space-x-1">
              <div
                className="w-2 h-2 bg-primary rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              ></div>
              <div
                className="w-2 h-2 bg-primary rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></div>
              <div
                className="w-2 h-2 bg-primary rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Breadcrumbs
        heading={"User Dashboard"}
        btn={{ show: true }}
      ></Breadcrumbs>

      <div className="rounded-md    shadow-sm overflow-auto ">
        <div className=" mx-auto space-y-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Users"
              value={data?.totalUsers||0}
              icon={Users}
              description="All registered users"
            />
            <StatCard
              title="Active Users"
              value={data?.activeUsers||0}
              icon={UserCheck}
              description="Currently active"
            />
            <StatCard
              title="Inactive Users"
              value={data?.inactiveUsers||0}
              icon={UserX}
              description="No recent activity"
            />
            <StatCard
              title="New Users Today"
              value={data?.newUsersToday||0}
              icon={UserPlus}
              description="Registered today"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <StatCard
              title="Growth Rate"
                value={data?.weeklyGrowthRate||0}
              icon={TrendingUp}
              description="User growth this month"
            />
            <StatCard
              title="Avg Session Duration"
              value="8m 42s"
              icon={Clock}
              description="Average time per session"
            />
            <StatCard
              title="Active Sessions"
              value="347"
              icon={Activity}
              description="Currently online"
            />
            <StatCard
              title="Email Verified"
              value={data?.emailVerifiedCount||0}
              icon={Mail}
              description="96.6% verification rate"
            />
            <StatCard
              title="Countries"
              value="42"
              icon={Globe}
              description="Global user reach"
            />
            <StatCard
              title="2FA Enabled"
              value={data?.twoFactorEnabledCount||0}
              icon={ShieldCheck}
              description="57.9% security adoption"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <ChartCard title="Users by Role">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data?.usersByRole||[]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {usersByRole.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Users by Device">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data?.usersByDevice||[]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight">Users</h2>
              <p className="text-sm text-muted-foreground">
                A comprehensive list of all users in the system
              </p>
            </div>
            <DataTableExample />
          </div>
        </div>
      </div>
    </>
  );
}
