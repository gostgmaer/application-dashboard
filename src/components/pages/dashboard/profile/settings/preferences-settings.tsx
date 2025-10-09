"use client";

import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useUserPreferences } from '@/hooks/use-user-settings';
import { Bell, Mail, Shield, Eye, Loader as Loader2, Volume2, Smartphone, Globe, Lock, Sun, Moon, Monitor, Check } from 'lucide-react';
import { cn } from '@/lib/utils/utils';

const themes = [
  {
    id: 'light',
    label: 'Light',
    icon: Sun,
    description: 'Clean and bright'
  },
  {
    id: 'dark',
    label: 'Dark',
    icon: Moon,
    description: 'Easy on the eyes'
  },
  {
    id: 'system',
    label: 'System',
    icon: Monitor,
    description: 'Follow system'
  }
];

const preferenceGroups = [
  {
    title: 'Appearance',
    description: 'Customize how the interface looks',
    icon: Eye,
    isTheme: true
  },
  {
    title: 'Notifications',
    description: 'Control how and when you receive notifications',
    icon: Bell,
    preferences: [
      {
        key: 'notifications' as const,
        label: 'Push Notifications',
        description: 'Receive notifications about account activity',
        icon: Smartphone
      },
      {
        key: 'securityAlerts' as const,
        label: 'Security Alerts',
        description: 'Get notified about security-related events',
        icon: Shield
      }
    ]
  },
  {
    title: 'Communication',
    description: 'Manage your communication preferences',
    icon: Mail,
    preferences: [
      {
        key: 'newsletter' as const,
        label: 'Newsletter',
        description: 'Receive our weekly newsletter with updates',
        icon: Volume2
      }
    ]
  },
  {
    title: 'Privacy',
    description: 'Control your privacy and data sharing',
    icon: Lock,
    preferences: [
      {
        key: 'privacyMode' as const,
        label: 'Privacy Mode',
        description: 'Enhanced privacy with limited data collection',
        icon: Eye
      }
    ]
  }
];

export function PreferencesSettings() {
  const { preferences, loading, updatePreferences } = useUserPreferences();
  const { theme, setTheme } = useTheme();

  const handleToggle = async (key: keyof typeof preferences, value: boolean) => {
    if (!preferences) return;
    await updatePreferences({ [key]: value });
  };

  if (loading || !preferences) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Preferences</h1>
        <p className="text-muted-foreground mt-2">
          Customize your experience and control your account settings
        </p>
      </div>

      <div className="space-y-6">
        {preferenceGroups.map((group, groupIndex) => {
          const GroupIcon = group.icon;
          
          return (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: groupIndex * 0.1 }}
            >
              <Card className="border-0 shadow-sm bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GroupIcon className="w-5 h-5" />
                    {group.title}
                  </CardTitle>
                  <CardDescription>
                    {group.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {group.isTheme ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {themes.map((themeOption, index) => {
                        const Icon = themeOption.icon;
                        const isSelected = theme === themeOption.id;
                        
                        return (
                          <motion.div
                            key={themeOption.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full h-auto p-4 flex-col gap-3 relative border-2 transition-all hover:scale-[1.02]",
                                isSelected && "border-primary bg-primary/5"
                              )}
                              onClick={() => setTheme(themeOption.id)}
                            >
                              {isSelected && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="absolute -top-2 -right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center"
                                >
                                  <Check className="w-3 h-3 text-primary-foreground" />
                                </motion.div>
                              )}
                              
                              <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                                isSelected 
                                  ? "bg-primary text-primary-foreground" 
                                  : "bg-muted text-muted-foreground"
                              )}>
                                <Icon className="w-4 h-4" />
                              </div>
                              
                              <div className="text-center">
                                <div className="font-medium text-sm">{themeOption.label}</div>
                                <div className="text-xs text-muted-foreground">
                                  {themeOption.description}
                                </div>
                              </div>
                            </Button>
                          </motion.div>
                        );
                      })}
                    </div>
                  ) : (
                  <div className="space-y-6">
                    {group.preferences.map((preference, index) => {
                      const PreferenceIcon = preference.icon;
                      const isEnabled = preferences[preference.key];
                      
                      return (
                        <div key={preference.key}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                                <PreferenceIcon className="w-5 h-5 text-muted-foreground" />
                              </div>
                              <div className="space-y-1">
                                <Label 
                                  htmlFor={preference.key}
                                  className="text-sm font-medium cursor-pointer"
                                >
                                  {preference.label}
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                  {preference.description}
                                </p>
                              </div>
                            </div>
                            <Switch
                              id={preference.key}
                              checked={isEnabled}
                              onCheckedChange={(checked) => handleToggle(preference.key, checked)}
                            />
                          </div>
                          
                          {index < group.preferences.length - 1 && (
                            <Separator className="mt-6" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Privacy Notice */}
      <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50/70 to-emerald-50/70 dark:from-green-950/20 dark:to-emerald-950/20 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
              <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-green-900 dark:text-green-100">
                Your Privacy Matters
              </h3>
              <p className="text-sm text-green-800 dark:text-green-200">
                We respect your privacy and give you complete control over your data. 
                You can change these preferences at any time, and we'll never share 
                your information without your explicit consent.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}