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
import { NotificationProviderCommunication } from "@/contexts/notification-context";
import { MessagingProvider } from "@/contexts/messaging-context";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SettingProvider>
      <WebSocketProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <UserProvider>
            <NotificationProvider>
              <NotificationProviderCommunication>
                <MessagingProvider>
                  <ReduxProvider store={store}>
                    <ModalProvider>
                      {children}
                      <Toaster />
                      <ModalManager />
                    </ModalProvider>
                  </ReduxProvider>
                </MessagingProvider>
              </NotificationProviderCommunication>
            </NotificationProvider>
          </UserProvider>
        </ThemeProvider>
      </WebSocketProvider>
    </SettingProvider>
  );
}
