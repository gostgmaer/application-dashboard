// components/BrandForm.tsx
"use client";

import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";

import { Plus, X, Save, Eye, Upload, ImageIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import BrandServices from "@/lib/http/brands";
import brandService from "@/lib/http/brands";
import { useSession } from "next-auth/react";

const statusArray = [
  "active",
  "inactive",
  "draft",
  "pending",
  "archived",
  "published",
];

const brandSchema = z.object({
  name: z
    .string()
    .min(1, " Name is required")
    .max(100, "Name cannot exceed 100 characters"),
  slug: z.string().optional(),
  status: z.enum(
    ["active", "inactive", "draft", "pending", "archived", "published"],
    {
      errorMap: () => ({
        message:
          "Status must be one of: active, inactive, draft, pending, archived, published",
      }),
    }
  ),
  //   images: z.array(z.string().url("Must be a valid URL")).optional(),
  descriptions: z
    .string()
    .max(1000, "Description cannot exceed 500 characters")
    .optional(),

  contact: z
    .object({
      email: z.string().email().optional(),
      phone: z.string().optional(),
      website: z.string().url().optional(),
    })
    .optional(),
  seo: z
    .object({
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      keywords: z.array(z.string()).optional(),
    })
    .optional(),
});

interface SEOData {
  title?: string;
  description?: string;
  keywords?: string[];
  [key: string]: any; // allows flexibility for additional SEO fields
}
interface contactData {
  email?: string;
  phone?: string;
  website?: string;
}

interface BrandData {
  name: string;
  slug: string;
  //   seo?: SEOData;
  status:
    | "active"
    | "inactive"
    | "draft"
    | "pending"
    | "archived"
    | "published";
  contact?: contactData;
  //   images?: string[];

  descriptions?: string;
}

// type BrandFormValues = z.infer<typeof brandSchema>;

export function BrandForm({ data, id }: any) {

  const { data: session } = useSession();


  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<BrandData>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: data.name || "",
      slug: data.slug || "",
      contact: data.contact || {},
      status: data.status || "draft",
      //   seo: data.seo || "",
      //   images: data.images || {},
      descriptions: data.descriptions || "",
    },
  });

  //   const {
  //     fields: images,
  //     append: appendImage,
  //     remove: removeImage,
  //   } = useFieldArray({
  //     control,
  //     name: "images",
  //   });

  const [newImage, setNewImage] = useState("");

  //   const addImage = () => {
  //     if (newImage.trim() && !getValues("images")?.includes(newImage.trim())) {
  //       appendImage(newImage.trim());
  //       setNewImage("");
  //     }
  //   };

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  // Form submission
  const onSubmit = async (
    data: BrandData,
    status: "draft" | "published" | "update"
  ) => {
    // console.log(data, status, id);
    const updateData = {
      ...data,
      slug: data.slug.toLowerCase() || generateSlug(data.name).toLowerCase(),
    };
    switch (status) {
      case "draft":
        {
          const res = await BrandServices.create({ ...updateData, status },  session?.accessToken );
        }

        break;
      case "update":
        {
          const res = await brandService.update(id, updateData, session?.accessToken);
        }
        break;

      default:
        {
          const res = await BrandServices.create(updateData, session?.accessToken);
        }
        break;
    }
  };
  return (
    <>
      <div className="bg-gray-100 dark:bg-black py-4 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 ">
          <div className="grid grid-cols-1 col-span-1  gap-8">
            <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg">
              <CardContent className="space-y-6 p-6 text-gray-900 dark:text-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="title"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Title *
                    </Label>
                    <Input
                      id="name"
                      {...register("name")}
                      className="mt-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="Enter  title"
                    />
                    {errors.name && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label
                      htmlFor="slug"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Slug
                    </Label>
                    <Input
                      id="slug"
                      {...register("slug")}
                      className="mt-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="Enter URL slug (auto-generated if empty)"
                    />
                    {errors.slug && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.slug.message}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <Label
                    htmlFor="status"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Status *
                  </Label>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="mt-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                          {statusArray.map((item, index) => {
                            return (
                              <SelectItem
                                key={index}
                                value={item}
                                className="hover:bg-gray-100 dark:hover:bg-gray-700 capitalize"
                              >
                                {item}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.status && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.status.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label
                    htmlFor="descriptions"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Description
                  </Label>
                  <Textarea
                    id="descriptions"
                    {...register("descriptions")}
                    className="mt-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-h-[100px]"
                    placeholder="Enter description"
                  />
                  {errors.descriptions && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.descriptions.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
            {/* <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg">
              <CardHeader className="bg-gray-50 dark:bg-gray-800 border-b-gray-200 dark:border-b-gray-700">
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <div className="w-2 h-6 bg-orange-400 rounded-full"></div>
                  Images
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 text-gray-900 dark:text-gray-200">
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Upload category images
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        PNG, JPG up to 10MB each. Multiple files supported.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      <Upload className="w-4 h-4" />
                      Choose Files
                    </Button>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Image URLs
                  </Label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {images.map((image, index) => (
                      <Badge key={index} variant="secondary" className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-300 border-gray-300 dark:border-gray-600 flex items-center gap-1">
                        {image}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeImage(index)}
                          className="h-4 w-4 p-0"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newImage}
                      onChange={(e) => setNewImage(e.target.value)}
                      placeholder="Enter image URL"
                      onKeyPress={(e) => e.key === "Enter" && addImage()}
                      className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 flex-1"
                    />
                    <Button
                      type="button"
                      onClick={addImage}
                      variant="outline"
                      size="sm"
                      className="border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                      disabled={!newImage}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {errors.images && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.images.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card> */}

            <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg">
              <CardHeader className="bg-gray-50 dark:bg-gray-800 border-b-gray-200 dark:border-b-gray-700">
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <div className="w-2 h-6 bg-purple-400 rounded-full"></div>
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6 text-gray-900 dark:text-gray-200">
                <div>
                  <Label>Contact Email</Label>
                  <Input {...register("contact.email")} />
                  <Label>Phone</Label>
                  <Input {...register("contact.phone")} />
                  <Label>Website</Label>
                  <Input {...register("contact.website")} />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg">
              <CardHeader className="bg-gray-50 dark:bg-gray-800 border-b-gray-200 dark:border-b-gray-700">
                <CardTitle className="text-lg text-gray-900 dark:text-white">
                  Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 text-gray-900 dark:text-gray-200">
                {id ? (
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      type="button"
                      onClick={handleSubmit((data) => onSubmit(data, "update"))}
                      className="flex-1 bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Update Brand
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      type="button"
                      onClick={handleSubmit((data) => onSubmit(data, "draft"))}
                      variant="outline"
                      className="flex-1 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save as Draft
                    </Button>
                    <Button
                      type="button"
                      onClick={handleSubmit((data) =>
                        onSubmit(data, "published")
                      )}
                      className="flex-1 bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Publish Brand
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
