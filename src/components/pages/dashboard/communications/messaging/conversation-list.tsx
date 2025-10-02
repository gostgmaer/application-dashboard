'use client';

import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Search, Pin, Users, Circle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils/utils';
import { useMessaging } from '@/contexts/messaging-context';
import { Conversation } from '@/types';

interface ConversationListProps {
  onConversationSelect?: () => void;
}

export default function ConversationList({ onConversationSelect }: ConversationListProps) {
  const {
    conversations,
    activeConversation,
    setActiveConversation,
    fetchMessages,
    markAsRead,
    loading
  } = useMessaging();

  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = conversations.filter(conversation =>
    conversation.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConversationClick = async (conversation: Conversation) => {
    setActiveConversation(conversation);
    await fetchMessages(conversation.id);
    markAsRead(conversation.id);
    onConversationSelect?.();
  };

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse flex items-center space-x-3">
            <div className="rounded-full bg-muted h-12 w-12"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Messages</h2>
          <Badge variant="secondary" className="ml-2">
            {conversations.reduce((acc, conv) => acc + conv.unreadCount, 0)} unread
          </Badge>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Conversations */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredConversations.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchQuery ? 'No conversations found' : 'No conversations yet'}
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredConversations.map((conversation) => (
                <ConversationItem
                  key={conversation.id}
                  conversation={conversation}
                  isActive={activeConversation?.id === conversation.id}
                  onClick={() => handleConversationClick(conversation)}
                />
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
}

function ConversationItem({ conversation, isActive, onClick }: ConversationItemProps) {
  const isOnline = conversation.participants.some(p => p.online);

  return (
    <div
      className={cn(
        "flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors",
        "hover:bg-muted/50",
        isActive && "bg-primary/10 border border-primary/20",
        conversation.unreadCount > 0 && "bg-muted/30"
      )}
      onClick={onClick}
    >
      {/* Avatar */}
      <div className="relative">
        <Avatar className="h-12 w-12">
          <AvatarImage src={conversation.avatar} alt={conversation.name} />
          <AvatarFallback>
            {conversation.isGroup ? (
              <Users className="h-6 w-6" />
            ) : (
              conversation.name.slice(0, 2).toUpperCase()
            )}
          </AvatarFallback>
        </Avatar>
        
        {/* Online indicator */}
        {!conversation.isGroup && isOnline && (
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-background rounded-full" />
        )}

        {/* Pin indicator */}
        {conversation.isPinned && (
          <div className="absolute -top-1 -right-1">
            <Pin className="h-3 w-3 text-primary fill-current" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h4 className={cn(
            "font-medium text-sm truncate",
            conversation.unreadCount > 0 && "font-semibold"
          )}>
            {conversation.name}
          </h4>
          
          {conversation.lastMessage && (
            <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
              {formatDistanceToNow(conversation.lastMessage.createdAt, { addSuffix: false })}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground truncate">
            {conversation.lastMessage ? (
              <>
                {conversation.lastMessage.senderId === 'user1' && 'You: '}
                {conversation.lastMessage.content}
              </>
            ) : (
              'No messages yet'
            )}
          </p>

          {conversation.unreadCount > 0 && (
            <Badge variant="destructive" className="ml-2 px-2 py-0 text-xs min-w-[1.25rem] h-5 flex items-center justify-center">
              {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}