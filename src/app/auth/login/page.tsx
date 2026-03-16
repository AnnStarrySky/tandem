import React, { Suspense } from "react";

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions, AUTH_ROUTES } from "@shared/config/auth";

import { LoginPageClient } from "./page-client";

export default async function LoginPage(): Promise<React.JSX.Element> {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    redirect(AUTH_ROUTES.dashboard);
  }

  return (
    <Suspense fallback={null}>
      <LoginPageClient />
    </Suspense>
  );
}
