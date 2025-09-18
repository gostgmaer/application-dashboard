"use client";
import { Button } from "@/components/ui/button";
import { Search, Bell, Menu, Users } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Sidebar } from "./sidebar";
import { ThemeSwitch } from "../elements/theme-switch";
import { UserStatus } from "../elements/userpopover";
import { useState } from "react";
import Breadcrumbs from "./common/breadcrumb";
import DashboardHeader from "./private/header";
interface DashboardProps {
  children: React.ReactNode;
}
export default function PrivateLayout({ children }: DashboardProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const closeMobile = () => {
    setMobileOpen(false);
  };

  const openMobile = () => {
    setMobileOpen(true);
  };

  return (
    <div className="h-screen flex overflow-hidden bg-white dark:bg-gray-900 ">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
        mobileOpen={mobileOpen}
        onMobileClose={closeMobile}
      />

      <div className="flex-1 flex flex-col bg-white dark:bg-gray-900">
        <DashboardHeader />

        <main className="flex-grow px-6 py-2 space-y-6 max-h-[calc(100vh-64px)] overflow-y-auto  text-black  dark:text-white">
          {children}
        </main>
      </div>

      {/* <NotificationCenter /> */}
    </div>
  );
}
