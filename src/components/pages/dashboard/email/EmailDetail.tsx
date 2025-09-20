'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { 
  ArrowLeft, 
  Reply, 
  ReplyAll, 
  Forward, 
  Archive, 
  Trash2, 
  Star,
  MoreHorizontal,
  Download,
  Eye,
  Edit
} from 'lucide-react';
import { Email } from '@/types/email';

interface EmailDetailProps {
  email: Email;
  onClose: () => void;
  onReply: () => void;
  onDelete: () => void;
  onArchive: () => void;
}

export function EmailDetail({ email, onClose, onReply, onDelete, onArchive }: EmailDetailProps) {
  const [isStarred, setIsStarred] = useState(email.isStarred);
  const [showFullHeaders, setShowFullHeaders] = useState(false);

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

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsStarred(!isStarred)}
            >
              <Star className={`w-4 h-4 ${isStarred ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} />
            </Button>
            <Button variant="ghost" size="sm" onClick={onArchive}>
              <Archive className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onDelete}>
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Subject */}
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {email.subject}
        </h1>

        {/* Sender Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium ${getAvatarColor(email.sender)}`}>
              {getAvatarInitials(email.sender)}
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                {email.sender.split('@')[0]}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {email.sender}
              </div>
            </div>
          </div>
          
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {format(new Date(email.timestamp), 'PPP p')}
          </div>
        </div>

        {/* Email Headers Toggle */}
        <div className="mt-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFullHeaders(!showFullHeaders)}
            className="text-xs text-gray-500 dark:text-gray-400"
          >
            {showFullHeaders ? 'Hide' : 'Show'} details
          </Button>
        </div>

        {/* Full Headers */}
        {showFullHeaders && (
          <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-xs">
            <div className="space-y-1">
              <div><span className="font-medium">From:</span> {email.sender}</div>
              <div><span className="font-medium">To:</span> you@company.com</div>
              <div><span className="font-medium">Date:</span> {format(new Date(email.timestamp), 'PPP p')}</div>
              <div><span className="font-medium">Subject:</span> {email.subject}</div>
              <div><span className="font-medium">Message-ID:</span> &lt;{email.id}@mailserver.com&gt;</div>
            </div>
          </div>
        )}
        {/* Labels */}
        {email.labels.length > 0 && (
          <div className="flex items-center space-x-2 mt-3">
            {email.labels.map((label, index) => (
              <Badge key={index} variant="secondary">
                {label}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="prose dark:prose-invert max-w-none">
          <div className="text-gray-900 dark:text-white whitespace-pre-wrap">
            {email.content}
          </div>
        </div>

        {/* Attachments */}
        {email.attachments.length > 0 && (
          <div className="mt-8">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Attachments ({email.attachments.length})
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {email.attachments.map((attachment, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded flex items-center justify-center">
                      {attachment.type.includes('image') ? (
                        <Eye className="w-4 h-4 text-blue-600" />
                      ) : attachment.type.includes('video') ? (
                        <Edit className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Download className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {attachment.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {attachment.size} • {attachment.type}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center space-x-3">
          <Button onClick={onReply} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Reply className="w-4 h-4 mr-2" />
            Reply
          </Button>
          <Button variant="outline">
            <ReplyAll className="w-4 h-4 mr-2" />
            Reply All
          </Button>
          <Button variant="outline">
            <Forward className="w-4 h-4 mr-2" />
            Forward
          </Button>
        </div>
      </div>
    </div>
  );
}