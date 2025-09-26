'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  CheckSquare, 
  Plus, 
  Calendar, 
  User, 
  Flag,
  Clock,
  MoreHorizontal
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const initialTasks = [
  {
    id: 1,
    title: 'Update user dashboard UI',
    description: 'Implement new design system components',
    priority: 'high',
    status: 'in-progress',
    assignee: 'John Doe',
    dueDate: '2024-01-20',
    completed: false
  },
  {
    id: 2,
    title: 'Fix payment gateway integration',
    description: 'Resolve Stripe webhook issues',
    priority: 'urgent',
    status: 'todo',
    assignee: 'Jane Smith',
    dueDate: '2024-01-18',
    completed: false
  },
  {
    id: 3,
    title: 'Write API documentation',
    description: 'Document all REST endpoints',
    priority: 'medium',
    status: 'review',
    assignee: 'Mike Johnson',
    dueDate: '2024-01-25',
    completed: false
  },
  {
    id: 4,
    title: 'Database optimization',
    description: 'Optimize slow queries and add indexes',
    priority: 'low',
    status: 'completed',
    assignee: 'Sarah Connor',
    dueDate: '2024-01-15',
    completed: true
  },
  {
    id: 5,
    title: 'Security audit',
    description: 'Conduct comprehensive security review',
    priority: 'high',
    status: 'todo',
    assignee: 'Tom Wilson',
    dueDate: '2024-01-22',
    completed: false
  }
]

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'urgent': return 'bg-red-100 text-red-800'
    case 'high': return 'bg-orange-100 text-orange-800'
    case 'medium': return 'bg-yellow-100 text-yellow-800'
    case 'low': return 'bg-green-100 text-green-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'bg-green-100 text-green-800'
    case 'in-progress': return 'bg-blue-100 text-blue-800'
    case 'review': return 'bg-purple-100 text-purple-800'
    case 'todo': return 'bg-gray-100 text-gray-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

export default function TaskManagement() {
  const [tasks, setTasks] = useState(initialTasks)
  const [newTask, setNewTask] = useState('')

  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(task => 
      task.id === id 
        ? { ...task, completed: !task.completed, status: task.completed ? 'todo' : 'completed' }
        : task
    ))
  }

  const addTask = () => {
    if (newTask.trim()) {
      const task = {
        id: Date.now(),
        title: newTask,
        description: '',
        priority: 'medium',
        status: 'todo',
        assignee: 'Unassigned',
        dueDate: new Date().toISOString().split('T')[0],
        completed: false
      }
      setTasks(prev => [task, ...prev])
      setNewTask('')
    }
  }

  const completedTasks = tasks.filter(task => task.completed).length
  const totalTasks = tasks.length
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5" />
            Task Management
          </div>
          <Badge variant="secondary">
            {completedTasks}/{totalTasks} ({completionRate}%)
          </Badge>
        </CardTitle>
        <CardDescription>Track and manage your team's tasks</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Add New Task */}
        <div className="flex space-x-2 mb-4">
          <Input
            placeholder="Add a new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
          />
          <Button onClick={addTask} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Task Stats */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          <div className="text-center p-2 bg-blue-50 rounded">
            <div className="text-lg font-bold text-blue-600">{tasks.filter(t => t.status === 'todo').length}</div>
            <div className="text-xs text-gray-600">To Do</div>
          </div>
          <div className="text-center p-2 bg-yellow-50 rounded">
            <div className="text-lg font-bold text-yellow-600">{tasks.filter(t => t.status === 'in-progress').length}</div>
            <div className="text-xs text-gray-600">In Progress</div>
          </div>
          <div className="text-center p-2 bg-purple-50 rounded">
            <div className="text-lg font-bold text-purple-600">{tasks.filter(t => t.status === 'review').length}</div>
            <div className="text-xs text-gray-600">Review</div>
          </div>
          <div className="text-center p-2 bg-green-50 rounded">
            <div className="text-lg font-bold text-green-600">{completedTasks}</div>
            <div className="text-xs text-gray-600">Done</div>
          </div>
        </div>

        {/* Task List */}
        <ScrollArea className="h-64">
          <div className="space-y-3">
            {tasks.map((task) => (
              <div key={task.id} className={`p-3 border rounded-lg ${task.completed ? 'bg-gray-50' : 'bg-white'}`}>
                <div className="flex items-start space-x-3">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => toggleTask(task.id)}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`font-medium text-sm ${task.completed ? 'line-through text-gray-500' : ''}`}>
                        {task.title}
                      </h4>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Assign</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    {task.description && (
                      <p className={`text-xs text-gray-600 mb-2 ${task.completed ? 'line-through' : ''}`}>
                        {task.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className={getPriorityColor(task.priority)}>
                          <Flag className="h-3 w-3 mr-1" />
                          {task.priority}
                        </Badge>
                        <Badge variant="secondary" className={getStatusColor(task.status)}>
                          {task.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <User className="h-3 w-3" />
                        <span>{task.assignee}</span>
                        <Calendar className="h-3 w-3 ml-2" />
                        <span>{task.dueDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}