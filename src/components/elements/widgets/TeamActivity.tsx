'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Users, 
  Clock, 
  Target, 
  Award,
  Calendar,
  MessageSquare,
  CheckCircle,
  TrendingUp
} from 'lucide-react'

const teamMembers = [
  {
    id: 1,
    name: 'John Doe',
    role: 'Frontend Developer',
    avatar: '/avatars/john.jpg',
    status: 'online',
    tasksCompleted: 12,
    tasksTotal: 15,
    hoursWorked: 38,
    productivity: 92,
    lastActive: 'Active now'
  },
  {
    id: 2,
    name: 'Jane Smith',
    role: 'Backend Developer',
    avatar: '/avatars/jane.jpg',
    status: 'away',
    tasksCompleted: 8,
    tasksTotal: 10,
    hoursWorked: 35,
    productivity: 88,
    lastActive: '5 minutes ago'
  },
  {
    id: 3,
    name: 'Mike Johnson',
    role: 'UI/UX Designer',
    avatar: '/avatars/mike.jpg',
    status: 'online',
    tasksCompleted: 6,
    tasksTotal: 8,
    hoursWorked: 32,
    productivity: 85,
    lastActive: 'Active now'
  },
  {
    id: 4,
    name: 'Sarah Connor',
    role: 'Project Manager',
    avatar: '/avatars/sarah.jpg',
    status: 'offline',
    tasksCompleted: 10,
    tasksTotal: 12,
    hoursWorked: 40,
    productivity: 95,
    lastActive: '2 hours ago'
  },
  {
    id: 5,
    name: 'Tom Wilson',
    role: 'DevOps Engineer',
    avatar: '/avatars/tom.jpg',
    status: 'online',
    tasksCompleted: 7,
    tasksTotal: 9,
    hoursWorked: 36,
    productivity: 78,
    lastActive: 'Active now'
  }
]

const recentActivities = [
  {
    user: 'John Doe',
    action: 'completed task',
    target: 'User Authentication Module',
    timestamp: '10 minutes ago',
    type: 'completion'
  },
  {
    user: 'Jane Smith',
    action: 'started working on',
    target: 'API Integration',
    timestamp: '25 minutes ago',
    type: 'start'
  },
  {
    user: 'Mike Johnson',
    action: 'uploaded design',
    target: 'Dashboard Mockups v2',
    timestamp: '1 hour ago',
    type: 'upload'
  },
  {
    user: 'Sarah Connor',
    action: 'scheduled meeting',
    target: 'Sprint Planning',
    timestamp: '2 hours ago',
    type: 'meeting'
  },
  {
    user: 'Tom Wilson',
    action: 'deployed to',
    target: 'Staging Environment',
    timestamp: '3 hours ago',
    type: 'deployment'
  }
]

const teamStats = {
  totalMembers: 5,
  activeMembers: 3,
  avgProductivity: 87.6,
  totalHours: 181,
  completedTasks: 43,
  totalTasks: 54
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'online': return 'bg-green-500'
    case 'away': return 'bg-yellow-500'
    case 'offline': return 'bg-gray-400'
    default: return 'bg-gray-400'
  }
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'completion': return <CheckCircle className="h-4 w-4 text-green-600" />
    case 'start': return <Clock className="h-4 w-4 text-blue-600" />
    case 'upload': return <TrendingUp className="h-4 w-4 text-purple-600" />
    case 'meeting': return <Calendar className="h-4 w-4 text-orange-600" />
    case 'deployment': return <Target className="h-4 w-4 text-red-600" />
    default: return <MessageSquare className="h-4 w-4 text-gray-600" />
  }
}

export default function TeamActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Team Activity
        </CardTitle>
        <CardDescription>Monitor team performance and recent activities</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Team Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">{teamStats.activeMembers}/{teamStats.totalMembers}</div>
            <div className="text-xs text-gray-600">Active Members</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <Award className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">{teamStats.avgProductivity}%</div>
            <div className="text-xs text-gray-600">Avg Productivity</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <Clock className="h-6 w-6 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600">{teamStats.totalHours}h</div>
            <div className="text-xs text-gray-600">Total Hours</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <Target className="h-6 w-6 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-600">{teamStats.completedTasks}/{teamStats.totalTasks}</div>
            <div className="text-xs text-gray-600">Tasks Done</div>
          </div>
        </div>

        {/* Team Members */}
        <div>
          <h4 className="font-medium mb-3">Team Members</h4>
          <ScrollArea className="h-64">
            <div className="space-y-3">
              {teamMembers.map((member) => (
                <div key={member.id} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(member.status)}`}></div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div>
                          <h5 className="font-medium text-sm">{member.name}</h5>
                          <p className="text-xs text-gray-500">{member.role}</p>
                        </div>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          {member.productivity}%
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-xs text-gray-600 mb-2">
                        <div>
                          <span>Tasks: {member.tasksCompleted}/{member.tasksTotal}</span>
                          <Progress value={(member.tasksCompleted / member.tasksTotal) * 100} className="h-1 mt-1" />
                        </div>
                        <div>
                          <span>Hours: {member.hoursWorked}h</span>
                        </div>
                      </div>
                      
                      <p className="text-xs text-gray-400">{member.lastActive}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Recent Activities */}
        <div>
          <h4 className="font-medium mb-3">Recent Activities</h4>
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded">
                {getActivityIcon(activity.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-medium">{activity.user}</span>
                    <span className="text-gray-600"> {activity.action} </span>
                    <span className="font-medium">{activity.target}</span>
                  </p>
                  <p className="text-xs text-gray-400">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}