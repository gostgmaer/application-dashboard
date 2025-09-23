'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Plus, 
  Users, 
  FileText, 
  Settings, 
  Download, 
  Upload,
  Mail,
  Calendar,
  CreditCard
} from 'lucide-react'

const quickActions = [
  { 
    label: 'Add User', 
    icon: Plus, 
    description: 'Create new user account',
    action: 'add-user',
    color: 'bg-blue-500 hover:bg-blue-600'
  },
  { 
    label: 'Generate Report', 
    icon: FileText, 
    description: 'Create analytics report',
    action: 'generate-report',
    color: 'bg-green-500 hover:bg-green-600'
  },
  { 
    label: 'Send Newsletter', 
    icon: Mail, 
    description: 'Send email to users',
    action: 'send-newsletter',
    color: 'bg-purple-500 hover:bg-purple-600'
  },
  { 
    label: 'Export Data', 
    icon: Download, 
    description: 'Export user data',
    action: 'export-data',
    color: 'bg-orange-500 hover:bg-orange-600'
  },
  { 
    label: 'Import Data', 
    icon: Upload, 
    description: 'Import CSV file',
    action: 'import-data',
    color: 'bg-teal-500 hover:bg-teal-600'
  },
  { 
    label: 'Schedule Meeting', 
    icon: Calendar, 
    description: 'Book team meeting',
    action: 'schedule-meeting',
    color: 'bg-indigo-500 hover:bg-indigo-600'
  },
  { 
    label: 'Process Payments', 
    icon: CreditCard, 
    description: 'Bulk payment processing',
    action: 'process-payments',
    color: 'bg-pink-500 hover:bg-pink-600'
  },
  { 
    label: 'System Settings', 
    icon: Settings, 
    description: 'Configure system',
    action: 'system-settings',
    color: 'bg-gray-500 hover:bg-gray-600'
  }
]

export default function QuickActions() {
  const handleAction = (action: string) => {
    console.log(`Executing action: ${action}`)
    // Here you would integrate with your backend API
    // Example: api.execute(action)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Frequently used administrative tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => (
            <Button
              key={action.action}
              variant="outline"
              className={`h-auto p-4 flex flex-col items-center space-y-2 hover:scale-105 transition-all duration-200 ${action.color} text-white border-0`}
              onClick={() => handleAction(action.action)}
            >
              <action.icon className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium text-sm">{action.label}</div>
                <div className="text-xs opacity-90">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}