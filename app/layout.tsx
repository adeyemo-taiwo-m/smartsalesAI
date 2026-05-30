import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";
import { Toaster } from "@/components/shared/Toaster";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SmartSales AI - Turn Chats Into Sales Automatically",
  description: "AI-powered WhatsApp, Instagram & Web Sales Assistant for African SMEs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} dark`} style={{ colorScheme: "dark" }} suppressHydrationWarning>
      <body className="antialiased bg-dark text-slate-50 min-h-screen font-sans">
        <Providers>
          {children}
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
