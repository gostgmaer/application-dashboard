"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useEffect } from "react";
import { SessionProvider, useSession } from "next-auth/react";
import Dashboard from "./dashboard";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function PublicLayout({ children }: MainLayoutProps) {
  const { data: session, status } = useSession();

  // useEffect(() => {
  //   if (session) {
  //     const setSessionCookies = async () => {
  //       try {
  //         await fetch("/api/auth/cookies");
  //       } catch (error) {
  //         console.error("Failed to set session cookies:", error);
  //       }
  //     };

  //     setSessionCookies();
  //   }
  // }, [session]);

  return (
    <div className="flex flex-col bg-white dark:bg-gray-900 min-h-screen">
      <>
        <Header />
        <main className="flex-grow container mx-auto px-4">{children}</main>
        <Footer />
      </>
    </div>
  );
}
