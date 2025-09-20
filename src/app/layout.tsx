import "./globals.css";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { Providers } from "@/components/providers";
import { SessionProviderWrapper } from "@/components/Sessionproviders";
import { DialogProvider } from "@/hooks/use-dialog";
import { ReusableDialog } from "@/components/layout/dialog";
import { ModalProvider } from "@/contexts/modal-context";
import ModalManager from "@/components/layout/modals/modal-manager";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/authOptions";
import SettingServices from "@/helper/services/SettingServices";
import { sitekey } from "@/config/setting";
// const inter = Inter({ subsets: ['latin'] });
const roboto = Roboto({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NextAuth - Modern Authentication System",
  description:
    "A comprehensive authentication and user management system with Next.js",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const token: string = session?.accessToken || "";
  const setting = await SettingServices.getOnlineStoreSetting(sitekey);
  console.log(setting);
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${roboto.className} overflow-hidden`}>
        <SessionProviderWrapper>
          <Providers>
            <NotificationProvider authToken={token}>
              <DialogProvider>
                <ModalProvider>
                  {children}
                  <ReusableDialog />
                  <ModalManager />
                </ModalProvider>
              </DialogProvider>
            </NotificationProvider>
          </Providers>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
