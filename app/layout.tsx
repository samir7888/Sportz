import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/providers/query-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Sportz | Real-Time Live Commentary",
    template: "%s | Sportz"
  },
  description: "The ultimate real-time sports commentary platform for football and cricket. Get live scores, over-by-over updates, and granular match data instantly.",
  keywords: ["live sports", "cricket commentary", "football scores", "real-time sports", "pusher", "drizzle orm"],
  authors: [{ name: "Sportz Team || Sameer Basnet" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          {children}
        </QueryProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
