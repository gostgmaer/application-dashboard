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

export default function DiscountsPage({statics}:any) {
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
      content: <DiscountForm statics={statics} />,
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
      <DiscountRulesTable statics={statics}></DiscountRulesTable>
    </>
  );
}
