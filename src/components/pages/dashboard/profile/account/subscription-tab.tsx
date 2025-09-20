'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Crown, Check, Zap, Shield, Users, Loader2 } from 'lucide-react'
import { User } from '@/types/user'
import { toast } from 'sonner'

interface SubscriptionTabProps {
  user: User
}

export default function SubscriptionTab({ user }: SubscriptionTabProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [currentPlan, setCurrentPlan] = useState(user.subscriptionType)
  const [autoRenewal, setAutoRenewal] = useState(true)

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      icon: Users,
      features: [
        'Basic features',
        'Up to 5 projects',
        'Community support',
        '1GB storage'
      ],
      color: 'bg-gray-100 text-gray-800',
      description: 'Perfect for getting started'
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 19,
      icon: Zap,
      features: [
        'All Free features',
        'Unlimited projects',
        'Priority support',
        '100GB storage',
        'Advanced analytics',
        'Custom themes'
      ],
      color: 'bg-gradient-to-r from-amber-400 to-orange-500',
      description: 'Best for professionals',
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 99,
      icon: Shield,
      features: [
        'All Premium features',
        'Unlimited storage',
        'Dedicated support',
        'Advanced security',
        'Team collaboration',
        'Custom integrations',
        'SLA guarantee'
      ],
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
      description: 'For large organizations'
    }
  ]

  const handlePlanChange = async (planId: string) => {
    if (planId === currentPlan) return

    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setCurrentPlan(planId)
      
      if (planId === 'free') {
        toast.success('Successfully downgraded to Free plan')
      } else {
        toast.success(`Successfully upgraded to ${planId.charAt(0).toUpperCase() + planId.slice(1)} plan`)
      }
    } catch (error) {
      toast.error('Failed to change subscription plan')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAutoRenewalToggle = async (enabled: boolean) => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      setAutoRenewal(enabled)
      toast.success(`Auto-renewal ${enabled ? 'enabled' : 'disabled'}`)
    } catch (error) {
      toast.error('Failed to update auto-renewal setting')
    } finally {
      setIsLoading(false)
    }
  }

  const getCurrentPlan = () => {
    return plans.find(plan => plan.id === currentPlan)||{ name: 'Free', price: 0, color: 'bg-gray-100 text-gray-800', icon: Users}
  }

  return (
    <div className="space-y-6">
      {/* Current Subscription */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Current Subscription
          </CardTitle>
          <CardDescription>
            Manage your subscription and billing preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-amber-400 to-orange-500">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">
                    {getCurrentPlan()?.name} Plan
                  </h3>
                  <Badge 
                    className={getCurrentPlan()?.color}
                  >
                    {user.subscriptionStatus}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  ${getCurrentPlan()?.price}/month
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Next billing</p>
              <p className="font-medium">January 15, 2024</p>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Auto-renewal</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically renew your subscription each month
                </p>
              </div>
              <Switch
                checked={autoRenewal}
                onCheckedChange={handleAutoRenewalToggle}
                disabled={isLoading}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Plans */}
      <div>
        <h3 className="text-lg font-medium mb-4">Choose Your Plan</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const Icon = plan.icon
            const isCurrentPlan = plan.id === currentPlan
            
            return (
              <Card 
                key={plan.id} 
                className={`relative ${plan.popular ? 'border-primary shadow-lg' : ''} ${
                  isCurrentPlan ? 'ring-2 ring-primary' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className={`p-3 rounded-full ${
                      plan.id === 'free' 
                        ? 'bg-gray-100' 
                        : `bg-gradient-to-r ${plan.color.includes('gradient') ? plan.color : ''}`
                    }`}>
                      <Icon className={`h-6 w-6 ${
                        plan.id === 'free' ? 'text-gray-600' : 'text-white'
                      }`} />
                    </div>
                  </div>
                  
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  
                  <div className="mt-4">
                    <span className="text-3xl font-bold">
                      ${plan.price}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-muted-foreground">/month</span>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    variant={isCurrentPlan ? "outline" : "default"}
                    className="w-full"
                    disabled={isCurrentPlan || isLoading}
                    onClick={() => handlePlanChange(plan.id)}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : isCurrentPlan ? (
                      'Current Plan'
                    ) : plan.price > getCurrentPlan()?.price ? (
                      'Upgrade'
                    ) : (
                      'Downgrade'
                    )}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Billing Information */}
      <Card>
        <CardHeader>
          <CardTitle>Billing Information</CardTitle>
          <CardDescription>
            View your billing history and manage payment methods
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Current billing cycle</p>
                <p className="font-medium">Dec 15, 2023 - Jan 15, 2024</p>
              </div>
              <div>
                <p className="text-muted-foreground">Payment method</p>
                <p className="font-medium">•••• •••• •••• 1234</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="flex justify-between items-center">
              <span className="text-sm">Last payment</span>
              <span className="font-medium">${getCurrentPlan()?.price}.00 on Dec 15, 2023</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}