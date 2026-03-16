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

const MOCK_USER: BackendUser = {
  id: 1,
  email: "demo@codecat.dev",
  name: "Demo User",
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

  if (email === "fail@codecat.dev") {
    throw new Error("Неверный email или пароль");
  }

  return buildAuthResponse({
    ...MOCK_USER,
    email,
    name: email === "demo@codecat.dev" ? "Demo User" : "CodeCat User",
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

  if (email === "taken@codecat.dev") {
    throw new Error("Пользователь с таким email уже существует");
  }

  void name;

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
