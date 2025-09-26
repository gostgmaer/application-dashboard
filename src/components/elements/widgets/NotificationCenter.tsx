'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Bell, X, Check, AlertTriangle, Info, CheckCircle } from 'lucide-react'

const notifications = [
  {
    id: 1,
    title: 'New Order Received',
    message: 'Order #12345 has been placed by John Doe',
    type: 'info',
    timestamp: '5 minutes ago',
    read: false
  },
  {
    id: 2,
    title: 'Payment Failed',
    message: 'Payment for order #12344 could not be processed',
    type: 'error',
    timestamp: '10 minutes ago',
    read: false
  },
  {
    id: 3,
    title: 'System Update',
    message: 'System maintenance completed successfully',
    type: 'success',
    timestamp: '1 hour ago',
    read: true
  },
  {
    id: 4,
    title: 'Low Stock Alert',
    message: 'Product "iPhone 15" is running low on stock',
    type: 'warning',
    timestamp: '2 hours ago',
    read: false
  },
  {
    id: 5,
    title: 'New User Registration',
    message: 'Sarah Connor has created a new account',
    type: 'info',
    timestamp: '3 hours ago',
    read: true
  },
  {
    id: 6,
    title: 'Backup Completed',
    message: 'Daily database backup has been completed',
    type: 'success',
    timestamp: '4 hours ago',
    read: true
  }
]

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'error':
      return <AlertTriangle className="h-4 w-4 text-red-500" />
    case 'warning':
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />
    case 'success':
      return <CheckCircle className="h-4 w-4 text-green-500" />
    default:
      return <Info className="h-4 w-4 text-blue-500" />
  }
}

const getNotificationColor = (type: string) => {
  switch (type) {
    case 'error':
      return 'border-red-200 bg-red-50'
    case 'warning':
      return 'border-yellow-200 bg-yellow-50'
    case 'success':
      return 'border-green-200 bg-green-50'
    default:
      return 'border-blue-200 bg-blue-50'
  }
}

export default function NotificationCenter() {
  const [notificationList, setNotificationList] = useState(notifications)

  const unreadCount = notificationList.filter(n => !n.read).length

  const markAsRead = (id: number) => {
    setNotificationList(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotificationList(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  const removeNotification = (id: number) => {
    setNotificationList(prev => prev.filter(notification => notification.id !== id))
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs"
            >
              Mark all read
            </Button>
          )}
        </div>
        <CardDescription>Recent system alerts and updates</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64">
          <div className="space-y-3">
            {notificationList.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 rounded-lg border transition-all duration-200 ${
                  !notification.read 
                    ? getNotificationColor(notification.type)
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-600'}`}>
                        {notification.title}
                      </h4>
                      <p className={`text-xs mt-1 ${!notification.read ? 'text-gray-700' : 'text-gray-500'}`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        {notification.timestamp}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1 ml-2">
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead(notification.id)}
                        className="h-6 w-6 p-0"
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeNotification(notification.id)}
                      className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}