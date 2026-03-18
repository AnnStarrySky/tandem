"use client";

import type React from "react";
import type { PropsWithChildren } from "react";

import { SessionProvider } from "next-auth/react";

export function AuthProvider({ children }: PropsWithChildren): React.JSX.Element {
  return (
    <SessionProvider refetchOnWindowFocus={false} refetchWhenOffline={false}>
      {children}
    </SessionProvider>
  );
}
