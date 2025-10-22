"use client";

import { useState, useEffect, use } from 'react';
import { userApi } from '@/lib/api';
import { User, Address, Device, ActivityLog, SocialConnection, UserPreferences } from '@/types/user';
import { toast } from 'sonner';
import authService from '@/lib/http/authService';
import { useSession } from 'next-auth/react';
import addressServices from '@/lib/http/address';
import { useSetting } from '@/contexts/SettingContext';

export function useUserData() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<User>({} as User);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession()

  const fetchProfile = async () => {
    try {
      const response = await authService.getProfile(session?.accessToken);
      if (response.success && response.data) {
        setProfile(response.data);
      }
    } catch (error) {
      toast.error('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };



  const fetchUser = async () => {
    try {
      const response = await authService.getAccountSetting(session?.accessToken);
      if (response.success && response.data) {
        setUser(response.data);
      }
    } catch (error) {
      toast.error('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (data: Partial<User>) => {

    try {
      const response = await authService.updateProfile(data, session?.accessToken);
      if (response.success) {
        setUser(prev => prev ? { ...prev, ...data } : null);
        toast.success('Profile updated successfully');
        return true;
      }
      return false;
    } catch (error) {
      toast.error('Failed to update profile');
      return false;
    }
  };
  useEffect(() => {
    if (session) {
      fetchUser();
    }
  }, [session]);

  useEffect(() => {
    if (session) {
      fetchProfile();
    }
  }, [session]);
  return { user, loading, updateUser, refetch: fetchUser, fetchProfile, profile };
}

export function useAddresses() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession()

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await addressServices.getUserAddress(session?.accessToken);
      if (response.success && response.data) {
        setAddresses(response.data);
      }
    } catch (error) {
      toast.error('Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

  const createAddress = async (address: Omit<Address, 'id'>) => {
    try {
      const response = await authService.addAddress(address, session?.accessToken);
      if (response.success) {
        toast.success('Address added successfully');
        fetchAddresses();
        return true;
      }
      return false;
    } catch (error) {
      toast.error('Failed to add address');
      return false;
    }
  };

  const updateAddress = async (id: string, address: Partial<Address>) => {
    try {
      const response = await authService.updateAddress(id, address, session?.accessToken);
      if (response.success) {
        toast.success('Address updated successfully');
        fetchAddresses();
        return true;
      }
      return false;
    } catch (error) {
      toast.error('Failed to update address');
      return false;
    }
  };
  const setDefaultAddress = async (id: string, address: Partial<Address>) => {
    try {
      const response = await authService.setDefaultAddress(id, session?.accessToken);
      if (response.success) {
        toast.success('Address updated successfully');
        fetchAddresses();
        return true;
      }
      return false;
    } catch (error) {
      toast.error('Failed to update address');
      return false;
    }
  };

  const deleteAddress = async (id: string) => {
    try {
      const response = await authService.removeAddress(id, session?.accessToken);
      if (response.success) {
        toast.success('Address deleted successfully');
        fetchAddresses();
        return true;
      }
      return false;
    } catch (error) {
      toast.error('Failed to delete address');
      return false;
    }
  };

  return { addresses, loading, createAddress, updateAddress, deleteAddress, setDefaultAddress };
}

export function useDevices() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession()
  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      const response = await authService.getKnownDevices(session?.accessToken);
      if (response.success && response.data) {
        setDevices(response.data.items);
      }
    } catch (error) {
      toast.error('Failed to load devices');
    } finally {
      setLoading(false);
    }
  };

  const logoutDevice = async (deviceId: string) => {
    try {
      const response = await userApi.logoutDevice(deviceId);
      if (response.success) {
        toast.success('Device logged out successfully');
        fetchDevices();
        return true;
      }
      return false;
    } catch (error) {
      toast.error('Failed to logout device');
      return false;
    }
  };

  const logoutAllDevices = async () => {
    try {
      const response = await userApi.logoutAllDevices();
      if (response.success) {
        toast.success('All devices logged out successfully');
        fetchDevices();
        return true;
      }
      return false;
    } catch (error) {
      toast.error('Failed to logout all devices');
      return false;
    }
  };

  const updateDeviceTrust = async (deviceId: string, trusted: boolean) => {
    try {
      const response = await userApi.updateDeviceTrust(deviceId, trusted);
      if (response.success) {
        setDevices(prev => prev.map(device =>
          device.id === deviceId ? { ...device, trusted } : device
        ));
        toast.success(`Device ${trusted ? 'trusted' : 'untrusted'} successfully`);
        return true;
      }
      return false;
    } catch (error) {
      toast.error('Failed to update device trust');
      return false;
    }
  };

  return { devices, loading, logoutDevice, logoutAllDevices, updateDeviceTrust };
}

export function useActivityLogs() {
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [securityLogs, setSecurityLogs] = useState<ActivityLog[]>([]);
  const [activityTotal, setActivityTotal] = useState(0);
  const [securityTotal, setSecurityTotal] = useState(0);
  const [activityLoading, setActivityLoading] = useState(true);
  const [securityLoading, setSecurityLoading] = useState(true);
  const { data: session } = useSession()



  const fetchActivityLogs = async (page: number = 1) => {
    try {
      setActivityLoading(true);
      const response = await authService.getActivityLogs(session?.accessToken);
      if (response.success && response.data) {
        setActivityLogs(response.data.logs);
        setActivityTotal(response.data.pagination.total);
      }
    } catch (error) {
      toast.error('Failed to load activity logs');
    } finally {
      setActivityLoading(false);
    }
  };

  const fetchSecurityLogs = async (page: number = 1) => {
    try {
      setSecurityLoading(true);
      const response = await userApi.getSecurityLogs(page);
      if (response.success && response.data) {
        setSecurityLogs(response.data.logs);
        setSecurityTotal(response.data.total);
      }
    } catch (error) {
      toast.error('Failed to load security logs');
    } finally {
      setSecurityLoading(false);
    }
  };

  useEffect(() => {
    fetchActivityLogs();
    fetchSecurityLogs();
  }, []);

  return {
    activityLogs,
    securityLogs,
    activityTotal,
    securityTotal,
    activityLoading,
    securityLoading,
    fetchActivityLogs,
    fetchSecurityLogs
  };
}

export function useSocialConnections() {
  const [connections, setConnections] = useState<SocialConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession()
  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    try {
      const response = await authService.getLinkedAccounts(session?.accessToken);
      if (response.success && response.data) {
        setConnections(response.data.linkedAccounts);
      }
    } catch (error) {
      toast.error('Failed to load social connections');
    } finally {
      setLoading(false);
    }
  };

  const connectSocial = async (provider: string) => {
    try {
      // const response = await userApi.connectSocial(provider);
      const response = await authService.linkSocialAccount({ "provider": "google", accessToken: session?.accessToken }, session?.accessToken);
      if (response.success) {
        toast.success(`Connected to ${provider} successfully`);
        fetchConnections();
        return true;
      }
      return false;
    } catch (error) {
      toast.error(`Failed to connect to ${provider}`);
      return false;
    }
  };

  const disconnectSocial = async (provider: string) => {
    try {
      const response = await userApi.disconnectSocial(provider);
      if (response.success) {
        toast.success(`Disconnected from ${provider} successfully`);
        fetchConnections();
        return true;
      }
      return false;
    } catch (error) {
      toast.error(`Failed to disconnect from ${provider}`);
      return false;
    }
  };

  return { connections, loading, connectSocial, disconnectSocial };
}

