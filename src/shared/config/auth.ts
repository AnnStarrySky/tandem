import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

import { mockLogin, mockOAuth } from "./auth-mocks";

import type { BackendAuthResponse } from "@shared/types";
import type { NextAuthOptions } from "next-auth";

export const AUTH_ROUTES = {
  signIn: "/auth/login",
  signUp: "/auth/register",
  dashboard: "/dashboard",
} as const;

export const AUTH_ENV = {
  useMock: process.env.AUTH_USE_MOCK === "true",
  githubEnabled: Boolean(process.env.GITHUB_ID && process.env.GITHUB_SECRET),
  googleEnabled: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
} as const;

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

      try {
        let data: BackendAuthResponse;

        if (AUTH_ENV.useMock) {
          data = await mockLogin({
            email: credentials.email.trim(),
            password: credentials.password,
          });
        } else {
          throw new Error("Backend login is not connected yet");
        }

        return {
          id: data.user.id,
          email: data.user.email ?? undefined,
          name: data.user.name ?? undefined,
          __backend: data,
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
  session: { strategy: "jwt" },
  pages: {
    signIn: AUTH_ROUTES.signIn,
  },
  providers,
  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
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
        let data: BackendAuthResponse;

        if (AUTH_ENV.useMock) {
          data = await mockOAuth({
            provider: account.provider,
          });
        } else {
          throw new Error("Backend OAuth is not connected yet");
        }

        token.user = data.user;
        token.accessToken = data.accessToken;
        token.refreshToken = data.refreshToken;
        token.provider = account.provider;
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
