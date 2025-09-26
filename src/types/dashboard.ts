export interface ActivityItem {
  id: string;
  user: string;
  action: string;
  resource: string;
  timestamp: Date;
  status: 'success' | 'warning' | 'error';
  ipAddress?: string;
  userAgent?: string;
}

export interface ReportItem {
  id: string;
  title: string;
  category: string;
  createdBy: string;
  createdAt: Date;
  status: 'completed' | 'pending' | 'failed';
  size: string;
  downloads: number;
  type: 'pdf' | 'excel' | 'csv';
}

export interface MetricCard {
  title: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  icon: string;
}

export interface ChartData {
  name: string;
  value: number;
  date?: string;
  category?: string;
  trend?: number;
}

export interface SystemMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'healthy' | 'warning' | 'critical';
  threshold: number;
  lastUpdated: Date;
}

export interface UserSession {
  id: string;
  userId: string;
  userName: string;
  startTime: Date;
  lastActivity: Date;
  duration: number;
  pageViews: number;
  location: string;
  device: string;
  status: 'active' | 'idle' | 'offline';
}

export interface SecurityEvent {
  id: string;
  type: 'login_attempt' | 'failed_login' | 'suspicious_activity' | 'data_access' | 'permission_change';
  severity: 'low' | 'medium' | 'high' | 'critical';
  user: string;
  description: string;
  timestamp: Date;
  ipAddress: string;
  resolved: boolean;
}

export interface PerformanceMetric {
  id: string;
  metric: string;
  value: number;
  unit: string;
  timestamp: Date;
  target: number;
  status: 'good' | 'warning' | 'poor';
}

export interface FilterState {
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  category: string;
  status: string;
  search: string;
}