export function useUserPreferences() {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const response = await userApi.getPreferences();
      if (response.success && response.data) {
        setPreferences(response.data);
      }
    } catch (error) {
      toast.error('Failed to load preferences');
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences: any = async (updates: Partial<UserPreferences>) => {
    try {
      const response = await userApi.updatePreferences(updates);
      if (response.success) {
        setPreferences(prev => prev ? { ...prev, ...updates } : null);
        toast.success('Preferences updated successfully');
        return true;
      }
      return false;
    } catch (error) {
      toast.error('Failed to update preferences');
      return false;
    }
  };

  return { preferences, loading, updatePreferences };
}

export function useProflileSecurity() {
  const { data: session } = useSession()

  const logoutDevice = async (deviceId: string) => {
    try {
      const response = await authService.logout(session?.accessToken);
      if (response.success) {
        toast.success('Device logged out successfully');
        return true;
      }
      return false;
    } catch (error) {
      toast.error('Failed to logout device');
      return false;
    }
  };
  const logoutAllDevices = async () => {
    try {
      const response = await authService.logoutAll(undefined, session?.accessToken);
      if (response.success) {
        toast.success('All devices logged out successfully');
        return true;
      }
      return false;
    } catch (error) {
      toast.error('Failed to logout all devices');
      return false;
    }
  };
  return { logoutAllDevices, logoutDevice };

}

export function useTwoFactorStatus() {
  const { data: session } = useSession()
  const { setLoading } = useSetting();
  const [twoFa, setTwoFa] = useState<any>(null);
  const fetchTwoFA = async () => {
    try {
      const response = await authService.getOTPStatus(session?.accessToken);
      if (response.success && response.data) {
        setTwoFa(response.data);
      }
    } catch (error) {
      toast.error('Failed to load social connections');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.accessToken) {
      fetchTwoFA();
    }
  }, [session]);

  return { fetchTwoFA, twoFa };
}
export function useSecurityLogs() {
  const { data: session } = useSession()
  const { setLoading } = useSetting();
  const [securityLogs, setSecurityLogs] = useState<ActivityLog[]>([]);
  const fetchSecurityLogs = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await authService.getSecurityLogs(session?.accessToken);
      if (response.success && response.data) {
        setSecurityLogs(response.data.logs);
      }
    } catch (error) {
      toast.error('Failed to load security logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.accessToken) {
      fetchSecurityLogs();
    }
  }, [session]);

  return { fetchSecurityLogs, securityLogs };
}
export function useLoginHistory() {
  const { data: session } = useSession()
  const { setLoading } = useSetting();
  const [loginHistory, setLoginHistory] = useState<ActivityLog[]>([]);
  const fetchLoginHistory = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await authService.getLoginHistory(session?.accessToken);
      if (response.success && response.data) {
        setLoginHistory(response.data);
      }
    } catch (error) {
      toast.error('Failed to load security logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.accessToken) {
      fetchLoginHistory();
    }
  }, [session]);

  return { fetchLoginHistory, loginHistory };
}
export function useActiveSessions() {
  const { data: session } = useSession()
  const { setLoading } = useSetting();
  const [activeSessions, setActiveSessions] = useState<ActivityLog[]>([]);

  const fetchActiveSession = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await authService.getAllActiveSessions(session?.accessToken);
      if (response.success && response.data) {
        setActiveSessions(response.data);
      }
    } catch (error) {
      toast.error('Failed to load security logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.accessToken) {
      fetchActiveSession();
    }
  }, [session]);

  return { fetchActiveSession, activeSessions };
}
export function useMyActivity() {
  const { data: session } = useSession()
  const { setLoading } = useSetting();
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

  const fetchActivityLogs = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await authService.getActivityLogs(session?.accessToken);
      if (response.success && response.data) {
        setActivityLogs(response.data.logs);

      }
    } catch (error) {
      toast.error('Failed to load activity logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.accessToken) {
      fetchActivityLogs();
    }
  }, [session]);

  return { fetchActivityLogs, activityLogs };
}