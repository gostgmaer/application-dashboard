"use client";

import { useEffect } from "react";
import { useSetting } from "@/contexts/SettingContext";
import { useNotification } from "@/contexts/NotificationContext";

interface SettingUpdaterProps {
  onSettingUpdate?: (setting: any) => void;
}

export function SettingUpdater({ onSettingUpdate }: SettingUpdaterProps) {
  const { setting, refreshSetting } = useSetting();
  const { socket } = useNotification();

  useEffect(() => {
    if (!socket) return;

    // Listen for setting updates via socket
    const handleSettingUpdate = (data: any) => {
      console.log("Setting updated via socket:", data);
      refreshSetting();
      onSettingUpdate?.(data);
    };

    socket.on("setting_updated", handleSettingUpdate);

    return () => {
      socket.off("setting_updated", handleSettingUpdate);
    };
  }, [socket, refreshSetting, onSettingUpdate]);

  // You can also listen for custom events or intervals
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "refresh_setting" && e.newValue === "true") {
        refreshSetting();
        localStorage.removeItem("refresh_setting");
      }
    };

    window.addEventListener("storage", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [refreshSetting]);

  return null; // This component doesn't render anything
}