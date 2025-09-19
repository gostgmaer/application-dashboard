'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Loader2, CreditCard, Plus, Edit2, Trash2, Wallet } from 'lucide-react'
import { paymentMethodSchema, PaymentMethodFormData } from '@/lib/validation/account'
import { User } from '@/types/user'
import { toast } from 'sonner'

interface PaymentMethodsTabProps {
  user: User
}

export default function PaymentMethodsTab({ user }: PaymentMethodsTabProps) {
  const [paymentMethods, setPaymentMethods] = useState(user.paymentMethods)
  const [isLoading, setIsLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingMethod, setEditingMethod] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<PaymentMethodFormData>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      method: 'credit_card',
      holderName: '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      isDefault: false
    }
  })

  const watchedMethod = watch('method')

  const onSubmit = async (data: PaymentMethodFormData) => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (editingMethod) {
        // Update existing payment method
        setPaymentMethods(prev => prev.map(method => 
          method.id === editingMethod ? { 
            ...method, 
            ...data,
            cardNumber: `**** **** **** ${data.cardNumber.slice(-4)}`
          } : method
        ))
        toast.success('Payment method updated successfully!')
      } else {
        // Add new payment method
        const newMethod = {
          id: Date.now().toString(),
          ...data,
          cardNumber: `**** **** **** ${data.cardNumber.slice(-4)}`
        }
        setPaymentMethods(prev => [...prev, newMethod])
        toast.success('Payment method added successfully!')
      }

      setIsDialogOpen(false)
      setEditingMethod(null)
      reset()
    } catch (error) {
      toast.error('Failed to save payment method. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (method: any) => {
    setEditingMethod(method.id)
    setValue('method', method.method)
    setValue('holderName', method.holderName)
    setValue('cardNumber', '')
    setValue('expiryDate', method.expiryDate)
    setValue('cvv', '')
    setValue('isDefault', method.isDefault)
    setIsDialogOpen(true)
  }

  const handleDelete = async (methodId: string) => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      setPaymentMethods(prev => prev.filter(method => method.id !== methodId))
      toast.success('Payment method deleted successfully!')
    } catch (error) {
      toast.error('Failed to delete payment method.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSetDefault = async (methodId: string) => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      setPaymentMethods(prev => prev.map(method => ({
        ...method,
        isDefault: method.id === methodId
      })))
      toast.success('Default payment method updated!')
    } catch (error) {
      toast.error('Failed to update default payment method.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddNew = () => {
    reset()
    setEditingMethod(null)
    setIsDialogOpen(true)
  }

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'credit_card':
        return <CreditCard className="h-4 w-4" />
      case 'paypal':
        return <Wallet className="h-4 w-4" />
      default:
        return <CreditCard className="h-4 w-4" />
    }
  }

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'credit_card':
        return 'bg-blue-100 text-blue-800'
      case 'paypal':
        return 'bg-yellow-100 text-yellow-800'
      case 'bank_transfer':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatMethodName = (method: string) => {
    switch (method) {
      case 'credit_card':
        return 'Credit Card'
      case 'paypal':
        return 'PayPal'
      case 'bank_transfer':
        return 'Bank Transfer'
      default:
        return method
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Payment Methods</h3>
          <p className="text-sm text-muted-foreground">
            Manage your saved payment methods for faster checkout
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew}>
              <Plus className="mr-2 h-4 w-4" />
              Add Payment Method
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingMethod ? 'Edit Payment Method' : 'Add Payment Method'}
              </DialogTitle>
              <DialogDescription>
                {editingMethod 
                  ? 'Update your payment method information.' 
                  : 'Add a new payment method for faster checkout.'
                }
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <Select value={watchedMethod} onValueChange={(value) => setValue('method', value as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="credit_card">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          Credit Card
                        </div>
                      </SelectItem>
                      <SelectItem value="paypal">
                        <div className="flex items-center gap-2">
                          <Wallet className="h-4 w-4" />
                          PayPal
                        </div>
                      </SelectItem>
                      <SelectItem value="bank_transfer">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          Bank Transfer
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.method && (
                    <p className="text-sm text-destructive">{errors.method.message}</p>
                  )}
                </div>

                {watchedMethod === 'credit_card' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="holderName">Cardholder Name</Label>
                      <Input
                        id="holderName"
                        {...register('holderName')}
                        placeholder="John Doe"
                      />
                      {errors.holderName && (
                        <p className="text-sm text-destructive">{errors.holderName.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        {...register('cardNumber')}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                      {errors.cardNumber && (
                        <p className="text-sm text-destructive">{errors.cardNumber.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input
                          id="expiryDate"
                          {...register('expiryDate')}
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                        {errors.expiryDate && (
                          <p className="text-sm text-destructive">{errors.expiryDate.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          {...register('cvv')}
                          placeholder="123"
                          maxLength={3}
                        />
                        {errors.cvv && (
                          <p className="text-sm text-destructive">{errors.cvv.message}</p>
                        )}
                      </div>
                    </div>
                  </>
                )}

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isDefault"
                    checked={watch('isDefault')}
                    onCheckedChange={(checked) => setValue('isDefault', checked)}
                  />
                  <Label htmlFor="isDefault">Set as default payment method</Label>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false)
                    setEditingMethod(null)
                    reset()
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {editingMethod ? 'Updating...' : 'Adding...'}
                    </>
                  ) : (
                    editingMethod ? 'Update Method' : 'Add Method'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {paymentMethods.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-medium text-lg mb-2">No payment methods yet</h3>
              <p className="text-muted-foreground text-center mb-4">
                Add a payment method to make checkout faster and more secure.
              </p>
              <Button onClick={handleAddNew}>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Payment Method
              </Button>
            </CardContent>
          </Card>
        ) : (
          paymentMethods.map((method) => (
            <Card key={method.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-12 h-8 bg-muted rounded">
                      {getMethodIcon(method.method)}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="secondary" 
                          className={getMethodColor(method.method)}
                        >
                          {formatMethodName(method.method)}
                        </Badge>
                        {method.isDefault && (
                          <Badge variant="default">Default</Badge>
                        )}
                      </div>
                      <p className="font-medium">{method.cardNumber}</p>
                      <p className="text-sm text-muted-foreground">
                        {method.holderName} • Expires {method.expiryDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(method)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(method.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {!method.isDefault && (
                  <>
                    <Separator className="my-4" />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefault(method.id)}
                      disabled={isLoading}
                    >
                      Set as Default
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}