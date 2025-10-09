"use client";

import { useState, useEffect } from 'react';
import { userApi } from '@/lib/api';
import { User, Address, Device, ActivityLog, SocialConnection, UserPreferences } from '@/types/user';
import { toast } from 'sonner';

export function useUserData() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await userApi.getUser();
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
      const response = await userApi.updateUser(data);
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

  return { user, loading, updateUser, refetch: fetchUser };
}

export function useAddresses() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await userApi.getAddresses();
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
      const response = await userApi.createAddress(address);
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
      const response = await userApi.updateAddress(id, address);
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
      const response = await userApi.deleteAddress(id);
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

  return { addresses, loading, createAddress, updateAddress, deleteAddress };
}

export function useDevices() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      const response = await userApi.getDevices();
      if (response.success && response.data) {
        setDevices(response.data);
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

  const fetchActivityLogs = async (page: number = 1) => {
    try {
      setActivityLoading(true);
      const response = await userApi.getActivityLogs(page);
      if (response.success && response.data) {
        setActivityLogs(response.data.logs);
        setActivityTotal(response.data.total);
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

  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    try {
      const response = await userApi.getSocialConnections();
      if (response.success && response.data) {
        setConnections(response.data);
      }
    } catch (error) {
      toast.error('Failed to load social connections');
    } finally {
      setLoading(false);
    }
  };

  const connectSocial = async (provider: string) => {
    try {
      const response = await userApi.connectSocial(provider);
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

  const updatePreferences = async (updates: Partial<UserPreferences>) => {
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