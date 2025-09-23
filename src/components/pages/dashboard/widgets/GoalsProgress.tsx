'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Target, 
  TrendingUp, 
  Calendar, 
  DollarSign,
  Users,
  ShoppingCart,
  Award,
  CheckCircle
} from 'lucide-react'

const goals = [
  {
    id: 1,
    title: 'Monthly Revenue Target',
    description: 'Reach $50,000 in monthly recurring revenue',
    current: 42000,
    target: 50000,
    unit: '$',
    deadline: '2024-01-31',
    category: 'Revenue',
    icon: DollarSign,
    color: 'bg-green-500',
    status: 'on-track'
  },
  {
    id: 2,
    title: 'New User Acquisition',
    description: 'Acquire 1,000 new active users',
    current: 750,
    target: 1000,
    unit: '',
    deadline: '2024-02-15',
    category: 'Growth',
    icon: Users,
    color: 'bg-blue-500',
    status: 'on-track'
  },
  {
    id: 3,
    title: 'Product Launch',
    description: 'Launch new premium features',
    current: 7,
    target: 10,
    unit: ' features',
    deadline: '2024-01-25',
    category: 'Product',
    icon: Award,
    color: 'bg-purple-500',
    status: 'behind'
  },
  {
    id: 4,
    title: 'Customer Satisfaction',
    description: 'Maintain 95% customer satisfaction rate',
    current: 92,
    target: 95,
    unit: '%',
    deadline: '2024-01-31',
    category: 'Quality',
    icon: CheckCircle,
    color: 'bg-orange-500',
    status: 'at-risk'
  },
  {
    id: 5,
    title: 'Sales Conversion',
    description: 'Improve conversion rate to 5%',
    current: 4.2,
    target: 5.0,
    unit: '%',
    deadline: '2024-02-28',
    category: 'Sales',
    icon: ShoppingCart,
    color: 'bg-pink-500',
    status: 'on-track'
  }
]

const milestones = [
  { title: 'Q4 Revenue Goal', completed: true, date: '2023-12-31' },
  { title: '10K User Milestone', completed: true, date: '2024-01-10' },
  { title: 'Mobile App Launch', completed: false, date: '2024-01-30' },
  { title: 'API v2 Release', completed: false, date: '2024-02-15' },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'bg-green-100 text-green-800'
    case 'on-track': return 'bg-blue-100 text-blue-800'
    case 'behind': return 'bg-yellow-100 text-yellow-800'
    case 'at-risk': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const calculateProgress = (current: number, target: number) => {
  return Math.min((current / target) * 100, 100)
}

const getDaysUntilDeadline = (deadline: string) => {
  const today = new Date()
  const deadlineDate = new Date(deadline)
  const diffTime = deadlineDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

export default function GoalsProgress() {
  const completedGoals = goals.filter(goal => calculateProgress(goal.current, goal.target) >= 100).length
  const totalGoals = goals.length
  const overallProgress = (completedGoals / totalGoals) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Goals & Objectives
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {completedGoals}/{totalGoals} Complete
          </Badge>
        </CardTitle>
        <CardDescription>Track progress towards your key objectives</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">Overall Progress</h3>
            <span className="text-2xl font-bold">{overallProgress.toFixed(0)}%</span>
          </div>
          <Progress value={overallProgress} className="h-2 bg-blue-400" />
          <p className="text-blue-100 text-sm mt-2">
            {completedGoals} of {totalGoals} goals completed
          </p>
        </div>

        {/* Individual Goals */}
        <div className="space-y-4">
          {goals.map((goal) => {
            const progress = calculateProgress(goal.current, goal.target)
            const daysLeft = getDaysUntilDeadline(goal.deadline)
            
            return (
              <div key={goal.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${goal.color} bg-opacity-10`}>
                      <goal.icon className={`h-5 w-5 text-gray-700`} />
                    </div>
                    <div>
                      <h4 className="font-medium">{goal.title}</h4>
                      <p className="text-sm text-gray-600">{goal.description}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className={getStatusColor(goal.status)}>
                    {goal.status}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Progress</span>
                    <span className="text-sm font-medium">
                      {goal.current.toLocaleString()}{goal.unit} / {goal.target.toLocaleString()}{goal.unit}
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>{progress.toFixed(1)}% complete</span>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {daysLeft > 0 ? `${daysLeft} days left` : `${Math.abs(daysLeft)} days overdue`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Milestones */}
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Award className="h-4 w-4" />
            Key Milestones
          </h4>
          <div className="space-y-2">
            {milestones.map((milestone, index) => (
              <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${milestone.completed ? 'bg-green-50' : 'bg-gray-50'}`}>
                <div className="flex items-center space-x-3">
                  <CheckCircle className={`h-5 w-5 ${milestone.completed ? 'text-green-600' : 'text-gray-400'}`} />
                  <div>
                    <div className={`font-medium text-sm ${milestone.completed ? 'text-green-900' : 'text-gray-900'}`}>
                      {milestone.title}
                    </div>
                    <div className="text-xs text-gray-500">Target: {milestone.date}</div>
                  </div>
                </div>
                <Badge variant="secondary" className={milestone.completed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                  {milestone.completed ? 'Completed' : 'Pending'}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="flex-1">
            <TrendingUp className="h-4 w-4 mr-2" />
            View Analytics
          </Button>
          <Button size="sm" className="flex-1">
            <Target className="h-4 w-4 mr-2" />
            Set New Goal
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}