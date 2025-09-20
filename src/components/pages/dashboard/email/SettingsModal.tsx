'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { X, User, Bell, Shield, Palette, Mail, Zap } from 'lucide-react';

interface SettingsModalProps {
  onClose: () => void;
}

export function SettingsModal({ onClose }: SettingsModalProps) {
  const [settings, setSettings] = useState({
    displayName: 'John Doe',
    email: 'john.doe@company.com',
    signature: 'Best regards,\nJohn Doe\nSoftware Engineer',
    notifications: {
      desktop: true,
      sound: false,
      email: true,
      mobile: true
    },
    privacy: {
      readReceipts: true,
      onlineStatus: true,
      lastSeen: false
    },
    appearance: {
      theme: 'system',
      density: 'comfortable',
      fontSize: 'medium'
    },
    autoReply: {
      enabled: false,
      message: 'Thank you for your email. I will get back to you soon.'
    }
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Settings</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          <Tabs defaultValue="account" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="account" className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>Account</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center space-x-2">
                <Bell className="w-4 h-4" />
                <span>Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>Privacy</span>
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center space-x-2">
                <Palette className="w-4 h-4" />
                <span>Appearance</span>
              </TabsTrigger>
              <TabsTrigger value="signature" className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>Signature</span>
              </TabsTrigger>
              <TabsTrigger value="automation" className="flex items-center space-x-2">
                <Zap className="w-4 h-4" />
                <span>Automation</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="account" className="space-y-6 mt-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={settings.displayName}
                    onChange={(e) => setSettings(prev => ({ ...prev, displayName: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select defaultValue="utc">
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utc">UTC</SelectItem>
                      <SelectItem value="est">Eastern Time</SelectItem>
                      <SelectItem value="pst">Pacific Time</SelectItem>
                      <SelectItem value="cet">Central European Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6 mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Desktop Notifications</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Show notifications on your desktop</p>
                  </div>
                  <Switch
                    checked={settings.notifications.desktop}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ 
                        ...prev, 
                        notifications: { ...prev.notifications, desktop: checked }
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Sound Notifications</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Play sound for new emails</p>
                  </div>
                  <Switch
                    checked={settings.notifications.sound}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ 
                        ...prev, 
                        notifications: { ...prev.notifications, sound: checked }
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Receive email notifications</p>
                  </div>
                  <Switch
                    checked={settings.notifications.email}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ 
                        ...prev, 
                        notifications: { ...prev.notifications, email: checked }
                      }))
                    }
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="privacy" className="space-y-6 mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Read Receipts</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Send read receipts when you open emails</p>
                  </div>
                  <Switch
                    checked={settings.privacy.readReceipts}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ 
                        ...prev, 
                        privacy: { ...prev.privacy, readReceipts: checked }
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Online Status</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Show when you&apos;re online</p>
                  </div>
                  <Switch
                    checked={settings.privacy.onlineStatus}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ 
                        ...prev, 
                        privacy: { ...prev.privacy, onlineStatus: checked }
                      }))
                    }
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-6 mt-6">
              <div className="space-y-4">
                <div>
                  <Label>Theme</Label>
                  <Select 
                    value={settings.appearance.theme}
                    onValueChange={(value) => 
                      setSettings(prev => ({ 
                        ...prev, 
                        appearance: { ...prev.appearance, theme: value }
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Display Density</Label>
                  <Select 
                    value={settings.appearance.density}
                    onValueChange={(value) => 
                      setSettings(prev => ({ 
                        ...prev, 
                        appearance: { ...prev.appearance, density: value }
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compact">Compact</SelectItem>
                      <SelectItem value="comfortable">Comfortable</SelectItem>
                      <SelectItem value="spacious">Spacious</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Font Size</Label>
                  <Select 
                    value={settings.appearance.fontSize}
                    onValueChange={(value) => 
                      setSettings(prev => ({ 
                        ...prev, 
                        appearance: { ...prev.appearance, fontSize: value }
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="signature" className="space-y-6 mt-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="signature">Email Signature</Label>
                  <Textarea
                    id="signature"
                    rows={6}
                    value={settings.signature}
                    onChange={(e) => setSettings(prev => ({ ...prev, signature: e.target.value }))}
                    placeholder="Enter your email signature..."
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="automation" className="space-y-6 mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto Reply</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Automatically reply to incoming emails</p>
                  </div>
                  <Switch
                    checked={settings.autoReply.enabled}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ 
                        ...prev, 
                        autoReply: { ...prev.autoReply, enabled: checked }
                      }))
                    }
                  />
                </div>
                {settings.autoReply.enabled && (
                  <div>
                    <Label htmlFor="autoReplyMessage">Auto Reply Message</Label>
                    <Textarea
                      id="autoReplyMessage"
                      rows={4}
                      value={settings.autoReply.message}
                      onChange={(e) => 
                        setSettings(prev => ({ 
                          ...prev, 
                          autoReply: { ...prev.autoReply, message: e.target.value }
                        }))
                      }
                    />
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}