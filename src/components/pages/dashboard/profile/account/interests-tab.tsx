'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Plus, X, Heart, Sparkles } from 'lucide-react'
import { interestsSchema, InterestsFormData } from '@/lib/validation/account'
import { User } from '@/types/user'
import { toast } from 'sonner'

interface InterestsTabProps {
  user: User
}

export default function InterestsTab({ user }: InterestsTabProps) {
  const [interests, setInterests] = useState<string[]>(user.interests||[])
  const [isLoading, setIsLoading] = useState(false)
  const [newInterest, setNewInterest] = useState('')

  console.log(user);
  
  const {
    handleSubmit,
    formState: { errors }
  } = useForm<InterestsFormData>({
    resolver: zodResolver(interestsSchema)
  })

  const suggestedInterests = [
    'Technology', 'Travel', 'Photography', 'Cooking', 'Music',
    'Sports', 'Reading', 'Gaming', 'Art', 'Fashion',
    'Health & Fitness', 'Business', 'Science', 'Movies',
    'Nature', 'History', 'Design', 'Writing', 'Meditation',
    'Learning Languages'
  ]

  const handleAddInterest = () => {
    if (!newInterest.trim()) return
    
    if (interests.includes(newInterest.trim())) {
      toast.error('Interest already added')
      return
    }

    if (interests.length >= 20) {
      toast.error('Maximum 20 interests allowed')
      return
    }

    setInterests(prev => [...prev, newInterest.trim()])
    setNewInterest('')
  }

  const handleRemoveInterest = (interestToRemove: string) => {
    setInterests(prev => prev.filter(interest => interest !== interestToRemove))
  }

  const handleAddSuggested = (interest: string) => {
    if (interests.includes(interest)) {
      toast.error('Interest already added')
      return
    }

    if (interests.length >= 20) {
      toast.error('Maximum 20 interests allowed')
      return
    }

    setInterests(prev => [...prev, interest])
  }

  const onSubmit = async () => {
    if (interests.length === 0) {
      toast.error('Please add at least one interest')
      return
    }

    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Updated interests:', interests)
      toast.success('Interests updated successfully!')
    } catch (error) {
      toast.error('Failed to update interests. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddInterest()
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Your Interests
          </CardTitle>
          <CardDescription>
            Tell us about your interests to personalize your experience. You can add up to 20 interests.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add New Interest */}
          <div className="space-y-2">
            <Label htmlFor="newInterest">Add Interest</Label>
            <div className="flex gap-2">
              <Input
                id="newInterest"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter an interest..."
                maxLength={50}
              />
              <Button 
                type="button" 
                onClick={handleAddInterest}
                disabled={!newInterest.trim() || interests.length >= 20}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {interests.length}/20 interests added
            </p>
          </div>

          {/* Current Interests */}
          {interests.length > 0 && (
            <div className="space-y-2">
              <Label>Your Interests</Label>
              <div className="flex flex-wrap gap-2">
                {interests.map((interest) => (
                  <Badge 
                    key={interest} 
                    variant="secondary" 
                    className="text-sm px-3 py-1 flex items-center gap-2 hover:bg-secondary/80 transition-colors"
                  >
                    {interest}
                    <button
                      type="button"
                      onClick={() => handleRemoveInterest(interest)}
                      className="hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Suggested Interests */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Suggested Interests
            </Label>
            <div className="flex flex-wrap gap-2">
              {suggestedInterests
                .filter(interest => !interests.includes(interest))
                .map((interest) => (
                  <Badge 
                    key={interest} 
                    variant="outline" 
                    className="text-sm px-3 py-1 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => handleAddSuggested(interest)}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    {interest}
                  </Badge>
                ))}
            </div>
            {suggestedInterests.filter(interest => !interests.includes(interest)).length === 0 && (
              <p className="text-sm text-muted-foreground">
                You've added all our suggested interests! Feel free to add your own.
              </p>
            )}
          </div>

          {errors.interests && (
            <p className="text-sm text-destructive">{errors.interests.message}</p>
          )}
        </CardContent>
      </Card>

      {/* Benefits */}
      <Card>
        <CardHeader>
          <CardTitle>Why Add Interests?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <Sparkles className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium">Personalized Recommendations</h4>
                <p className="text-muted-foreground">
                  Get content and product recommendations tailored to your interests
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 rounded-full">
                <Heart className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium">Better Experience</h4>
                <p className="text-muted-foreground">
                  Enjoy a more relevant and engaging experience across our platform
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end pt-4">
        <Button onClick={handleSubmit(onSubmit)} disabled={isLoading || interests.length === 0}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Interests'
          )}
        </Button>
      </div>
    </div>
  )
}