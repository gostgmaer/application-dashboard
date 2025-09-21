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
import { useDialog } from "@/hooks/use-dialog";
import permissionServices from "@/helper/services/permissionServices";
import { useSession } from "next-auth/react";

const permissionCategory = [
  {
    name: "Coupon",
    label: "Coupon Management",
    description:
      "Create, update, and track promotional coupons and discount rules",
  },
  {
    name: "Cart",
    label: "Cart Management",
    description: "Create, update, and track Cart",
  },
  {
    name: "Address",
    label: "Address Management",
    description: "Create, update, and track Address",
  },
  {
    name: "Review",
    label: "Review Moderation",
    description: "Moderate product reviews, ratings, and user feedback",
  },
  {
    name: "Ticket",
    label: "Support Ticketing",
    description: "Manage customer support tickets and resolution workflows",
  },
  {
    name: "Content",
    label: "Content Management",
    description: "Manage CMS pages, banners, and static content blocks",
  },
  {
    name: "Media",
    label: "Media Library",
    description: "Upload, organize, and manage images, videos, and documents",
  },
  {
    name: "Report",
    label: "Reporting & Insights",
    description: "Generate and view business reports, charts, and analytics",
  },
  {
    name: "Webhook",
    label: "Webhook Management",
    description: "Configure and monitor outbound webhooks for integrations",
  },
  {
    name: "Integration",
    label: "Third-Party Integrations",
    description:
      "Manage external service connections like payment gateways or shipping APIs",
  },
  {
    name: "Logistics",
    label: "Logistics Management",
    description: "Oversee shipping zones, delivery partners, and tracking",
  },
  {
    name: "Tax",
    label: "Tax Configuration",
    description: "Manage tax rules, zones, and compliance settings",
  },
  {
    name: "Translation",
    label: "Translation Management",
    description: "Manage multilingual content and localization workflows",
  },
  {
    name: "Theme",
    label: "Theme Customization",
    description:
      "Control layout, colors, and UI themes for storefront and admin",
  },
  {
    name: "ImportExport",
    label: "Import/Export Tools",
    description: "Bulk import or export data for products, users, or orders",
  },
  {
    name: "Scheduler",
    label: "Task Scheduler",
    description: "Manage cron jobs, background tasks, and automation triggers",
  },
  {
    name: "Maintenance",
    label: "System Maintenance",
    description: "Perform system updates, backups, and downtime scheduling",
  },
  {
    name: "User",
    label: "User Management",
    description: "Manage users, roles, and access levels",
  },
  {
    name: "Product",
    label: "Product Management",
    description: "Manage product listings, variants, pricing, and inventory",
  },
  {
    name: "Order",
    label: "Order Management",
    description: "Oversee order lifecycle, status updates, and fulfillment",
  },
  {
    name: "Category",
    label: "Category Management",
    description: "Organize and manage product categories",
  },
  {
    name: "Brand",
    label: "Brand Management",
    description: "Manage brand metadata and associations",
  },
  {
    name: "Setting",
    label: "System Settings",
    description: "Control system-wide configurations and preferences",
  },
  {
    name: "Wishlist",
    label: "Wishlist Management",
    description: "View and manage user wishlist data",
  },
  {
    name: "Audit",
    label: "Audit Logs",
    description: "Access audit logs and system activity history",
  },
  {
    name: "Admin",
    label: "Admin Tools",
    description:
      "Perform bulk operations, data exports, and system-level actions",
  },
  {
    name: "SEO",
    label: "SEO Management",
    description: "Manage metadata, slugs, and search optimization helpers",
  },
  {
    name: "Variant",
    label: "Variant Management",
    description: "Control variant generation, attributes, and mapping logic",
  },
  {
    name: "Permission",
    label: "Permission Control",
    description: "View and assign granular permissions across roles",
  },
  {
    name: "Role",
    label: "Role Management",
    description: "Create, update, and assign roles with permission sets",
  },
  {
    name: "CLI",
    label: "Developer CLI",
    description:
      "Trigger CLI scaffolding, migrations, and developer automation",
  },
  {
    name: "Analytics",
    label: "Analytics Dashboard",
    description: "Access dashboards, KPIs, and performance metrics",
  },
  {
    name: "Notification",
    label: "Notification Center",
    description:
      "Manage system alerts, email templates, and push notifications",
  },
];

