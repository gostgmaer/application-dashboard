'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Loader2, Globe, Palette, Bell, Mail } from 'lucide-react'
import { preferencesSchema, PreferencesFormData } from '@/lib/validation/account'
import { User } from '@/types/user'
import { toast } from 'sonner'

interface PreferencesTabProps {
  user: User
}

export default function PreferencesTab({ user }: PreferencesTabProps) {
  const [isLoading, setIsLoading] = useState(false)

  const {
    setValue,
    watch,
    handleSubmit,
    formState: { errors }
  } = useForm<PreferencesFormData>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      language: user.preferences.language,
      currency: user.preferences.currency,
      theme: user.preferences.theme,
      newsletter: user.preferences.newsletter,
      notifications: user.preferences.notifications
    }
  })

  const watchedValues = watch()

  const onSubmit = async (data: PreferencesFormData) => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Updated preferences:', data)
      toast.success('Preferences updated successfully!')
    } catch (error) {
      toast.error('Failed to update preferences. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'zh', name: 'Chinese' }
  ]

  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' }
  ]

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Localization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Localization
          </CardTitle>
          <CardDescription>
            Set your preferred language and currency
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Language</Label>
              <Select
                value={watchedValues.language}
                onValueChange={(value) => setValue('language', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.language && (
                <p className="text-sm text-destructive">{errors.language.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Currency</Label>
              <Select
                value={watchedValues.currency}
                onValueChange={(value) => setValue('currency', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.symbol} {currency.name} ({currency.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.currency && (
                <p className="text-sm text-destructive">{errors.currency.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Appearance
          </CardTitle>
          <CardDescription>
            Customize how the interface looks and feels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Theme</Label>
            <Select
              value={watchedValues.theme}
              onValueChange={(value) => setValue('theme', value as 'light' | 'dark')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
              </SelectContent>
            </Select>
            {errors.theme && (
              <p className="text-sm text-destructive">{errors.theme.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>
            Choose what notifications you want to receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Push Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications about your account activity
              </p>
            </div>
            <Switch
              checked={watchedValues.notifications}
              onCheckedChange={(checked) => setValue('notifications', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5 flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <div>
                <Label className="text-base">Email Newsletter</Label>
                <p className="text-sm text-muted-foreground">
                  Get updates about new features and promotions
                </p>
              </div>
            </div>
            <Switch
              checked={watchedValues.newsletter}
              onCheckedChange={(checked) => setValue('newsletter', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Preferences'
          )}
        </Button>
      </div>
    </form>
  )
}