import React from "react";

import { redirect } from "next/navigation";

import { getServerSession } from "next-auth";

import { authOptions, AUTH_ROUTES } from "@shared/config/auth";

import { RegisterPageClient } from "./page-client";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function RegisterPage({ params }: Props): Promise<React.JSX.Element> {
  const { locale } = await params;
  const session = await getServerSession(authOptions);

  if (session?.user) {
    redirect(`/${locale}${AUTH_ROUTES.dashboard}`);
  }

  return <RegisterPageClient />;
}
