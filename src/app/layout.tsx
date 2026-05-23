import type { Metadata, Viewport } from "next";
import "./globals.css";
import { EazoProvider } from "@eazo/sdk/react";
import { cn } from "@/utils/utils";
import { Toaster } from "@/components/ui/sonner";
import { UserSyncEffect } from "@/components/user-profile/user-sync-effect";

const SITE_URL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : undefined;

const SITE_TITLE = "海与船 · Sail the Mind";
const SITE_DESCRIPTION =
  "A small 3D world you can sail through. Four islands. Twelve people you can meet.";

export const metadata: Metadata = {
  ...(SITE_URL ? { metadataBase: new URL(SITE_URL) } : {}),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: "Sail the Mind",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: "/",
    locale: "zh_CN",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh" className={cn("h-full antialiased")}>
      <body className="h-full w-full m-0 p-0 overflow-hidden bg-[oklch(35%_0.06_200)]">
        <EazoProvider>
          <UserSyncEffect />
          {children}
          <Toaster />
        </EazoProvider>
      </body>
    </html>
  );
}
