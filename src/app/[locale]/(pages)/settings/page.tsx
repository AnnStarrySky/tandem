import React from "react";

import { redirect } from "next/navigation";

import { getServerSession } from "next-auth";

import { authOptions, AUTH_ROUTES } from "@shared/config/auth";

import SettingsClient from "./settings-client";

type Props = {
  params: { locale: string };
};

export default async function SettingsPage({ params }: Props): Promise<React.JSX.Element> {
  const { locale } = params;
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect(`/${locale}${AUTH_ROUTES.signIn}`);
  }

  return <SettingsClient />;
}
