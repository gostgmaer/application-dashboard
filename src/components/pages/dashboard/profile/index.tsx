
"use client";

import { useState, useEffect, useMemo } from 'react';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MapPin, Activity, User, Plus, X, CreditCard, Lock, LucideUsersRound, UserCheck2Icon } from 'lucide-react';
// import { cn } from '@/lib/utils';
import { useDebounce } from 'use-debounce';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import authService from '@/helper/services/authServices';

// Zod schema for Address
const AddressSchema = z.object({
  id: z.string().optional(),
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "Zip code is required"),
  country: z.string().min(1, "Country is required"),
  isDefault: z.boolean().default(false),
});

// Zod schema for Change Password
const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(8, "Current password must be at least 8 characters"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmNewPassword: z.string().min(8, "Confirm password must be at least 8 characters"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords must match",
    path: ["confirmNewPassword"],
  });

interface Address extends z.infer<typeof AddressSchema> {}
interface ChangePassword extends z.infer<typeof ChangePasswordSchema> {}

interface Product {
  id: string;
  title: string;
  image?: string;
}

interface PaymentMethod {
  method: 'credit_card' | 'paypal' | 'bank_transfer';
  details?: { cardNumber?: string; expiryDate?: string; holderName?: string };
  isDefault: boolean;
}

interface UserData {
  username: string;
  email: string;
  fullName: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say' | null;
  phoneNumber?: string | null;
  address: Address[];
  favoriteProducts?: Product[];
  profilePicture?: string | null;
  status: 'active' | 'inactive' | 'pending' | 'banned' | 'deleted' | 'archived' | 'draft';
  socialMedia?: { facebook?: string | null; twitter?: string | null; instagram?: string | null; linkedin?: string | null; google?: string | null; pinterest?: string | null };
  preferences?: { newsletter: boolean; notifications: boolean; language: string; currency: string; theme: 'light' | 'dark' };
  interests?: string[];
  lastLogin?: string;
  loyaltyPoints: number;
  referralCode?: string;
  subscriptionStatus: 'active' | 'inactive';
  subscriptionType: 'free' | 'premium' | 'enterprise';
  paymentMethods?: PaymentMethod[];
  shippingPreferences?: { deliveryMethod: 'standard' | 'express'; deliveryInstructions?: string | null; preferredTime?: string | null };
}

interface ActivityLog {
  action: string;
  timestamp: string;
}

interface ProfilePageProps {
  userData: UserData;
  activityLogs?: ActivityLog[];
  otherUsers?: { id: string; username: string; firstName: string; lastName: string; profilePicture?: string }[];
}