// Define action types
const actionTypes = {
  READ: "read",
  WRITE: "write",
  MODIFY: "modify",
  DELETE: "delete",
  MANAGE: "full",
};
// Zod schema based on the provided Mongoose schema
const permissionSchema = z
  .object({
    name: z.string().min(1, "Name is required").trim(),
    description: z.string().trim().optional(),
    category: z.string().trim(),
    action: z.enum([
      actionTypes.READ,
      actionTypes.WRITE,
      actionTypes.MODIFY,
      actionTypes.DELETE,
      actionTypes.MANAGE,
    ]),
    isDefault: z.boolean(),
    isActive: z.boolean(),
  })
  .strict();

interface permissionData {
  name: string;
  description?: string;
  category?: string;
  action?: keyof typeof actionTypes;
  //   permissions: string[];
  isDefault: boolean;
  isActive: boolean;
}

export default function PermissionForm({ p, id }: any) {
  const { data: session, status, update } = useSession();

  console.log(p, id);

  const { toast } = useToast();
  const { openDialog, closeDialog, confirm, alert, options } = useDialog();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<permissionData>({
    resolver: zodResolver(permissionSchema),
    defaultValues: {
      name: p?.name?.split(":")[0] || "",
      description: p?.description || "",
      category: p?.category || "",
      action: p?.action || "read",
      isDefault: p?.isDefault || false,
      isActive: p?.isActive || true,
    },
  });

  const onSubmit = async (
    data: permissionData,
    status: "draft" | "published" | "update"
  ) => {
    const updateData = {
      ...data,
    };
    let res: any = {};
    switch (status) {
      case "update":
        {
          res = await permissionServices.updatePatch(
            id,
            updateData,
            session?.accessToken
          );
        }
        break;

      default:
        {
          res = await permissionServices.create(
            updateData,
            session?.accessToken
          );
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
  };

  return (
    <div className=" bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-lg">
          <CardHeader className="bg-gray-50 dark:bg-gray-800 border-b-gray-200 dark:border-b-gray-700 pb-0">
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <div className="w-2 h-6 bg-blue-400 rounded-full"></div>
              Permission Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div>
              <Label
                htmlFor="name"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Permission Name *
              </Label>
              <Input
                id="name"
                {...register("name")}
                className="mt-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Enter category title"
              />
              {errors.name && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="mt-6">
              <Label
                htmlFor="category"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Category *
              </Label>

              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    defaultValue={getValues("category")}
                  >
                    <SelectTrigger
                      className={`mt-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-blue-500 ${
                        errors.category ? "border-red-500" : ""
                      }`}
                    >
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                      {permissionCategory.map((category) => (
                        <SelectItem
                          key={category.label}
                          value={category.label}
                          className="hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />

              {errors.category && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.category.message}
                </p>
              )}
            </div>
            <div className="mt-6">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Action
              </Label>
              <div className="flex flex-wrap gap-6 mt-2">
                <Controller
                  name="action"
                  control={control}
                  render={({ field }) => (
                    <>
                      {Object.values(actionTypes).map((action) => (
                        <div
                          key={action}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="radio"
                            id={`action-${action}`}
                            name="action" // Ensures only one radio button can be selected
                            value={action}
                            checked={field.value === action}
                            onChange={(e) => field.onChange(e.target.value)}
                            className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 dark:border-gray-600 cursor-pointer"
                          />
                          <Label
                            htmlFor={`action-${action}`}
                            className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                          >
                            {action.charAt(0).toUpperCase() + action.slice(1)}
                          </Label>
                        </div>
                      ))}
                    </>
                  )}
                />
              </div>
              {errors.action && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.action.message}
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
                placeholder="Enter permission description"
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm text-gray-700 dark:text-gray-300">
                  Default ?
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
                  Active ?
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
                Save Permission
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
