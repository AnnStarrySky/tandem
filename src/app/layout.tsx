import React from "react";

import { Geist, Geist_Mono } from "next/font/google";

import { ConfigProvider } from "antd";
import { NextIntlClientProvider } from "next-intl";

import { AuthProvider } from "./providers/auth-provider";
import { ThemeProvider } from "./providers/theme-provider";

import type { Metadata } from "next";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CodeCat",
  description: "Interactive interview trainer platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.JSX.Element {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ConfigProvider>
          <ThemeProvider>
            <AuthProvider>
              <NextIntlClientProvider>{children}</NextIntlClientProvider>
            </AuthProvider>
          </ThemeProvider>
        </ConfigProvider>
      </body>
    </html>
  );
}
