
"use client";

import { useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, X, Upload, Save } from 'lucide-react';
import Image from 'next/image';

// Zod schemas for nested objects
const PaymentMethodSchema = z.object({
  method: z.enum(['credit_card', 'paypal', 'bank_transfer']),
  details: z.object({
    cardNumber: z.string().optional(),
    expiryDate: z.string().optional(),
    holderName: z.string().optional(),
  }).optional(),
  isDefault: z.boolean().default(false),
});

const UserDataSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(30, "Username cannot exceed 30 characters").trim(),
  socialID: z.string().nullable().default(null),
  email: z.string().email("Invalid email address").toLowerCase(),
  hash_password: z.string().optional(),
  firstName: z.string().min(1, "First name is required").trim(),
  lastName: z.string().min(1, "Last name is required").trim(),
  dateOfBirth: z.string().optional(), // String in form, convert to Date
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']).nullable().default(null),
  phoneNumber: z.string().regex(/^[0-9]{10}$/, "Phone number must be 10 digits").nullable().default(null),
  address: z.array(z.string()).optional(), // String array, convert to ObjectIds
  orders: z.array(z.string()).optional(), // String array, convert to ObjectIds
  favoriteProducts: z.array(z.string()).optional(), // String array, convert to ObjectIds
  profilePicture: z.string().url("Profile picture must be a valid URL").nullable().default(null),
  resetToken: z.string().nullable().default(null),
  resetTokenExpiration: z.string().optional(), // String in form, convert to Date
  session: z.array(z.record(z.unknown())).optional(),
  created_by: z.string().optional(), // String in form, convert to ObjectId
  updated_by: z.string().optional(), // String in form, convert to ObjectId
  status: z.enum(['active', 'inactive', 'pending', 'banned', 'deleted', 'archived', 'draft']).default('draft'),
  created_user_id: z.string().nullable().default(null),
  updated_user_id: z.string().nullable().default(null),
  confirmToken: z.string().nullable().default(null),
  role: z.string().optional(), // String in form, convert to ObjectId
  isVerified: z.boolean().default(false),
  tokens: z.array(z.object({ token: z.string() })).optional(),
  socialMedia: z.object({
    facebook: z.string().nullable().default(null),
    twitter: z.string().nullable().default(null),
    instagram: z.string().nullable().default(null),
    linkedin: z.string().nullable().default(null),
    google: z.string().nullable().default(null),
    pinterest: z.string().nullable().default(null),
  }).optional(),
  preferences: z.object({
    newsletter: z.boolean().default(false),
    notifications: z.boolean().default(true),
    language: z.string().default('en'),
    currency: z.string().default('USD'),
    theme: z.enum(['light', 'dark']).default('light'),
  }).optional(),
  interests: z.array(z.string()).optional(),
  lastLogin: z.string().optional(), // String in form, convert to Date
  loyaltyPoints: z.number().int().min(0).default(0),
  referralCode: z.string().optional(),
  referredBy: z.string().optional(), // String in form, convert to ObjectId
  shoppingCart: z.string().optional(), // String in form, convert to ObjectId
  wishList: z.string().optional(), // String in form, convert to ObjectId
  paymentMethods: z.array(PaymentMethodSchema).optional(),
  shippingPreferences: z.object({
    deliveryMethod: z.enum(['standard', 'express']).default('standard'),
    deliveryInstructions: z.string().nullable().default(null),
    preferredTime: z.string().nullable().default(null),
  }).optional(),
  subscriptionStatus: z.enum(['active', 'inactive']).default('inactive'),
  subscriptionType: z.enum(['free', 'premium', 'enterprise']).default('free'),
});

interface UserData extends z.infer<typeof UserDataSchema> {}

type FieldArrayNames = 'address' | 'orders' | 'favoriteProducts' | 'interests' | 'paymentMethods' | 'tokens';

interface ProfileProps {
  data?: Partial<UserData>;
  onSubmit?: (data: UserData) => void;
}

