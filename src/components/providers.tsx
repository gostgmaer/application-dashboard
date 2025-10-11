"use client";

import { ThemeProvider } from "next-themes";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/store";
import { Toaster } from "@/components/ui/toaster";
import { UserProvider } from "@/contexts/UserProvider";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ReduxProvider store={store}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <UserProvider>
        {children}
        </UserProvider>
        <Toaster />
      </ThemeProvider>
    </ReduxProvider>
  );
}
