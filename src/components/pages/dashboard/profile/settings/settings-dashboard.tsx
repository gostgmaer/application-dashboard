"use client";

import { useEffect, useState } from "react";
import { SettingsLayout } from "./settings-layout";
import { ProfileSettings } from "./profile-settings";
import { SecuritySettings } from "./security-settings";
import { AddressesSettings } from "./addresses-settings";
import { PreferencesSettings } from "./preferences-settings";
import { AdvancedSettings } from "./advanced-settings";

interface SettingsDashboardProps {
  defaultSection?: string;
}

export function SettingsDashboard({
  defaultSection = "profile",
}: SettingsDashboardProps) {
  const [activeSection, setActiveSection] = useState(defaultSection);

  const renderSection = () => {
    switch (activeSection) {
      case "profile":
        return <ProfileSettings  />;
      case "security":
        return <SecuritySettings />;
      case "addresses":
        return <AddressesSettings />;
      case "preferences":
        return <PreferencesSettings />;
      case "advanced":
        return <AdvancedSettings />;
      default:
        return <ProfileSettings />;
    }
  };

  return (
    <>
      <SettingsLayout
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      >
        {renderSection()}
      </SettingsLayout>
    </>
  );
}
