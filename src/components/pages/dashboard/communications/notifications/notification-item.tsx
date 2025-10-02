'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { CircleCheck as CheckCircle, TriangleAlert as AlertTriangle, Circle as XCircle, Info, Tag, ExternalLink, Trash2, Circle, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils/utils';
import { useNotifications } from '@/contexts/notification-context';
import { Notification } from '@/types';

interface NotificationItemProps {
  notification: Notification;
}

const typeIcons = {
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
  info: Info,
  promo: Tag
};

const typeColors = {
  success: 'text-green-600 bg-green-50 dark:bg-green-900/20',
  warning: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20',
  error: 'text-red-600 bg-red-50 dark:bg-red-900/20',
  info: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
  promo: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20'
};

const priorityColors = {
  urgent: 'bg-red-500',
  high: 'bg-orange-500',
  medium: 'bg-yellow-500',
  low: 'bg-green-500'
};

export default function NotificationItem({ notification }: NotificationItemProps) {
  const { markAsRead, deleteNotification } = useNotifications();
  const [isHovered, setIsHovered] = useState(false);

  const IconComponent = typeIcons[notification.type];

  const handleMarkAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    markAsRead(notification.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNotification(notification.id);
  };

  const handleClick = () => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    if (notification.actionUrl) {
      // In a real app, this would navigate to the URL
      console.log('Navigate to:', notification.actionUrl);
    }
  };

  return (
    <div
      className={cn(
        "group relative flex items-start space-x-4 p-4 rounded-lg border transition-all duration-200 cursor-pointer",
        notification.read 
          ? "bg-background hover:bg-muted/50" 
          : "bg-muted/30 border-l-4 border-l-primary hover:bg-muted/50",
        "hover:shadow-md"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Priority Indicator */}
      <div
        className={cn(
          "w-1 h-full absolute left-0 top-0 rounded-l-lg",
          priorityColors[notification.priority]
        )}
      />

      {/* Type Icon */}
      <div className={cn("flex-shrink-0 p-2 rounded-full", typeColors[notification.type])}>
        <IconComponent className="h-4 w-4" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h4 className={cn(
              "font-medium text-sm mb-1",
              !notification.read && "font-semibold"
            )}>
              {notification.title}
            </h4>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {notification.message}
            </p>
          </div>

          {/* Actions */}
          <div className={cn(
            "flex items-center gap-1 transition-opacity duration-200",
            isHovered ? "opacity-100" : "opacity-0"
          )}>
            {!notification.read && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAsRead}
                className="h-8 w-8 p-0"
                title="Mark as read"
              >
                <Check className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
              title="Delete notification"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {notification.type}
            </Badge>
            <Badge variant="outline" className="text-xs capitalize">
              {notification.priority}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
            </span>
          </div>

          {notification.actionUrl && notification.actionLabel && (
            <Button variant="link" size="sm" className="h-auto p-0 text-xs">
              {notification.actionLabel}
              <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
          )}
        </div>
      </div>

      {/* Unread Indicator */}
      {!notification.read && (
        <div className="flex-shrink-0">
          <div className="w-2 h-2 bg-primary rounded-full" />
        </div>
      )}
    </div>
  );
}