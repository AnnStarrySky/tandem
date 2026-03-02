import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GitLabProvider from "next-auth/providers/gitlab";

import { backendPost } from "@shared/api/auth";

import type { BackendAuthResponse } from "@shared/types";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },

  providers: [
    CredentialsProvider({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const data = await backendPost<BackendAuthResponse>("/auth/login", {
          email: credentials.email,
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
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),

    GitLabProvider({
      clientId: process.env.GITLAB_ID!,
      clientSecret: process.env.GITLAB_SECRET!,
      issuer: process.env.GITLAB_ISSUER ?? "https://gitlab.com",
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

      if (account && (account.provider === "github" || account.provider === "gitlab")) {
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
      if (token.user) session.user = token.user;

      session.accessToken = token.accessToken;
      session.provider = token.provider;

      return session;
    },
  },
};
