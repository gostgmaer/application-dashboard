'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  Send, 
  Paperclip, 
  Image, 
  Video, 
  Smile,
  Bold,
  Italic,
  Underline,
  Link,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { Email, Attachment } from '@/types/email';

interface ComposeModalProps {
  onClose: () => void;
  onSend: (email: Partial<Email>) => void;
}

export function ComposeModal({ onClose, onSend }: ComposeModalProps) {
  const [to, setTo] = useState('');
  const [cc, setCc] = useState('');
  const [bcc, setBcc] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showCcBcc, setShowCcBcc] = useState(false);

  const handleSend = () => {
    if (!to || !subject || !content) return;

    onSend({
      sender: to,
      subject,
      content,
      attachments,
      labels: []
    });
  };

  const handleFileUpload = (type: 'image' | 'video' | 'file') => {
    // Simulate file upload
    const newAttachment: Attachment = {
      id: Date.now().toString(),
      name: `${type}_${Date.now()}.${type === 'image' ? 'jpg' : type === 'video' ? 'mp4' : 'pdf'}`,
      size: '2.5 MB',
      type: type === 'image' ? 'image/jpeg' : type === 'video' ? 'video/mp4' : 'application/pdf',
      url: '#'
    };
    
    setAttachments([...attachments, newAttachment]);
  };

  const removeAttachment = (id: string) => {
    setAttachments(attachments.filter(att => att.id !== id));
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-t-lg shadow-lg z-50">
        <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
          <span className="font-medium text-gray-900 dark:text-white">
            New Message
          </span>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(false)}
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            New Message
          </h2>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(true)}
            >
              <Minimize2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Form */}
        <div className="flex flex-col h-[600px]">
          {/* Recipients */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 space-y-3">
            <div className="flex items-center space-x-3">
              <label className="w-12 text-sm text-gray-600 dark:text-gray-400">To:</label>
              <Input
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="Enter email addresses..."
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCcBcc(!showCcBcc)}
                className="text-sm"
              >
                Cc/Bcc
              </Button>
            </div>

            {showCcBcc && (
              <>
                <div className="flex items-center space-x-3">
                  <label className="w-12 text-sm text-gray-600 dark:text-gray-400">Cc:</label>
                  <Input
                    value={cc}
                    onChange={(e) => setCc(e.target.value)}
                    placeholder="Carbon copy..."
                    className="flex-1"
                  />
                </div>
                <div className="flex items-center space-x-3">
                  <label className="w-12 text-sm text-gray-600 dark:text-gray-400">Bcc:</label>
                  <Input
                    value={bcc}
                    onChange={(e) => setBcc(e.target.value)}
                    placeholder="Blind carbon copy..."
                    className="flex-1"
                  />
                </div>
              </>
            )}

            <div className="flex items-center space-x-3">
              <label className="w-12 text-sm text-gray-600 dark:text-gray-400">Subject:</label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter subject..."
                className="flex-1"
              />
            </div>
          </div>

          {/* Toolbar */}
          <div className="p-2 border-b border-gray-200 dark:border-gray-700 flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Bold className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Italic className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Underline className="w-4 h-4" />
            </Button>
            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />
            <Button variant="ghost" size="sm">
              <Link className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Smile className="w-4 h-4" />
            </Button>
            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />
            <Button variant="ghost" size="sm" onClick={() => handleFileUpload('file')}>
              <Paperclip className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => handleFileUpload('image')}>
              <Image className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => handleFileUpload('video')}>
              <Video className="w-4 h-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 p-4">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your message..."
              className="w-full h-full resize-none border-none focus:ring-0 text-base"
            />
          </div>

          {/* Attachments */}
          {attachments.length > 0 && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap gap-2">
                {attachments.map((attachment) => (
                  <Badge
                    key={attachment.id}
                    variant="secondary"
                    className="flex items-center space-x-2 px-3 py-1"
                  >
                    <span>{attachment.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-0 h-auto"
                      onClick={() => removeAttachment(attachment.id)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                onClick={handleSend}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={!to || !subject || !content}
              >
                <Send className="w-4 h-4 mr-2" />
                Send
              </Button>
              <Button variant="outline">
                Save Draft
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}