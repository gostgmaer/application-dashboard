"use client"
import React, { useState } from 'react'
import { useDialog } from '@/hooks/use-dialog'
import { FormDialog, InfoDialog, CustomDialog } from '@/components/layout/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  MessageSquare, 
  AlertCircle, 
  CheckCircle, 
  Info, 
  Settings,
  Users,
  FileText,
  Image,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Star,
  Heart,
  Share2,
  Download,
  Edit3,
  Trash2,
  Plus,
  Filter,
  Search
} from 'lucide-react'

interface User {
  id: number
  name: string
  email: string
  role: string
  status: 'active' | 'inactive'
}

interface FormData {
  name: string
  email: string
  message: string
  category: string
  priority: string
}

export default function DashboardLayout() {
  const { openDialog, closeDialog, confirm, alert } = useDialog()
  const [users] = useState<User[]>([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'inactive' }
  ])
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
    category: '',
    priority: 'medium'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Basic confirmation dialog
  const handleBasicConfirm = async () => {
    const result = await confirm({
      title: 'Confirm Action',
      description: 'Are you sure you want to proceed with this action? This cannot be undone.',
      confirmText: 'Yes, proceed',
      cancelText: 'Cancel',
      closeOnOverlayClick: false, // Cannot dismiss by clicking outside
      closeOnEscape: true // Can dismiss with Escape key
    })
    
    if (result) {
      await alert({
        title: 'Success!',
        description: 'Your action has been completed successfully.',
        variant: 'success',
        closeOnOverlayClick: false // Cannot dismiss by clicking outside
      })
    }
  }

  // Destructive confirmation dialog
  const handleDestructiveConfirm = async () => {
    const result = await confirm({
      title: 'Delete Item',
      description: 'This action cannot be undone. This will permanently delete the item and remove all associated data.',
      confirmText: 'Delete',
      cancelText: 'Keep',
      variant: 'destructive',
      closeOnOverlayClick: false, // Cannot dismiss by clicking outside
      closeOnEscape: false // Cannot dismiss with Escape key for safety
    })
    
    if (result) {
      await alert({
        title: 'Deleted',
        description: 'The item has been permanently deleted.',
        variant: 'info',
        closeOnOverlayClick: false
      })
    }
  }

  // Warning confirmation dialog
  const handleWarningConfirm = async () => {
    const result = await confirm({
      title: 'Important Change',
      description: 'This change may affect other parts of the system. Please review the implications before proceeding.',
      confirmText: 'Continue',
      cancelText: 'Review',
      variant: 'warning',
      closeOnOverlayClick: false,
      closeOnEscape: true
    })
    
    if (result) {
      await alert({
        title: 'Change Applied',
        description: 'The system has been updated successfully.',
        variant: 'success',
        closeOnOverlayClick: true // This one can be dismissed by clicking outside
      })
    }
  }

  // Custom content dialog
  const handleCustomDialog = () => {
    openDialog(
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">User Profile</h2>
        
        <div className="flex items-center gap-4 mb-6">
          <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
            JD
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">John Doe</h3>
            <p className="text-gray-600 dark:text-gray-300">Senior Developer</p>
          </div>
        </div>
        
        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
            <Mail className="h-4 w-4" />
            <span>john.doe@example.com</span>
          </div>
          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
            <Phone className="h-4 w-4" />
            <span>+1 (555) 123-4567</span>
          </div>
          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
            <MapPin className="h-4 w-4" />
            <span>San Francisco, CA</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-6">
          <Badge variant="secondary">React</Badge>
          <Badge variant="secondary">TypeScript</Badge>
          <Badge variant="secondary">Node.js</Badge>
          <Badge variant="secondary">Python</Badge>
        </div>
        
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={closeDialog}>Close</Button>
          <Button>Edit Profile</Button>
        </div>
      </div>,
      { 
        size: 'lg',
        closeOnOverlayClick: true, // Can dismiss by clicking outside
        closeOnEscape: true,
        showCloseButton: true
      }
    )
  }

  // Form dialog
  const handleFormDialog = () => {
    openDialog(
      <FormDialog
        title="Contact Support"
        onSubmit={async () => {
          setIsSubmitting(true)
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 2000))
          console.log('Form submitted:', formData)
          setIsSubmitting(false)
          closeDialog()
          
          await alert({
            title: 'Message Sent!',
            description: 'Thank you for contacting us. We\'ll get back to you within 24 hours.',
            variant: 'success',
            closeOnOverlayClick: true
          })
          
          setFormData({ name: '', email: '', message: '', category: '', priority: 'medium' })
        }}
        onCancel={closeDialog}
        submitText="Send Message"
        isSubmitting={isSubmitting}
        submitDisabled={!formData.name || !formData.email || !formData.message}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="your.email@example.com"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Technical Support</SelectItem>
                  <SelectItem value="billing">Billing Question</SelectItem>
                  <SelectItem value="feature">Feature Request</SelectItem>
                  <SelectItem value="bug">Bug Report</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Describe your issue or question in detail..."
              required
            />
          </div>
        </div>
      </FormDialog>,
      { 
        size: 'lg',
        closeOnOverlayClick: false, // Form should not be dismissed accidentally
        closeOnEscape: true,
        showCloseButton: true
      }
    )
  }

  // Info dialog
  const handleInfoDialog = () => {
    openDialog(
      <InfoDialog
        title="System Information"
        onClose={closeDialog}
        actions={
          <>
            <Button variant="outline">Download Report</Button>
            <Button variant="outline">Share</Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Here's an overview of your current system status and recent activity.
          </p>
          
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Active Users</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">1,234</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">System Uptime</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">99.9%</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Storage Used</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">2.4 GB</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">API Calls Today</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">15,678</div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Recent Updates</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Database optimization completed
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Security patches applied
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                New features deployed
              </li>
            </ul>
          </div>
        </div>
      </InfoDialog>,
      { 
        size: 'md',
        closeOnOverlayClick: true, // Info dialogs can be dismissed easily
        closeOnEscape: true,
        showCloseButton: true
      }
    )
  }

  // Full-screen custom dialog
  const handleFullScreenDialog = () => {
    openDialog(
      <CustomDialog
        showHeader
        title="Dashboard Analytics"
        showFooter
        footer={
          <div className="flex justify-between w-full">
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
            <Button onClick={closeDialog}>Close Dashboard</Button>
          </div>
        }
      >
        <div className="h-full">
          <Tabs defaultValue="overview" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="flex-1 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { title: 'Total Revenue', value: '$45,231', change: '+20.1%', icon: <FileText className="h-4 w-4" /> },
                  { title: 'Active Users', value: '2,350', change: '+180.1%', icon: <Users className="h-4 w-4" /> },
                  { title: 'New Signups', value: '12,234', change: '+19%', icon: <Calendar className="h-4 w-4" /> },
                  { title: 'Conversion Rate', value: '3.2%', change: '+4.2%', icon: <Star className="h-4 w-4" /> }
                ].map((stat, index) => (
                  <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                      {stat.icon}
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <p className="text-xs text-green-600">
                        {stat.change} from last month
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { action: 'New user registered', time: '2 minutes ago', type: 'user' },
                        { action: 'Payment processed', time: '5 minutes ago', type: 'payment' },
                        { action: 'Report generated', time: '10 minutes ago', type: 'report' },
                        { action: 'System backup completed', time: '15 minutes ago', type: 'system' }
                      ].map((activity, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="h-2 w-2 bg-blue-500 rounded-full" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{activity.action}</p>
                            <p className="text-xs text-gray-500">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" size="sm" className="justify-start">
                        <Plus className="h-4 w-4 mr-2" />
                        Add User
                      </Button>
                      <Button variant="outline" size="sm" className="justify-start">
                        <Edit3 className="h-4 w-4 mr-2" />
                        Edit Settings
                      </Button>
                      <Button variant="outline" size="sm" className="justify-start">
                        <FileText className="h-4 w-4 mr-2" />
                        Generate Report
                      </Button>
                      <Button variant="outline" size="sm" className="justify-start">
                        <Settings className="h-4 w-4 mr-2" />
                        System Config
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="users" className="flex-1">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage your team members and their permissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {users.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-sm font-medium">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                            {user.status}
                          </Badge>
                          <Badge variant="outline">{user.role}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="analytics" className="flex-1">
              <div className="text-center py-8">
                <Image className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Analytics Coming Soon</h3>
                <p className="text-gray-500 dark:text-gray-400">Advanced analytics and reporting features will be available here.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="settings" className="flex-1">
              <Card>
                <CardHeader>
                  <CardTitle>Application Settings</CardTitle>
                  <CardDescription>Configure your application preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { name: 'Email Notifications', description: 'Receive email updates about your account' },
                    { name: 'Push Notifications', description: 'Get notified about important updates' },
                    { name: 'Auto-save', description: 'Automatically save your work' },
                    { name: 'Dark Mode', description: 'Use dark theme across the application' }
                  ].map((setting, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{setting.name}</h4>
                        <p className="text-sm text-gray-500">{setting.description}</p>
                      </div>
                      <Button variant="outline" size="sm">Toggle</Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </CustomDialog>,
      { 
        size: 'full',
        showCloseButton: true,
        closeOnOverlayClick: false, // Full-screen dialogs should not be dismissed accidentally
        closeOnEscape: true
      }
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Reusable Dialog System
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            A comprehensive dialog system with multiple variants, animations, and easy-to-use hooks for seamless integration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-green-500" />
                <CardTitle>Basic Confirmation</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                Simple yes/no confirmation dialog with promise-based response.
              </CardDescription>
              <Button onClick={handleBasicConfirm} className="w-full">
                Show Confirmation
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Trash2 className="h-6 w-6 text-red-500" />
                <CardTitle>Destructive Action</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                Destructive confirmation with warning styling and context.
              </CardDescription>
              <Button onClick={handleDestructiveConfirm} variant="destructive" className="w-full">
                Delete Something
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <AlertCircle className="h-6 w-6 text-amber-500" />
                <CardTitle>Warning Dialog</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                Warning confirmation for actions that need attention.
              </CardDescription>
              <Button onClick={handleWarningConfirm} className="w-full bg-amber-500 hover:bg-amber-600">
                Show Warning
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <MessageSquare className="h-6 w-6 text-blue-500" />
                <CardTitle>Custom Content</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                Dialog with completely custom content and interactions.
              </CardDescription>
              <Button onClick={handleCustomDialog} className="w-full">
                Show Profile
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Edit3 className="h-6 w-6 text-purple-500" />
                <CardTitle>Form Dialog</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                Complete form with validation, loading states, and submission.
              </CardDescription>
              <Button onClick={handleFormDialog} className="w-full">
                Contact Support
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Info className="h-6 w-6 text-indigo-500" />
                <CardTitle>Info Dialog</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                Information display with additional actions and rich content.
              </CardDescription>
              <Button onClick={handleInfoDialog} className="w-full">
                System Info
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow md:col-span-2 lg:col-span-3">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Settings className="h-6 w-6 text-gray-500" />
                <CardTitle>Full-Screen Dashboard</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                Complex full-screen dialog with tabs, cards, and interactive content for dashboard-style interfaces.
              </CardDescription>
              <Button onClick={handleFullScreenDialog} className="w-full">
                Open Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Features & Benefits</CardTitle>
            <CardDescription>What makes this dialog system powerful and easy to use</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium mb-1">Promise-based API</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Use async/await with confirmation dialogs for clean code
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium mb-1">Multiple Variants</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Pre-built styles for different use cases and contexts
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium mb-1">Accessible</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Built with accessibility in mind using Radix primitives
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium mb-1">Flexible Sizing</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Multiple size options from small alerts to full-screen
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium mb-1">Easy Integration</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Simple hooks and components for quick implementation
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium mb-1">Customizable</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Highly customizable with props and styling options
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}