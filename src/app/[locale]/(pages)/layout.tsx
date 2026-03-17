import React from "react";
import { Header } from "@/src/widgets/header";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mx-auto w-[1440px] max-w-[1440px] p-4">
      <div className="flex w-full justify-center rounded-lg shadow-2xl">
        <Header />
        <main className="w-full px-15 py-6">{children}</main>
      </div>
    </div>
  );
}
