"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
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
import { Discount, CreateDiscountInput } from "@/types/discount";

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
});

type DiscountFormData = z.infer<typeof discountSchema>;

interface DiscountFormProps {
  discount?: Discount | null;
}

export function DiscountForm({ statics, discount }: any) {
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState<SearchResult[]>([]);
  const [brand, setBrand] = useState<SearchResult[]>([]);
  const [category, setCategory] = useState<SearchResult[]>([]);
  const isEditMode = !!discount;
  const { data: session } = useSession();
  console.log(statics);

  const handleTags = (results: SearchResult | SearchResult[]) => {
    setTags(Array.isArray(results) ? results : [results]);
  };

  const handleCategory = (results: SearchResult | SearchResult[]) => {
    setCategory(Array.isArray(results) ? results : [results]);
  };

  const handlebrands = (results: SearchResult | SearchResult[]) => {
    setBrand(Array.isArray(results) ? results : [results]);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<DiscountFormData>({
    resolver: zodResolver(discountSchema),
    defaultValues: {
      name: "",
      discountType: "percentage",
      discountValue: 0,
      isActive:false,
    },
  });

  const selectedType = watch("discountType");
  const selectedStatus = watch("isActive");

  // Reset form when modal opens/closes or discount changes
  useEffect(() => {
    if (discount) {
      reset({
        name: discount.name,
        discountType: discount.discountType,
        discountValue: discount.discountValue,
        isActive: discount.isActive,
        startDate: discount.startDate,
        endDate: discount.endDate
      });
    } else {
      reset({
        name: "",
        discountType: "percentage",
        discountValue: 0,
        isActive: false,
      });
    }
  }, [discount, reset]);

  const onSubmit = async (data: DiscountFormData) => {
    try {
      setLoading(true);

      if (isEditMode && discount) {
        const response = await discountServices.updateRule(
          discount._id,
          {...data,categoryIds:category.map((item:any) => item.id),brandIds:brand.map((item:any) => item.id),tags:tags.map((item:any) => item.id)},
          session?.accessToken
        );
        toast.success(response.message || "Discount updated successfully");
      } else {
        const response = await discountServices.createOrUpdateRule(
              {...data,categoryIds:category.map((item:any) => item.id),brandIds:brand.map((item:any) => item.id),tags:tags.map((item:any) => item.id)},
          session?.accessToken
        );
        toast.success(response.message || "Discount created successfully");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name Field */}
        <div>
          <Label htmlFor="name">Discount Name *</Label>
          <Input
            id="name"
            {...register("name")}
            placeholder="Enter discount name"
            className="mt-1"
            disabled={loading}
          />
          {errors.name && (
            <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
          )}
        </div>
        <div className=" grid grid-cols-2 gap-4">
          {/* Type Field */}
          <div className=" flex-1">
            <Label htmlFor="discountType">Discount Type *</Label>
            <Select
              value={selectedType}
              onValueChange={(value) =>
                setValue("discountType", value as "percentage" | "fixed")
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
            {errors.discountType && (
              <p className="text-sm text-red-600 mt-1">
                {errors.discountType.message}
              </p>
            )}
          </div>

          {/* Value Field */}
          <div>
            <Label htmlFor="discountValue">
              {selectedType === "percentage" ? "Percentage (%)" : "Amount ($)"}{" "}
              *
            </Label>
            <Input
              id="discountValue"
              type="number"
              step={selectedType === "percentage" ? "0.1" : "0.01"}
              min="0"
              max={selectedType === "percentage" ? "100" : "100000"}
              {...register("discountValue", { valueAsNumber: true })}
              placeholder={
                selectedType === "percentage" ? "e.g., 25" : "e.g., 50.00"
              }
              className="mt-1"
              disabled={loading}
            />
            {errors.discountValue && (
              <p className="text-sm text-red-600 mt-1">
                {errors.discountValue.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label
              htmlFor="startDate"
              className="text-sm font-medium text-gray-700 dark:text-gray-400"
            >
              Start Date
            </Label>
            <Input
              id="startDate"
              type="date"
              {...register("startDate")}
              className={`mt-1  ${errors.startDate ? "border-red-500" : ""}`}
            />
            {errors.startDate && (
              <p className="text-red-500 text-xs mt-1">
                {errors.startDate.message}
              </p>
            )}
          </div>

          <div>
            <Label
              htmlFor="endDate"
              className="text-sm font-medium text-gray-700 dark:text-gray-400"
            >
              End Date
            </Label>
            <Input
              id="dateOfBirth"
              type="date"
              {...register("endDate")}
              className={`mt-1  ${errors.endDate ? "border-red-500" : ""}`}
            />
            {errors.endDate && (
              <p className="text-red-500 text-xs mt-1">
                {errors.endDate.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <AutocompleteSearch
            data={statics?.tags || []}
            multiple={true}
            placeholder="Search and select Tags..."
            minChars={1}
            onSelect={handleTags}
            value={tags}
            className="w-full"
          />
        </div>
        <div>
          <AutocompleteSearch
            data={statics?.categories || []}
            multiple={true}
            placeholder="Search and select Ctagory..."
            minChars={1}
            onSelect={handleCategory}
            value={tags}
            className="w-full"
          />
        </div>
        <div>
          <AutocompleteSearch
            data={statics?.brands || []}
            multiple={true}
            placeholder="Search and select Brands..."
            minChars={1}
            onSelect={handlebrands}
            value={tags}
            className="w-full"
          />
        </div>
        {/* Status Field */}
        <div className="flex items-center justify-between">
          <Label htmlFor="status">Active Status</Label>
          <Switch
            id="status"
            checked={selectedStatus}
            onCheckedChange={(checked) =>
              setValue("isActive", checked ? true : false)
            }
            disabled={loading}
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t">
          <Button type="submit" disabled={loading}>
            {loading
              ? "Saving..."
              : isEditMode
              ? "Update Discount"
              : "Create Discount"}
          </Button>
        </div>
      </form>
    </div>
  );
}
