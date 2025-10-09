"use client";

import { useState } from 'react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { SettingsLayout } from './settings-layout';
import { ProfileSettings } from './profile-settings';
import { SecuritySettings } from './security-settings';
import { DevicesSettings } from './devices-settings';
import { AddressesSettings } from './addresses-settings';
import { PreferencesSettings } from './preferences-settings';
import { AdvancedSettings } from './advanced-settings';

interface SettingsDashboardProps {
  defaultSection?: string;
}

export function SettingsDashboard({ defaultSection = 'profile' }: SettingsDashboardProps) {
  const [activeSection, setActiveSection] = useState(defaultSection);

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileSettings />;
      case 'security':
        return <SecuritySettings />;
      case 'addresses':
        return <AddressesSettings />;
      case 'preferences':
        return <PreferencesSettings />;
      case 'advanced':
        return <AdvancedSettings />;
      default:
        return <ProfileSettings />;
    }
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SettingsLayout
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      >
        {renderSection()}
      </SettingsLayout>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          className: 'bg-white dark:bg-slate-900 border shadow-lg',
        }}
      />
    </ThemeProvider>
  );
}