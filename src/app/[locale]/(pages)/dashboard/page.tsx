import Dashboard from "./dashboard-client";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions, AUTH_ROUTES } from "@shared/config/auth";
import React from "react";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function DashboardPage({ params }: Props): Promise<React.JSX.Element> {
  const { locale } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect(`/${locale}${AUTH_ROUTES.signIn}`);
  }

  return <Dashboard />;
}
