import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased bg-background text-foreground min-h-screen flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
