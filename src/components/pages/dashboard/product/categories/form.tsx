"use client";

import { useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Upload, Image as ImageIcon, Save, Eye } from "lucide-react";
import CategoryServices from "@/helper/services/CategoryServices";
import { useDialog } from "@/hooks/use-dialog";
import {  useToast } from "@/hooks/useToast";
import { useSession } from "next-auth/react";
import categoryServices from "@/helper/services/categoryService";

// Zod schema for validation
const categorySchema = z.object({
  title: z
    .string()
    .min(1, "Category title is required")
    .max(100, "Title cannot exceed 100 characters"),
  slug: z
    .string().optional(),
  // child: z
  //   .array(z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid category ID"))
  //   .optional(),
  status: z.enum(
    ["active", "inactive", "draft", "pending", "archived", "published"],
    {
      errorMap: () => ({
        message:
          "Status must be one of: active, inactive, draft, pending, archived, published",
      }),
    }
  ),
  // parent: z
  //   .string()
  //   .regex(/^[0-9a-fA-F]{24}$/, "Invalid parent category ID")
  //   .optional()
  //   .or(z.literal("")),
  // images: z.array(z.string().url("Must be a valid URL")).optional(),
  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),
});

const statusData = [
  "active",
  "inactive",
  "draft",
  "pending",
  "archived",
  "published",
];
interface CategoryData {
  title: string;
  slug: string;
  // child?: string[];
  status:
    | "active"
    | "inactive"
    | "draft"
    | "pending"
    | "archived"
    | "published";
  // parent?: string;
  // images?: string[];
  description?: string;
}

export function CategoryCreate({ data, id }: any) {
  // console.log(data);
   const { toast } = useToast()
   const { data: session } = useSession();
   
    const { openDialog, closeDialog, confirm, alert, options } = useDialog();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<CategoryData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      title: data.title || "",
      slug: data.slug || "",
      // child: data.title || [],
      status: data.status || "draft",
      // parent: data.title || "",
      // images: data.images || [],
      description: data.description || "",
    },
  });

  // const {
  //   fields: childCategories,
  //   append: appendChild,
  //   remove: removeChild,
  // } = useFieldArray({
  //   control,
  //   name: "child",
  // });

  // const {
  //   fields: images,
  //   append: appendImage,
  //   remove: removeImage,
  // } = useFieldArray({
  //   control,
  //   name: "images",
  // });

  const [newChildCategory, setNewChildCategory] = useState("");
  const [newImage, setNewImage] = useState("");
  const [showJsonOutput, setShowJsonOutput] = useState(false);
  const [jsonOutput, setJsonOutput] = useState("");

  // Add child category
  // const addChildCategory = () => {
  //   if (
  //     newChildCategory.trim() &&
  //     !getValues("child")?.includes(newChildCategory.trim())
  //   ) {
  //     appendChild(newChildCategory.trim());
  //     setNewChildCategory("");
  //   }
  // };

  // // Add image URL
  // const addImage = () => {
  //   if (newImage.trim() && !getValues("images")?.includes(newImage.trim())) {
  //     appendImage(newImage.trim());
  //     setNewImage("");
  //   }
  // };

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  // Form submission
  const onSubmit = async (
    data: CategoryData,
    status: "draft" | "published" | "update"
  ) => {
    console.log("Category JSON:", data);
    // const updatedCategory = {
    //   ...data,
    //   slug: data.slug || generateSlug(data.title)
    // };


        const updateData = {
      ...data,
      slug: data.slug.toLowerCase() || generateSlug(data.title).toLowerCase(),
    };
    let res:any={}
    switch (status) {
      case "draft":
        {
          res = await categoryServices.create({ ...updateData, status }, session?.accessToken);
        }

        break;
      case "update":
        {
          res = await categoryServices.updatePatch(id, updateData, session?.accessToken);
        }
        break;

      default:
        {
         res = await categoryServices.create(updateData, session?.accessToken);
        }
        break;
    }

   console.log(res);
   
      toast({
        title: res.message,
        description: "We'll get back to you within 24 hours.",
        duration: 5000,
      })
          closeDialog();



    // const jsonString = JSON.stringify(updatedCategory, null, 2);
    // setJsonOutput(jsonString);
    // setShowJsonOutput(true);

    // console.log("Category JSON:", jsonString);
  };

  return (
    <div className=" bg-gray-100 dark:bg-black py-4 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 ">
        <div className="grid grid-cols-1 col-span-1 gap-8">
          <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg">
            <CardHeader className="bg-gray-50 dark:bg-gray-800 border-b-gray-200 dark:border-b-gray-700">
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <div className="w-2 h-6 bg-blue-400 rounded-full"></div>
                Basic Information
              </CardTitle>
            </CardHeader>
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
                    id="title"
                    {...register("title")}
                    className="mt-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="Enter category title"
                  />
                  {errors.title && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.title.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label
                    htmlFor="slug"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Slug *
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
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="mt-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                        {statusData.map((item, index) => {
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
                  htmlFor="description"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Description
                </Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  className="mt-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-h-[100px]"
                  placeholder="Enter category description"
                />
                {errors.description && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg">
            <CardHeader className="bg-gray-50 dark:bg-gray-800 border-b-gray-200 dark:border-b-gray-700">
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <div className="w-2 h-6 bg-purple-400 rounded-full"></div>
                Category Relationships
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6 text-gray-900 dark:text-gray-200">
              <div>
                <Label
                  htmlFor="parent"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Parent Category
                </Label>
                <Input
                  id="parent"
                  {...register("parent")}
                  className="mt-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter parent category ID (optional)"
                />
                {errors.parent && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.parent.message}
                  </p>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Child Categories
                </Label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {childCategories.map((child, index) => (
                    <Badge
                      key={child.id}
                      variant="secondary"
                      className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-300 border-gray-300 dark:border-gray-600 flex items-center gap-1"
                    >
                      {child}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeChild(index)}
                        className="h-4 w-4 p-0"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newChildCategory}
                    onChange={(e) => setNewChildCategory(e.target.value)}
                    placeholder="Enter child category ID"
                    onKeyPress={(e) => e.key === "Enter" && addChildCategory()}
                    className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 flex-1"
                  />
                  <Button
                    type="button"
                    onClick={addChildCategory}
                    variant="outline"
                    size="sm"
                    className="border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    disabled={!newChildCategory}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {errors.child && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.child.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card> */}

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
                    Update Category
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
                    Publish Category
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
