import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { ConvexClientProvider } from "@/components/convex-client-provider";
import { Toaster } from "@/components/ui/sonner";
import "@liveblocks/react-ui/styles.css";
import "@liveblocks/react-tiptap/styles.css";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Google Docs",
  description: "Google Docs clone",
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={inter.className}>
        <NuqsAdapter>
          <ConvexClientProvider>
            <Toaster/>
          {children}
          </ConvexClientProvider>
          </NuqsAdapter>
      </body>
    </html>
  );
}
