"use client";

import React, { useState, useMemo } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, RefreshCw, TrendingUp, Percent, DollarSign } from "lucide-react";
import { Discount } from "@/types/discount";
import { DiscountForm } from "@/components/pages/dashboard/product/discounts/DiscountForm";
import { useModal } from "@/contexts/modal-context";
import Breadcrumbs from "@/components/layout/common/breadcrumb";
import { usePermissions } from "@/hooks/usePermissions";
import { DiscountRulesTable } from "./DiscountRoles";

export default function DiscountsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const { hasPermission } = usePermissions();
  const [formModal, setFormModal] = useState<{
    isOpen: boolean;
    discount: Discount | null;
  }>({
    isOpen: false,
    discount: null,
  });

  // Debounced search term for API calls
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const { showCustom } = useModal();
//   const { discounts, loading, error, refetch } = useDiscounts(
//     debouncedSearchTerm,
//     typeFilter === "all" ? undefined : typeFilter
//   );




  // Statistics calculations
//   const stats = useMemo(() => {
//     const activeDiscounts = discounts.filter(
//       (d) => d.status === "active"
//     ).length;
//     const percentageDiscounts = discounts.filter(
//       (d) => d.discountType === "percentage"
//     ).length;
//     const fixedDiscounts = discounts.filter((d) => d.discountType === "fixed").length;
//     const totalDiscounts = discounts.length;

//     return {
//       total: totalDiscounts,
//       active: activeDiscounts,
//       percentage: percentageDiscounts,
//       fixed: fixedDiscounts,
//     };
//   }, [discounts]);

  const handleCreate: any = async () => {
    showCustom({
      title: `Create New Discount Rule`,
      content: <DiscountForm />,
    });
  };

  return (
    <>
      <Breadcrumbs
        heading="Role Dashboard"
        desc="Manage user roles, permissions, and access control across your organization"
        btn={{
          event: handleCreate,
          show: hasPermission("role:create") && true,
        }}
      />
      <div className=" mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}

        {/* Statistics Cards */}
        {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Discounts
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                {stats.active} active, {stats.total - stats.active} inactive
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Discounts
              </CardTitle>
              <div className="h-4 w-4 bg-green-500 rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.active}
              </div>
              <p className="text-xs text-muted-foreground">Ready to apply</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Percentage</CardTitle>
              <Percent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.percentage}</div>
              <p className="text-xs text-muted-foreground">
                Percentage-based discounts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Fixed Amount
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.fixed}</div>
              <p className="text-xs text-muted-foreground">
                Fixed amount discounts
              </p>
            </CardContent>
          </Card>
        </div> */}
      </div>
      <DiscountRulesTable></DiscountRulesTable>
    </>
  );
}
