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