'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, Smile, Paperclip, MoveVertical as MoreVertical, Phone, Video, PhoneCall, Video as VideoIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils/utils';
import { useMessaging } from '@/contexts/messaging-context';
import MessageItem from './message-item';
import TypingIndicator from './typing-indicator';
import CallNotification from './call-notification';

interface ChatWindowProps {
  onBackToList: () => void;
}

export default function ChatWindow({ onBackToList }: ChatWindowProps) {
  const {
    activeConversation,
    messages,
    typingUsers,
    activeCall,
    sendMessage,
    initiateCall,
    startTyping,
    stopTyping,
    loading
  } = useMessaging();

  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMessageInput(value);

    if (value.trim() && !isTyping) {
      setIsTyping(true);
      startTyping();
    } else if (!value.trim() && isTyping) {
      setIsTyping(false);
      stopTyping();
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
        stopTyping();
      }
    }, 2000);
  };

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    sendMessage(messageInput);
    setMessageInput('');
    
    if (isTyping) {
      setIsTyping(false);
      stopTyping();
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAudioCall = () => {
    initiateCall('audio');
  };

  const handleVideoCall = () => {
    initiateCall('video');
  };

  if (!activeConversation) return null;

  const otherParticipants = activeConversation.participants.filter(p => p.id !== 'user1');
  const isOnline = otherParticipants.some(p => p.online);

  return (
    <div className="flex flex-col h-full">
      {/* Call Notification Overlay */}
      {activeCall && activeCall.conversationId === activeConversation.id && (
        <CallNotification call={activeCall} />
      )}

      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-muted/30">
        <div className="flex items-center space-x-3">
          {/* Back button for mobile */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onBackToList}
            className="md:hidden"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <Avatar className="h-10 w-10">
            <AvatarImage src={activeConversation.avatar} alt={activeConversation.name} />
            <AvatarFallback>
              {activeConversation.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div>
            <h3 className="font-semibold text-sm">{activeConversation.name}</h3>
            <div className="flex items-center gap-2">
              {isOnline && (
                <>
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-xs text-muted-foreground">Online</span>
                </>
              )}
              {activeConversation.isGroup && (
                <Badge variant="secondary" className="text-xs">
                  {activeConversation.participants.length} members
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleAudioCall}
            disabled={!!activeCall}
          >
            <Phone className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleVideoCall}
            disabled={!!activeCall}
          >
            <Video className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex space-x-3">
                    <div className="rounded-full bg-muted h-8 w-8"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No messages yet. Start the conversation!
              </p>
            </div>
          ) : (
            messages.map((message, index) => (
              <MessageItem
                key={message.id}
                message={message}
                isOwn={message.senderId === 'user1'}
                showAvatar={
                  index === 0 ||
                  messages[index - 1].senderId !== message.senderId
                }
                showTimestamp={
                  index === messages.length - 1 ||
                  messages[index + 1].senderId !== message.senderId ||
                  (new Date(messages[index + 1].createdAt).getTime() - new Date(message.createdAt).getTime()) > 300000
                }
              />
            ))
          )}

          {/* Typing Indicators */}
          {typingUsers
            .filter(t => t.conversationId === activeConversation.id && t.userId !== 'user1')
            .map(typingUser => (
              <TypingIndicator key={typingUser.userId} user={typingUser} />
            ))}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="p-4 border-t bg-muted/30">
        <div className="flex items-end space-x-2">
          <Button variant="ghost" size="sm" className="mb-2">
            <Paperclip className="h-4 w-4" />
          </Button>
          
          <div className="flex-1">
            <Input
              placeholder="Type a message..."
              value={messageInput}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className="min-h-[40px] resize-none"
            />
          </div>

          <Button variant="ghost" size="sm" className="mb-2">
            <Smile className="h-4 w-4" />
          </Button>

          <Button
            onClick={handleSendMessage}
            disabled={!messageInput.trim()}
            className="mb-2"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}