import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

import { backendPost } from "@shared/api/auth";

import type { BackendAuthResponse } from "@shared/types";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },

  pages: {
    signIn: "/auth/login",
  },

  providers: [
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

        const data = await backendPost<BackendAuthResponse>("/auth/login", {
          email: credentials.email.trim(),
          password: credentials.password,
        });

        return {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name ?? undefined,
          __backend: data,
        };
      },
    }),

    GitHubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],

  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user?.__backend) {
        const data = user.__backend;

        token.user = data.user;
        token.accessToken = data.accessToken;
        token.refreshToken = data.refreshToken;
        token.provider = "credentials";

        return token;
      }

      if (account && (account.provider === "github" || account.provider === "google")) {
        if (!account.access_token) {
          return token;
        }

        const data = await backendPost<BackendAuthResponse>("/auth/oauth", {
          provider: account.provider,
          accessToken: account.access_token,
          idToken: (account as { id_token?: string }).id_token,
          profile,
        });

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

      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.provider = token.provider;

      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

const GET = handler;
const POST = handler;

export { GET, POST };
