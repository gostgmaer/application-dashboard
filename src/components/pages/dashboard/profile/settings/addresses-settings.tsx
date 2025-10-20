"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAddresses } from "@/hooks/use-user-settings";
import { Address } from "@/types/user";
import {
  MapPin,
  Plus,
  CreditCard as Edit,
  Trash2,
  Chrome as Home,
  Building,
  Phone,
  Loader as Loader2,
  Star,
} from "lucide-react";

const addressSchema = z.object({
  label: z.string().min(1, "Label is required"),
  addressLine1: z.string().min(1, "Address line 1 is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().optional(),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
  phone: z.string().optional(),
  isDefault: z.boolean().default(false),
});

type AddressForm = z.infer<typeof addressSchema>;

export function AddressesSettings() {
  const { addresses, loading, createAddress, updateAddress, deleteAddress } =
    useAddresses();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const form = useForm<AddressForm>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      label: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      phone: "",
      isDefault: false,
    },
  });

  const onSubmit = async (data: AddressForm) => {
    setActionLoading("save");
    let success = false;

    if (editingAddress) {
      success = await updateAddress(editingAddress.id, data);
    } else {
      success = await createAddress(data);
    }

    if (success) {
      setDialogOpen(false);
      setEditingAddress(null);
      form.reset();
    }
    setActionLoading(null);
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    form.reset(address);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    setActionLoading(id);
    await deleteAddress(id);
    setActionLoading(null);
  };

  const handleNew = () => {
    setEditingAddress(null);
    form.reset({
      label: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      phone: "",
      isDefault: false,
    });
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Addresses</h1>
          <p className="text-muted-foreground mt-2">
            Manage your saved addresses for faster checkout
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNew}>
              <Plus className="w-4 h-4 mr-2" />
              Add Address
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingAddress ? "Edit Address" : "Add New Address"}
              </DialogTitle>
              <DialogDescription>
                {editingAddress
                  ? "Update your address information below."
                  : "Add a new address to your account for faster checkout."}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="label">Address Label *</Label>
                  <Input
                    id="label"
                    {...form.register("label")}
                    placeholder="Home, Work, etc."
                  />
                  {form.formState.errors.label && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.label.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    {...form.register("phone")}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="addressLine1">Address Line 1 *</Label>
                <Input
                  id="addressLine1"
                  {...form.register("addressLine1")}
                  placeholder="Street address"
                />
                {form.formState.errors.addressLine1 && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.addressLine1.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="addressLine2">Address Line 2</Label>
                <Input
                  id="addressLine2"
                  {...form.register("addressLine2")}
                  placeholder="Apartment, suite, etc. (optional)"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    {...form.register("city")}
                    placeholder="City"
                  />
                  {form.formState.errors.city && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.city.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State/Province</Label>
                  <Input
                    id="state"
                    {...form.register("state")}
                    placeholder="State"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code *</Label>
                  <Input
                    id="postalCode"
                    {...form.register("postalCode")}
                    placeholder="12345"
                  />
                  {form.formState.errors.postalCode && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.postalCode.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  {...form.register("country")}
                  placeholder="Country"
                />
                {form.formState.errors.country && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.country.message}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  {...form.register("isDefault")}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="isDefault">Set as default address</Label>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setDialogOpen(false);
                    setEditingAddress(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={actionLoading === "save"}>
                  {actionLoading === "save" && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  {editingAddress ? "Update Address" : "Save Address"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {addresses.length === 0 ? (
        <Card className="border-0 shadow-sm bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <MapPin className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No addresses saved</h3>
            <p className="text-muted-foreground mb-6">
              Add your first address to make checkout faster and easier.
            </p>
            <Button onClick={handleNew}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Address
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {addresses.map((address, index) => (
              <motion.div
                key={address.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-0 shadow-sm bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          {address.label.toLowerCase().includes("home") ? (
                            <Home className="w-4 h-4 text-primary" />
                          ) : (
                            <Building className="w-4 h-4 text-primary" />
                          )}
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {address.label}
                          </CardTitle>
                          {address.isDefault && (
                            <Badge variant="default" className="text-xs mt-1">
                              <Star className="w-3 h-3 mr-1" />
                              Default
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(address)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={actionLoading === address.id}
                            >
                              {actionLoading === address.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete Address?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete &quot;
                                {address.label}&quot;? This action cannot be
                                undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(address.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete Address
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <p>{address.aaddressLine1}</p>
                      {address.addressLine2 && <p>{address.addressLine2}</p>}
                      <p>
                        {address.city}
                        {address.state && `, ${address.state}`}{" "}
                        {address.postalCode}
                      </p>
                      <p className="text-muted-foreground">{address.country}</p>
                      {address.phone && (
                        <div className="flex items-center gap-2 pt-2 border-t">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span>{address.phone}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
