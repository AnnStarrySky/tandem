import bcrypt from "bcryptjs";

import { createMockUser, validateMockUserCredentials } from "@shared/lib/auth";

import type { BackendAuthResponse, BackendUser } from "@shared/types";

export type MockLoginInput = {
  email: string;
  password: string;
};

export type MockRegisterInput = {
  email: string;
  password: string;
  name?: string;
};

export type MockOAuthInput = {
  provider: "github" | "google";
};

export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function buildAuthResponse(user: BackendUser): BackendAuthResponse {
  return {
    user,
    accessToken: "mock-access-token",
    refreshToken: "mock-refresh-token",
  };
}

export async function mockLogin(input: MockLoginInput): Promise<BackendAuthResponse> {
  await wait(10);

  const email = input.email.trim().toLowerCase();
  const password = input.password;

  if (!email || !password) {
    throw new Error("Email и пароль обязательны");
  }

  if (password.length < 6) {
    throw new Error("Пароль должен содержать минимум 6 символов");
  }

  const user = await validateMockUserCredentials({
    email,
    password,
  });

  return buildAuthResponse({
    id: user.id,
    email: user.email,
    name: user.name,
  });
}

export async function mockRegister(input: MockRegisterInput): Promise<{ success: true }> {
  await wait(10);

  const email = input.email.trim().toLowerCase();
  const password = input.password;
  const name = input.name?.trim();

  if (!email) {
    throw new Error("Email обязателен");
  }

  if (!password || password.length < 6) {
    throw new Error("Пароль должен содержать минимум 6 символов");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await createMockUser({
    email,
    passwordHash,
    name,
  });

  return { success: true };
}

export async function mockOAuth(input: MockOAuthInput): Promise<BackendAuthResponse> {
  await wait(10);

  return buildAuthResponse({
    id: input.provider === "github" ? 2 : 3,
    email: input.provider === "github" ? "github-user@codecat.dev" : "google-user@codecat.dev",
    name: input.provider === "github" ? "GitHub User" : "Google User",
  });
}
