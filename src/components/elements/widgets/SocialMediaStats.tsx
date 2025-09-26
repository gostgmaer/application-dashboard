'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { 
  Share2, 
  Heart, 
  MessageCircle, 
  Users, 
  TrendingUp,
  TrendingDown,
  Eye
} from 'lucide-react'

const socialPlatforms = [
  {
    name: 'Twitter',
    followers: 12500,
    growth: 8.5,
    engagement: 4.2,
    posts: 45,
    color: 'bg-blue-500',
    icon: '🐦'
  },
  {
    name: 'Instagram',
    followers: 8900,
    growth: 12.3,
    engagement: 6.8,
    posts: 32,
    color: 'bg-pink-500',
    icon: '📷'
  },
  {
    name: 'LinkedIn',
    followers: 5600,
    growth: -2.1,
    engagement: 3.4,
    posts: 18,
    color: 'bg-blue-600',
    icon: '💼'
  },
  {
    name: 'Facebook',
    followers: 15200,
    growth: 5.7,
    engagement: 2.9,
    posts: 28,
    color: 'bg-blue-700',
    icon: '👥'
  }
]

const engagementData = [
  { day: 'Mon', likes: 245, comments: 32, shares: 18, views: 1200 },
  { day: 'Tue', likes: 189, comments: 28, shares: 15, views: 980 },
  { day: 'Wed', likes: 312, comments: 45, shares: 24, views: 1450 },
  { day: 'Thu', likes: 278, comments: 38, shares: 21, views: 1320 },
  { day: 'Fri', likes: 356, comments: 52, shares: 29, views: 1680 },
  { day: 'Sat', likes: 198, comments: 25, shares: 12, views: 890 },
  { day: 'Sun', likes: 167, comments: 19, shares: 9, views: 750 },
]

const topPosts = [
  {
    platform: 'Instagram',
    content: 'Behind the scenes of our latest product launch...',
    likes: 1234,
    comments: 89,
    shares: 45,
    engagement: 8.9
  },
  {
    platform: 'Twitter',
    content: 'Exciting news! We just hit 10K followers 🎉',
    likes: 892,
    comments: 156,
    shares: 234,
    engagement: 12.4
  },
  {
    platform: 'LinkedIn',
    content: 'How we increased productivity by 40% with...',
    likes: 567,
    comments: 78,
    shares: 123,
    engagement: 6.7
  }
]

export default function SocialMediaStats() {
  const totalFollowers = socialPlatforms.reduce((sum, platform) => sum + platform.followers, 0)
  const avgGrowth = socialPlatforms.reduce((sum, platform) => sum + platform.growth, 0) / socialPlatforms.length

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="h-5 w-5" />
          Social Media Analytics
        </CardTitle>
        <CardDescription>Track your social media performance across platforms</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">{totalFollowers.toLocaleString()}</div>
            <div className="text-xs text-gray-600">Total Followers</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">+{avgGrowth.toFixed(1)}%</div>
            <div className="text-xs text-gray-600">Avg Growth</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <Heart className="h-6 w-6 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600">2.1K</div>
            <div className="text-xs text-gray-600">Total Likes</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <MessageCircle className="h-6 w-6 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-600">456</div>
            <div className="text-xs text-gray-600">Comments</div>
          </div>
        </div>

        {/* Platform Performance */}
        <div>
          <h4 className="font-medium mb-3">Platform Performance</h4>
          <div className="space-y-3">
            {socialPlatforms.map((platform, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{platform.icon}</span>
                    <div>
                      <div className="font-medium">{platform.name}</div>
                      <div className="text-sm text-gray-500">{platform.followers.toLocaleString()} followers</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`flex items-center space-x-1 ${platform.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {platform.growth >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                      <span className="text-sm font-medium">{platform.growth > 0 ? '+' : ''}{platform.growth}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500">Engagement</div>
                    <div className="font-medium">{platform.engagement}%</div>
                    <Progress value={platform.engagement * 10} className="h-1 mt-1" />
                  </div>
                  <div>
                    <div className="text-gray-500">Posts</div>
                    <div className="font-medium">{platform.posts}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Avg/Post</div>
                    <div className="font-medium">{Math.round(platform.followers / platform.posts)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Engagement Trend */}
        <div>
          <h4 className="font-medium mb-3">Weekly Engagement</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="likes" stroke="#8884d8" strokeWidth={2} />
              <Line type="monotone" dataKey="comments" stroke="#82ca9d" strokeWidth={2} />
              <Line type="monotone" dataKey="shares" stroke="#ffc658" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Performing Posts */}
        <div>
          <h4 className="font-medium mb-3">Top Performing Posts</h4>
          <div className="space-y-3">
            {topPosts.map((post, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <Badge variant="secondary" className="mb-2">{post.platform}</Badge>
                    <p className="text-sm text-gray-700 mb-2">{post.content}</p>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {post.engagement}% engagement
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Heart className="h-4 w-4" />
                    <span>{post.likes}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="h-4 w-4" />
                    <span>{post.comments}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Share2 className="h-4 w-4" />
                    <span>{post.shares}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}