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
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useToast } from "@/hooks/useToast";
import permissionServices from "@/lib/http/permissionServices";
import { useSession } from "next-auth/react";
import { permissionCategory } from "./mock";
import masterServices from "@/lib/http/master";
import { Textarea } from "@/components/ui/textarea";

// Define action types
const actionTypes = {
  READ: "read",
  WRITE: "write",
  MODIFY: "modify",
  DELETE: "delete",
  MANAGE: "full",
};
// Zod schema based on the provided Mongoose schema
// lib/validations/master.ts

export const MasterSchema = z.object({
  type: z.string().min(1, "Type is required").max(50, "Type max 50 characters"),

  code: z.string().min(1, "Code is required").max(50, "Code max 50 characters"),

  label: z
    .string()
    .min(1, "Label is required")
    .max(200, "Label max 200 characters"),

  // ✅ Optional fields: null, undefined, or empty string allowed
  tenantId: z
    .string()
    .max(100, "tenantId max 100 characters")
    .nullable()
    .optional()
    .transform((val) =>
      val === null || val === "" || val === undefined ? null : val
    ),
  isDefault: z.boolean().optional(),

  altLabel: z
    .string()
    .max(200, "altLabel max 200 characters")
    .nullable()
    .optional()
    .transform((val) =>
      val === null || val === "" || val === undefined ? null : val
    ),

  description: z
    .string()
    .max(500, "Description max 500 characters")
    .nullable()
    .optional()
    .transform((val) =>
      val === null || val === "" || val === undefined ? null : val
    ),

  parentId: z
    .string()
    .refine(
      (id) => !id || /^[0-9a-fA-F]{24}$/.test(id),
      "Invalid parentId format"
    )
    .nullable()
    .optional()
    .transform((val) =>
      val === null || val === "" || val === undefined ? null : val
    ),

  domain: z
    .string()
    .max(100, "Domain max 100 characters")
    .nullable()
    .optional()
    .transform((val) =>
      val === null || val === "" || val === undefined ? null : val
    ),

  sortOrder: z.coerce
    .number()
    .int({ message: "sortOrder must be integer" })
    .min(0, "sortOrder 0-9999")
    .max(9999, "sortOrder 0-9999")
    .optional()
    .or(z.null())
    .transform((val) => (val === null || val === undefined ? 0 : val)),
});

interface CreateMasterInput {
  type: string;
  code: string;
  label: string;
  isDefault: boolean;
  tenantId?: string;
  altLabel?: string;
  description?: string;
  parentId?: string;
  domain?: string;
  sortOrder?: number;
}

export default function Form({ p, id }: any) {
  const { data: session, status, update } = useSession();
  const { toast } = useToast();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<CreateMasterInput>({
    resolver: zodResolver(MasterSchema),
    defaultValues: {
      type: p?.type || "",
      code: p?.code || "",
      label: p?.label || "",
      isDefault: p?.isDefault || false,
      tenantId: p?.tenantId || "",
      altLabel: p?.altLabel || "",
      description: p?.description || "",
      parentId: p?.parentId || "",
      domain: p?.domain || "Master",
      sortOrder: p?.sortOrder || 0,
    },
  });

  const onSubmit = async (
    data: CreateMasterInput,
    s: "draft" | "published" | "update"
  ) => {
    const updateData = {
      ...data,
    };
    let res: any = {};
    switch (s) {
      case "update":
        {
          res = await masterServices.update(
            id,
            updateData,
            session?.accessToken
          );
        }
        break;

      default:
        {
          res = await masterServices.create(updateData, session?.accessToken);
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
      toast({
        title: res.status,
        description: res.message,
      });
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-lg">
          {/* <CardHeader className="bg-gray-50 dark:bg-gray-800 border-b-gray-200 dark:border-b-gray-700 pb-0">
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <div className="w-2 h-6 bg-green-400 rounded-full"></div>
              Master Data Information
            </CardTitle>
          </CardHeader> */}
          <CardContent className="space-y-6 p-6">
            {/* Type Field */}
            <div>
              <Label
                htmlFor="type"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Type *
              </Label>
              <Input
                id="type"
                {...register("type")}
                disabled={id ? true : false}
                className="mt-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                placeholder="GENDER, COUNTRY, STATUS"
              />
              {errors.type && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.type.message}
                </p>
              )}
            </div>

            {/* Code Field */}
            <div>
              <Label
                htmlFor="code"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Code *
              </Label>
              <Input
                id="code"
                {...register("code")}
                disabled={id ? true : false}
                className="mt-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                placeholder="M, F, IN, ACTIVE"
              />
              {errors.code && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.code.message}
                </p>
              )}
            </div>

            {/* Label Field */}
            <div>
              <Label
                htmlFor="label"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Label *
              </Label>
              <Input
                id="label"
                {...register("label")}
                className="mt-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                placeholder="Male, Female, India, Active"
              />
              {errors.label && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.label.message}
                </p>
              )}
            </div>

            {/* Optional Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tenant ID */}
              <div>
                <Label
                  htmlFor="tenantId"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Tenant ID
                </Label>
                <Input
                  id="tenantId"
                  {...register("tenantId")}
                  className="mt-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="tenant123 (optional)"
                />
              </div>

              {/* Domain */}
              <div>
                <Label
                  htmlFor="domain"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Domain
                </Label>
                <Input
                  id="domain"
                  {...register("domain")}
                  className="mt-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="HR, SALES, INVENTORY (optional)"
                />
              </div>
            </div>

            {/* Alt Label & Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label
                  htmlFor="altLabel"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Alt Label
                </Label>
                <Input
                  id="altLabel"
                  {...register("altLabel")}
                  className="mt-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="Alternative label (optional)"
                />
              </div>

              <div>
                <Label
                  htmlFor="sortOrder"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Sort Order
                </Label>
                <Input
                  id="sortOrder"
                  type="number"
                  {...register("sortOrder", { valueAsNumber: true })}
                  className="mt-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                  placeholder="0"
                  min="0"
                  max="9999"
                />
              </div>
            </div>

            {/* Description & Parent ID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Label
                  htmlFor="description"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Description
                </Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  className="mt-1 w-full h-24 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-green-500 focus:ring-1 focus:ring-green-500 p-3 rounded-lg resize-vertical"
                  placeholder="Enter description (optional)"
                />
              </div>

             
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
                {id ? "Update Master" : "Create Master"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
