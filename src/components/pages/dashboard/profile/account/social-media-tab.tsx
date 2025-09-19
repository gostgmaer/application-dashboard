'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Loader2, Facebook, Twitter, Linkedin, Chrome, Github } from 'lucide-react'
import { socialMediaSchema, connectedAccountsSchema, SocialMediaFormData, ConnectedAccountsFormData } from '@/lib/validation/account'
import { User } from '@/types/user'
import { toast } from 'sonner'

interface SocialMediaTabProps {
  user: User
}

interface ConnectedAccount {
  provider: string
  providerId: string | undefined
  email: string
  verified: boolean
  connectedAt: Date
}

export default function SocialMediaTab({ user }: SocialMediaTabProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogType, setDialogType] = useState<'disconnect' | 'connect-social' | null>(null)
  const [dialogPlatform, setDialogPlatform] = useState<keyof SocialMediaFormData | null>(null)
  const [originalValue, setOriginalValue] = useState<string | ConnectedAccount | null>(null)
  const [connecting, setConnecting] = useState<keyof ConnectedAccountsFormData | null>(null)

  // Initialize connectedAccounts form
  const connectedForm = useForm<ConnectedAccountsFormData>({
    resolver: zodResolver(connectedAccountsSchema),
    defaultValues: {
      facebook: user.connectedAccounts?.find(acc => acc.provider === 'facebook' && acc.verified)?.providerId || '',
      twitter: user.connectedAccounts?.find(acc => acc.provider === 'twitter' && acc.verified)?.providerId || '',
      linkedin: user.connectedAccounts?.find(acc => acc.provider === 'linkedin' && acc.verified)?.providerId || '',
      google: user.connectedAccounts?.find(acc => acc.provider === 'google' && acc.verified)?.providerId || '',
      github: user.connectedAccounts?.find(acc => acc.provider === 'github' && acc.verified)?.providerId || ''
    }
  })

  // Initialize socialMedia form
  const socialForm = useForm<SocialMediaFormData>({
    resolver: zodResolver(socialMediaSchema),
    defaultValues: {
      facebook: user.socialMedia?.facebook || '',
      twitter: user.socialMedia?.twitter || '',
      linkedin: user.socialMedia?.linkedin || '',
      google: user.socialMedia?.google || '',
      github: user.socialMedia?.github || ''
    }
  })

  const connectedValues = connectedForm.watch()
  const socialValues = socialForm.watch()

  // Combined submit handler for both forms
  const onSubmit = async () => {
    // Validate both forms
    const connectedValid = await connectedForm.trigger()
    const socialValid = await socialForm.trigger()

    if (!connectedValid || !socialValid) {
      toast.error('Please fix form errors before submitting.')
      return
    }

    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      // Construct connectedAccounts array of objects based on non-empty values
      const connectedAccounts: ConnectedAccount[] = Object.keys(connectedValues)
        .filter(key => connectedValues[key as keyof ConnectedAccountsFormData])
        .map(key => ({
          provider: key,
          providerId: connectedValues[key as keyof ConnectedAccountsFormData],
          email: `${key}@example.com`, // Placeholder; real app would get from API
          verified: true,
          connectedAt: new Date()
        }))
      console.log('Updated connected accounts:', connectedAccounts)
      console.log('Updated social media:', socialForm.getValues())
      toast.success('Accounts updated successfully!')
    } catch (error) {
      toast.error('Failed to update accounts. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleConnectedToggle = (name: keyof ConnectedAccountsFormData, checked: boolean) => {
    const isCurrentlyConnected = !!connectedValues[name]

    if (checked) {
      if (!isCurrentlyConnected) {
        // Simulate API call for connection verification (e.g., OAuth flow)
        setConnecting(name)
        setIsLoading(true)
        new Promise((resolve, reject) => setTimeout(() => Math.random() > 0.1 ? resolve('success') : reject('error'), 1500))
          .then(() => {
            connectedForm.setValue(name, `${name}-provider-id-${Date.now()}`, { shouldValidate: true })
            toast.success(`${name.charAt(0).toUpperCase() + name.slice(1)} connected successfully!`)
            setConnecting(null)
            setIsLoading(false)
          })
          .catch(() => {
            connectedForm.setValue(name, '', { shouldValidate: true })
            toast.error(`Failed to connect to ${name}. Please try again.`)
            setConnecting(null)
            setIsLoading(false)
          })
      }
    } else {
      if (isCurrentlyConnected) {
        // Show disconnect confirmation modal
        const origAccount = user.connectedAccounts?.find(acc => acc.provider === name && acc.verified)
        setOriginalValue(origAccount || null)
        connectedForm.setValue(name, '', { shouldValidate: true })
        setDialogPlatform(name)
        setDialogType('disconnect')
        setDialogOpen(true)
      }
    }
  }

  const handleSocialToggle = (name: keyof SocialMediaFormData, checked: boolean) => {
    const isCurrentlyConnected = !!socialValues[name]

    if (checked) {
      if (!isCurrentlyConnected) {
        // Show connect confirmation modal
        setDialogPlatform(name)
        setDialogType('connect-social')
        setDialogOpen(true)
      }
    } else {
      if (isCurrentlyConnected) {
        // Show disconnect confirmation modal
        const origValue = socialForm.getValues(name)
        setOriginalValue(origValue)
        socialForm.setValue(name, '', { shouldValidate: true })
        setDialogPlatform(name)
        setDialogType('disconnect')
        setDialogOpen(true)
      }
    }
  }

  const handleConfirmSocialConnect = () => {
    if (dialogPlatform) {
      const baseUrl = dialogPlatform === 'google' ? 'plus.google' : dialogPlatform
      socialForm.setValue(dialogPlatform, `https://${baseUrl}.com/yourusername`, { shouldValidate: true })
      toast.success(`${dialogPlatform.charAt(0).toUpperCase() + dialogPlatform.slice(1)} added successfully!`)
    }
    setDialogOpen(false)
    setDialogPlatform(null)
    setDialogType(null)
  }

  const handleCancelDialog = () => {
    if (dialogPlatform && dialogType === 'disconnect') {
      if (originalValue) {
        if (typeof originalValue === 'string') {
          socialForm.setValue(dialogPlatform, originalValue, { shouldValidate: true })
        } else {
          connectedForm.setValue(dialogPlatform, originalValue.providerId || '', { shouldValidate: true })
        }
      }
    }
    setDialogOpen(false)
    setDialogPlatform(null)
    setDialogType(null)
    setOriginalValue(null)
  }

  const accountPlatforms = [
    {
      name: 'facebook' as const,
      label: 'Facebook',
      icon: Facebook,
      color: 'text-blue-600'
    },
    {
      name: 'twitter' as const,
      label: 'Twitter',
      icon: Twitter,
      color: 'text-sky-500'
    },
    {
      name: 'linkedin' as const,
      label: 'LinkedIn',
      icon: Linkedin,
      color: 'text-blue-700'
    },
    {
      name: 'google' as const,
      label: 'Google',
      icon: Chrome,
      color: 'text-red-500'
    },
    {
      name: 'github' as const,
      label: 'GitHub',
      icon: Github,
      color: 'text-gray-800'
    }
  ]

  const isConnectedChecked = (name: keyof ConnectedAccountsFormData) => !!connectedValues[name] || connecting === name
  const isSocialChecked = (name: keyof SocialMediaFormData) => !!socialValues[name]

  return (
    <>
           <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Connected Accounts */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Connected Accounts</h3>
                {accountPlatforms.map((platform) => {
                  const Icon = platform.icon
                  return (
                    <div key={platform.name} className="flex items-center justify-between">
                      <Label 
                        htmlFor={`connected-${platform.name}`}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Icon className={`h-4 w-4 ${platform.color}`} />
                        {platform.label}
                      </Label>
                      <Switch
                        id={`connected-${platform.name}`}
                        checked={isConnectedChecked(platform.name)}
                        onCheckedChange={(checked) => handleConnectedToggle(platform.name, checked)}
                        disabled={isLoading}
                      />
                      {connectedForm.formState.errors[platform.name] && (
                        <p className="text-sm text-destructive mt-1">{connectedForm.formState.errors[platform.name]?.message}</p>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Social Media Accounts */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Social Media Accounts</h3>
                {accountPlatforms.map((platform) => {
                  const Icon = platform.icon
                  return (
                    <div key={platform.name} className="flex items-center justify-between">
                      <Label 
                        htmlFor={`social-${platform.name}`}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Icon className={`h-4 w-4 ${platform.color}`} />
                        {platform.label}
                      </Label>
                      <Switch
                        id={`social-${platform.name}`}
                        checked={isSocialChecked(platform.name)}
                        onCheckedChange={(checked) => handleSocialToggle(platform.name, checked)}
                        disabled={isLoading}
                      />
                      {socialForm.formState.errors[platform.name] && (
                        <p className="text-sm text-destructive mt-1">{socialForm.formState.errors[platform.name]?.message}</p>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Privacy Notice</h4>
              <p className="text-sm text-muted-foreground">
                Your connected accounts and social media links will be displayed on your public profile. 
                Only share links you&apos;re comfortable with others seeing.
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogType === 'connect-social' ? 'Add Social Media Account' : 'Disconnect Account'}
            </DialogTitle>
            <DialogDescription>
              {dialogType === 'connect-social'
                ? `Do you want to add your ${dialogPlatform} social media account?`
                : `Are you sure you want to disconnect your ${dialogPlatform} account? This action cannot be undone.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCancelDialog}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (dialogType === 'connect-social') {
                  handleConfirmSocialConnect()
                } else {
                  toast.success(`${dialogPlatform} disconnected successfully!`)
                  setDialogOpen(false)
                  setDialogPlatform(null)
                  setDialogType(null)
                  setOriginalValue(null)
                }
              }}
            >
              {dialogType === 'connect-social' ? 'Add' : 'Disconnect'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}