import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import type { Lang } from "@/i18n/types";
import { Toaster } from "sonner";
import Header from "@/components/layout/Header";
import ScrollToTop from "@/components/layout/ScrollToTop";
import ServiceWorkerRegister from "@/components/pwa/ServiceWorkerRegister";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Memorize Supporter",
  description: "A focus-driven memorization app for spaced repetition and active recall.",
  manifest: "/manifest.json",
  openGraph: {
    title: "Memorize Supporter",
    description: "A focus-driven memorization app for spaced repetition and active recall.",
    type: "website",
    siteName: "Memorize Supporter",
  },
  twitter: {
    card: "summary_large_image",
    title: "Memorize Supporter",
    description: "A focus-driven memorization app for spaced repetition and active recall.",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Memorize Supporter",
  },
};

export const viewport = {
  themeColor: "#09090b",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  const initialLang = ["en", "ko", "ja"].includes(lang) ? (lang as Lang) : "en";

  return (
    <html lang={initialLang} className="dark">
      <body className={`${inter.variable} antialiased bg-background text-foreground min-h-screen flex flex-col`}>
        <ServiceWorkerRegister />
        <ScrollToTop />
        <Header lang={initialLang} />
        {children}
        <Toaster theme="dark" position="bottom-right" />
      </body>
    </html>
  );
}
