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

const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem("theme");
    var theme =
      stored === "light" || stored === "dark"
        ? stored
        : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.style.colorScheme = theme;
  } catch (e) {}
})();
`;

export const metadata: Metadata = {
  title: "CodeCat",
  description: "Interview trainer platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.JSX.Element {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>

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