export default function Profile({ userData, activityLogs = [], otherUsers = [] }: ProfilePageProps) {
const {data:session} = useSession()
    console.log(userData);
    
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addresses, setAddresses] = useState<Address[]>(userData.address || []);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  const {
    register: registerAddress,
    handleSubmit: handleAddressSubmit,
    reset: resetAddress,
    control: controlAddress,
    formState: { errors: addressErrors, isSubmitting: isAddressSubmitting },
  } = useForm<Address>({
    resolver: zodResolver(AddressSchema),
    defaultValues: { street: '', city: '', state: '', zipCode: '', country: '', isDefault: false },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
  } = useForm<ChangePassword>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmNewPassword: '' },
  });

  useEffect(() => {
    if (editingAddress) {
      resetAddress(editingAddress);
    } else {
      resetAddress({ street: '', city: '', state: '', zipCode: '', country: '', isDefault: false });
    }
  }, [editingAddress, resetAddress]);

  const handleAddressSave = async (data: Address) => {
    setIsLoading(true);
    setError(null);
    try {
      let newAddress:any;
      if (editingAddress && editingAddress.id) {
        // Optimistic update
        setAddresses(addresses.map((addr) => (addr.id === editingAddress.id ? data : addr)));
        await fetch(`/api/addresses/${editingAddress.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        // Placeholder for future notification
      } else {
        // Optimistic update
        const tempId = `temp-${Date.now()}`;
        setAddresses([...addresses, { ...data, id: tempId }]);
        const response = await fetch('/api/addresses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        newAddress = await response.json();
        setAddresses((prev) => prev.map((addr) => (addr.id === tempId ? newAddress : addr)));
        // Placeholder for future notification
      }
      setIsAddressModalOpen(false);
      resetAddress();
    } catch (error) {
      setError('Failed to save address');
      // Revert optimistic update
      if (editingAddress && editingAddress.id) {
        setAddresses(addresses);
      } else {
        setAddresses(addresses.filter((addr) => addr.id !== `temp-${Date.now()}`));
      }
      // Placeholder for future notification
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddressDelete = async (id: string, index: number) => {
    setIsLoading(true);
    setError(null);
    const prevAddresses = [...addresses]; // Store previous state
    try {
      // Optimistic update
      setAddresses(addresses.filter((_, i) => i !== index));
      await fetch(`/api/addresses/${id}`, { method: 'DELETE' });
      // Placeholder for future notification
    } catch (error) {
      setError('Failed to delete address');
      setAddresses(prevAddresses); // Revert to previous state
      // Placeholder for future notification
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (data: ChangePassword) => {
    setIsLoading(true);
    setError(null);
    setPasswordSuccess(null);
    try {
      const response = await authService.changePassword({currentPassword: data.currentPassword,
          newPassword: data.newPassword,},session?.accessToken);
      if (!response.success) throw new Error('Failed to change password');
      setPasswordSuccess('Password changed successfully');
      resetPassword();
      // Placeholder for future notification
    } catch (error) {
      setError('Failed to change password');
      // Placeholder for future notification
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    if (!debouncedSearchTerm) return otherUsers;
    return otherUsers.filter((user) =>
      user.username.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      user.firstName.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [debouncedSearchTerm, otherUsers]);

  const selectedUser = otherUsers.find((user) => user.id === selectedUserId);

  return (
    <div className="w-full  space-y-4">
      <div className=" grid grid-cols-1  gap-8">
        {/* User Profile */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm rounded-xl overflow-hidden">
          <CardHeader className="border-b  hidden border-gray-200 dark:border-gray-700">
           
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <div className="flex  sm:flex-row items-start gap-6 border-b border-spacing-4">
              {userData.profilePicture && (
                <Image
                  src={userData.profilePicture}
                  alt="Profile"
                  className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-full border-2 border-gray-300 dark:border-gray-600 transition-transform hover:scale-105"
                  loading="lazy"
                />
              )}
              <div>
                <h3 className="text-xl sm:text-2xl font-medium">{userData.fullName}</h3>
                {/* <p className="text-gray-600 dark:text-gray-400">{userData.username}</p> */}
                <p className="text-gray-600 dark:text-gray-400">{userData.email}</p>
              </div>
              <div className='ml-auto'>
                <Link
                    href={'/dashboard/profile/edit'}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border bg-background hover:text-accent-foreground h-10 px-4 py-2 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    aria-label="Change password"
                  >
                    <UserCheck2Icon className="w-4 h-4 mr-2" />
                    Update
                  </Link>
              </div>
            </div>
            <div className="flex justify-end">
              <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    aria-label="Change password"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Change Password
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handlePasswordSubmit(handlePasswordChange)} className="space-y-4">
                    {passwordSuccess && <p className="text-green-600 text-sm">{passwordSuccess}</p>}
                    {error && <p className="text-red-600 text-sm">{error}</p>}
                    <div>
                      <Label htmlFor="currentPassword">Current Password *</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        {...registerPassword('currentPassword')}
                        placeholder="Enter current password"
                        className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                        aria-invalid={!!passwordErrors.currentPassword}
                      />
                      {passwordErrors.currentPassword && (
                        <p className="text-red-600 text-sm mt-1">{passwordErrors.currentPassword.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="newPassword">New Password *</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        {...registerPassword('newPassword')}
                        placeholder="Enter new password"
                        className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                        aria-invalid={!!passwordErrors.newPassword}
                      />
                      {passwordErrors.newPassword && (
                        <p className="text-red-600 text-sm mt-1">{passwordErrors.newPassword.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="confirmNewPassword">Confirm New Password *</Label>
                      <Input
                        id="confirmNewPassword"
                        type="password"
                        {...registerPassword('confirmNewPassword')}
                        placeholder="Confirm new password"
                        className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                        aria-invalid={!!passwordErrors.confirmNewPassword}
                      />
                      {passwordErrors.confirmNewPassword && (
                        <p className="text-red-600 text-sm mt-1">{passwordErrors.confirmNewPassword.message}</p>
                      )}
                    </div>
                    <Button
                      type="submit"
                      disabled={isPasswordSubmitting}
                      className="w-full bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-300 disabled:opacity-50"
                    >
                      {isPasswordSubmitting ? 'Changing...' : 'Change Password'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium">Date of Birth</p>
                <p className="text-gray-600 dark:text-gray-400">
                  {userData.dateOfBirth ? new Date(userData.dateOfBirth).toLocaleDateString() : 'Not set'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Gender</p>
                <p className="text-gray-600 dark:text-gray-400">{userData.gender || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Phone Number</p>
                <p className="text-gray-600 dark:text-gray-400">{userData.phoneNumber || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Status</p>
                <p className="text-gray-600 dark:text-gray-400">{userData.status}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Loyalty Points</p>
                <p className="text-gray-600 dark:text-gray-400">{userData.loyaltyPoints}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Referral Code</p>
                <p className="text-gray-600 dark:text-gray-400">{userData.referralCode || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Subscription</p>
                <p className="text-gray-600 dark:text-gray-400">{userData.subscriptionType} ({userData.subscriptionStatus})</p>
              </div>
              <div>
                <p className="text-sm font-medium">Last Login</p>
                <p className="text-gray-600 dark:text-gray-400">
                  {userData.lastLogin ? new Date(userData.lastLogin).toLocaleString() : 'Not set'}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium">Interests</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {userData.interests?.length ? (
                  userData.interests.map((interest, index) => (
                    <Badge
                      key={index}
                      className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors"
                    >
                      {interest}
                    </Badge>
                  ))
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">No interests set</p>
                )}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium">Social Media</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                {Object.entries(userData.socialMedia || {}).map(([platform, url]) => (
                  <p key={platform} className="text-gray-600 dark:text-gray-400">
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}: {url ? (
                      <a href={url} target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-900 dark:hover:text-gray-100">
                        {url}
                      </a>
                    ) : 'Not set'}
                  </p>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium">Preferences</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                <p className="text-gray-600 dark:text-gray-400">Newsletter: {userData.preferences?.newsletter ? 'Subscribed' : 'Unsubscribed'}</p>
                <p className="text-gray-600 dark:text-gray-400">Notifications: {userData.preferences?.notifications ? 'Enabled' : 'Disabled'}</p>
                <p className="text-gray-600 dark:text-gray-400">Language: {userData.preferences?.language || 'en'}</p>
                <p className="text-gray-600 dark:text-gray-400">Currency: {userData.preferences?.currency || 'USD'}</p>
                <p className="text-sm font-medium">Theme: {userData.preferences?.theme || 'light'}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium">Favorite Products</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                {userData.favoriteProducts?.length ? (
                  userData.favoriteProducts.map((product) => (
                    <div key={product.id} className="flex items-center gap-3 p-3 border border-gray-300 dark:border-gray-600 rounded-md">
                      {product.image && (
                        <Image src={product.image} alt={product.title} className="w-12 h-12 object-cover rounded-md" loading="lazy" />
                      )}
                      <p className="text-gray-600 dark:text-gray-400">{product.title}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">No favorite products set</p>
                )}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium">Payment Methods</p>
              <div className="space-y-2 mt-2">
                {userData.paymentMethods?.length ? (
                  userData.paymentMethods.map((method, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-gray-300 dark:border-gray-600 rounded-md">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5" />
                        <p className="text-gray-600 dark:text-gray-400">
                          {method.method.replace('_', ' ').toUpperCase()}
                          {method.details?.cardNumber && ` (**** ${method.details.cardNumber.slice(-4)})`}
                        </p>
                      </div>
                      {method.isDefault && <Badge className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900">Default</Badge>}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">No payment methods set</p>
                )}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium">Shipping Preferences</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                <p className="text-gray-600 dark:text-gray-400">Delivery Method: {userData.shippingPreferences?.deliveryMethod || 'standard'}</p>
                <p className="text-gray-600 dark:text-gray-400">Delivery Instructions: {userData.shippingPreferences?.deliveryInstructions || 'Not set'}</p>
                <p className="text-gray-600 dark:text-gray-400">Preferred Time: {userData.shippingPreferences?.preferredTime || 'Not set'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address Management */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm rounded-xl overflow-hidden">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700">
            <CardTitle className="flex items-center gap-2 text-2xl font-semibold">
              <MapPin className="w-6 h-6" />
              Addresses
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {isLoading && <p className="text-gray-600 dark:text-gray-400">Loading...</p>}
            <div className="space-y-4">
              {addresses.length ? (
                addresses.map((address, index) => (
                  <div
                    key={address.id || index}
                    className="flex items-center justify-between p-4 border border-gray-300 dark:border-gray-600 rounded-md transition-transform hover:scale-[1.01]"
                  >
                    <div>
                      <p className="font-medium">{address.street}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {address.city}, {address.state} {address.zipCode}, {address.country}
                      </p>
                      {address.isDefault && <Badge className="mt-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900">Default</Badge>}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => { setEditingAddress(address); setIsAddressModalOpen(true); }}
                        className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                        aria-label={`Edit address at ${address.street}`}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleAddressDelete(address.id || '', index)}
                        aria-label={`Delete address at ${address.street}`}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 dark:text-gray-400">No addresses set</p>
              )}
              <Button
                onClick={() => { setEditingAddress(null); setIsAddressModalOpen(true); }}
                className="bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-300"
                aria-label="Add new address"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Address
              </Button>
            </div>

            <Dialog open={isAddressModalOpen} onOpenChange={setIsAddressModalOpen}>
              <DialogContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>{editingAddress ? 'Edit Address' : 'Add Address'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddressSubmit(handleAddressSave)} className="space-y-4">
                  <div>
                    <Label htmlFor="street">Street *</Label>
                    <Input
                      id="street"
                      {...registerAddress('street')}
                      placeholder="Enter street"
                      className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                      aria-invalid={!!addressErrors.street}
                    />
                    {addressErrors.street && <p className="text-red-600 text-sm mt-1">{addressErrors.street.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      {...registerAddress('city')}
                      placeholder="Enter city"
                      className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                      aria-invalid={!!addressErrors.city}
                    />
                    {addressErrors.city && <p className="text-red-600 text-sm mt-1">{addressErrors.city.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      {...registerAddress('state')}
                      placeholder="Enter state"
                      className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                      aria-invalid={!!addressErrors.state}
                    />
                    {addressErrors.state && <p className="text-red-600 text-sm mt-1">{addressErrors.state.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="zipCode">Zip Code *</Label>
                    <Input
                      id="zipCode"
                      {...registerAddress('zipCode')}
                      placeholder="Enter zip code"
                      className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                      aria-invalid={!!addressErrors.zipCode}
                    />
                    {addressErrors.zipCode && <p className="text-red-600 text-sm mt-1">{addressErrors.zipCode.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="country">Country *</Label>
                    <Input
                      id="country"
                      {...registerAddress('country')}
                      placeholder="Enter country"
                      className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                      aria-invalid={!!addressErrors.country}
                    />
                    {addressErrors.country && <p className="text-red-600 text-sm mt-1">{addressErrors.country.message}</p>}
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="isDefault">Set as Default</Label>
                    <Controller
                      name="isDefault"
                      control={controlAddress}
                      render={({ field }) => (
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-gray-900 dark:data-[state=checked]:bg-gray-100"
                          aria-label="Set address as default"
                        />
                      )}
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isAddressSubmitting}
                    className="w-full bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-300 disabled:opacity-50"
                  >
                    {isAddressSubmitting ? 'Saving...' : 'Save Address'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Activity Logs */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm rounded-xl overflow-hidden">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700">
            <CardTitle className="flex items-center gap-2 text-2xl font-semibold">
              <Activity className="w-6 h-6" />
              Activity Logs
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {activityLogs.length ? (
              <ul className="space-y-3">
                {activityLogs.slice(0, 5).map((log, index) => (
                  <li
                    key={index}
                    className="p-3 border border-gray-300 dark:border-gray-600 rounded-md transition-transform hover:scale-[1.01]"
                  >
                    <p className="font-medium">{log.action}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{new Date(log.timestamp).toLocaleString()}</p>
                  </li>
                ))}
                {activityLogs.length > 5 && (
                  <Button
                    variant="link"
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                    aria-label="View more activity logs"
                  >
                    View More
                  </Button>
                )}
              </ul>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">No activity logs available.</p>
            )}
          </CardContent>
        </Card>

        {/* Other Users' Profiles */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm rounded-xl overflow-hidden">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700">
            <CardTitle className="flex items-center gap-2 text-2xl font-semibold">
              <User className="w-6 h-6" />
              View Other Users
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="mb-4">
              <Label htmlFor="userSearch">Search Users</Label>
              <Input
                id="userSearch"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by username or name"
                className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                aria-label="Search users"
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="otherUser">Select User</Label>
              <Select value={selectedUserId || ''} onValueChange={setSelectedUserId}>
                <SelectTrigger className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700">
                  <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                  {filteredUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.username} ({user.firstName} {user.lastName})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedUser && (
              <div className="p-4 border border-gray-300 dark:border-gray-600 rounded-md transition-transform hover:scale-[1.01]">
                <div className="flex items-center gap-4">
                  {selectedUser.profilePicture && (
                    <Image
                      src={selectedUser.profilePicture}
                      alt={`${selectedUser.username}'s profile`}
                      className="w-16 h-16 object-cover rounded-full border-2 border-gray-300 dark:border-gray-600"
                      loading="lazy"
                    />
                  )}
                  <div>
                    <p className="font-medium text-lg">{selectedUser.username}</p>
                    <p className="text-gray-600 dark:text-gray-400">{selectedUser.firstName} {selectedUser.lastName}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
