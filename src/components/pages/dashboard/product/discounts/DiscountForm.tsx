"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Discount, CreateDiscountInput } from '@/types/discount';

import { toast } from 'sonner';
import discountServices from '@/lib/http/discountServices';
import { useSession } from 'next-auth/react';

const discountSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  discountType: z.enum(['percentage', 'fixed']),
  discountValue: z.number().min(0, 'Value must be positive').max(100000, 'Value is too large'),
  status: z.enum(['active', 'inactive'])
});

type DiscountFormData = z.infer<typeof discountSchema>;

interface DiscountFormProps {

  discount?: Discount | null;
}

export function DiscountForm({  discount }: DiscountFormProps) {
  const [loading, setLoading] = useState(false);
  const isEditMode = !!discount;
const {data:session}=useSession()
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<DiscountFormData>({
    resolver: zodResolver(discountSchema),
    defaultValues: {
      name: '',
      discountType: 'percentage',
      discountValue: 0,
      status: 'active'
    }
  });

  const selectedType = watch('discountType');
  const selectedStatus = watch('status');

  // Reset form when modal opens/closes or discount changes
  useEffect(() => {
    if (discount) {
        reset({
          name: discount.name,
          discountType: discount.discountType,
          discountValue: discount.discountValue,
          status: discount.status
        });
      } else {
        reset({
          name: '',
          discountType: 'percentage',
          discountValue: 0,
          status: 'active'
        });
      }
  }, [ discount,reset]);

  const onSubmit = async (data: DiscountFormData) => {
    try {
      setLoading(true);
      
      if (isEditMode && discount) {
        const response = await discountServices.updateRule(discount._id, data,session?.accessToken);
        toast.success(response.message || 'Discount updated successfully');
      } else {
        const response = await discountServices.createOrUpdateRule(data,session?.accessToken);
        toast.success(response.message || 'Discount created successfully');
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name Field */}
        <div>
          <Label htmlFor="name">Discount Name *</Label>
          <Input
            id="name"
            {...register('name')}
            placeholder="Enter discount name"
            className="mt-1"
            disabled={loading}
          />
          {errors.name && (
            <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Type Field */}
        <div>
          <Label htmlFor="discountType">Discount Type *</Label>
          <Select
            value={selectedType}
            onValueChange={(value) => setValue('discountType', value as 'percentage' | 'fixed')}
            disabled={loading}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select discount type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="percentage">Percentage (%)</SelectItem>
              <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
            </SelectContent>
          </Select>
          {errors.discountType && (
            <p className="text-sm text-red-600 mt-1">{errors.discountType.message}</p>
          )}
        </div>

        {/* Value Field */}
        <div>
          <Label htmlFor="discountValue">
            {selectedType === 'percentage' ? 'Percentage (%)' : 'Amount ($)'} *
          </Label>
          <Input
            id="discountValue"
            type="number"
            step={selectedType === 'percentage' ? '0.1' : '0.01'}
            min="0"
            max={selectedType === 'percentage' ? '100' : '100000'}
            {...register('discountValue', { valueAsNumber: true })}
            placeholder={selectedType === 'percentage' ? 'e.g., 25' : 'e.g., 50.00'}
            className="mt-1"
            disabled={loading}
          />
          {errors.discountValue && (
            <p className="text-sm text-red-600 mt-1">{errors.discountValue.message}</p>
          )}
        </div>

        {/* Status Field */}
        <div className="flex items-center justify-between">
          <Label htmlFor="status">Active Status</Label>
          <Switch
            id="status"
            checked={selectedStatus === 'active'}
            onCheckedChange={(checked) => 
              setValue('status', checked ? 'active' : 'inactive')
            }
            disabled={loading}
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t">
   
          <Button
            type="submit"
            disabled={loading}
          >
            {loading ? 'Saving...' : isEditMode ? 'Update Discount' : 'Create Discount'}
          </Button>
        </div>
      </form>
    </div>
  );
}