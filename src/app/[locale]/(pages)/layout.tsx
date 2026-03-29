import React from "react";

import { Header } from "@/src/widgets/header";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mx-auto min-h-screen w-full max-w-[1440px] p-4">
      <div className="flex min-h-[calc(100vh-32px)] w-full items-stretch rounded-lg shadow-2xl">
        <Header className="min-h-full" />
        <main className="w-full px-4 py-4 sm:px-8 md:px-15 md:py-6">{children}</main>
      </div>
    </div>
  );
}
