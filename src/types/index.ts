export interface User {
  id: string;
  name: string;
  avatar?: string;
  email: string;
  online: boolean;
  lastSeen?: Date;
}

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success' | 'promo';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
  actionLabel?: string;
  groupId?: string;
  userId: string;
}

export interface Conversation {
  id: string;
  name: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  isPinned: boolean;
  isGroup: boolean;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  sender: User;
  content: string;
  type: 'text' | 'image' | 'file' | 'audio' | 'video';
  attachments?: Attachment[];
  replyTo?: string;
  reactions: Reaction[];
  readBy: ReadReceipt[];
  editedAt?: Date;
  createdAt: Date;
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface Reaction {
  emoji: string;
  users: User[];
  count: number;
}

export interface ReadReceipt {
  userId: string;
  readAt: Date;
}

export interface TypingIndicator {
  conversationId: string;
  userId: string;
  userName: string;
}

export interface WebSocketEvent {
  type: 'message:new' | 'message:read' | 'conversation:new' | 'typing:start' | 'typing:stop' | 'notification:new';
  data: any;
}

export interface CallSession {
  id: string;
  conversationId: string;
  initiatorId: string;
  participants: User[];
  type: 'audio' | 'video';
  status: 'initiating' | 'ringing' | 'active' | 'ended' | 'declined';
  startedAt?: Date;
  endedAt?: Date;
  teamsUrl?: string;
}

export interface CallNotification {
  id: string;
  callId: string;
  type: 'incoming_call' | 'missed_call' | 'call_ended';
  from: User;
  conversationId: string;
  callType: 'audio' | 'video';
  createdAt: Date;
}