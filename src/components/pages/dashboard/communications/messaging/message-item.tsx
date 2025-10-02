'use client';

import { useState } from 'react';
import { formatDistanceToNow, format } from 'date-fns';
import { MoveVertical as MoreVertical, Reply, Trash2, CreditCard as Edit, Check, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils/utils';
import { Message } from '@/types';

interface MessageItemProps {
  message: Message;
  isOwn: boolean;
  showAvatar: boolean;
  showTimestamp: boolean;
}

const statusIcons = {
  sending: null,
  sent: Check,
  delivered: CheckCheck,
  read: CheckCheck,
  failed: null
};

export default function MessageItem({ message, isOwn, showAvatar, showTimestamp }: MessageItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showFullTimestamp, setShowFullTimestamp] = useState(false);

  const StatusIcon = statusIcons[message.status];

  return (
    <div
      className={cn(
        "flex gap-3 group",
        isOwn && "flex-row-reverse"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Avatar */}
      <div className={cn("w-8", !showAvatar && "invisible")}>
        {!isOwn && (
          <Avatar className="h-8 w-8">
            <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
            <AvatarFallback className="text-xs">
              {message.sender.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}
      </div>

      {/* Message Content */}
      <div className={cn("flex-1 max-w-xs md:max-w-md lg:max-w-lg", isOwn && "flex flex-col items-end")}>
        {/* Sender name (for group chats) */}
        {!isOwn && showAvatar && (
          <span className="text-xs text-muted-foreground mb-1 ml-1">
            {message.sender.name}
          </span>
        )}

        <div
          className={cn(
            "relative px-4 py-2 rounded-2xl break-words",
            isOwn
              ? "bg-primary text-primary-foreground rounded-br-md"
              : "bg-muted rounded-bl-md"
          )}
        >
          {/* Message content */}
          <p className="text-sm">{message.content}</p>

          {/* Reactions */}
          {message.reactions.length > 0 && (
            <div className="flex items-center gap-1 mt-2 flex-wrap">
              {message.reactions.map((reaction, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs px-2 py-0 h-5 cursor-pointer hover:bg-secondary/80"
                >
                  {reaction.emoji} {reaction.count}
                </Badge>
              ))}
            </div>
          )}

          {/* Message actions */}
          <div
            className={cn(
              "absolute top-0 -right-12 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity",
              isOwn && "-left-12 right-auto"
            )}
          >
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Reply className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <MoreVertical className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Timestamp and status */}
        {showTimestamp && (
          <div
            className={cn(
              "flex items-center gap-1 mt-1 text-xs text-muted-foreground",
              isOwn && "flex-row-reverse"
            )}
          >
            <span
              className="cursor-pointer"
              onClick={() => setShowFullTimestamp(!showFullTimestamp)}
            >
              {showFullTimestamp
                ? format(message.createdAt, 'MMM d, yyyy HH:mm')
                : formatDistanceToNow(message.createdAt, { addSuffix: true })
              }
            </span>
            
            {isOwn && StatusIcon && (
              <StatusIcon
                className={cn(
                  "h-3 w-3",
                  message.status === 'read' && "text-blue-500",
                  message.status === 'delivered' && "text-muted-foreground"
                )}
              />
            )}

            {message.editedAt && (
              <span className="text-muted-foreground">(edited)</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}