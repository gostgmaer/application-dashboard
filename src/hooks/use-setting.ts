"use client";

import { useEffect } from "react";
import { useSetting } from "@/contexts/SettingContext";

// Custom hook for using settings with side effects
export function useSettingWithEffects() {
  const { setting, loading, error, refreshSetting } = useSetting();

  useEffect(() => {
    if (setting?.branding?.themeColor) {
      // Update CSS custom property for theme color
      document.documentElement.style.setProperty(
        "--theme-color", 
        setting.branding.themeColor
      );
    }

    if (setting?.siteName) {
      // Update document title dynamically
      document.title = setting.siteName;
    }

    if (setting?.branding?.favicon) {
      // Update favicon dynamically
      const faviconLink = document.querySelector("link[rel*=\"icon\"]") as HTMLLinkElement;
      if (faviconLink) {
        faviconLink.href = setting.branding.favicon;
      }
    }
  }, [setting]);

  return {
    setting,
    loading,
    error,
    refreshSetting,
  };
}