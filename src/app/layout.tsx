
import type { Metadata } from "next";
// @ts-ignore
import "./globals.css";
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
import { SettingProvider } from "@/contexts/SettingContext";
import settingServices from "@/helper/services/settngsServices";
import { sitekey } from "@/config/setting";

const roboto = Roboto({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const settingResponse = await settingServices.getBySiteKey(sitekey as string);
  const setting = settingResponse?.data;
  
  const seoKeywords = setting?.seo?.keywords?.length 
    ? setting.seo.keywords.join(", ") 
    : "ecommerce, shopping, online store";
  const siteLocale = setting?.siteLocale?.replace("-", "_") || "en_US";

  return {
    title: setting?.siteName || "My E-Commerce Store",
    description: setting?.name || "Best E-Commerce Store for all your shopping needs",
    keywords: seoKeywords,
    // themeColor: setting?.branding?.themeColor || "#FF6600",
    authors: [{ name: "My Store Team" }],
    metadataBase: new URL("https://yourdomain.com"),
    openGraph: {
      title: setting?.siteName,
      description: setting?.name,
      locale: siteLocale,
      siteName: setting?.siteName,
      images: setting?.branding?.logo 
        ? [{ url: setting.branding.logo, width: 800, height: 600 }] 
        : undefined,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: setting?.siteName,
      description: setting?.name,
      site: "@yourtwitterhandle",
      creator: "@yourtwitterhandle",
      images: setting?.branding?.logo,
    },
    icons: {
      icon: setting?.branding?.favicon || "/favicon.ico",
      shortcut: setting?.branding?.favicon || "/favicon-16x16.png",
      apple: setting?.branding?.favicon || "/apple-touch-icon.png",
    },
    robots: "index, follow",
    other: {
      "contact-email": setting?.contactInfo?.email,
      "contact-phone": setting?.contactInfo?.phone,
      "site-timezone": setting?.siteTimezone,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const token: string = session?.accessToken || "";

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${roboto.className} overflow-hidden`}>
        <SessionProviderWrapper>
          <Providers>
            <SettingProvider>
              <NotificationProvider authToken={token}>
                <DialogProvider>
                  <ModalProvider>
                    {children}
                    <ReusableDialog />
                    <ModalManager />
                  </ModalProvider>
                </DialogProvider>
              </NotificationProvider>
            </SettingProvider>
          </Providers>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}