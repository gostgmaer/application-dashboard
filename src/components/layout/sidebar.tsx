"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils/utils";
import {
  ChevronDown,
  ChevronRight,
  Home,
  Users,
  Settings,
  BarChart3,
  FileText,
  ShoppingCart,
  Calendar,
  Mail,
  Database,
  Shield,
  Layers,
  Menu,
  X,
  ChevronLeft,
  User,
  CreditCard,
  LogOut,
  User2,
  ShipIcon,
  ReceiptPoundSterling,
  IdCard,
  MailPlus,
  MailOpen,
  ShieldCheck,
} from "lucide-react";

interface NavItem {
  title: string;
  href?: string;
  icon: React.ElementType;
  children?: NavItem[];
}

const navigationItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "User Management",
    icon: Users,
    children: [
      { title: "All Users", href: "/dashboard/users", icon: Users },
      { title: "User Roles", href: "/dashboard/users/roles", icon: Shield },
      {
        title: "Permissions",
        href: "/dashboard/users/permissions",
        icon: ShieldCheck,
      },
    ],
  },
  {
    title: "E-commerce",
    icon: ShoppingCart,
    children: [
      {
        title: "Products",
        href: "/dashboard/ecommerce/products",
        icon: ShoppingCart,
      },
      { title: "Orders", href: "/dashboard/ecommerce/orders", icon: Calendar },
      // { title: "Inventory", href: "/dashboard/ecommerce/inventory", icon: Database },
      // { title: "Analytics", href: "/dashboard/ecommerce/analytics", icon: BarChart3 },
      {
        title: "Shipping",
        href: "/dashboard/ecommerce/shipping",
        icon: ShipIcon,
      },
      {
        title: "Customers",
        href: "/dashboard/ecommerce/customers",
        icon: User2,
      },
    ],
  },
];

const personalNavigationItems: NavItem[] = [
  {
    title: "Profile",
    icon: User,
    children: [
      { title: "View Profile", href: "/dashboard/profile", icon: User },
      { title: "Edit Profile", href: "/dashboard/profile/edit", icon: User },
      {
        title: "Account Settings",
        href: "/dashboard/profile/settings",
        icon: Settings,
      },
    ],
  },
  {
    title: "Analytics",
    icon: BarChart3,
    children: [
      {
        title: "Activity",
        href: "/dashboard/analytics/activity",
        icon: BarChart3,
      },
      {
        title: "Reports",
        href: "/dashboard/analytics/reports",
        icon: ReceiptPoundSterling,
      },
    ],
  },
  {
    title: "Settings",
    icon: Settings,
    children: [
      { title: "General", href: "/dashboard/settings", icon: Settings },
      { title: "Billing", href: "/dashboard/settings/billing", icon: IdCard },
      { title: "Security", href: "/dashboard/settings/security", icon: Shield },
      {
        title: "API Configuration",
        href: "/dashboard/settings/integration",
        icon: Database,
      },
    ],
  },
  {
    title: "Communication",
    icon: MailOpen,
    children: [
      {
        title: "Messages",
        href: "/dashboard/communication/messages",
        icon: Mail,
      },
      {
        title: "Email",
        href: "/dashboard/communication/email",
        icon: MailPlus,
      },
      {
        title: "Notifications",
        href: "/dashboard/communication/notifications",
        icon: Calendar,
      },
    ],
  },
  {
    title: "Logout",
    icon: LogOut,
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({
  collapsed,
  onToggle,
  mobileOpen,
  onMobileClose,
}: SidebarProps) {


  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([
    "User Management",
  ]);

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    );
  };

  const isActive = (href?: string) => {
    if (!href) return false;
    return pathname === href;
  };

  const isParentActive = (item: NavItem): boolean => {
    if (item.href && isActive(item.href)) return true;
    if (item.children) {
      return item.children.some((child) => isActive(child.href));
    }
    return false;
  };

  const renderNavItem = (item: NavItem, depth = 0) => {
    const Icon = item.icon;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.title);
    const active = isParentActive(item);

    return (
      <div key={item.title}>
        {item.href ? (
          <Link
            href={item.href}
            onClick={onMobileClose}
            className={cn(
              "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200",
              "hover:bg-gray-100 dark:hover:bg-gray-800",
              depth > 0 &&
                "ml-4 pl-4 border-l border-gray-200 dark:border-gray-700",
              active &&
                "bg-gray-900 text-white dark:bg-white dark:text-gray-900",
              !active && "text-gray-700 dark:text-gray-300",
              collapsed && "px-2"
            )}
          >
            <Icon size={16} />
            {(!collapsed || mobileOpen) && (
              <span
                className={cn(
                  "transition-all duration-200",
                  depth > 0 && "text-sm font-medium"
                )}
              >
                {item.title}
              </span>
            )}
          </Link>
        ) : (
          <button
            onClick={() => toggleExpanded(item.title)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 w-full",
              "hover:bg-gray-100 dark:hover:bg-gray-800",
              active && "bg-gray-50 dark:bg-gray-800",
              "text-gray-700 dark:text-gray-300",
              collapsed && "px-2"
            )}
          >
            <Icon size={16} />
            {(!collapsed || mobileOpen) && (
              <>
                <span className="flex-1 text-left text-sm font-medium">
                  {item.title}
                </span>
                {hasChildren && (
                  <div className="transition-transform duration-200">
                    {isExpanded ? (
                      <ChevronDown size={14} />
                    ) : (
                      <ChevronRight size={14} />
                    )}
                  </div>
                )}
              </>
            )}
          </button>
        )}

        {hasChildren && isExpanded && (!collapsed || mobileOpen) && (
          <div className="mt-0.5 space-y-0.5">
            {item.children!.map((child) => renderNavItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 min-h-screen max-h-screen  bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-50 transition-all duration-300",
          "md:relative md:translate-x-0",
          collapsed && !mobileOpen ? "w-14" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-gray-200 h-16 dark:border-gray-800">
            {(!collapsed || mobileOpen) && (
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                Admin Dashboard
              </h1>
            )}
            <button
              onClick={mobileOpen ? onMobileClose : onToggle}
              className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {collapsed ? (
                <ChevronRight size={18} />
              ) : (
                <ChevronLeft size={18} />
              )}
            </button>
          </div>

          {/* Navigation */}
          <div className="flex flex-col h-full">
            <nav className="flex-1  h-[50%] p-3 space-y-1">
              {navigationItems.map((item) => renderNavItem(item))}
            </nav>
            <nav className="flex-0  max-h-[50%] p-3 space-y-1">
              <hr></hr>
              {personalNavigationItems.map((item) => renderNavItem(item))}
            </nav>
          </div>
        </div>
      </aside>
    </>
  );
}
