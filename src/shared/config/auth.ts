import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

import {
  createDevMockUser,
  findDevMockUserByEmail,
  validateDevMockCredentials,
} from "@shared/api/auth";

import type { BackendAuthResponse, BackendLoginResponse } from "@shared/types";
import type { NextAuthOptions } from "next-auth";

export const AUTH_ROUTES = {
  signIn: "/auth/login",
  signUp: "/auth/register",
  dashboard: "/dashboard",
  backendLogin: "api/login",
} as const;

export const AUTH_ENV = {
  useMock: process.env.AUTH_USE_MOCK === "true",
  githubEnabled: Boolean(process.env.GITHUB_ID && process.env.GITHUB_SECRET),
  googleEnabled: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
  backendUrl: process.env.BACKEND_URL,
} as const;

function buildMockAuthResponse(data: {
  id: number | string;
  email: string;
  name: string;
}): BackendAuthResponse {
  return {
    user: {
      id: String(data.id),
      email: data.email,
      name: data.name,
    },
    accessToken: "mock-access-token",
    refreshToken: "mock-refresh-token",
  };
}

const providers: NextAuthOptions["providers"] = [
  CredentialsProvider({
    name: "Email & Password",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) {
        return null;
      }

      if (AUTH_ENV.useMock) {
        try {
          const user = await validateDevMockCredentials({
            email: credentials.email.trim(),
            password: credentials.password,
          });

          const data = buildMockAuthResponse({
            id: user.id,
            email: user.email,
            name: user.name,
          });

          return {
            id: data.user.id,
            email: data.user.email ?? undefined,
            name: data.user.name ?? undefined,
            __backend: data,
          };
        } catch {
          return null;
        }
      }

      try {
        if (!AUTH_ENV.backendUrl) {
          throw new Error("BACKEND_URL is not configured");
        }

        const backendResult = await fetch(new URL(AUTH_ROUTES.backendLogin, AUTH_ENV.backendUrl), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            email: credentials.email.trim(),
            password: credentials.password,
          }),
        });

        if (!backendResult.ok) {
          return null;
        }

        const data = (await backendResult.json()) as BackendLoginResponse;

        const backendUser: BackendAuthResponse = {
          user: {
            id: String(data.id),
            email: credentials.email.trim(),
            name: data.name,
          },
          accessToken: data.JWTToken,
        };

        return {
          id: backendUser.user.id,
          email: backendUser.user.email ?? undefined,
          name: backendUser.user.name ?? undefined,
          __backend: backendUser,
        };
      } catch {
        return null;
      }
    },
  }),
];

if (AUTH_ENV.githubEnabled) {
  providers.push(
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  );
}

if (AUTH_ENV.googleEnabled) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  );
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "JWT" },
  pages: {
    signIn: AUTH_ROUTES.signIn,
  },
  providers,
  callbacks: {
    async JWT({ token, user, account, trigger, session }) {
      if (trigger === "update" && session?.user) {
        token.user = {
          ...token.user,
          ...session.user,
        };
        return token;
      }

      if (user?.__backend) {
        const data = user.__backend;

        token.user = data.user;
        token.accessToken = data.accessToken;
        token.refreshToken = data.refreshToken;
        token.provider = "credentials";

        return token;
      }

      if (account && (account.provider === "github" || account.provider === "google")) {
        if (AUTH_ENV.useMock) {
          const email =
            account.provider === "github" ? "github-user@codecat.dev" : "google-user@codecat.dev";
          const name = account.provider === "github" ? "GitHub User" : "Google User";

          let existing = await findDevMockUserByEmail(email);

          if (!existing) {
            existing = await createDevMockUser({
              email,
              password: "oauth-user-password",
              name,
            });
          }

          const data = buildMockAuthResponse({
            id: existing.id,
            email: existing.email,
            name: existing.name,
          });

          token.user = data.user;
          token.accessToken = data.accessToken;
          token.refreshToken = data.refreshToken;
          token.provider = account.provider;

          return token;
        }

        throw new Error("Backend OAuth is not connected yet");
      }

      return token;
    },

    async session({ session, token }) {
      if (token.user) {
        session.user = token.user;
      }

      session.accessToken = typeof token.accessToken === "string" ? token.accessToken : undefined;
      session.refreshToken =
        typeof token.refreshToken === "string" ? token.refreshToken : undefined;
      session.provider =
        token.provider === "credentials" ||
        token.provider === "github" ||
        token.provider === "google"
          ? token.provider
          : undefined;

      return session;
    },
  },
};
