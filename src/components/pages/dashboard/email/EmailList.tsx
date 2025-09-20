'use client';

import React from 'react';
import { format } from 'date-fns';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Star, Paperclip, Clock, AlertCircle } from 'lucide-react';
import { Email } from '@/types/email';

interface EmailListProps {
  emails: Email[];
  selectedEmail: Email | null;
  onEmailSelect: (email: Email) => void;
  selectedEmails: string[];
  onEmailSelectionChange: (selectedIds: string[]) => void;
}

export function EmailList({ 
  emails, 
  selectedEmail, 
  onEmailSelect,
  selectedEmails,
  onEmailSelectionChange
}: EmailListProps) {
  const getAvatarInitials = (email: string) => {
    return email.split('@')[0].substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (email: string) => {
    const colors = [
      'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
    ];
    const index = email.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const handleEmailSelection = (emailId: string, checked: boolean) => {
    if (checked) {
      onEmailSelectionChange([...selectedEmails, emailId]);
    } else {
      onEmailSelectionChange(selectedEmails.filter(id => id !== emailId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onEmailSelectionChange(emails.map(email => email.id));
    } else {
      onEmailSelectionChange([]);
    }
  };

  const getPriorityIcon = (email: Email) => {
    if (email.labels.includes('urgent')) {
      return <AlertCircle className="w-3 h-3 text-red-500" />;
    }
    if (email.labels.includes('important')) {
      return <Clock className="w-3 h-3 text-orange-500" />;
    }
    return null;
  };
  if (emails.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
        <div className="text-center">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-lg">No emails found</p>
          <p className="text-sm">Try adjusting your search or filters</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Select All Header */}
      {emails.length > 0 && (
        <div className="p-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center space-x-3">
            <Checkbox
              checked={selectedEmails.length === emails.length}
              onCheckedChange={handleSelectAll}
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {selectedEmails.length > 0 ? `${selectedEmails.length} selected` : 'Select all'}
            </span>
          </div>
        </div>
      )}

      {emails.map((email) => (
        <div
          key={email.id}
          className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors ${
            selectedEmail?.id === email.id ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-500' : ''
          } ${!email.isRead ? 'bg-white dark:bg-gray-900 font-medium' : 'bg-gray-50 dark:bg-gray-800'}`}
        >
          <div className="flex items-start space-x-3" onClick={() => onEmailSelect(email)}>
            {/* Checkbox */}
            <div onClick={(e) => e.stopPropagation()}>
              <Checkbox
                checked={selectedEmails.includes(email.id)}
                onCheckedChange={(checked) => handleEmailSelection(email.id, checked as boolean)}
              />
            </div>

            {/* Avatar */}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium ${getAvatarColor(email.sender)}`}>
              {getAvatarInitials(email.sender)}
            </div>

            {/* Email Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2">
                  <span className={`text-sm ${!email.isRead ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                    {email.sender.split('@')[0]}
                  </span>
                  {getPriorityIcon(email)}
                  {email.labels.map((label, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {label}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center space-x-1">
                  {email.attachments.length > 0 && (
                    <Paperclip className="w-3 h-3 text-gray-400" />
                  )}
                  {email.isStarred && (
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                  )}
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {format(new Date(email.timestamp), 'MMM dd')}
                  </span>
                </div>
              </div>
              
              <div className={`text-sm mb-1 ${!email.isRead ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-700 dark:text-gray-300'}`}>
                {email.subject}
              </div>
              
              <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {email.preview}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}