import React from "react";

import {
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  Home,
  Package,
  ShoppingCart,
  BarChart3,
  Users,
  Folder,
  Tag,
  HelpCircle,
} from "lucide-react";
import { ThemeSwitch } from "@/components/elements/theme-switch";
import { UserStatus } from "@/components/elements/userpopover";
import NotificationsPopover from "@/components/elements/NotificationsPopover";
import SearchBar from "@/components/elements/globalSearchBar";
import { useSession } from "next-auth/react";

const DashboardHeader: React.FC = () => {
  const { data: session } = useSession();

  const notifications:any = [
    {
      id: 1,
      title: "Low Stock Alert",
      message: "5 products are running low on stock",
      time: "2 min ago",
      type: "warning",
    },
    {
      id: 2,
      title: "New Order",
      message: "Order #12345 has been placed",
      time: "5 min ago",
      type: "success",
    },
    {
      id: 3,
      title: "Product Review",
      message: 'New review for "Wireless Headphones"',
      time: "10 min ago",
      type: "info",
    },
  ];

  return (
    <header className="sticky top-0 z-50 border-b bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700 transition-colors duration-200">
      {/* Main Header */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section - Logo & Navigation */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-blue-500 dark:bg-blue-600">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  {session?.role}
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  E-commerce Dashboard
                </p>
              </div>
            </div>
            {/* Navigation */}
            <div className="flex-1 max-w-xl w-auto mx-8 hidden md:block">
              <SearchBar></SearchBar>
            </div>
          </div>
          {/* Center Section - Search */}

          {/* Right Section - Actions & Profile */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            <button className="lg:hidden p-2 rounded-lg transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800">
              <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>
            {/* Notifications */}
            <NotificationsPopover token={session?.accessToken || ""}
            ></NotificationsPopover>
            {/* Theme Toggle */}
            <ThemeSwitch />
            <UserStatus data={session?.user} />
            {/* User Profile */}
          </div>
        </div>
      </div>
      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-4">
        <SearchBar></SearchBar>
      </div>
    </header>
  );
};

export default DashboardHeader;
