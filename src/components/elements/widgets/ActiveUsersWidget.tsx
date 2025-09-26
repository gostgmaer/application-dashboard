"use client";

import { Users, Globe, Smartphone, Monitor } from 'lucide-react';
import { UserSession } from '@/types/dashboard';

interface ActiveUsersWidgetProps {
  sessions: UserSession[];
}

export function ActiveUsersWidget({ sessions }: ActiveUsersWidgetProps) {
  const activeSessions = sessions.filter(s => s.status === 'active');
  const idleSessions = sessions.filter(s => s.status === 'idle');
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'idle':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getDeviceIcon = (device: string) => {
    if (device.includes('Mobile')) return <Smartphone className="h-4 w-4" />;
    if (device.includes('Desktop')) return <Monitor className="h-4 w-4" />;
    return <Globe className="h-4 w-4" />;
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Active Users</h3>
        <Users className="h-5 w-5 text-gray-500 dark:text-gray-400" />
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{activeSessions.length}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Active</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{idleSessions.length}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Idle</p>
        </div>
      </div>

      <div className="space-y-3">
        {sessions.slice(0, 5).map((session) => (
          <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                  <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(session.status)} rounded-full border-2 border-white dark:border-gray-800`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{session.userName}</p>
                <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                  {getDeviceIcon(session.device)}
                  <span>{session.location}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {formatDuration(session.duration)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {session.pageViews} pages
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}