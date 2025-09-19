import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CheckCircle, Star } from 'lucide-react'
import { User } from '@/types/user'

interface ProfileHeaderProps {
  user: User
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase()
  }

  const getSubscriptionColor = (type: string) => {
    switch (type) {
      case 'premium':
        return 'bg-gradient-to-r from-amber-400 to-orange-500'
      case 'enterprise':
        return 'bg-gradient-to-r from-purple-500 to-pink-500'
      default:
        return 'bg-gradient-to-r from-gray-400 to-gray-500'
    }
  }

  return (
    <Card className="sticky top-4">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user?.profilePicture} alt={user.firstName} />
              <AvatarFallback className="text-lg">
                {getInitials(user.firstName, user.lastName)}
              </AvatarFallback>
            </Avatar>
            {user.isVerified && (
              <CheckCircle className="absolute -bottom-1 -right-1 h-6 w-6 text-green-500 bg-white rounded-full" />
            )}
          </div>

          <div className="space-y-1">
            <h3 className="font-semibold text-lg">
              {user.firstName} {user.lastName}
            </h3>
            <p className="text-sm text-muted-foreground">@{user.username}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>

          <div className="flex flex-col items-center space-y-2 w-full">
            <Badge 
              variant="outline" 
              className={`${getSubscriptionColor(user.subscriptionType)} text-white border-none`}
            >
              {user.subscriptionType.charAt(0).toUpperCase() + user.subscriptionType.slice(1)} Plan
            </Badge>
            
            <div className="flex items-center gap-1 text-sm">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="font-medium">{user?.loyaltyPoints?.toLocaleString()}</span>
              <span className="text-muted-foreground">points</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full text-center pt-4 border-t">
            <div>
              <p className="text-lg font-semibold">{user.address.length}</p>
              <p className="text-xs text-muted-foreground">Addresses</p>
            </div>
            <div>
              <p className="text-lg font-semibold">{user.paymentMethods.length}</p>
              <p className="text-xs text-muted-foreground">Payment Methods</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}