export default function Profile({ data, onSubmit }: ProfileProps) {
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [newInterest, setNewInterest] = useState('');

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserData>({
    resolver: zodResolver(UserDataSchema),
    defaultValues: {
      username: '',
      email: '',
      firstName: '',
      lastName: '',
      status: 'draft',
      isVerified: false,
      loyaltyPoints: 0,
      subscriptionStatus: 'inactive',
      subscriptionType: 'free',
      preferences: { newsletter: false, notifications: true, language: 'en', currency: 'USD', theme: 'light' },
      socialMedia: { facebook: null, twitter: null, instagram: null, linkedin: null, google: null, pinterest: null },
      shippingPreferences: { deliveryMethod: 'standard', deliveryInstructions: null, preferredTime: null },
    },
  });

  const { fields: interests, append: appendInterest, remove: removeInterest } = useFieldArray({
    control,
    name: 'interests',
  });

  const { fields: paymentMethods, append: appendPaymentMethod, remove: removePaymentMethod } = useFieldArray({
    control,
    name: 'paymentMethods',
  });

  useEffect(() => {
    if (data) {
      reset({
        ...data,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth).toISOString().split('T')[0] : undefined,
        resetTokenExpiration: data.resetTokenExpiration ? new Date(data.resetTokenExpiration).toISOString().split('T')[0] : undefined,
        lastLogin: data.lastLogin ? new Date(data.lastLogin).toISOString().split('T')[0] : undefined,
        preOrderDate: data.preOrderDate ? new Date(data.preOrderDate).toISOString().split('T')[0] : undefined,
      });
    }
  }, [data, reset]);

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePictureFile(file);
      const url = URL.createObjectURL(file);
      reset({ ...control._formValues, profilePicture: url });
    }
  };

  const addInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      appendInterest(newInterest.trim());
      setNewInterest('');
    }
  };

  const onSubmitForm = async (formData: UserData) => {
    try {
      // Transform dates and file uploads
      const submissionData = {
        ...formData,
        dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth) : null,
        resetTokenExpiration: formData.resetTokenExpiration ? new Date(formData.resetTokenExpiration) : null,
        lastLogin: formData.lastLogin ? new Date(formData.lastLogin) : null,
        profilePicture: profilePictureFile ? await uploadFile(profilePictureFile) : formData.profilePicture,
      };
      onSubmit?.(submissionData);
      // Reset file input
      setProfilePictureFile(null);
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  // Placeholder for file upload (implement on backend)
  const uploadFile = async (file: File): Promise<string> => {
    // Simulate file upload to server
    return new Promise((resolve) => resolve(URL.createObjectURL(file))); // Replace with actual upload logic
  };

  return (
    <>
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-8 max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="username" className="text-sm font-medium text-gray-700">Username *</Label>
              <Input id="username" {...register('username')} placeholder="Enter username" />
              {errors.username && <p className="text-red-600 text-sm mt-1">{errors.username.message}</p>}
            </div>
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email *</Label>
              <Input id="email" type="email" {...register('email')} placeholder="Enter email" />
              {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">First Name *</Label>
              <Input id="firstName" {...register('firstName')} placeholder="Enter first name" />
              {errors.firstName && <p className="text-red-600 text-sm mt-1">{errors.firstName.message}</p>}
            </div>
            <div>
              <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">Last Name *</Label>
              <Input id="lastName" {...register('lastName')} placeholder="Enter last name" />
              {errors.lastName && <p className="text-red-600 text-sm mt-1">{errors.lastName.message}</p>}
            </div>
          </div>
          <div>
            <Label htmlFor="dateOfBirth" className="text-sm font-medium text-gray-700">Date of Birth</Label>
            <Input id="dateOfBirth" type="date" {...register('dateOfBirth')} />
          </div>
          <div>
            <Label htmlFor="gender" className="text-sm font-medium text-gray-700">Gender</Label>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <Select value={field.value || ''} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div>
            <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">Phone Number</Label>
            <Input id="phoneNumber" {...register('phoneNumber')} placeholder="Enter 10-digit phone number" />
            {errors.phoneNumber && <p className="text-red-600 text-sm mt-1">{errors.phoneNumber.message}</p>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
            Profile Picture
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            {control._formValues.profilePicture && (
              <Image
                src={control._formValues.profilePicture}
                alt="Profile preview"
                className="w-24 h-24 object-cover rounded-full"
              />
            )}
            <div>
              <Label htmlFor="profilePicture" className="text-sm font-medium text-gray-700">
                Upload Profile Picture
              </Label>
              <Input
                id="profilePicture"
                type="file"
                accept="image/*"
                onChange={handleProfilePictureChange}
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
            Interests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-3">
            {interests.map((interest, index) => (
              <Badge key={interest.id} variant="secondary" className="flex items-center gap-1">
                {interest.id}
                <button
                  type="button"
                  onClick={() => removeInterest(index)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              placeholder="Add an interest"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
            />
            <Button type="button" onClick={addInterest} variant="outline">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          {errors.interests && (
            <p className="text-red-600 text-sm mt-1">
              {Array.isArray(errors.interests)
                ? errors.interests.map((err, i) => err?.message && <span key={i}>{err.message}</span>).filter(Boolean)
                : errors.interests.message}
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
            Social Media
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {['facebook', 'twitter', 'instagram', 'linkedin', 'google', 'pinterest'].map((platform) => (
            <div key={platform}>
              <Label htmlFor={`socialMedia.${platform}`} className="text-sm font-medium text-gray-700">
                {platform.charAt(0).toUpperCase() + platform.slice(1)}
              </Label>
              <Input
                id={`socialMedia.${platform}`}
                {...register(`socialMedia.${platform}`)}
                placeholder={`Enter ${platform} URL`}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
            Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="preferences.newsletter" className="text-sm font-medium text-gray-700">
              Subscribe to Newsletter
            </Label>
            <Controller
              name="preferences.newsletter"
              control={control}
              render={({ field }) => (
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="preferences.notifications" className="text-sm font-medium text-gray-700">
              Enable Notifications
            </Label>
            <Controller
              name="preferences.notifications"
              control={control}
              render={({ field }) => (
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
          </div>
          <div>
            <Label htmlFor="preferences.language" className="text-sm font-medium text-gray-700">
              Language
            </Label>
            <Input id="preferences.language" {...register('preferences.language')} placeholder="e.g., en" />
          </div>
          <div>
            <Label htmlFor="preferences.currency" className="text-sm font-medium text-gray-700">
              Currency
            </Label>
            <Input id="preferences.currency" {...register('preferences.currency')} placeholder="e.g., USD" />
          </div>
          <div>
            <Label htmlFor="preferences.theme" className="text-sm font-medium text-gray-700">
              Theme
            </Label>
            <Controller
              name="preferences.theme"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
            Payment Methods
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {paymentMethods.map((method, index) => (
            <div key={method.id} className="border p-4 rounded-md space-y-2">
              <div>
                <Label htmlFor={`paymentMethods.${index}.method`} className="text-sm font-medium text-gray-700">
                  Payment Method
                </Label>
                <Controller
                  name={`paymentMethods.${index}.method`}
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="credit_card">Credit Card</SelectItem>
                        <SelectItem value="paypal">PayPal</SelectItem>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              {method.method === 'credit_card' && (
                <>
                  <div>
                    <Label htmlFor={`paymentMethods.${index}.details.cardNumber`} className="text-sm font-medium text-gray-700">
                      Card Number
                    </Label>
                    <Input
                      id={`paymentMethods.${index}.details.cardNumber`}
                      {...register(`paymentMethods.${index}.details.cardNumber`)}
                      placeholder="Enter card number"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`paymentMethods.${index}.details.expiryDate`} className="text-sm font-medium text-gray-700">
                      Expiry Date
                    </Label>
                    <Input
                      id={`paymentMethods.${index}.details.expiryDate`}
                      type="date"
                      {...register(`paymentMethods.${index}.details.expiryDate`)}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`paymentMethods.${index}.details.holderName`} className="text-sm font-medium text-gray-700">
                      Cardholder Name
                    </Label>
                    <Input
                      id={`paymentMethods.${index}.details.holderName`}
                      {...register(`paymentMethods.${index}.details.holderName`)}
                      placeholder="Enter cardholder name"
                    />
                  </div>
                </>
              )}
              <div className="flex items-center justify-between">
                <Label htmlFor={`paymentMethods.${index}.isDefault`} className="text-sm font-medium text-gray-700">
                  Set as Default
                </Label>
                <Controller
                  name={`paymentMethods.${index}.isDefault`}
                  control={control}
                  render={({ field }) => (
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  )}
                />
              </div>
              <Button type="button" variant="destructive" onClick={() => removePaymentMethod(index)}>
                Remove
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => appendPaymentMethod({ method: 'credit_card', isDefault: false })}
          >
            Add Payment Method
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
            Shipping Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="shippingPreferences.deliveryMethod" className="text-sm font-medium text-gray-700">
              Delivery Method
            </Label>
            <Controller
              name="shippingPreferences.deliveryMethod"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select delivery method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="express">Express</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div>
            <Label htmlFor="shippingPreferences.deliveryInstructions" className="text-sm font-medium text-gray-700">
              Delivery Instructions
            </Label>
            <Textarea
              id="shippingPreferences.deliveryInstructions"
              {...register('shippingPreferences.deliveryInstructions')}
              placeholder="Enter delivery instructions"
            />
          </div>
          <div>
            <Label htmlFor="shippingPreferences.preferredTime" className="text-sm font-medium text-gray-700">
              Preferred Delivery Time
            </Label>
            <Input
              id="shippingPreferences.preferredTime"
              {...register('shippingPreferences.preferredTime')}
              placeholder="e.g., Morning"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
            Account Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="status" className="text-sm font-medium text-gray-700">Status</Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {['active', 'inactive', 'pending', 'banned', 'deleted', 'archived', 'draft'].map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="isVerified" className="text-sm font-medium text-gray-700">Verified Account</Label>
            <Controller
              name="isVerified"
              control={control}
              render={({ field }) => (
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
          </div>
          <div>
            <Label htmlFor="subscriptionStatus" className="text-sm font-medium text-gray-700">Subscription Status</Label>
            <Controller
              name="subscriptionStatus"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subscription status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div>
            <Label htmlFor="subscriptionType" className="text-sm font-medium text-gray-700">Subscription Type</Label>
            <Controller
              name="subscriptionType"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subscription type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div>
            <Label htmlFor="loyaltyPoints" className="text-sm font-medium text-gray-700">Loyalty Points</Label>
            <Input
              id="loyaltyPoints"
              type="number"
              {...register('loyaltyPoints', { valueAsNumber: true })}
              placeholder="Enter loyalty points"
            />
          </div>
          <div>
            <Label htmlFor="referralCode" className="text-sm font-medium text-gray-700">Referral Code</Label>
            <Input id="referralCode" {...register('referralCode')} placeholder="Enter referral code" />
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        <Save className="w-4 h-4 mr-2" />
        {isSubmitting ? 'Saving...' : 'Save Profile'}
      </Button>
    </form>
    </>
  );
}
