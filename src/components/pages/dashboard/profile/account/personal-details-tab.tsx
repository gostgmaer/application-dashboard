'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Camera, Loader2 } from 'lucide-react'
import { personalDetailsSchema, PersonalDetailsFormData } from '@/lib/validation/account'
import { User } from '@/types/user'
import { toast } from 'sonner'

interface PersonalDetailsTabProps {
  user: User
}

export default function PersonalDetailsTab({ user }: PersonalDetailsTabProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string>(user.profilePicture || '')

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<PersonalDetailsFormData>({
    resolver: zodResolver(personalDetailsSchema),
    defaultValues: {
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email,
      username: user.username,
      phoneNumber: user.phoneNumber || '',
      dateOfBirth: user?.dateOfBirth
        ? new Date(user.dateOfBirth).toISOString().split("T")[0]
        : "",
      gender: user.gender || '',
      profilePicture: user.profilePicture || ''
    }
  })

  const watchedGender = watch('gender')

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // In a real app, you'd upload this to your server/cloud storage
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setPreviewImage(result)
        setValue('profilePicture', result)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (data: PersonalDetailsFormData) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Updated personal details:', data)
      toast.success('Personal details updated successfully!')
    } catch (error) {
      toast.error('Failed to update personal details. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Profile Picture */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Avatar className="h-20 w-20">
            <AvatarImage src={previewImage} alt="Profile" />
            <AvatarFallback className="text-lg">
              {getInitials(watch('firstName'), watch('lastName'))}
            </AvatarFallback>
          </Avatar>
          <label className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1.5 cursor-pointer hover:bg-primary/90 transition-colors">
            <Camera className="h-3 w-3" />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>
        <div>
          <h4 className="font-medium">Profile Picture</h4>
          <p className="text-sm text-muted-foreground">
            Click the camera icon to change your profile picture
          </p>
        </div>
      </div>

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            {...register('firstName')}
            placeholder="Enter your first name"
          />
          {errors.firstName && (
            <p className="text-sm text-destructive">{errors.firstName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            {...register('lastName')}
            placeholder="Enter your last name"
          />
          {errors.lastName && (
            <p className="text-sm text-destructive">{errors.lastName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">Username *</Label>
          <Input
            id="username"
            {...register('username')}
            placeholder="Enter your username"
          />
          {errors.username && (
            <p className="text-sm text-destructive">{errors.username.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            {...register('phoneNumber')}
            placeholder="1234567890"
          />
          {errors.phoneNumber && (
            <p className="text-sm text-destructive">{errors.phoneNumber.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Input
            id="dateOfBirth"
            type="date"
            {...register('dateOfBirth')}
          />
          {errors.dateOfBirth && (
            <p className="text-sm text-destructive">{errors.dateOfBirth.message}</p>
          )}
        </div>
      </div>

      {/* Gender Selection */}
      <div className="space-y-2">
        <Label>Gender</Label>
        <Select value={watchedGender} onValueChange={(value) => setValue('gender', value as any)}>
          <SelectTrigger>
            <SelectValue placeholder="Select your gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="other">Other</SelectItem>
            <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
          </SelectContent>
        </Select>
        {errors.gender && (
          <p className="text-sm text-destructive">{errors.gender.message}</p>
        )}
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
  )
}