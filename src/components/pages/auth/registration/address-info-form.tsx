'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { addressInfoSchema } from '@/lib/validation-schemas';
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
import { countries } from '@/lib/utils/utils';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { updateAddressInfo, nextStep, prevStep } from '@/store/slices/registrationSlice';
import { UserAddressInfo } from '@/types';
import { Loader2 } from 'lucide-react';

export function AddressInfoForm() {
  const dispatch = useAppDispatch();
  const addressInfo = useAppSelector((state) => state.registration.userData.addressInfo);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<UserAddressInfo>({
    resolver: yupResolver(addressInfoSchema),
    defaultValues: {
      ...addressInfo,
    },
  });

  const handleCountryChange = (value: string) => {
    setValue('country', value);
  };

  const onSubmit = (data: UserAddressInfo) => {
    dispatch(updateAddressInfo(data));
    dispatch(nextStep());
  };

  const handleBack = () => {
    dispatch(prevStep());
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Address Information</h2>
        <p className="text-muted-foreground">Please provide your current address details</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="streetAddress">Street Address *</Label>
        <Input
          id="streetAddress"
          {...register('streetAddress')}
          className={errors.streetAddress ? 'border-destructive' : ''}
          placeholder="123 Main St, Apt 4B"
        />
        {errors.streetAddress && (
          <p className="text-sm text-destructive">{errors.streetAddress.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City *</Label>
          <Input
            id="city"
            {...register('city')}
            className={errors.city ? 'border-destructive' : ''}
            placeholder="New York"
          />
          {errors.city && <p className="text-sm text-destructive">{errors.city.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">State/Province *</Label>
          <Input
            id="state"
            {...register('state')}
            className={errors.state ? 'border-destructive' : ''}
            placeholder="NY"
          />
          {errors.state && <p className="text-sm text-destructive">{errors.state.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="zipCode">Zip/Postal Code *</Label>
          <Input
            id="zipCode"
            {...register('zipCode')}
            className={errors.zipCode ? 'border-destructive' : ''}
            placeholder="10001"
          />
          {errors.zipCode && <p className="text-sm text-destructive">{errors.zipCode.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">Country *</Label>
          <Select onValueChange={handleCountryChange} defaultValue={addressInfo.country}>
            <SelectTrigger className={errors.country ? 'border-destructive' : ''}>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.country && <p className="text-sm text-destructive">{errors.country.message}</p>}
        </div>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={handleBack}>
          Back
        </Button>
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