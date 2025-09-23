"use client";

import { useState } from "react";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, X, Save, Eye, Trash2 } from "lucide-react";
import roleServices from "@/helper/services/roleServices";
import { useToast } from "@/hooks/useToast";
import { useDialog } from "@/hooks/use-dialog";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@/components/ui/checkbox";
import { useSession } from "next-auth/react";

// Predefined roles
const PREDEFINED_ROLES = [
  "super_admin", // Full system access
  "admin", // Manage platform settings, users, products
  "manager", // Oversee operations
  "staff", // Limited admin tasks
  "vendor", // Third-party seller
  "customer", // Regular buyer
  "guest", // Not logged in
  "support_agent", // Customer service
  "moderator", // Content/review moderation
  "user", // Generic authenticated user
];

const PREDEFINED_PERMISSIONS = [
  "User Management: Read",
  "User Management: Write",
  "User Management: Create",
  "User Management: Delete",
];

// Zod schema based on the provided Mongoose schema
const roleSchema = z
  .object({
    name: z.enum(
      [
        "super_admin", // Full system access
        "admin", // Manage platform settings, users, products
        "manager", // Oversee operations
        "staff", // Limited admin tasks
        "vendor", // Third-party seller
        "customer", // Regular buyer
        "guest", // Not logged in
        "support_agent", // Customer service
        "moderator", // Content/review moderation
        "user", // Generic authenticated user
      ],
      { message: "Invalid role name" }
    ),
    description: z.string().trim().optional(),
    permissions: z.array(z.string()).optional(),
    isDefault: z.boolean(),
    isActive: z.boolean(),
  })
  .strict();

interface RoleData {
  name: string;
  description?: string;
  permissions: string[];
  isDefault: boolean;
  isActive: boolean;
}

export default function RoleForm({ initialData, id, permissionData }: any) {
  console.log(permissionData);
  
  const { data: session } = useSession();
  const { toast } = useToast();
  const { openDialog, closeDialog, confirm, alert, options } = useDialog();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<RoleData>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: initialData.name || "",
      description: initialData.description || "",
      permissions: initialData.per || [],
      isDefault: initialData.isDefault || false,
      isActive: initialData.isActive || true,
    },
  });

  const onSubmit = async (
    data: RoleData,
    status: "draft" | "published" | "update"
  ) => {
    try {
      const updateData = {
        ...data,
      };
      let res: any = {};
      switch (status) {
        case "update":
          {
            res = await roleServices.updatePatch(
              id,
              updateData,
              session?.accessToken
            );
          }
          break;

        default:
          {
            res = await roleServices.create(updateData, session?.accessToken);
          }
          break;
      }
      if (res.error) {
        const error = JSON.parse(res.error);
        toast({
          title: error.status,
          description: error.message,
          variant: "destructive",
        });
      } else {
        closeDialog();
        toast({
          title: res.status,
          description: res.message,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className=" bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-4xl mx-auto ">
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-lg ">
          <CardHeader className="bg-gray-50 dark:bg-gray-800 border-b-gray-200 dark:border-b-gray-700 pb-0">
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white ">
              <div className="w-2 h-6 bg-blue-400 rounded-full"></div>
              Role Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div>
              <Label
                htmlFor="name"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Role Name *
              </Label>

              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    defaultValue={getValues("name")}
                  >
                    <SelectTrigger
                      className={`mt-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-blue-500 ${
                        errors.name ? "border-red-500" : ""
                      }`}
                    >
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                      {PREDEFINED_ROLES.map((category) => (
                        <SelectItem
                          key={category}
                          value={category}
                          className="hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />

              {errors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="mt-6">
              <Label
                htmlFor="description"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Description
              </Label>
              <Input
                id="description"
                {...register("description")}
                className={`mt-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-blue-500 ${
                  errors.description ? "border-red-500" : ""
                }`}
                placeholder="Enter role description"
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>
            <div className="mt-6">
              <Label>
                <p className="text-sm text-gray-800 dark:text-gray-400">
                  Action abbreviations: (D) Read, (W) Write, (M) Modify, (D)
                  Delete, (F) Manage/Full Access
                </p>
              </Label>
            </div>

            <div className="mt-6">
              <Label className="text-md font-semibold mb-4  text-gray-700 dark:text-gray-300">
                Permissions
              </Label>

              <Controller
                name="permissions"
                control={control}
                render={({ field }) => (
                  <div className=" space-y-2 mt-2">
                    {permissionData.map((p:any) => (
                      <div
                        key={p.category}
                        className="space-y-1 flex justify-between"
                      >
                        <h3 className="text-sm  text-gray-800 dark:text-gray-200">
                          {p.category}
                        </h3>
                        <div className="grid grid-cols-5 gap-3">
                          {p.action.map((a:any) => (
                            <div
                              key={a.id}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={a.id}
                                checked={field.value.includes(a.id)}
                                onCheckedChange={(checked) => {
                                  const updatedPermissions = checked
                                    ? [...field.value, a.id]
                                    : field.value.filter((id) => id !== a.id);
                                  field.onChange(updatedPermissions);
                                }}
                                className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
                              />
                              <Label
                                htmlFor={a.id}
                                className={` ${
                                  a.action == "delete"
                                    ? "text-red-500"
                                    : "text-gray-700 dark:text-gray-300"
                                } text-sm  cursor-pointer capitalize`}
                              >
                                {a.action[0]}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              />
            </div>
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm text-gray-700 dark:text-gray-300">
                  Default Role
                </Label>
                <Controller
                  control={control}
                  name="isDefault"
                  render={({ field }) => (
                    <Switch
                      id="isDefault"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm text-gray-700 dark:text-gray-300">
                  Active Role
                </Label>
                <Controller
                  control={control}
                  name="isActive"
                  render={({ field }) => (
                    <Switch
                      id="isActive"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>
            </div>

            <Separator className="bg-gray-200 dark:bg-gray-700 my-6" />
            <div className="flex gap-3">
              <Button
                type="button"
                onClick={handleSubmit((data) =>
                  onSubmit(data, id ? "update" : "published")
                )}
                className="flex-1 bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white"
                disabled={Object.keys(errors).length > 0}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Role
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
