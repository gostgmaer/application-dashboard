// hooks/useEnhancedSession.ts
import { useSession } from "next-auth/react";
import { useState, useCallback, useEffect } from "react";

interface SessionUpdateData {
  "2fa_verified"?: boolean;
  accessToken?: string;
  refreshToken?: string;
  accessTokenExpires?: string | number;
  role?: string;
  [key: string]: any;
}

interface EnhancedSessionReturn {
  session: any;
  status: "loading" | "authenticated" | "unauthenticated";
  update: (data: SessionUpdateData) => Promise<void>;
  isUpdating: boolean;
  updateError: string | null;
}

export function useEnhancedSession(): EnhancedSessionReturn {
  const { data: session, status, update: nextAuthUpdate } = useSession();
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const update = useCallback(async (data: SessionUpdateData) => {
    setIsUpdating(true);
    setUpdateError(null);

    try {
      console.log("🔄 Enhanced session update started:", data);
      
      // Validate required data
      if (data["2fa_verified"] && !data.accessToken) {
        throw new Error("Access token is required when 2FA is verified");
      }

      // Ensure proper data format
      const updatePayload = {
        ...data,
        // Convert string dates to numbers if needed
        accessTokenExpires: typeof data.accessTokenExpires === 'string' 
          ? Date.parse(data.accessTokenExpires)
          : data.accessTokenExpires,
      };

      console.log("📋 Formatted update payload:", {
        "2fa_verified": updatePayload["2fa_verified"],
        hasAccessToken: !!updatePayload.accessToken,
        hasRefreshToken: !!updatePayload.refreshToken,
        accessTokenExpires: updatePayload.accessTokenExpires ? new Date(updatePayload.accessTokenExpires as number) : undefined,
      });

      // Call NextAuth update
      const result = await nextAuthUpdate(updatePayload);
      
      if (!result) {
        throw new Error("Failed to update session");
      }

      console.log("✅ Enhanced session update completed successfully");
      
    } catch (error) {
      console.error("❌ Enhanced session update failed:", error);
      setUpdateError(error instanceof Error ? error.message : "Failed to update session");
      throw error;
    } finally {
      setIsUpdating(false);
    }
  }, [nextAuthUpdate]);

  // Clear error when session changes
  useEffect(() => {
    if (updateError) {
      setUpdateError(null);
    }
  }, [session,updateError]);

  return {
    session,
    status,
    update,
    isUpdating,
    updateError,
  };
}