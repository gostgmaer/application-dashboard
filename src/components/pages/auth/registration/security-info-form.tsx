'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { securityInfoSchema } from '@/lib/validation-schemas';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { securityQuestions } from '@/lib/utils/utils';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { updateSecurityInfo, nextStep, prevStep } from '@/store/slices/registrationSlice';
import { UserSecurityInfo } from '@/types';
import { Loader2 } from 'lucide-react';

export function SecurityInfoForm() {
  const dispatch = useAppDispatch();
  const securityInfo = useAppSelector((state) => state.registration.userData.securityInfo);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UserSecurityInfo>({
    resolver: yupResolver(securityInfoSchema),
    defaultValues: {
      ...securityInfo,
    },
  });

  const twoFactorEnabled = watch('twoFactorEnabled');

  const handleSecurityQuestion1Change = (value: string) => {
    setValue('securityQuestion1', value);
  };

  const handleSecurityQuestion2Change = (value: string) => {
    setValue('securityQuestion2', value);
  };

  const handleTwoFactorChange = (checked: boolean) => {
    setValue('twoFactorEnabled', checked);
  };

  const onSubmit = (data: UserSecurityInfo) => {
    dispatch(updateSecurityInfo(data));
    dispatch(nextStep());
  };

  const handleBack = () => {
    dispatch(prevStep());
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Security & Authentication</h2>
        <p className="text-muted-foreground">Set up security measures to protect your account</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="securityQuestion1">Security Question 1 *</Label>
        <Select
          onValueChange={handleSecurityQuestion1Change}
          defaultValue={securityInfo.securityQuestion1}
        >
          <SelectTrigger className={errors.securityQuestion1 ? 'border-destructive' : ''}>
            <SelectValue placeholder="Select a security question" />
          </SelectTrigger>
          <SelectContent>
            {securityQuestions.map((question, index) => (
              <SelectItem key={index} value={question}>
                {question}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.securityQuestion1 && (
          <p className="text-sm text-destructive">{errors.securityQuestion1.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="securityAnswer1">Security Answer 1 *</Label>
        <Input
          id="securityAnswer1"
          {...register('securityAnswer1')}
          className={errors.securityAnswer1 ? 'border-destructive' : ''}
          placeholder="Your answer"
        />
        {errors.securityAnswer1 && (
          <p className="text-sm text-destructive">{errors.securityAnswer1.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="securityQuestion2">Security Question 2 *</Label>
        <Select
          onValueChange={handleSecurityQuestion2Change}
          defaultValue={securityInfo.securityQuestion2}
        >
          <SelectTrigger className={errors.securityQuestion2 ? 'border-destructive' : ''}>
            <SelectValue placeholder="Select a security question" />
          </SelectTrigger>
          <SelectContent>
            {securityQuestions.map((question, index) => (
              <SelectItem key={index} value={question}>
                {question}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.securityQuestion2 && (
          <p className="text-sm text-destructive">{errors.securityQuestion2.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="securityAnswer2">Security Answer 2 *</Label>
        <Input
          id="securityAnswer2"
          {...register('securityAnswer2')}
          className={errors.securityAnswer2 ? 'border-destructive' : ''}
          placeholder="Your answer"
        />
        {errors.securityAnswer2 && (
          <p className="text-sm text-destructive">{errors.securityAnswer2.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="twoFactorEnabled">Enable Two-Factor Authentication</Label>
          <Switch
            id="twoFactorEnabled"
            checked={twoFactorEnabled}
            onCheckedChange={handleTwoFactorChange}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Enable two-factor authentication for an extra layer of security
        </p>
      </div>

      {twoFactorEnabled && (
        <>
          <div className="space-y-2">
            <Label htmlFor="backupEmail">Backup Email (Optional)</Label>
            <Input
              id="backupEmail"
              type="email"
              {...register('backupEmail')}
              className={errors.backupEmail ? 'border-destructive' : ''}
              placeholder="backup.email@example.com"
            />
            {errors.backupEmail && (
              <p className="text-sm text-destructive">{errors.backupEmail.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="backupPhone">Backup Phone Number (Optional)</Label>
            <Input
              id="backupPhone"
              {...register('backupPhone')}
              className={errors.backupPhone ? 'border-destructive' : ''}
              placeholder="(123) 456-7890"
            />
            {errors.backupPhone && (
              <p className="text-sm text-destructive">{errors.backupPhone.message}</p>
            )}
          </div>
        </>
      )}

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