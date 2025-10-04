'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Conversation, Message, User, TypingIndicator, CallSession } from '@/types';
import { useWebSocket } from './websocket-context';
import { useNotifications } from './notification-context';

interface MessagingContextType {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: Message[];
  typingUsers: TypingIndicator[];
  activeCall: CallSession | null;
  loading: boolean;
  error: string | null;
  setActiveConversation: (conversation: Conversation | null) => void;
  sendMessage: (content: string, type?: 'text' | 'image' | 'file') => void;
  startTyping: () => void;
  stopTyping: () => void;
  markAsRead: (conversationId: string) => void;
  fetchConversations: () => void;
  fetchMessages: (conversationId: string) => void;
  initiateCall: (type: 'audio' | 'video') => Promise<void>;
  answerCall: (callId: string) => Promise<void>;
  declineCall: (callId: string) => Promise<void>;
  endCall: (callId: string) => Promise<void>;
}

const MessagingContext = createContext<MessagingContextType | undefined>(undefined);

export function useMessaging() {
  const context = useContext(MessagingContext);
  if (!context) {
    throw new Error('useMessaging must be used within a MessagingProvider');
  }
  return context;
}

export function MessagingProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingIndicator[]>([]);
  const [activeCall, setActiveCall] = useState<CallSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addEventListener, sendMessage: sendWebSocketMessage } = useWebSocket();
  const { addNotification } = useNotifications();

  useEffect(() => {
    fetchConversations();

    // Listen for real-time updates
    const unsubscribeMessage = addEventListener('message:new', (data: Message) => {
      if (activeConversation && data.conversationId === activeConversation.id) {
        setMessages(prev => [...prev, data]);
      }
      
      // Update conversation list
      setConversations(prev =>
        prev.map(conv =>
          conv.id === data.conversationId
            ? { ...conv, lastMessage: data, unreadCount: conv.unreadCount + 1 }
            : conv
        )
      );
    });

    const unsubscribeTypingStart = addEventListener('typing:start', (data: TypingIndicator) => {
      setTypingUsers(prev => [...prev.filter(t => t.userId !== data.userId), data]);
    });

    const unsubscribeTypingStop = addEventListener('typing:stop', (data: TypingIndicator) => {
      setTypingUsers(prev => prev.filter(t => t.userId !== data.userId));
    });

    const unsubscribeCallIncoming = addEventListener('call:incoming', (data: CallSession) => {
      setActiveCall(data);
      // Add notification for incoming call
      addNotification({
        type: 'info',
        priority: 'urgent',
        title: `Incoming ${data.type} call`,
        message: `${data.participants.find(p => p.id === data.initiatorId)?.name} is calling you`,
        read: false,
        createdAt: new Date(),
        userId: 'user1'
      });
    });

    return () => {
      unsubscribeMessage();
      unsubscribeTypingStart();
      unsubscribeTypingStop();
      unsubscribeCallIncoming();
    };
  }, [addEventListener, activeConversation, addNotification]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: Replace with your actual API endpoint
      // const response = await fetch('/api/conversations', {
      //   headers: {
      //     'Authorization': `Bearer ${getAuthToken()}`
      //   }
      // });
      // const conversations = await response.json();
      // setConversations(conversations);
      
      // Simulate API call for demo
      await new Promise(resolve => setTimeout(resolve, 800));

      const mockUsers: User[] = [
        {
          id: 'user2',
          name: 'John Doe',
          email: 'john@example.com',
          avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2',
          online: true
        },
        {
          id: 'user3',
          name: 'Jane Smith',
          email: 'jane@example.com',
          avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2',
          online: false,
          lastSeen: new Date(Date.now() - 1000 * 60 * 30)
        },
        {
          id: 'user4',
          name: 'Mike Johnson',
          email: 'mike@example.com',
          avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2',
          online: true
        }
      ];

      const mockConversations: Conversation[] = [
        {
          id: 'conv1',
          name: 'John Doe',
          participants: [mockUsers[0]],
          unreadCount: 2,
          isPinned: false,
          isGroup: false,
          avatar: mockUsers[0].avatar,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
          updatedAt: new Date(Date.now() - 1000 * 60 * 15),
          lastMessage: {
            id: 'msg1',
            conversationId: 'conv1',
            senderId: 'user2',
            sender: mockUsers[0],
            content: 'Hey! How are you doing?',
            type: 'text',
            reactions: [],
            readBy: [],
            createdAt: new Date(Date.now() - 1000 * 60 * 15),
            status: 'delivered'
          }
        },
        {
          id: 'conv2',
          name: 'Jane Smith',
          participants: [mockUsers[1]],
          unreadCount: 0,
          isPinned: true,
          isGroup: false,
          avatar: mockUsers[1].avatar,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
          updatedAt: new Date(Date.now() - 1000 * 60 * 60),
          lastMessage: {
            id: 'msg2',
            conversationId: 'conv2',
            senderId: 'user1',
            sender: mockUsers[1],
            content: 'Thanks for your help!',
            type: 'text',
            reactions: [],
            readBy: [],
            createdAt: new Date(Date.now() - 1000 * 60 * 60),
            status: 'read'
          }
        },
        {
          id: 'conv3',
          name: 'Project Team',
          participants: [mockUsers[0], mockUsers[1], mockUsers[2]],
          unreadCount: 5,
          isPinned: false,
          isGroup: true,
          avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
          updatedAt: new Date(Date.now() - 1000 * 60 * 30),
          lastMessage: {
            id: 'msg3',
            conversationId: 'conv3',
            senderId: 'user4',
            sender: mockUsers[2],
            content: 'Great work on the project everyone!',
            type: 'text',
            reactions: [],
            readBy: [],
            createdAt: new Date(Date.now() - 1000 * 60 * 30),
            status: 'delivered'
          }
        }
      ];

      setConversations(mockConversations);
    } catch (err) {
      setError('Failed to fetch conversations');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: Replace with your actual API endpoint
      // const response = await fetch(`/api/messages/${conversationId}`, {
      //   headers: {
      //     'Authorization': `Bearer ${getAuthToken()}`
      //   }
      // });
      // const messages = await response.json();
      // setMessages(messages);
      
      // Simulate API call for demo
      await new Promise(resolve => setTimeout(resolve, 500));

      const mockMessages: Message[] = [
        {
          id: 'msg1',
          conversationId,
          senderId: 'user2',
          sender: {
            id: 'user2',
            name: 'John Doe',
            email: 'john@example.com',
            avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2',
            online: true
          },
          content: 'Hey! How are you doing today?',
          type: 'text',
          reactions: [
            { emoji: '👍', users: [], count: 1 }
          ],
          readBy: [],
          createdAt: new Date(Date.now() - 1000 * 60 * 60),
          status: 'delivered'
        },
        {
          id: 'msg2',
          conversationId,
          senderId: 'user1',
          sender: {
            id: 'user1',
            name: 'You',
            email: 'you@example.com',
            online: true
          },
          content: 'I\'m doing great! Just working on this new messaging system.',
          type: 'text',
          reactions: [],
          readBy: [],
          createdAt: new Date(Date.now() - 1000 * 60 * 45),
          status: 'read'
        },
        {
          id: 'msg3',
          conversationId,
          senderId: 'user2',
          sender: {
            id: 'user2',
            name: 'John Doe',
            email: 'john@example.com',
            avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2',
            online: true
          },
          content: 'That sounds exciting! Can you show me a demo?',
          type: 'text',
          reactions: [],
          readBy: [],
          createdAt: new Date(Date.now() - 1000 * 60 * 30),
          status: 'delivered'
        },
        {
          id: 'msg4',
          conversationId,
          senderId: 'user1',
          sender: {
            id: 'user1',
            name: 'You',
            email: 'you@example.com',
            online: true
          },
          content: 'Sure! It has real-time messaging, notifications, and even typing indicators.',
          type: 'text',
          reactions: [
            { emoji: '🚀', users: [], count: 1 },
            { emoji: '💯', users: [], count: 1 }
          ],
          readBy: [],
          createdAt: new Date(Date.now() - 1000 * 60 * 15),
          status: 'read'
        }
      ];

      setMessages(mockMessages);
    } catch (err) {
      setError('Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = (content: string, type: 'text' | 'image' | 'file' = 'text') => {
    if (!activeConversation || !content.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      conversationId: activeConversation.id,
      senderId: 'user1',
      sender: {
        id: 'user1',
        name: 'You',
        email: 'you@example.com',
        online: true
      },
      content: content.trim(),
      type,
      reactions: [],
      readBy: [],
      createdAt: new Date(),
      status: 'sending'
    };

    setMessages(prev => [...prev, newMessage]);

    // TODO: Replace with your actual API endpoint
    // fetch('/api/messages', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${getAuthToken()}`
    //   },
    //   body: JSON.stringify({
    //     conversationId: activeConversation.id,
    //     content: content.trim(),
    //     type
    //   })
    // });
    // Simulate message sending
    setTimeout(() => {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === newMessage.id ? { ...msg, status: 'sent' } : msg
        )
      );
    }, 1000);

    // Send via WebSocket
    sendWebSocketMessage({
      type: 'message:new',
      data: newMessage
    });
  };

  const startTyping = () => {
    if (!activeConversation) return;
    
    sendWebSocketMessage({
      type: 'typing:start',
      data: {
        conversationId: activeConversation.id,
        userId: 'user1',
        userName: 'You'
      }
    });
  };

  const stopTyping = () => {
    if (!activeConversation) return;
    
    sendWebSocketMessage({
      type: 'typing:stop',
      data: {
        conversationId: activeConversation.id,
        userId: 'user1',
        userName: 'You'
      }
    });
  };

  const markAsRead = (conversationId: string) => {
    // TODO: Replace with your actual API endpoint
    // fetch('/api/messages/read', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${getAuthToken()}`
    //   },
    //   body: JSON.stringify({ conversationId })
    // });
    
    setConversations(prev =>
      prev.map(conv =>
        conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
      )
    );
  };

  const initiateCall = async (type: 'audio' | 'video') => {
    if (!activeConversation) return;

    try {
      const callSession: CallSession = {
        id: Date.now().toString(),
        conversationId: activeConversation.id,
        initiatorId: 'user1',
        participants: [
          { id: 'user1', name: 'You', email: 'you@example.com', online: true },
          ...activeConversation.participants
        ],
        type,
        status: 'initiating',
        startedAt: new Date()
      };

      // TODO: Replace with your actual API endpoint
      const response = await fetch('/api/calls/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // TODO: Add your authentication headers
          // 'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({
          conversationId: activeConversation.id,
          participants: callSession.participants.map(p => p.id),
          type,
          teamsIntegration: true
        })
      });

      if (!response.ok) {
        throw new Error('Failed to initiate call');
      }

      const { teamsUrl, callId } = await response.json();
      callSession.teamsUrl = teamsUrl;
      callSession.id = callId;

      setActiveCall(callSession);

      // Send notification to other participants
      sendWebSocketMessage({
        type: 'call:incoming',
        data: callSession
      });

      // TODO: Your notification service will handle email notifications automatically
      // when the call is initiated through your API

      // Open Teams call in new window/tab
      if (teamsUrl) {
        window.open(teamsUrl, '_blank');
      }

    } catch (error) {
      console.error('Failed to initiate call:', error);
      setError('Failed to initiate call. Please try again.');
    }
  };

  const answerCall = async (callId: string) => {
    try {
      // TODO: Replace with your actual API endpoint
      const response = await fetch(`/api/calls/${callId}/answer`, {
        method: 'POST',
        headers: {
          // TODO: Add your authentication headers
          // 'Authorization': `Bearer ${getAuthToken()}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to answer call');
      }

      const { teamsUrl } = await response.json();
      
      if (activeCall) {
        setActiveCall({
          ...activeCall,
          status: 'active',
          teamsUrl
        });
      }

      // Open Teams call
      if (teamsUrl) {
        window.open(teamsUrl, '_blank');
      }

    } catch (error) {
      console.error('Failed to answer call:', error);
      setError('Failed to answer call. Please try again.');
    }
  };

  const declineCall = async (callId: string) => {
    try {
      // TODO: Replace with your actual API endpoint
      await fetch(`/api/calls/${callId}/decline`, {
        method: 'POST',
        headers: {
          // TODO: Add your authentication headers
          // 'Authorization': `Bearer ${getAuthToken()}`
        }
      });

      setActiveCall(null);

    } catch (error) {
      console.error('Failed to decline call:', error);
    }
  };

  const endCall = async (callId: string) => {
    try {
      // TODO: Replace with your actual API endpoint
      await fetch(`/api/calls/${callId}/end`, {
        method: 'POST',
        headers: {
          // TODO: Add your authentication headers
          // 'Authorization': `Bearer ${getAuthToken()}`
        }
      });

      if (activeCall) {
        setActiveCall({
          ...activeCall,
          status: 'ended',
          endedAt: new Date()
        });
      }

      // Clear call after a short delay
      setTimeout(() => {
        setActiveCall(null);
      }, 2000);

    } catch (error) {
      console.error('Failed to end call:', error);
    }
  };

  return (
    <MessagingContext.Provider
      value={{
        conversations,
        activeConversation,
        messages,
        typingUsers,
        activeCall,
        loading,
        error,
        setActiveConversation,
        sendMessage,
        startTyping,
        stopTyping,
        markAsRead,
        fetchConversations,
        fetchMessages,
        initiateCall,
        answerCall,
        declineCall,
        endCall
      }}
    >
      {children}
    </MessagingContext.Provider>
  );
}