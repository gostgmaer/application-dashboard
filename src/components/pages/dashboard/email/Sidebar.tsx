'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { 
  Inbox, 
  Send, 
  FileText, 
  Trash2, 
  Archive, 
  Star, 
  Plus,
  Menu,
  Sun,
  Moon,
  Settings,
  Mail,
  Users,
  Calendar,
  Bell,
  Tag,
  Filter,
  Zap
} from 'lucide-react';
import { Folder } from '@/types/email';

interface SidebarProps {
  folders: Folder[];
  selectedFolder: Folder;
  onFolderSelect: (folder: Folder) => void;
  onComposeClick: () => void;
  onSettingsClick: () => void;
  onContactsClick: () => void;
  onCalendarClick: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const folderIcons = {
  inbox: Inbox,
  sent: Send,
  drafts: FileText,
  spam: Trash2,
  archive: Archive,
  starred: Star,
  custom: Mail
};

export function Sidebar({ 
  folders, 
  selectedFolder, 
  onFolderSelect, 
  onComposeClick,
  onSettingsClick,
  onContactsClick,
  onCalendarClick,
  collapsed,
  onToggleCollapse
}: SidebarProps) {

  return (
    <div className={`${collapsed ? 'w-16' : 'w-64'} bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleCollapse}
              className="p-2"
            >
              <Menu className="w-4 h-4" />
            </Button>
            {!collapsed && (
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                MailBox
              </h1>
            )}
          </div>
        
        </div>
      </div>

      {/* Compose Button */}
      <div className="p-4">
        <Button 
          onClick={onComposeClick}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          size={collapsed ? "sm" : "default"}
        >
          <Plus className="w-4 h-4" />
          {!collapsed && <span className="ml-2">Compose</span>}
        </Button>
      </div>

      {/* Folder List */}
      <div className="flex-1 overflow-y-auto">
        <nav className="px-2">
          {folders.map((folder) => {
            const IconComponent = folderIcons[folder.id as keyof typeof folderIcons] || Mail;
            return (
              <Button
                key={folder.id}
                variant={selectedFolder.id === folder.id ? "secondary" : "ghost"}
                className={`w-full justify-start mb-1 ${collapsed ? 'px-2' : 'px-3'} ${
                  selectedFolder.id === folder.id 
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                onClick={() => onFolderSelect(folder)}
              >
                <IconComponent className="w-4 h-4" />
                {!collapsed && (
                  <>
                    <span className="ml-3 flex-1 text-left">{folder.name}</span>
                    {folder.count > 0 && (
                      <Badge 
                        variant={folder.id === 'spam' ? 'destructive' : 'secondary'}
                        className="ml-auto"
                      >
                        {folder.count}
                      </Badge>
                    )}
                  </>
                )}
              </Button>
            );
          })}
        </nav>

        {/* Quick Actions */}
        {!collapsed && (
          <div className="px-2 mt-6">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 px-3">
              QUICK ACTIONS
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start mb-1 px-3 text-gray-700 dark:text-gray-300"
              onClick={onContactsClick}
            >
              <Users className="w-4 h-4" />
              <span className="ml-3">Contacts</span>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start mb-1 px-3 text-gray-700 dark:text-gray-300"
              onClick={onCalendarClick}
            >
              <Calendar className="w-4 h-4" />
              <span className="ml-3">Calendar</span>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start mb-1 px-3 text-gray-700 dark:text-gray-300"
            >
              <Tag className="w-4 h-4" />
              <span className="ml-3">Labels</span>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start mb-1 px-3 text-gray-700 dark:text-gray-300"
            >
              <Zap className="w-4 h-4" />
              <span className="ml-3">Automation</span>
            </Button>
          </div>
        )}
      </div>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-gray-600 dark:text-gray-400"
            onClick={onSettingsClick}
          >
            <Settings className="w-4 h-4" />
            <span className="ml-3">Settings</span>
          </Button>
        </div>
      )}
    </div>
  );
}