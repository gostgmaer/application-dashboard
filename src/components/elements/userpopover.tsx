"use client";

// import { useAuth } from '@/hooks/useAppContext'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
// LogOut from 'next-auth/core/actions/logout'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Settings, LogOut } from "lucide-react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import Link from "next/link";

import Cookies from "js-cookie";

export function UserStatus() {
  //   const { user, login, logout, isAuthenticated } = useAuth()
  const { data: session, status } = useSession();
  const [username, setUsername] = useState("");

  //   const handleLogin = (e: React.FormEvent) => {
  //     e.preventDefault()
  //     if (username.trim()) {
  //       login(username)
  //       setUsername('')
  //     }
  //   }

  const handleSignOut = (): void => {
    // Clear localStorage and sessionStorage
    // if (typeof window !== "undefined") {
    //   localStorage.clear();
    //   sessionStorage.clear(); // Clear client-side cookies

    //   Object.keys(Cookies.get()).forEach((cookieName) => {
    //     Cookies.remove(cookieName);
    //   });
    // } // Sign out using NextAuth
 signOut();
    localStorage.clear();
    sessionStorage.clear(); // Debug: Log cookies before removing

    console.log("Cookies before removal:", Cookies.get()); // Remove all cookies set via js-cookie

    Object.keys(Cookies.get()).forEach((cookieName) => {
      Cookies.remove(cookieName, { path: "/" });
    }); // Debug: Log cookies after removal

    console.log("Cookies after removal:", Cookies.get());

   
  };

  if (status === "authenticated") {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src="https://images.pexels.com/photos/2269872/pexels-photo-2269872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt={session.user?.name || ""}
              />
              <AvatarFallback>
                {session.user?.name?.charAt(0).toUpperCase() ?? ""}
              </AvatarFallback>
            </Avatar>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56" align="end">
          <div className="flex items-center gap-2 border-b pb-4">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src="https://images.pexels.com/photos/2269872/pexels-photo-2269872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt={session.user?.name || ""}
              />
              <AvatarFallback>
                {session.user?.name?.charAt(0).toUpperCase() ?? ""}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{session.user?.name}</span>
              <span className="text-xs text-muted-foreground">
                @{session.user?.name?.toLowerCase()}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-1 pt-2">
            <Link
              href="/profile"
              className="w-full justify-start gap-2 flex items-center py-2 "
            >
              <User size={16} />
              My Profile
            </Link>
            <Link
              href="/account"
              className="w-full justify-start gap-2 flex items-center py-2"
            >
              <Settings size={16} />
              Account Settings
            </Link>
            <hr className=" border-t" />
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-red-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
              size="sm"
              onClick={() => handleSignOut()}
            >
              <LogOut size={16} />
              Logout
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  //   return (
  //     <form onSubmit={handleLogin} className="flex gap-2">
  //       <Input
  //         type="text"
  //         placeholder="Username"
  //         value={username}
  //         onChange={(e) => setUsername(e.target.value)}
  //         className="max-w-[200px]"
  //       />
  //       <Button type="submit" size="sm">Sign In</Button>
  //     </form>
  //   )
}
