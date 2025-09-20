export interface Email {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  isStarred: boolean;
  isSent: boolean;
  isDraft: boolean;
  isArchived: boolean;
  isSpam: boolean;
  attachments: Attachment[];
  labels: string[];
}

export interface Attachment {
  id: string;
  name: string;
  size: string;
  type: string;
  url: string;
}

export interface Folder {
  id: string;
  name: string;
  count: number;
  icon?: string;
}