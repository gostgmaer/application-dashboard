'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { User, Shield, Settings, Heart, MapPin, CreditCard, Crown, Users } from 'lucide-react'
import PersonalDetailsTab from './personal-details-tab'
import SecurityTab from './security-tab'
import PreferencesTab from './preferences-tab'
import SocialMediaTab from './social-media-tab'
import InterestsTab from './interests-tab'
import AddressesTab from './addresses-tab'
import PaymentMethodsTab from './payment-methods-tab'
import SubscriptionTab from './subscription-tab'
import ProfileHeader from './profile-header'


export default function AccountPage({user}:any) {

  const [activeTab, setActiveTab] = useState('personal')

  

  const tabs = [
    {
      id: 'personal',
      label: 'Personal Details',
      icon: User,
      component: PersonalDetailsTab
    },
    {
      id: 'security',
      label: 'Security',
      icon: Shield,
      component: SecurityTab
    },
    {
      id: 'preferences',
      label: 'Preferences',
      icon: Settings,
      component: PreferencesTab
    },
    {
      id: 'social',
      label: 'Social Media',
      icon: Users,
      component: SocialMediaTab
    },
    // {
    //   id: 'interests',
    //   label: 'Interests',
    //   icon: Heart,
    //   component: InterestsTab
    // },
    {
      id: 'addresses',
      label: 'Addresses',
      icon: MapPin,
      component: AddressesTab
    },
    {
      id: 'payment',
      label: 'Payment Methods',
      icon: CreditCard,
      component: PaymentMethodsTab
    },
    {
      id: 'subscription',
      label: 'Subscription',
      icon: Crown,
      component: SubscriptionTab
    }
  ]

  return (
    <div className=" mx-auto py-8 ">
    

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Profile Summary Card */}
        <div className="lg:col-span-1">
          <ProfileHeader user={user} />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 lg:grid-cols-8 h-auto p-1 bg-muted/50">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="flex flex-col items-center gap-2 p-3 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-xs font-medium hidden sm:block">
                      {tab.label}
                    </span>
                  </TabsTrigger>
                )
              })}
            </TabsList>

            {tabs.map((tab) => {
              const Component = tab.component
              return (
                <TabsContent key={tab.id} value={tab.id} className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <tab.icon className="h-5 w-5" />
                        {tab.label}
                      </CardTitle>
                      <CardDescription>
                        {getTabDescription(tab.id)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <Component user={user} />
                    </CardContent>
                  </Card>
                </TabsContent>
              )
            })}
          </Tabs>
        </div>
      </div>
    </div>
  )
}

function getTabDescription(tabId: string): string {
  const descriptions = {
    personal: 'Update your personal information and profile details',
    security: 'Manage your security settings, passwords, and two-factor authentication',
    preferences: 'Customize your experience with language, theme, and notification settings',
    social: 'Connect and manage your social media accounts',
    interests: 'Tell us about your interests to personalize your experience',
    addresses: 'Manage your shipping and billing addresses',
    payment: 'Add and manage your payment methods',
    subscription: 'View and manage your subscription plan and billing'
  }
  return descriptions[tabId as keyof typeof descriptions] || ''
}