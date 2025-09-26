import { ActivityItem, ReportItem, MetricCard, ChartData } from '@/types/dashboard';
import { SystemMetric, UserSession, SecurityEvent, PerformanceMetric } from '@/types/dashboard';

export const mockActivities: ActivityItem[] = [
  {
    id: '1',
    user: 'John Doe',
    action: 'Login',
    resource: 'Dashboard',
    timestamp: new Date('2024-01-15T10:30:00'),
    status: 'success',
    ipAddress: '192.168.1.100',
    userAgent: 'Chrome/120.0'
  },
  {
    id: '2',
    user: 'Sarah Smith',
    action: 'Export Report',
    resource: 'Sales Report',
    timestamp: new Date('2024-01-15T10:25:00'),
    status: 'success',
    ipAddress: '192.168.1.101'
  },
  {
    id: '3',
    user: 'Mike Johnson',
    action: 'Failed Login',
    resource: 'Authentication',
    timestamp: new Date('2024-01-15T10:20:00'),
    status: 'error',
    ipAddress: '192.168.1.102'
  },
  {
    id: '4',
    user: 'Emily Davis',
    action: 'Create Report',
    resource: 'Analytics Dashboard',
    timestamp: new Date('2024-01-15T10:15:00'),
    status: 'success',
    ipAddress: '192.168.1.103'
  },
  {
    id: '5',
    user: 'David Wilson',
    action: 'Update Profile',
    resource: 'User Settings',
    timestamp: new Date('2024-01-15T10:10:00'),
    status: 'warning',
    ipAddress: '192.168.1.104'
  }
];

export const mockReports: ReportItem[] = [
  {
    id: '1',
    title: 'Monthly Sales Report',
    category: 'Sales',
    createdBy: 'Sarah Smith',
    createdAt: new Date('2024-01-15T09:00:00'),
    status: 'completed',
    size: '2.3 MB',
    downloads: 45,
    type: 'pdf'
  },
  {
    id: '2',
    title: 'User Activity Analytics',
    category: 'Analytics',
    createdBy: 'Mike Johnson',
    createdAt: new Date('2024-01-15T08:30:00'),
    status: 'completed',
    size: '1.8 MB',
    downloads: 23,
    type: 'excel'
  },
  {
    id: '3',
    title: 'Financial Summary Q4',
    category: 'Finance',
    createdBy: 'Emily Davis',
    createdAt: new Date('2024-01-15T08:00:00'),
    status: 'pending',
    size: '3.1 MB',
    downloads: 0,
    type: 'pdf'
  },
  {
    id: '4',
    title: 'Customer Feedback Report',
    category: 'Support',
    createdBy: 'David Wilson',
    createdAt: new Date('2024-01-15T07:30:00'),
    status: 'failed',
    size: '0.9 MB',
    downloads: 0,
    type: 'csv'
  }
];

export const activityMetrics: MetricCard[] = [
  {
    title: 'Total Users Active',
    value: '2,847',
    change: 12.5,
    trend: 'up',
    icon: 'Users'
  },
  {
    title: 'Login Attempts',
    value: '1,234',
    change: -3.2,
    trend: 'down',
    icon: 'LogIn'
  },
  {
    title: 'Actions Today',
    value: '8,921',
    change: 8.7,
    trend: 'up',
    icon: 'Activity'
  },
  {
    title: 'Failed Operations',
    value: '23',
    change: -15.3,
    trend: 'up',
    icon: 'AlertTriangle'
  }
];

export const reportMetrics: MetricCard[] = [
  {
    title: 'Total Reports',
    value: '156',
    change: 23.1,
    trend: 'up',
    icon: 'FileText'
  },
  {
    title: 'Reports Generated Today',
    value: '12',
    change: 5.4,
    trend: 'up',
    icon: 'TrendingUp'
  },
  {
    title: 'Total Downloads',
    value: '2,341',
    change: 18.9,
    trend: 'up',
    icon: 'Download'
  },
  {
    title: 'Failed Reports',
    value: '3',
    change: -40.0,
    trend: 'up',
    icon: 'AlertCircle'
  }
];

export const chartData: ChartData[] = [
  { name: 'Jan', value: 400, date: '2024-01' },
  { name: 'Feb', value: 300, date: '2024-02' },
  { name: 'Mar', value: 600, date: '2024-03' },
  { name: 'Apr', value: 800, date: '2024-04' },
  { name: 'May', value: 500, date: '2024-05' },
  { name: 'Jun', value: 900, date: '2024-06' }
];

