import { Users, Shield, Lock } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  description?: string;
}

function StatCard({ title, value, icon, description }: StatCardProps) {
  return (
    <Card className="p-6 bg-white hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</p>
          {description && (
            <p className="text-xs text-gray-500">{description}</p>
          )}
        </div>
        <div className="p-3 bg-blue-50 rounded-2xl">
          {icon}
        </div>
      </div>
    </Card>
  );
}

interface StatCardsProps {
  totalRoles: number;
  totalUsers: number;
  totalPermissions: number;
}

export function StatCards({ totalRoles, totalUsers, totalPermissions }: StatCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        title="Total Roles"
        value={totalRoles}
        icon={<Shield className="w-6 h-6 text-blue-600" />}
        description="Active role definitions"
      />
      <StatCard
        title="Total Users Assigned"
        value={totalUsers}
        icon={<Users className="w-6 h-6 text-blue-600" />}
        description="Across all roles"
      />
      <StatCard
        title="Total Permissions"
        value={totalPermissions}
        icon={<Lock className="w-6 h-6 text-blue-600" />}
        description="System-wide permissions"
      />
    </div>
  );
}
