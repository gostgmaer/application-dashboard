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

export default function UserDashboard() {
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
              value="1,542"
              icon={Users}
              description="All registered users"
            />
            <StatCard
              title="Active Users"
              value="1,400"
              icon={UserCheck}
              description="Currently active"
            />
            <StatCard
              title="Inactive Users"
              value="142"
              icon={UserX}
              description="No recent activity"
            />
            <StatCard
              title="New Users Today"
              value="25"
              icon={UserPlus}
              description="Registered today"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <StatCard
              title="Growth Rate"
              value="+12.5%"
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
              value="1,489"
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
              value="892"
              icon={ShieldCheck}
              description="57.9% security adoption"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <ChartCard title="Users by Role">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={usersByRole}
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
                <BarChart data={usersByDevice}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="device" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="users" fill="#3b82f6" radius={[8, 8, 0, 0]} />
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
