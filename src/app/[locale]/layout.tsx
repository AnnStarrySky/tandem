import React from "react";

import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";

import { ConfigProvider } from "antd";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";

import { ThemeProvider } from "@shared/lib/theme";

import { routing } from "../../i18n";
import { AuthProvider } from "../providers/auth-provider";

import type { Metadata } from "next";

import "../globals.css";

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
  description: "Is a platform for beginner programmers.",
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages({ locale });

  return (
    <html lang={locale}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <AuthProvider>
            <NextIntlClientProvider locale={locale} messages={messages}>
              <div className="min-h-screen overflow-x-hidden">
                <ConfigProvider>{children}</ConfigProvider>
              </div>
            </NextIntlClientProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
