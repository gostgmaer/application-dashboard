"use client";

import { useState } from "react";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Save } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { useToast } from "@/hooks/useToast";
import { useSession } from "next-auth/react";
import permissionServices from "@/helper/services/permissonServie";
import roleServices from "@/helper/services/roleServices";

// Zod schema for form validation
const rolePermissionSchema = z
  .object({
    role: z.string().min(1, "Role name is required").trim(),
    permissionIds: z.array(z.string()).optional(),
  })
  .strict();

interface RolePermissionData {
  role: string;
  permissionIds: string[];
}

export default function RolePermissionForm({
  initialData,
  id,
  permissionData,
}: any) {
  const { data: session } = useSession();
  const { toast } = useToast();
  console.log(initialData);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RolePermissionData>({
    resolver: zodResolver(rolePermissionSchema),
    defaultValues: {
      role: initialData?.name || "",
      permissionIds: initialData?.per || [],
    },
  });

  const onSubmit = async (data: RolePermissionData) => {
    try {
      // Replace with your actual API call
      console.log(data);

      const res = await roleServices.assignPermissions(
        id,
        data,
        session?.accessToken
      );
      toast({
        title: res.message || `Role ${id ? "updated" : "created"} successfully`,
        duration: 5000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save role permissions",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-lg">
          <CardHeader className="bg-gray-50 dark:bg-gray-800 border-b-gray-200 dark:border-b-gray-700 pb-0">
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <div className="w-2 h-6 bg-blue-400 rounded-full"></div>
              Role Permission Assignment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div>
              <Label
                htmlFor="role"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Role Name *
              </Label>
              <Input
                id="role"
                {...register("role")}
                className="mt-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Enter role name"
                disabled
              />
              {errors.role && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.role.message}
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
                name="permissionIds"
                control={control}
                render={({ field }) => (
                  <div className=" space-y-2 mt-2">
                    {permissionData.map((p) => (
                      <div
                        key={p.category}
                        className="space-y-1 flex justify-between"
                      >
                        <h3 className="text-sm  text-gray-800 dark:text-gray-200">
                          {p.category}
                        </h3>
                        <div className="grid grid-cols-5 gap-3">
                          {p.action.map((a) => (
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

            <Separator className="bg-gray-200 dark:bg-gray-700 my-6" />
            <div className="flex gap-3">
              <Button
                type="button"
                onClick={handleSubmit(onSubmit)}
                className="flex-1 bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white"
                disabled={Object.keys(errors).length > 0}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Role Permissions
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
