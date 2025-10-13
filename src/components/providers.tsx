"use client";

import { ThemeProvider } from "next-themes";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/store";
import { Toaster } from "@/components/ui/toaster";
import { UserProvider } from "@/contexts/UserProvider";
import { SettingProvider } from "@/contexts/SettingContext";
import { WebSocketProvider } from "@/contexts/websocket-context";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { ModalProvider } from "@/contexts/modal-context";
import ModalManager from "./ui/modals/modal-manager";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SettingProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <UserProvider>
          <WebSocketProvider>
            <NotificationProvider>
              <ReduxProvider store={store}>
                <ModalProvider>
                  {children}

                  <Toaster />
                  <ModalManager />
                </ModalProvider>
              </ReduxProvider>
            </NotificationProvider>
          </WebSocketProvider>
        </UserProvider>
      </ThemeProvider>
    </SettingProvider>
  );
}
