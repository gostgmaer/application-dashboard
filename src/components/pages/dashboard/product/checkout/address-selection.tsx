'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, MapPin, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { Address } from '@/types/checkout';
import { CheckoutAPI } from '@/lib/checkoutAPI';
import { addressSchema, AddressFormData } from '@/lib/validation/checkout';

interface AddressSelectionProps {
  selectedAddress: Address | null;
  onAddressSelect: (address: Address) => void;
  onNext: () => void;
  onBack: () => void;
}

export function AddressSelection({ selectedAddress, onAddressSelect, onNext, onBack }: AddressSelectionProps) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingAddress, setAddingAddress] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [validatingPostal, setValidatingPostal] = useState(false);

  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      name: '',
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'United States',
    }
  });

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      const response = await CheckoutAPI.getUserAddresses();
      if (response.success && response.data) {
        setAddresses(response.data);
        // Auto-select default address if none selected
        if (!selectedAddress) {
          const defaultAddr = response.data.find(addr => addr.isDefault);
          if (defaultAddr) {
            onAddressSelect(defaultAddr);
          }
        }
      }
    } catch (error) {
      toast.error('Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

  const validatePostalCode = async (postalCode: string) => {
    if (postalCode.length !== 6) return;
    
    setValidatingPostal(true);
    try {
      const response = await CheckoutAPI.validatePostalCode(postalCode);
      if (response.success && response.data) {
        form.setValue('city', response.data.city);
        form.setValue('state', response.data.state);
        toast.success('Postal code validated');
      } else {
        toast.error(response.error || 'Invalid postal code');
        form.setError('postalCode', { message: response.error || 'Invalid postal code' });
      }
    } catch (error) {
      toast.error('Failed to validate postal code');
    } finally {
      setValidatingPostal(false);
    }
  };

  const handleAddAddress = async (data: AddressFormData) => {
    setAddingAddress(true);
    try {
      const response = await CheckoutAPI.addAddress({
        ...data,
        isDefault: addresses.length === 0
      });
      
      if (response.success && response.data) {
        setAddresses([...addresses, response.data]);
        onAddressSelect(response.data);
        setDialogOpen(false);
        form.reset();
        toast.success('Address added successfully');
      } else {
        toast.error(response.error || 'Failed to add address');
      }
    } catch (error) {
      toast.error('Failed to add address');
    } finally {
      setAddingAddress(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600 dark:text-gray-400">Loading addresses...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Select Delivery Address</h2>
          <p className="text-gray-600 dark:text-gray-400">Choose where you want your order delivered</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add Address</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Address</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleAddAddress)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Home, Office, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main Street, Apt 4B" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal Code</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              placeholder="123456" 
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                if (e.target.value.length === 6) {
                                  validatePostalCode(e.target.value);
                                }
                              }}
                            />
                            {validatingPostal && (
                              <Loader2 className="absolute right-3 top-3 w-4 h-4 animate-spin text-blue-600" />
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input {...field} disabled />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="City" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input placeholder="State" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={addingAddress}>
                    {addingAddress ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      'Add Address'
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No addresses found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Add your first delivery address to continue</p>
          <Button onClick={() => setDialogOpen(true)}>Add Address</Button>
        </div>
      ) : (
        <RadioGroup value={selectedAddress?.id || ''} onValueChange={(value) => {
          const address = addresses.find(addr => addr.id === value);
          if (address) onAddressSelect(address);
        }}>
          <div className="grid gap-4">
            {addresses.map((address) => (
              <div key={address.id} className="relative">
                <RadioGroupItem
                  value={address.id}
                  id={address.id}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={address.id}
                  className="flex items-start space-x-3 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer peer-checked:border-blue-500 peer-checked:bg-blue-50 dark:peer-checked:bg-blue-900/20 hover:border-gray-300 dark:hover:border-gray-600 transition-all"
                >
                  <div className="flex-shrink-0 mt-1">
                    {selectedAddress?.id === address.id && (
                      <CheckCircle className="w-5 h-5 text-blue-500" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">{address.name}</h3>
                      {address.isDefault && (
                        <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {address.street}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {address.city}, {address.state} {address.postalCode}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {address.country}
                    </p>
                  </div>
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back to Cart
        </Button>
        <Button onClick={onNext} disabled={!selectedAddress}>
          Continue to Checkout
        </Button>
      </div>
    </div>
  );
}