export const pieChartData: ChartData[] = [
  { name: 'Sales', value: 45 },
  { name: 'Analytics', value: 25 },
  { name: 'Finance', value: 20 },
  { name: 'Support', value: 10 }
];

export const systemMetrics: SystemMetric[] = [
  {
    id: '1',
    name: 'CPU Usage',
    value: 68,
    unit: '%',
    status: 'warning',
    threshold: 80,
    lastUpdated: new Date()
  },
  {
    id: '2',
    name: 'Memory Usage',
    value: 45,
    unit: '%',
    status: 'healthy',
    threshold: 85,
    lastUpdated: new Date()
  },
  {
    id: '3',
    name: 'Disk Usage',
    value: 92,
    unit: '%',
    status: 'critical',
    threshold: 90,
    lastUpdated: new Date()
  },
  {
    id: '4',
    name: 'Network I/O',
    value: 234,
    unit: 'MB/s',
    status: 'healthy',
    threshold: 500,
    lastUpdated: new Date()
  }
];

export const userSessions: UserSession[] = [
  {
    id: '1',
    userId: 'user1',
    userName: 'John Doe',
    startTime: new Date(Date.now() - 3600000),
    lastActivity: new Date(Date.now() - 300000),
    duration: 3300,
    pageViews: 15,
    location: 'New York, US',
    device: 'Chrome Desktop',
    status: 'active'
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'Sarah Smith',
    startTime: new Date(Date.now() - 7200000),
    lastActivity: new Date(Date.now() - 1800000),
    duration: 5400,
    pageViews: 28,
    location: 'London, UK',
    device: 'Safari Mobile',
    status: 'idle'
  },
  {
    id: '3',
    userId: 'user3',
    userName: 'Mike Johnson',
    startTime: new Date(Date.now() - 1800000),
    lastActivity: new Date(Date.now() - 60000),
    duration: 1740,
    pageViews: 8,
    location: 'Tokyo, JP',
    device: 'Firefox Desktop',
    status: 'active'
  }
];

export const securityEvents: SecurityEvent[] = [
  {
    id: '1',
    type: 'failed_login',
    severity: 'medium',
    user: 'unknown@example.com',
    description: 'Multiple failed login attempts detected',
    timestamp: new Date(Date.now() - 1800000),
    ipAddress: '192.168.1.100',
    resolved: false
  },
  {
    id: '2',
    type: 'suspicious_activity',
    severity: 'high',
    user: 'admin@company.com',
    description: 'Unusual data access pattern detected',
    timestamp: new Date(Date.now() - 3600000),
    ipAddress: '10.0.0.50',
    resolved: true
  },
  {
    id: '3',
    type: 'permission_change',
    severity: 'low',
    user: 'hr@company.com',
    description: 'User permissions modified',
    timestamp: new Date(Date.now() - 7200000),
    ipAddress: '192.168.1.25',
    resolved: true
  }
];

export const performanceMetrics: PerformanceMetric[] = [
  {
    id: '1',
    metric: 'Page Load Time',
    value: 1.2,
    unit: 's',
    timestamp: new Date(),
    target: 2.0,
    status: 'good'
  },
  {
    id: '2',
    metric: 'API Response Time',
    value: 450,
    unit: 'ms',
    timestamp: new Date(),
    target: 500,
    status: 'good'
  },
  {
    id: '3',
    metric: 'Error Rate',
    value: 2.1,
    unit: '%',
    timestamp: new Date(),
    target: 1.0,
    status: 'warning'
  },
  {
    id: '4',
    metric: 'Throughput',
    value: 1250,
    unit: 'req/min',
    timestamp: new Date(),
    target: 1000,
    status: 'good'
  }
];

export const realtimeData: ChartData[] = [
  { name: '00:00', value: 120 },
  { name: '00:05', value: 135 },
  { name: '00:10', value: 148 },
  { name: '00:15', value: 162 },
  { name: '00:20', value: 155 },
  { name: '00:25', value: 178 },
  { name: '00:30', value: 190 }
];

export const geographicData: ChartData[] = [
  { name: 'United States', value: 45 },
  { name: 'United Kingdom', value: 25 },
  { name: 'Germany', value: 15 },
  { name: 'Japan', value: 10 },
  { name: 'Others', value: 5 }
];

export const deviceData: ChartData[] = [
  { name: 'Desktop', value: 60 },
  { name: 'Mobile', value: 30 },
  { name: 'Tablet', value: 10 }
]