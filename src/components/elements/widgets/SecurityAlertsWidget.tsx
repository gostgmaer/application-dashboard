"use client";

import { Shield, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { SecurityEvent } from '@/types/dashboard';

interface SecurityAlertsWidgetProps {
  events: SecurityEvent[];
}

export function SecurityAlertsWidget({ events }: SecurityAlertsWidgetProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'failed_login':
        return '🔐';
      case 'suspicious_activity':
        return '⚠️';
      case 'data_access':
        return '📊';
      case 'permission_change':
        return '👤';
      default:
        return '🔍';
    }
  };

  const unresolvedEvents = events.filter(e => !e.resolved);
  const criticalEvents = events.filter(e => e.severity === 'critical' || e.severity === 'high');

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Security Alerts</h3>
        <Shield className="h-5 w-5 text-gray-500 dark:text-gray-400" />
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-3 bg-red-50 dark:bg-red-900/10 rounded-lg">
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">{unresolvedEvents.length}</p>
          <p className="text-sm text-red-600 dark:text-red-400">Unresolved</p>
        </div>
        <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/10 rounded-lg">
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{criticalEvents.length}</p>
          <p className="text-sm text-orange-600 dark:text-orange-400">Critical</p>
        </div>
      </div>

      <div className="space-y-3">
        {events.slice(0, 4).map((event) => (
          <div key={event.id} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="text-lg">{getTypeIcon(event.type)}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(event.severity)}`}>
                  {event.severity.toUpperCase()}
                </span>
                <div className="flex items-center space-x-1">
                  {event.resolved ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Clock className="h-4 w-4 text-yellow-500" />
                  )}
                </div>
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {event.description}
              </p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-gray-500 dark:text-gray-400">{event.user}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {event.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}