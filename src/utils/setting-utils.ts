// utils/setting-utils.ts

export const triggerSettingRefresh = () => {
  // Method 1: Using localStorage event
  localStorage.setItem("refresh_setting", "true");
  
  // Method 2: Using custom event
  window.dispatchEvent(new CustomEvent("refresh_setting"));
};

export const clearSettingCache = () => {
  localStorage.removeItem("app_setting");
};

// Function to call after updating settings in admin
export const onSettingUpdated = () => {
  clearSettingCache();
  triggerSettingRefresh();
};