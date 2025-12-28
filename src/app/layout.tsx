import type { Metadata } from "next";
// @ts-ignore
import "./globals.css";
import { Roboto } from "next/font/google";
import { Providers } from "@/components/providers";
// import { SessionProviderWrapper } from "@/components/Sessionproviders";
import settingServices from "@/lib/http/settngsServices";
import { sitekey } from "@/config/setting";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";

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
    description:
      setting?.name || "Best E-Commerce Store for all your shopping needs",
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
  // const session = await getServerSession(authOptions);
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${roboto.className}`}>
        <SessionProviderWrapper>
          <Providers>{children}</Providers>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
