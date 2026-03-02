import { BackendUser, BackendAuthResponse } from "./auth";

import type { DefaultSession, DefaultUser } from "next-auth";
import type { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User extends DefaultUser {
    id: number;
    email?: string | null;
    name?: string | null;

    __backend?: BackendAuthResponse;
  }

  interface Session extends DefaultSession {
    user: BackendUser;
    accessToken?: string;
    refreshToken?: string;
    provider?: "credentials" | "github" | "gitlab";
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    user?: BackendUser;
    accessToken?: string;
    refreshToken?: string;
    provider?: "credentials" | "github" | "gitlab";
  }
}
