"use client";

import React, { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Switch } from "@/components/ui/switch";
import { Discount } from "@/types/discount";
import { toast } from "sonner";
import discountServices from "@/lib/http/discountServices";
import { useSession } from "next-auth/react";
import {
  AutocompleteSearch,
  SearchResult,
} from "@/components/ui/autocompleteSearch";

const discountSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  discountType: z.enum(["percentage", "fixed"]),
  startDate: z.string().nullable().or(z.literal("")),
  endDate: z.string().nullable().or(z.literal("")),
  discountValue: z
    .number()
    .min(0, "Value must be positive")
    .max(100000, "Value is too large"),
  isActive: z.boolean(),
  categoryIds: z.array(z.string()).optional(),
  brandIds: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

type DiscountFormData = z.infer<typeof discountSchema>;

interface DiscountFormProps {
  statics: {
    categories: SearchResult[];
    brands: SearchResult[];
    tags: SearchResult[];
  };
  discount?: Discount | null;
}

export function DiscountForm({ statics, discount }: DiscountFormProps) {
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState<SearchResult[]>([]);
  const [brands, setBrands] = useState<SearchResult[]>([]);
  const [categories, setCategories] = useState<SearchResult[]>([]);

  const isEditMode = !!discount;
  const { data: session } = useSession();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
    watch,
    reset,
  } = useForm<DiscountFormData>({
    resolver: zodResolver(discountSchema),
    defaultValues: {
      name: "",
      discountType: "percentage",
      discountValue: 0,
      isActive: false,
      categoryIds: [],
      brandIds: [],
      tags: [],
    },
  });

  const selectedType = watch("discountType");
  const selectedStatus = watch("isActive");

  useEffect(() => {
    if (discount) {
      reset({
        name: discount.name,
        discountType: discount.discountType,
        discountValue: discount.discountValue,
        isActive: discount.isActive,
        startDate: discount.startDate,
        endDate: discount.endDate,
        categoryIds: discount.categoryIds || [],
        brandIds: discount.brandIds || [],
        tags: discount.tags || [],
      });
      // Pre-select Autocomplete values
      setCategories(
        statics.categories.filter((c) => discount.categoryIds?.includes(c.id))
      );
      setBrands(
        statics.brands.filter((b) => discount.brandIds?.includes(b.id))
      );
      setTags(statics.tags.filter((t) => discount.tags?.includes(t.id)));
    } else {
      reset({
        name: "",
        discountType: "percentage",
        discountValue: 0,
        isActive: false,
        categoryIds: [],
        brandIds: [],
        tags: [],
      });
      setCategories([]);
      setBrands([]);
      setTags([]);
    }
  }, [discount, reset, statics]);

  const onSubmit = async (data: DiscountFormData) => {
    try {
      setLoading(true);
      const payload = {
        ...data,
        categoryIds: categories.map((c) => c.id),
        brandIds: brands.map((b) => b.id),
        tags: tags.map((t) => t.id),
      };

      if (isEditMode && discount) {
        const response = await discountServices.updateRule(
          discount._id,
          payload,
          session?.accessToken
        );
        toast.success(response.message || "Discount updated successfully");
      } else {
        const response = await discountServices.createOrUpdateRule(
          payload,
          session?.accessToken
        );
        toast.success(response.message || "Discount created successfully");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Name */}
      <div>
        <Label htmlFor="name">Discount Name *</Label>
        <Input
          {...register("name")}
          id="name"
          placeholder="Enter discount name"
          disabled={loading}
        />
        {errors.name && (
          <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Discount Type & Value */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="discountType">Discount Type *</Label>
          <Select
            value={selectedType}
            onValueChange={(v) =>
              setValue("discountType", v as "percentage" | "fixed")
            }
            disabled={loading}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select discount type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="percentage">Percentage (%)</SelectItem>
              <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="discountValue">
            {selectedType === "percentage" ? "Percentage (%)" : "Amount ($)"} *
          </Label>
          <Input
            {...register("discountValue", { valueAsNumber: true })}
            id="discountValue"
            type="number"
            step={selectedType === "percentage" ? 0.1 : 0.01}
            min={0}
            max={selectedType === "percentage" ? 100 : 100000}
            disabled={loading}
          />
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startDate">Start Date</Label>
          <Input {...register("startDate")} id="startDate" type="date" />
        </div>
        <div>
          <Label htmlFor="endDate">End Date</Label>
          <Input {...register("endDate")} id="endDate" type="date" />
        </div>
      </div>

      {/* Autocomplete Multi-Selects */}
      <div>
        <Label>Tags</Label>
        <Controller
          name="tags"
          control={control}
          defaultValue={discount?.tags || []} // array of string IDs
          render={({ field }) => {
            // Ensure field.value is always an array
            const currentValue = field.value ?? [];

            // Convert IDs to SearchResult objects for AutocompleteSearch
            const selectedObjects =
              statics.tags?.filter((tag) => currentValue.includes(tag.id)) ||
              [];

            return (
              <AutocompleteSearch
                data={statics.tags || []}
                multiple
                placeholder="Search and select Tags..."
                value={selectedObjects}
                onSelect={(selected: SearchResult | SearchResult[]) => {
                  const ids = Array.isArray(selected)
                    ? selected.map((s) => s.id)
                    : [selected.id];
                  field.onChange(ids);
                }}
              />
            );
          }}
        />
      </div>

      <div>
        <Label>Categories</Label>
        <Controller
          name="categoryIds"
          control={control}
          defaultValue={discount?.categoryIds || []} // array of string IDs
          render={({ field }) => {
            // Ensure field.value is always an array
            const currentValue = field.value ?? [];

            // Convert IDs to SearchResult objects for AutocompleteSearch
            const selectedObjects =
              statics.categories?.filter((category) =>
                currentValue.includes(category.id)
              ) || [];

            return (
              <AutocompleteSearch
                data={statics.categories || []}
                multiple
                placeholder="Search and select Categories..."
                value={selectedObjects}
                onSelect={(selected: SearchResult | SearchResult[]) => {
                  const ids = Array.isArray(selected)
                    ? selected.map((s) => s.id)
                    : [selected.id];
                  field.onChange(ids);
                }}
              />
            );
          }}
        />
      </div>

      <div>
        <Label>Brands</Label>
        <Controller
          name="brandIds"
          control={control}
          defaultValue={discount?.brandIds || []} // array of string IDs
          render={({ field }) => {
            // Ensure field.value is always an array
            const currentValue = field.value ?? [];

            // Convert IDs to SearchResult objects for AutocompleteSearch
            const selectedObjects =
              statics.brands?.filter((brand) =>
                currentValue.includes(brand.id)
              ) || [];

            return (
              <AutocompleteSearch
                data={statics.brands || []}
                multiple
                placeholder="Search and select Brands..."
                value={selectedObjects}
                onSelect={(selected: SearchResult | SearchResult[]) => {
                  const ids = Array.isArray(selected)
                    ? selected.map((s) => s.id)
                    : [selected.id];
                  field.onChange(ids);
                }}
              />
            );
          }}
        />
      </div>

      {/* Active Status */}
      <div className="flex items-center gap-2">
        <Label>Active Status</Label>
        <Switch
          checked={selectedStatus}
          onCheckedChange={(checked) => setValue("isActive", checked)}
          disabled={loading}
        />
      </div>

      {/* Submit */}
      <div className="flex justify-end pt-6 border-t">
        <Button type="submit" disabled={loading}>
          {loading
            ? "Saving..."
            : isEditMode
            ? "Update Discount"
            : "Create Discount"}
        </Button>
      </div>
    </form>
  );
}
