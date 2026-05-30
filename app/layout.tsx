import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";
import { Toaster } from "@/components/shared/Toaster";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

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
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="antialiased bg-dark text-text-primary min-h-screen font-sans transition-colors duration-300">
        <Providers>
          {children}
          <Toaster />
          <ThemeToggle />
        </Providers>
      </body>
    </html>
  );
}
