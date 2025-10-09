"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Settings, User, Shield, Activity, Smartphone, MapPin, Share2, Bell, TriangleAlert as AlertTriangle, Palette, Menu, X } from 'lucide-react';

const navigationItems = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
  { id: 'preferences', label: 'Preferences', icon: Bell },
  { id: 'advanced', label: 'Advanced', icon: AlertTriangle },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function SettingsLayout({ children, activeSection, onSectionChange }: SettingsLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebarContent = (
    <>
      <div className="flex items-center gap-3 p-6 border-b">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <Settings className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="font-semibold text-lg">Settings</h2>
          <p className="text-sm text-muted-foreground">Manage your account</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
      
      <ScrollArea className="flex-1 px-4 py-6">
        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-11",
                  isActive && "bg-primary text-primary-foreground shadow-sm"
                )}
                onClick={() => {
                  onSectionChange(item.id);
                  setSidebarOpen(false);
                }}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Button>
            );
          })}
        </nav>
      </ScrollArea>
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Settings className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold">Settings</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-64 min-h-screen bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-r flex-col">
          {sidebarContent}
        </aside>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="lg:hidden fixed inset-0 bg-black/50 z-50"
                onClick={() => setSidebarOpen(false)}
              />
              <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                className="lg:hidden fixed left-0 top-0 w-64 h-full bg-white dark:bg-slate-900 z-50 flex flex-col border-r"
              >
                {sidebarContent}
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          <div className="max-w-4xl mx-auto p-6 lg:p-8">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}