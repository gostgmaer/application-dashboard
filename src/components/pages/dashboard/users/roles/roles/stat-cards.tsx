import { Users, Shield, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import Link from "next/link";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  description?: string;
  link?: string;
}

function StatCard({ title, value, icon, description, link }: StatCardProps) {
  const content = (
    <Card className="p-6 bg-white dark:bg-gray-900 hover:shadow-lg dark:hover:shadow-gray-800 transition-shadow cursor-pointer border border-gray-200 dark:border-gray-800">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {value.toLocaleString()}
          </p>
          {description && (
            <p className="text-xs text-gray-500 dark:text-gray-500">
              {description}
            </p>
          )}
        </div>
        <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-2xl">
          {icon}
        </div>
      </div>
    </Card>
  );

  return link ? <Link href={link}>{content}</Link> : content;
}

interface StatCardsProps {
  totalRoles: number;
  totalUsers: number;
  totalPermissions: number;
}

export function StatCards({
  totalRoles,
  totalUsers,
  totalPermissions,
}: StatCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        title="Total Roles"
        value={totalRoles}
        icon={<Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
        description="Active role definitions"
      />
      <StatCard
        title="Total Users Assigned"
        value={totalUsers}
        icon={<Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
        description="Across all roles"
        link={"/dashboard/users"}
      />
      <StatCard
        title="Total Permissions"
        value={totalPermissions}
        icon={<Lock className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
        description="System-wide permissions"
        link={"/dashboard/users/permissions"}
      />
    </div>
  );
}
