'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { basicInfoSchema } from '@/lib/validation-schemas';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { updateBasicInfo, nextStep } from '@/store/slices/registrationSlice';
import { UserBasicInfo } from '@/types';
import { useState } from 'react';
import { Loader2, ImagePlus } from 'lucide-react';

export function BasicInfoForm() {
  const dispatch = useAppDispatch();
  const basicInfo = useAppSelector((state) => state.registration.userData.basicInfo);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<UserBasicInfo>({
    resolver: yupResolver(basicInfoSchema),
    defaultValues: {
      ...basicInfo,
    },
  });

  // Watch all form fields to update Redux store
  const formValues = watch();

  const handleGenderChange = (value: string) => {
    setValue('gender', value);
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setPreviewImage(reader.result);
          setValue('profilePicture', reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: UserBasicInfo) => {
    dispatch(updateBasicInfo(data));
    dispatch(nextStep());
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Basic Personal Information</h2>
        <p className="text-muted-foreground">Please provide your basic personal details</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            {...register('firstName')}
            className={errors.firstName ? 'border-destructive' : ''}
            placeholder="John"
          />
          {errors.firstName && <p className="text-sm text-destructive">{errors.firstName.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="middleName">Middle Name</Label>
          <Input
            id="middleName"
            {...register('middleName')}
            className={errors.middleName ? 'border-destructive' : ''}
            placeholder="David"
          />
          {errors.middleName && <p className="text-sm text-destructive">{errors.middleName.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="lastName">Last Name *</Label>
        <Input
          id="lastName"
          {...register('lastName')}
          className={errors.lastName ? 'border-destructive' : ''}
          placeholder="Doe"
        />
        {errors.lastName && <p className="text-sm text-destructive">{errors.lastName.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="username">Username *</Label>
        <Input
          id="username"
          {...register('username')}
          className={errors.username ? 'border-destructive' : ''}
          placeholder="johndoe"
        />
        {errors.username && <p className="text-sm text-destructive">{errors.username.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="password">Password *</Label>
          <Input
            id="password"
            type="password"
            {...register('password')}
            className={errors.password ? 'border-destructive' : ''}
            placeholder="••••••••"
          />
          {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password *</Label>
          <Input
            id="confirmPassword"
            type="password"
            {...register('confirmPassword')}
            className={errors.confirmPassword ? 'border-destructive' : ''}
            placeholder="••••••••"
          />
          {errors.confirmPassword && (
            <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            className={errors.email ? 'border-destructive' : ''}
            placeholder="john.doe@example.com"
          />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            {...register('phone')}
            className={errors.phone ? 'border-destructive' : ''}
            placeholder="(123) 456-7890"
          />
          {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth *</Label>
          <Input
            id="dateOfBirth"
            type="date"
            {...register('dateOfBirth')}
            className={errors.dateOfBirth ? 'border-destructive' : ''}
          />
          {errors.dateOfBirth && (
            <p className="text-sm text-destructive">{errors.dateOfBirth.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">Gender *</Label>
          <Select onValueChange={handleGenderChange} defaultValue={basicInfo.gender}>
            <SelectTrigger className={errors.gender ? 'border-destructive' : ''}>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="non-binary">Non-binary</SelectItem>
              <SelectItem value="other">Other</SelectItem>
              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
          {errors.gender && <p className="text-sm text-destructive">{errors.gender.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="profilePicture">Profile Picture</Label>
        <div className="flex items-center gap-4">
          {previewImage && (
            <div className="h-20 w-20 rounded-full overflow-hidden border">
              <img
                src={previewImage}
                alt="Profile Preview"
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <label
            htmlFor="profilePicture"
            className="flex items-center justify-center gap-2 h-10 px-4 py-2 bg-muted text-sm font-medium rounded-md cursor-pointer hover:bg-muted/80 transition-colors"
          >
            <ImagePlus className="h-4 w-4" />
            <span>Choose image</span>
            <Input
              id="profilePicture"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleProfilePictureChange}
            />
          </label>
        </div>
        {errors.profilePicture && (
          <p className="text-sm text-destructive">{errors.profilePicture.message}</p>
        )}
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Next'
          )}
        </Button>
      </div>
    </form>
  );
}