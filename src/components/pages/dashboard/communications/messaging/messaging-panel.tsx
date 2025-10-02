'use client';

import { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils/utils';
import ConversationList from './conversation-list';
import ChatWindow from './chat-window';
import { useMessaging } from '@/contexts/messaging-context';

export default function MessagingPanel() {
  const { activeConversation } = useMessaging();
  const [isMobileConversationListVisible, setIsMobileConversationListVisible] = useState(!activeConversation);

  return (
    <div className="flex h-[600px] bg-background border rounded-lg overflow-hidden">
      {/* Conversations Sidebar */}
      <div className={cn(
        "w-full md:w-80 border-r bg-muted/30 flex flex-col",
        "md:block",
        activeConversation && "hidden md:block"
      )}>
        <ConversationList 
          onConversationSelect={() => setIsMobileConversationListVisible(false)}
        />
      </div>

      {/* Chat Area */}
      <div className={cn(
        "flex-1 flex flex-col",
        !activeConversation && "hidden md:flex"
      )}>
        {activeConversation ? (
          <ChatWindow 
            onBackToList={() => setIsMobileConversationListVisible(true)}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-center p-8">
            <div>
              <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
              <p className="text-muted-foreground">
                Choose a conversation from the sidebar to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}