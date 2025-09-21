"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Loader2,
  MapPin,
  Plus,
  Edit2,
  Trash2,
  Home,
  Building,
  MapIcon,
} from "lucide-react";
// import { addressSchema, AddressFormData } from ''
import { User } from "@/types/user";
import { toast } from "sonner";
import { AddressFormData, addressSchema } from "@/lib/validation/account";

interface AddressesTabProps {
  user: User;
}

export default function AddressesTab({ user }: AddressesTabProps) {
  const [addresses, setAddresses] = useState(user.address);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      label: "home",
      addressLine1: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      isDefault: false,
    },
  });

  const watchedType = watch("label");

  const onSubmit = async (data: AddressFormData) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (editingAddress) {
        // Update existing address
        setAddresses((prev) =>
          prev.map((addr) =>
            addr.id === editingAddress ? { ...addr, ...data } : addr
          )
        );
        toast.success("Address updated successfully!");
      } else {
        // Add new address
        const newAddress = {
          id: Date.now().toString(),
          ...data,
        };
        setAddresses((prev) =>
          prev.map((addr) =>
            addr.id === editingAddress
              ? { ...addr, ...data } // data must have compatible shape with Address
              : addr
          )
        );
        toast.success("Address added successfully!");
      }

      setIsDialogOpen(false);
      setEditingAddress(null);
      reset();
    } catch (error) {
      toast.error("Failed to save address. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (address: any) => {
    setEditingAddress(address.id);
    setValue("label", address.label);
    setValue("addressLine1", address.addressLine1);
    setValue("city", address.city);
    setValue("state", address.state);
    setValue("postalCode", address.postalCode);
    setValue("country", address.country);
    setValue("isDefault", address.isDefault);
    setIsDialogOpen(true);
  };

  const handleDelete = async (addressId: string) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setAddresses((prev) => prev.filter((addr) => addr.id !== addressId));
      toast.success("Address deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete address.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetDefault = async (addressId: string) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setAddresses((prev) =>
        prev.map((addr) => ({
          ...addr,
          isDefault: addr.id === addressId,
        }))
      );
      toast.success("Default address updated!");
    } catch (error) {
      toast.error("Failed to update default address.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNew = () => {
    reset();
    setEditingAddress(null);
    setIsDialogOpen(true);
  };

  const getAddressTypeIcon = (label: string) => {
    switch (label) {
      case "home":
        return <Home className="h-4 w-4" />;
      case "work":
        return <Building className="h-4 w-4" />;
      default:
        return <MapIcon className="h-4 w-4" />;
    }
  };

  const getAddressTypeColor = (label: string) => {
    switch (label) {
      case "home":
        return "bg-blue-100 text-blue-800";
      case "work":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Saved Addresses</h3>
          <p className="text-sm text-muted-foreground">
            Manage your shipping and billing addresses
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew}>
              <Plus className="mr-2 h-4 w-4" />
              Add Address
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingAddress ? "Edit Address" : "Add New Address"}
              </DialogTitle>
              <DialogDescription>
                {editingAddress
                  ? "Update your address information."
                  : "Add a new shipping or billing address."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Address Type</Label>
                  <Select
                    value={watchedType}
                    onValueChange={(value) => setValue("label", value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select address type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="home">
                        <div className="flex items-center gap-2">
                          <Home className="h-4 w-4" />
                          Home
                        </div>
                      </SelectItem>
                      <SelectItem value="work">
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          Work
                        </div>
                      </SelectItem>
                      <SelectItem value="other">
                        <div className="flex items-center gap-2">
                          <MapIcon className="h-4 w-4" />
                          Other
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.label && (
                    <p className="text-sm text-destructive">
                      {errors.label.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="street">Street Address</Label>
                  <Input
                    id="addressLine1"
                    {...register("addressLine1")}
                    placeholder="123 Main Street"
                  />
                  {errors.addressLine1 && (
                    <p className="text-sm text-destructive">
                      {errors.addressLine1.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      {...register("city")}
                      placeholder="New York"
                    />
                    {errors.city && (
                      <p className="text-sm text-destructive">
                        {errors.city.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input id="state" {...register("state")} placeholder="NY" />
                    {errors.state && (
                      <p className="text-sm text-destructive">
                        {errors.state.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">ZIP Code</Label>
                    <Input
                      id="postalCode"
                      {...register("postalCode")}
                      placeholder="10001"
                    />
                    {errors.postalCode && (
                      <p className="text-sm text-destructive">
                        {errors.postalCode.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      {...register("country")}
                      placeholder="United States"
                    />
                    {errors.country && (
                      <p className="text-sm text-destructive">
                        {errors.country.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isDefault"
                    checked={watch("isDefault")}
                    onCheckedChange={(checked) =>
                      setValue("isDefault", checked)
                    }
                  />
                  <Label htmlFor="isDefault">Set as default address</Label>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setEditingAddress(null);
                    reset();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {editingAddress ? "Updating..." : "Adding..."}
                    </>
                  ) : editingAddress ? (
                    "Update Address"
                  ) : (
                    "Add Address"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {addresses.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-medium text-lg mb-2">No addresses yet</h3>
              <p className="text-muted-foreground text-center mb-4">
                Add your first address to make checkout faster and easier.
              </p>
              <Button onClick={handleAddNew}>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Address
              </Button>
            </CardContent>
          </Card>
        ) : (
          addresses.map((address, index) => (
            <Card key={address.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className={getAddressTypeColor(address.label)}
                      >
                        <span className="flex items-center gap-1">
                          {getAddressTypeIcon(address.label)}
                          {address.label.charAt(0).toUpperCase() +
                            address.label.slice(1)}
                        </span>
                      </Badge>
                      {address.isDefault && (
                        <Badge variant="default">Default</Badge>
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium">{address.addressLine1}</p>
                      <p className="text-muted-foreground">
                        {address.city}, {address.state} {address.postalCode}
                      </p>
                      <p className="text-muted-foreground">{address.country}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(address)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(address.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {!address.isDefault && (
                  <>
                    <Separator className="my-4" />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefault(address.id)}
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
  );
}
