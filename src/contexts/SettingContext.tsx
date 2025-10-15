"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import settingServices from "@/lib/http/settngsServices";
import { sitekey } from "@/config/setting";

interface Setting {
  siteName?: string;
  name?: string;
  seo?: { keywords?: string[] };
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
}

interface SettingContextType {
  setting: Setting | null;
  loading: boolean;
  error: string | null;
  refreshSetting: () => Promise<void>;
  updateLocalSetting: (newSetting: Partial<Setting>) => void;
}

const SettingContext = createContext<SettingContextType | undefined>(undefined);

interface SettingProviderProps {
  children: ReactNode;
}

export function SettingProvider({ children }: SettingProviderProps) {
  const [setting, setSetting] = useState<Setting | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /** Fetch setting from backend */
  const fetchSetting = async () => {
    try {
      setLoading(true);
      setError(null);

      const settingResponse = await settingServices.getBySiteKey(
        sitekey as string
      );

      if (settingResponse?.success && settingResponse?.data) {
        setSetting(settingResponse.data);
        localStorage.setItem(
          "app_setting",
          JSON.stringify(settingResponse.data)
        );
      } else {
        throw new Error("Failed to fetch setting data");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      console.error("Error fetching setting:", err);
    } finally {
      setLoading(false);
    }
  };

  /** Expose manual update function for local setting changes */
  const updateLocalSetting = (newSetting: Partial<Setting>) => {
    setSetting((prev) => {
      const updated = { ...prev, ...newSetting };
      localStorage.setItem("app_setting", JSON.stringify(updated));
      return updated;
    });
  };

  /** Refresh setting manually from API */
  const refreshSetting = async () => {
    await fetchSetting();
  };

  /** Load from localStorage first, then fetch only if empty */
  useEffect(() => {
    const cachedSetting = localStorage.getItem("app_setting");

    if (cachedSetting) {
      try {
        const parsed = JSON.parse(cachedSetting);
        setSetting(parsed);
        setLoading(false);
      } catch (parseError) {
        console.error("Error parsing cached setting:", parseError);
        // fallback to fresh fetch if parsing fails
        fetchSetting();
      }
    } else {
      fetchSetting();
    }
  }, []);

  const contextValue: SettingContextType = {
    setting,
    loading,
    error,
    refreshSetting,
    updateLocalSetting,
  };

  return (
    <SettingContext.Provider value={contextValue}>
      {children}
    </SettingContext.Provider>
  );
}

export function useSetting() {
  const context = useContext(SettingContext);
  if (!context) {
    throw new Error("useSetting must be used within a SettingProvider");
  }
  return context;
}
