
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Loader2, Facebook, Twitter, Instagram, Linkedin, Youtube, PrinterCheck } from 'lucide-react'
import { settingsSchema, SettingsFormData } from '@/lib/validation/settings'
import { Settings } from '@/types/settings'
import { toast } from 'sonner'

interface SettingsPageProps {
  settings: Settings
}

export default function SettingsPage({ settings }: SettingsPageProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogType, setDialogType] = useState<'maintenance' | 'disable-site' | null>(null)

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      basic: {
        siteName: settings?.basic?.siteName || '',
        siteKey: settings?.basic?.siteKey || '',
        isDeleted: settings?.basic?.isDeleted ?? false,
        name: settings?.basic?.name || '',
        isLive: settings?.basic?.isLive ?? true,
        maintenanceMode: settings?.basic?.maintenanceMode ?? false,
        siteTimezone: settings?.basic?.siteTimezone || 'UTC',
        siteLocale: settings?.basic?.siteLocale || 'en-US',
        defaultPageSize: settings?.basic?.defaultPageSize ?? 20,
        maxUploadSizeMB: settings?.basic?.maxUploadSizeMB ?? 10,
      },
      contactInfo: {
        email: settings?.contactInfo?.email || '',
        phone: settings?.contactInfo?.phone || '',
        address: {
          street: settings?.contactInfo?.address?.street || '',
          city: settings?.contactInfo?.address?.city || '',
          state: settings?.contactInfo?.address?.state || '',
          zipCode: settings?.contactInfo?.address?.zipCode || '',
          country: settings?.contactInfo?.address?.country || '',
        },
        supportEmail: settings?.contactInfo?.supportEmail || '',
        supportPhone: settings?.contactInfo?.supportPhone || '',
        contactHours: settings?.contactInfo?.contactHours || '',
      },
      branding: {
        logo: settings?.branding?.logo || '',
        favicon: settings?.branding?.favicon || '',
        themeColor: settings?.branding?.themeColor || '#000000',
        customCSSUrl: settings?.branding?.customCSSUrl || '',
        customJSUrl: settings?.branding?.customJSUrl || '',
      },
      shipping: {
        shippingOptions: settings?.shipping?.shippingOptions?.join(',') || '',
        shippingMethods: settings?.shipping?.shippingMethods?.join(',') || '',
        minOrderAmount: settings?.shipping?.minOrderAmount ?? 0,
        maxOrderAmount: settings?.shipping?.maxOrderAmount,
        freeShippingThreshold: settings?.shipping?.freeShippingThreshold ?? 100,
        shippingHandlingFee: settings?.shipping?.shippingHandlingFee ?? 5,
        shippingInsuranceEnabled: settings?.shipping?.shippingInsuranceEnabled ?? false,
      },
      email: {
        smtpHost: settings?.email?.smtpHost || '',
        smtpPort: settings?.email?.smtpPort,
        smtpUser: settings?.email?.smtpUser || '',
        smtpPassword: settings?.email?.smtpPassword || '',
        templates: {
          orderConfirmation: settings?.email?.templates?.orderConfirmation || '',
          passwordReset: settings?.email?.templates?.passwordReset || '',
          shippingNotification: settings?.email?.templates?.shippingNotification || '',
          promotional: settings?.email?.templates?.promotional || '',
        },
        emailSenderName: settings?.email?.emailSenderName || '',
        emailSenderAddress: settings?.email?.emailSenderAddress || '',
      },
      seo: {
        title: settings?.seo?.title || '',
        description: settings?.seo?.description || '',
        keywords: settings?.seo?.keywords?.join(',') || '',
        googleSiteVerification: settings?.seo?.googleSiteVerification || '',
        robotsTxt: settings?.seo?.robotsTxt || '',
      },
      analytics: {
        googleAnalyticsID: settings?.analytics?.googleAnalyticsID || '',
        facebookPixelID: settings?.analytics?.facebookPixelID || '',
        hotjarID: settings?.analytics?.hotjarID || '',
        segmentWriteKey: settings?.analytics?.segmentWriteKey || '',
      },
      currencySettings: {
        currency: settings?.currencySettings?.currency || 'USD',
        currencySymbol: settings?.currencySettings?.currencySymbol || '$',
        taxRate: settings?.currencySettings?.taxRate ?? 0,
        taxEnabled: settings?.currencySettings?.taxEnabled ?? false,
        taxInclusivePricing: settings?.currencySettings?.taxInclusivePricing ?? false,
      },
      payment: {
        paymentMethods: settings?.payment?.paymentMethods?.join(',') || '',
        enabledMFA: settings?.payment?.enabledMFA ?? false,
        defaultPaymentMethod: settings?.payment?.defaultPaymentMethod || '',
        stripePublicKey: settings?.payment?.stripePublicKey || '',
        stripeSecretKey: settings?.payment?.stripeSecretKey || '',
        paypalClientId: settings?.payment?.paypalClientId || '',
        paypalSecret: settings?.payment?.paypalSecret || '',
        currencyConversionEnabled: settings?.payment?.currencyConversionEnabled ?? false,
      },
      socialMediaLinks: {
        facebook: settings?.socialMediaLinks?.facebook || '',
        twitter: settings?.socialMediaLinks?.twitter || '',
        instagram: settings?.socialMediaLinks?.instagram || '',
        linkedin: settings?.socialMediaLinks?.linkedin || '',
        youtube: settings?.socialMediaLinks?.youtube || '',
        pinterest: settings?.socialMediaLinks?.pinterest || '',
        tiktok: settings?.socialMediaLinks?.tiktok || '',
      },
      featuredCategories: settings?.featuredCategories?.map(id => id.toString())?.join(',') || '',
      loyaltyProgram: {
        enabled: settings?.loyaltyProgram?.enabled ?? false,
        pointsPerDollar: settings?.loyaltyProgram?.pointsPerDollar ?? 1,
        tieredRewardsEnabled: settings?.loyaltyProgram?.tieredRewardsEnabled ?? false,
        extraRewardMultiplier: settings?.loyaltyProgram?.extraRewardMultiplier ?? 1,
      },
      policies: {
        returnPolicy: settings?.policies?.returnPolicy || '',
        privacyPolicy: settings?.policies?.privacyPolicy || '',
        termsOfService: settings?.policies?.termsOfService || '',
        cookiePolicy: settings?.policies?.cookiePolicy || '',
        gdprComplianceEnabled: settings?.policies?.gdprComplianceEnabled ?? false,
      },
      security: {
        passwordMinLength: settings?.security?.passwordMinLength ?? 8,
        passwordRequireSymbols: settings?.security?.passwordRequireSymbols ?? true,
        passwordRequireNumbers: settings?.security?.passwordRequireNumbers ?? true,
        passwordRequireUppercase: settings?.security?.passwordRequireUppercase ?? true,
        maxLoginAttempts: settings?.security?.maxLoginAttempts ?? 5,
        accountLockoutDurationMinutes: settings?.security?.accountLockoutDurationMinutes ?? 30,
        sessionTimeoutMinutes: settings?.security?.sessionTimeoutMinutes ?? 60,
        refreshTokenExpiryDays: settings?.security?.refreshTokenExpiryDays ?? 30,
        enableCaptchaOnLogin: settings?.security?.enableCaptchaOnLogin ?? false,
        enableCaptchaOnSignup: settings?.security?.enableCaptchaOnSignup ?? false,
        enableIPRateLimiting: settings?.security?.enableIPRateLimiting ?? true,
        maxRequestsPerMinute: settings?.security?.maxRequestsPerMinute ?? 60,
        allowedIPRanges: settings?.security?.allowedIPRanges?.join(',') || '',
        auditLoggingEnabled: settings?.security?.auditLoggingEnabled ?? true,
        twoFactorAuthRequired: settings?.security?.twoFactorAuthRequired ?? false,
        jwtSecret: settings?.security?.jwtSecret || '',
        jwtExpiryMinutes: settings?.security?.jwtExpiryMinutes ?? 60,
        passwordResetTokenExpiryMinutes: settings?.security?.passwordResetTokenExpiryMinutes ?? 15,
      },
      misc: {
        allowGuestCheckout: settings?.misc?.allowGuestCheckout ?? true,
        enableDarkMode: settings?.misc?.enableDarkMode ?? false,
        defaultLanguage: settings?.misc?.defaultLanguage || 'en',
        supportedLanguages: settings?.misc?.supportedLanguages?.join(',') || 'en',
        defaultPageSize: settings?.misc?.defaultPageSize ?? 20,
        maxUploadSizeMB: settings?.misc?.maxUploadSizeMB ?? 10,
        enablePushNotifications: settings?.misc?.enablePushNotifications ?? false,
        notificationSound: settings?.misc?.notificationSound || 'default',
        customCSSUrl: settings?.misc?.customCSSUrl || '',
        customJSUrl: settings?.misc?.customJSUrl || '',
      }
    }
  })

  const formValues = watch()

  const onSubmit = async (data: SettingsFormData) => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      // Transform comma-separated strings back to arrays
      const transformedData = {
        ...data,
        shipping: {
          ...data.shipping,
          shippingOptions: data.shipping.shippingOptions ? data.shipping.shippingOptions.split(',').map(s => s.trim()) : [],
          shippingMethods: data.shipping.shippingMethods ? data.shipping.shippingMethods.split(',').map(s => s.trim()) : [],
        },
        seo: {
          ...data.seo,
          keywords: data.seo.keywords ? data.seo.keywords.split(',').map(k => k.trim()) : [],
        },
        payment: {
          ...data.payment,
          paymentMethods: data.payment.paymentMethods ? data.payment.paymentMethods.split(',').map(m => m.trim()) : [],
        },
        featuredCategories: data.featuredCategories ? data.featuredCategories.split(',').map(id => id.trim()) : [],
        security: {
          ...data.security,
          allowedIPRanges: data.security.allowedIPRanges ? data.security.allowedIPRanges.split(',').map(ip => ip.trim()) : [],
        },
        misc: {
          ...data.misc,
          supportedLanguages: data.misc.supportedLanguages ? data.misc.supportedLanguages.split(',').map(lang => lang.trim()) : ['en'],
        }
      }
      console.log('Updated settings:', transformedData)
      toast.success('Settings updated successfully!')
    } catch (error) {
      toast.error('Failed to update settings. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCriticalToggle = (field: 'basic.maintenanceMode' | 'basic.isLive', checked: boolean) => {
    if (field === 'basic.maintenanceMode' && checked) {
      setDialogType('maintenance')
      setDialogOpen(true)
    } else if (field === 'basic.isLive' && !checked) {
      setDialogType('disable-site')
      setDialogOpen(true)
    } else {
      setValue(field, checked, { shouldValidate: true })
    }
  }

  const handleConfirmDialog = () => {
    if (dialogType === 'maintenance') {
      setValue('basic.maintenanceMode', true, { shouldValidate: true })
      toast.success('Maintenance mode enabled!')
    } else if (dialogType === 'disable-site') {
      setValue('basic.isLive', false, { shouldValidate: true })
      toast.success('Site disabled!')
    }
    setDialogOpen(false)
    setDialogType(null)
  }

  const handleCancelDialog = () => {
    if (dialogType === 'maintenance') {
      setValue('basic.maintenanceMode', false, { shouldValidate: true })
    } else if (dialogType === 'disable-site') {
      setValue('basic.isLive', true, { shouldValidate: true })
    }
    setDialogOpen(false)
    setDialogType(null)
  }

  const socialPlatforms = [
    { name: 'facebook' as const, label: 'Facebook', icon: Facebook, color: 'text-blue-600' },
    { name: 'twitter' as const, label: 'Twitter', icon: Twitter, color: 'text-sky-500' },
    { name: 'instagram' as const, label: 'Instagram', icon: Instagram, color: 'text-pink-600' },
    { name: 'linkedin' as const, label: 'LinkedIn', icon: Linkedin, color: 'text-blue-700' },
    { name: 'youtube' as const, label: 'YouTube', icon: Youtube, color: 'text-red-600' },

 
  ]

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Site Settings</CardTitle>
          <CardDescription>
            Configure your site settings, including basic, contact, and security settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Basic, Branding, Security, Currency */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Basic Settings</h3>
                  <div className="space-y-2">
                    <Label htmlFor="basic.siteName">Site Name</Label>
                    <Input id="basic.siteName" {...register('basic.siteName')} placeholder="Enter site name" />
                    {errors.basic?.siteName && <p className="text-sm text-destructive">{errors.basic.siteName.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="basic.siteKey">Site Key</Label>
                    <Input id="basic.siteKey" {...register('basic.siteKey')} placeholder="Enter site key" />
                    {errors.basic?.siteKey && <p className="text-sm text-destructive">{errors.basic.siteKey.message}</p>}
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="basic.isLive" className="cursor-pointer">Site Live</Label>
                    <Switch
                      id="basic.isLive"
                      checked={formValues.basic.isLive}
                      onCheckedChange={(checked) => handleCriticalToggle('basic.isLive', checked)}
                      disabled={isLoading}
                    />
                    {errors.basic?.isLive && <p className="text-sm text-destructive">{errors.basic.isLive.message}</p>}
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="basic.maintenanceMode" className="cursor-pointer">Maintenance Mode</Label>
                    <Switch
                      id="basic.maintenanceMode"
                      checked={formValues.basic.maintenanceMode}
                      onCheckedChange={(checked) => handleCriticalToggle('basic.maintenanceMode', checked)}
                      disabled={isLoading}
                    />
                    {errors.basic?.maintenanceMode && <p className="text-sm text-destructive">{errors.basic.maintenanceMode.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="basic.siteTimezone">Site Timezone</Label>
                    <Input id="basic.siteTimezone" {...register('basic.siteTimezone')} placeholder="Enter timezone (e.g., UTC)" />
                    {errors.basic?.siteTimezone && <p className="text-sm text-destructive">{errors.basic.siteTimezone.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="basic.siteLocale">Site Locale</Label>
                    <Input id="basic.siteLocale" {...register('basic.siteLocale')} placeholder="Enter locale (e.g., en-US)" />
                    {errors.basic?.siteLocale && <p className="text-sm text-destructive">{errors.basic.siteLocale.message}</p>}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Branding</h3>
                  <div className="space-y-2">
                    <Label htmlFor="branding.logo">Logo URL</Label>
                    <Input id="branding.logo" {...register('branding.logo')} placeholder="Enter logo URL" />
                    {errors.branding?.logo && <p className="text-sm text-destructive">{errors.branding.logo.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="branding.themeColor">Theme Color</Label>
                    <Input id="branding.themeColor" {...register('branding.themeColor')} placeholder="Enter theme color (e.g., #000000)" />
                    {errors.branding?.themeColor && <p className="text-sm text-destructive">{errors.branding.themeColor.message}</p>}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Security</h3>
                  <div className="space-y-2">
                    <Label htmlFor="security.passwordMinLength">Password Minimum Length</Label>
                    <Input
                      id="security.passwordMinLength"
                      type="number"
                      {...register('security.passwordMinLength', { valueAsNumber: true })}
                      placeholder="Enter minimum length"
                    />
                    {errors.security?.passwordMinLength && <p className="text-sm text-destructive">{errors.security.passwordMinLength.message}</p>}
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="security.twoFactorAuthRequired" className="cursor-pointer">Two-Factor Auth Required</Label>
                    <Switch
                      id="security.twoFactorAuthRequired"
                      checked={formValues.security.twoFactorAuthRequired}
                      onCheckedChange={(checked) => setValue('security.twoFactorAuthRequired', checked, { shouldValidate: true })}
                      disabled={isLoading}
                    />
                    {errors.security?.twoFactorAuthRequired && <p className="text-sm text-destructive">{errors.security.twoFactorAuthRequired.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="security.jwtSecret">JWT Secret</Label>
                    <Input
                      id="security.jwtSecret"
                      type="password"
                      {...register('security.jwtSecret')}
                      placeholder="Enter JWT secret"
                    />
                    {errors.security?.jwtSecret && <p className="text-sm text-destructive">{errors.security.jwtSecret.message}</p>}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Currency Settings</h3>
                  <div className="space-y-2">
                    <Label htmlFor="currencySettings.currency">Currency</Label>
                    <Input id="currencySettings.currency" {...register('currencySettings.currency')} placeholder="Enter currency (e.g., USD)" />
                    {errors.currencySettings?.currency && <p className="text-sm text-destructive">{errors.currencySettings.currency.message}</p>}
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="currencySettings.taxEnabled" className="cursor-pointer">Tax Enabled</Label>
                    <Switch
                      id="currencySettings.taxEnabled"
                      checked={formValues.currencySettings.taxEnabled}
                      onCheckedChange={(checked) => setValue('currencySettings.taxEnabled', checked, { shouldValidate: true })}
                      disabled={isLoading}
                    />
                    {errors.currencySettings?.taxEnabled && <p className="text-sm text-destructive">{errors.currencySettings.taxEnabled.message}</p>}
                  </div>
                </div>
              </div>

              {/* Right Column: Contact, Social Media, Shipping, Payment, SEO, etc. */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Contact Information</h3>
                  <div className="space-y-2">
                    <Label htmlFor="contactInfo.email">Email</Label>
                    <Input id="contactInfo.email" {...register('contactInfo.email')} placeholder="Enter contact email" />
                    {errors.contactInfo?.email && <p className="text-sm text-destructive">{errors.contactInfo.email.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactInfo.phone">Phone</Label>
                    <Input id="contactInfo.phone" {...register('contactInfo.phone')} placeholder="Enter contact phone" />
                    {errors.contactInfo?.phone && <p className="text-sm text-destructive">{errors.contactInfo.phone.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactInfo.address.street">Street</Label>
                    <Input id="contactInfo.address.street" {...register('contactInfo.address.street')} placeholder="Enter street" />
                    {errors.contactInfo?.address?.street && <p className="text-sm text-destructive">{errors.contactInfo.address.street.message}</p>}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Social Media Links</h3>
                  {socialPlatforms.map((platform) => (
                    <div key={platform.name} className="space-y-2">
                      <Label htmlFor={`socialMediaLinks.${platform.name}`} className="flex items-center gap-2">
                        <platform.icon className={`h-4 w-4 ${platform.color}`} />
                        {platform.label}
                      </Label>
                      <Input
                        id={`socialMediaLinks.${platform.name}`}
                        {...register(`socialMediaLinks.${platform.name}`)}
                        placeholder={`Enter ${platform.label} URL`}
                        disabled={isLoading}
                      />
                      {errors.socialMediaLinks?.[platform.name] && (
                        <p className="text-sm text-destructive">{errors.socialMediaLinks[platform.name]?.message}</p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Shipping</h3>
                  <div className="space-y-2">
                    <Label htmlFor="shipping.shippingOptions">Shipping Options (comma-separated)</Label>
                    <Input id="shipping.shippingOptions" {...register('shipping.shippingOptions')} placeholder="e.g., Standard,Express" />
                    {errors.shipping?.shippingOptions && <p className="text-sm text-destructive">{errors.shipping.shippingOptions.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shipping.freeShippingThreshold">Free Shipping Threshold</Label>
                    <Input
                      id="shipping.freeShippingThreshold"
                      type="number"
                      {...register('shipping.freeShippingThreshold', { valueAsNumber: true })}
                      placeholder="Enter threshold"
                    />
                    {errors.shipping?.freeShippingThreshold && <p className="text-sm text-destructive">{errors.shipping.freeShippingThreshold.message}</p>}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Payment</h3>
                  <div className="space-y-2">
                    <Label htmlFor="payment.paymentMethods">Payment Methods (comma-separated)</Label>
                    <Input id="payment.paymentMethods" {...register('payment.paymentMethods')} placeholder="e.g., Stripe,Paypal" />
                    {errors.payment?.paymentMethods && <p className="text-sm text-destructive">{errors.payment.paymentMethods.message}</p>}
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="payment.enabledMFA" className="cursor-pointer">Enable MFA</Label>
                    <Switch
                      id="payment.enabledMFA"
                      checked={formValues.payment.enabledMFA}
                      onCheckedChange={(checked) => setValue('payment.enabledMFA', checked, { shouldValidate: true })}
                      disabled={isLoading}
                    />
                    {errors.payment?.enabledMFA && <p className="text-sm text-destructive">{errors.payment.enabledMFA.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="payment.stripeSecretKey">Stripe Secret Key</Label>
                    <Input
                      id="payment.stripeSecretKey"
                      type="password"
                      {...register('payment.stripeSecretKey')}
                      placeholder="Enter Stripe secret key"
                    />
                    {errors.payment?.stripeSecretKey && <p className="text-sm text-destructive">{errors.payment.stripeSecretKey.message}</p>}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">SEO</h3>
                  <div className="space-y-2">
                    <Label htmlFor="seo.title">SEO Title</Label>
                    <Input id="seo.title" {...register('seo.title')} placeholder="Enter SEO title" />
                    {errors.seo?.title && <p className="text-sm text-destructive">{errors.seo.title.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="seo.keywords">Keywords (comma-separated)</Label>
                    <Input id="seo.keywords" {...register('seo.keywords')} placeholder="e.g., e-commerce,shopping" />
                    {errors.seo?.keywords && <p className="text-sm text-destructive">{errors.seo.keywords.message}</p>}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Loyalty Program</h3>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="loyaltyProgram.enabled" className="cursor-pointer">Enable Loyalty Program</Label>
                    <Switch
                      id="loyaltyProgram.enabled"
                      checked={formValues.loyaltyProgram.enabled}
                      onCheckedChange={(checked) => setValue('loyaltyProgram.enabled', checked, { shouldValidate: true })}
                      disabled={isLoading}
                    />
                    {errors.loyaltyProgram?.enabled && <p className="text-sm text-destructive">{errors.loyaltyProgram.enabled.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="loyaltyProgram.pointsPerDollar">Points Per Dollar</Label>
                    <Input
                      id="loyaltyProgram.pointsPerDollar"
                      type="number"
                      {...register('loyaltyProgram.pointsPerDollar', { valueAsNumber: true })}
                      placeholder="Enter points per dollar"
                    />
                    {errors.loyaltyProgram?.pointsPerDollar && <p className="text-sm text-destructive">{errors.loyaltyProgram.pointsPerDollar.message}</p>}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Privacy Notice</h4>
              <p className="text-sm text-muted-foreground">
                Your site settings, including social media links and API keys, may be publicly visible or sensitive. Ensure sensitive information is not exposed.
              </p>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogType === 'maintenance' ? 'Enable Maintenance Mode' : 'Disable Site'}
            </DialogTitle>
            <DialogDescription>
              {dialogType === 'maintenance'
                ? 'Are you sure you want to enable maintenance mode? This will make the site inaccessible to users.'
                : 'Are you sure you want to disable the site? This will prevent all user access.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelDialog}>
              Cancel
            </Button>
            <Button onClick={handleConfirmDialog}>
              {dialogType === 'maintenance' ? 'Enable' : 'Disable'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

