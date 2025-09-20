'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Facebook, Twitter, Instagram, Linkedin, Chrome, Pin, Github, CheckCircle, AlertCircle, Unlink } from 'lucide-react'
import { socialMediaSchema, connectedAccountsSchema, SocialMediaFormData, ConnectedAccountsFormData } from '@/lib/validation/account'
import { User } from '@/types/user'
import { toast } from 'sonner'

interface SocialMediaTabProps {
  user: User
}

export default function SocialMediaTab({ user }: SocialMediaTabProps) {
  const [isLoadingSocial, setIsLoadingSocial] = useState(false)
  const [isLoadingConnected, setIsLoadingConnected] = useState(false)
  const [connectedAccounts, setConnectedAccounts] = useState(user.socialAccounts || [])

  const socialMediaForm = useForm<SocialMediaFormData>({
    resolver: zodResolver(socialMediaSchema),
    defaultValues: {
      facebook: user.socialMedia.facebook || '',
      twitter: user.socialMedia.twitter || '',
      instagram: user.socialMedia.instagram || '',
      linkedin: user.socialMedia.linkedin || '',
      google: user.socialMedia.google || '',
      pinterest: user.socialMedia.pinterest || ''
    }
  })

  const connectedAccountsForm = useForm<ConnectedAccountsFormData>({
    resolver: zodResolver(connectedAccountsSchema),
    defaultValues: {
      google: connectedAccounts.some(acc => acc.provider === 'google'),
      facebook: connectedAccounts.some(acc => acc.provider === 'facebook'),
      twitter: connectedAccounts.some(acc => acc.provider === 'twitter'),
      github: connectedAccounts.some(acc => acc.provider === 'github'),
      linkedin: connectedAccounts.some(acc => acc.provider === 'linkedin')
    }
  })

  const onSocialMediaSubmit = async (data: SocialMediaFormData) => {
    setIsLoadingSocial(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Updated social media:', data)
      toast.success('Social media links updated successfully!')
    } catch (error) {
      toast.error('Failed to update social media links. Please try again.')
    } finally {
      setIsLoadingSocial(false)
    }
  }

  const handleConnectAccount = async (provider: string, connect: boolean) => {
    setIsLoadingConnected(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      if (connect) {
        // Simulate OAuth connection
        const newAccount = {
          id: Date.now().toString(),
          provider: provider as any,
          providerId: `${provider}_${Math.random().toString(36).substr(2, 9)}`,
          email: user.email,
          verified: true,
          connectedAt: new Date().toISOString()
        }
        setConnectedAccounts(prev => [...prev, newAccount])
        toast.success(`${provider.charAt(0).toUpperCase() + provider.slice(1)} account connected successfully!`)
      } else {
        // Disconnect account
        setConnectedAccounts(prev => prev.filter(acc => acc.provider !== provider))
        toast.success(`${provider.charAt(0).toUpperCase() + provider.slice(1)} account disconnected successfully!`)
      }
    } catch (error) {
      toast.error(`Failed to ${connect ? 'connect' : 'disconnect'} ${provider} account.`)
    } finally {
      setIsLoadingConnected(false)
    }
  }

  const socialPlatforms = [
    {
      name: 'facebook',
      label: 'Facebook',
      icon: Facebook,
      placeholder: 'https://facebook.com/yourusername',
      color: 'text-blue-600'
    },
    {
      name: 'twitter',
      label: 'Twitter',
      icon: Twitter,
      placeholder: 'https://twitter.com/yourusername',
      color: 'text-sky-500'
    },
    {
      name: 'instagram',
      label: 'Instagram',
      icon: Instagram,
      placeholder: 'https://instagram.com/yourusername',
      color: 'text-pink-600'
    },
    {
      name: 'linkedin',
      label: 'LinkedIn',
      icon: Linkedin,
      placeholder: 'https://linkedin.com/in/yourusername',
      color: 'text-blue-700'
    },
    {
      name: 'google',
      label: 'Google',
      icon: Chrome,
      placeholder: 'https://plus.google.com/yourid',
      color: 'text-red-500'
    },
    {
      name: 'pinterest',
      label: 'Pinterest',
      icon: Pin,
      placeholder: 'https://pinterest.com/yourusername',
      color: 'text-red-600'
    }
  ] as const

  const connectedProviders = [
    {
      id: 'google',
      name: 'Google',
      icon: Chrome,
      color: 'text-red-500',
      description: 'Sign in with your Google account'
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: Facebook,
      color: 'text-blue-600',
      description: 'Sign in with your Facebook account'
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: Twitter,
      color: 'text-sky-500',
      description: 'Sign in with your Twitter account'
    },
    {
      id: 'github',
      name: 'GitHub',
      icon: Github,
      color: 'text-gray-800',
      description: 'Sign in with your GitHub account'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'text-blue-700',
      description: 'Sign in with your LinkedIn account'
    }
  ]

  const isAccountConnected = (provider: string) => {
    return connectedAccounts.some(acc => acc.provider === provider)
  }

  const getConnectedAccount = (provider: string) => {
    return connectedAccounts.find(acc => acc.provider === provider)
  }

  return (
    <div className="space-y-8">
      {/* Connected Accounts for Login */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Connected Accounts
          </CardTitle>
          <CardDescription>
            Connect social accounts to enable quick sign-in options. You can use these accounts to log in to your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Connected accounts allow you to sign in quickly without entering your password. 
              Make sure to keep at least one login method available.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            {connectedProviders.map((provider) => {
              const Icon = provider.icon
              const isConnected = isAccountConnected(provider.id)
              const connectedAccount = getConnectedAccount(provider.id)
              
              return (
                <div key={provider.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full bg-gray-100`}>
                      <Icon className={`h-5 w-5 ${provider.color}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{provider.name}</h4>
                        {isConnected && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Connected
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {isConnected 
                          ? `Connected as ${connectedAccount?.email} on ${new Date(connectedAccount?.connectedAt || '').toLocaleDateString()}`
                          : provider.description
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {isConnected && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleConnectAccount(provider.id, false)}
                        disabled={isLoadingConnected}
                        className="text-destructive hover:text-destructive"
                      >
                        <Unlink className="h-4 w-4" />
                      </Button>
                    )}
                    <Switch
                      checked={isConnected}
                      onCheckedChange={(checked) => handleConnectAccount(provider.id, checked)}
                      disabled={isLoadingConnected}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          {isLoadingConnected && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span className="text-sm text-muted-foreground">Processing connection...</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* Social Media Profile Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Instagram className="h-5 w-5" />
            Social Media Profiles
          </CardTitle>
          <CardDescription>
            Add links to your social media profiles to display on your public profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={socialMediaForm.handleSubmit(onSocialMediaSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {socialPlatforms.map((platform) => {
                const Icon = platform.icon
                return (
                  <div key={platform.name} className="space-y-2">
                    <Label 
                      htmlFor={platform.name}
                      className="flex items-center gap-2"
                    >
                      <Icon className={`h-4 w-4 ${platform.color}`} />
                      {platform.label}
                    </Label>
                    <Input
                      id={platform.name}
                      {...socialMediaForm.register(platform.name)}
                      placeholder={platform.placeholder}
                      type="url"
                    />
                    {socialMediaForm.formState.errors[platform.name] && (
                      <p className="text-sm text-destructive">
                        {socialMediaForm.formState.errors[platform.name]?.message}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Privacy Notice</h4>
              <p className="text-sm text-muted-foreground">
                Your social media links will be displayed on your public profile. 
                Only share links you&apos;re comfortable with others seeing.
              </p>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isLoadingSocial}>
                {isLoadingSocial ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Social Links'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}