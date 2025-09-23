'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  User, 
  ShoppingCart, 
  Settings, 
  FileText, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react'

const activities = [
  {
    id: 1,
    user: 'John Doe',
    avatar: '/avatars/john.jpg',
    action: 'Created new order',
    target: '#12345',
    timestamp: '2 minutes ago',
    type: 'order',
    status: 'success',
    icon: ShoppingCart
  },
  {
    id: 2,
    user: 'Jane Smith',
    avatar: '/avatars/jane.jpg',
    action: 'Updated user profile',
    target: 'Profile Settings',
    timestamp: '5 minutes ago',
    type: 'user',
    status: 'success',
    icon: User
  },
  {
    id: 3,
    user: 'System',
    avatar: null,
    action: 'Failed payment processing',
    target: 'Payment #7890',
    timestamp: '10 minutes ago',
    type: 'error',
    status: 'error',
    icon: AlertTriangle
  },
  {
    id: 4,
    user: 'Mike Johnson',
    avatar: '/avatars/mike.jpg',
    action: 'Generated monthly report',
    target: 'Analytics Report',
    timestamp: '15 minutes ago',
    type: 'report',
    status: 'success',
    icon: FileText
  },
  {
    id: 5,
    user: 'Sarah Connor',
    avatar: '/avatars/sarah.jpg',
    action: 'Modified system settings',
    target: 'Security Config',
    timestamp: '30 minutes ago',
    type: 'settings',
    status: 'warning',
    icon: Settings
  },
  {
    id: 6,
    user: 'Admin',
    avatar: null,
    action: 'Database backup completed',
    target: 'DB Backup',
    timestamp: '1 hour ago',
    type: 'system',
    status: 'success',
    icon: CheckCircle
  },
  {
    id: 7,
    user: 'Tom Wilson',
    avatar: '/avatars/tom.jpg',
    action: 'Login attempt failed',
    target: 'Security Alert',
    timestamp: '2 hours ago',
    type: 'security',
    status: 'error',
    icon: XCircle
  },
  {
    id: 8,
    user: 'Emma Davis',
    avatar: '/avatars/emma.jpg',
    action: 'Uploaded new product',
    target: 'Product #456',
    timestamp: '3 hours ago',
    type: 'product',
    status: 'success',
    icon: CheckCircle
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'success': return 'bg-green-100 text-green-800'
    case 'error': return 'bg-red-100 text-red-800'
    case 'warning': return 'bg-yellow-100 text-yellow-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getStatusIcon = (status: string, IconComponent: any) => {
  const baseClass = "h-4 w-4"
  switch (status) {
    case 'success': return <IconComponent className={`${baseClass} text-green-600`} />
    case 'error': return <IconComponent className={`${baseClass} text-red-600`} />
    case 'warning': return <IconComponent className={`${baseClass} text-yellow-600`} />
    default: return <IconComponent className={`${baseClass} text-gray-600`} />
  }
}

export default function ActivityLogs() {
  return (
    <Card className="h-96">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Activity Logs
        </CardTitle>
        <CardDescription>Recent system and user activities</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80">
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-150">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={activity.avatar || undefined} alt={activity.user} />
                  <AvatarFallback>
                    {activity.user.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.user}
                    </p>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(activity.status, activity.icon)}
                      <Badge variant="secondary" className={getStatusColor(activity.status)}>
                        {activity.type}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600">
                    {activity.action} <span className="font-medium">{activity.target}</span>
                  </p>
                  
                  <p className="text-xs text-gray-400 mt-1">
                    {activity.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}