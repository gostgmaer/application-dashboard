"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import settingServices from "@/lib/http/settngsServices";
import { sitekey } from "@/config/setting";

// Define the setting type based on your data structure
interface Setting {
  siteName?: string;
  name?: string;
  seo?: {
    keywords?: string[];
  };
  siteLocale?: string;
  branding?: {
    themeColor?: string;
    logo?: string;
    favicon?: string;
  };
  contactInfo?: {
    email?: string;
    phone?: string;
  };
  siteTimezone?: string;
  // Add other setting properties as needed
}

interface SettingContextType {
  setting: Setting | null;
  loading: boolean;
  error: string | null;
  refreshSetting: () => Promise<void>;
}

const SettingContext = createContext<SettingContextType | undefined>(undefined);

interface SettingProviderProps {
  children: ReactNode;
}

export function SettingProvider({ children }: SettingProviderProps) {
  const [setting, setSetting] = useState<Setting | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSetting = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const settingResponse = await settingServices.getBySiteKey(sitekey as string);
      
      if (settingResponse?.success && settingResponse?.data) {
        setSetting(settingResponse.data);
        
        // Store in localStorage for persistence across refreshes
        localStorage.setItem("app_setting", JSON.stringify(settingResponse.data));
      } else {
        throw new Error("Failed to fetch setting data");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      console.error("Error fetching setting:", err);
      
      // Try to load from localStorage as fallback
      const cachedSetting = localStorage.getItem("app_setting");
      if (cachedSetting) {
        try {
          setSetting(JSON.parse(cachedSetting));
        } catch (parseError) {
          console.error("Error parsing cached setting:", parseError);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const refreshSetting = async () => {
    await fetchSetting();
  };

  useEffect(() => {
    // Check if setting is already cached
    const cachedSetting = localStorage.getItem("app_setting");
    if (cachedSetting) {
      try {
        setSetting(JSON.parse(cachedSetting));
        setLoading(false);
      } catch (parseError) {
        console.error("Error parsing cached setting:", parseError);
      }
    }
    
    // Always fetch fresh data on mount
    fetchSetting();
  }, []);

  const contextValue: SettingContextType = {
    setting,
    loading,
    error,
    refreshSetting,
  };

  return (
    <SettingContext.Provider value={contextValue}>
      {children}
    </SettingContext.Provider>
  );
}

export function useSetting() {
  const context = useContext(SettingContext);
  if (context === undefined) {
    throw new Error("useSetting must be used within a SettingProvider");
  }
  return context;
}