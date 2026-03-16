import { describe, expect, it } from "vitest";

import { buildAuthResponse, mockLogin, mockOAuth, mockRegister } from "./auth-mocks";

describe("auth mocks", () => {
  it("buildAuthResponse returns access and refresh tokens", () => {
    const result = buildAuthResponse({
      id: 10,
      email: "user@test.dev",
      name: "Test User",
    });

    expect(result.user.id).toBe(10);
    expect(result.accessToken).toBe("mock-access-token");
    expect(result.refreshToken).toBe("mock-refresh-token");
  });

  it("mockLogin returns user data for valid credentials", async () => {
    const result = await mockLogin({
      email: "demo@codecat.dev",
      password: "123456",
    });

    expect(result.user.email).toBe("demo@codecat.dev");
    expect(result.user.name).toBe("Demo User");
    expect(result.accessToken).toBeDefined();
  });

  it("mockLogin throws error for short password", async () => {
    await expect(
      mockLogin({
        email: "demo@codecat.dev",
        password: "123",
      }),
    ).rejects.toThrow("Пароль должен содержать минимум 6 символов");
  });

  it("mockLogin throws error for invalid mocked user", async () => {
    await expect(
      mockLogin({
        email: "fail@codecat.dev",
        password: "123456",
      }),
    ).rejects.toThrow("Неверный email или пароль");
  });

  it("mockRegister returns success for valid input", async () => {
    const result = await mockRegister({
      email: "new@codecat.dev",
      password: "123456",
      name: "New User",
    });

    expect(result).toEqual({ success: true });
  });

  it("mockRegister throws error when email is already taken", async () => {
    await expect(
      mockRegister({
        email: "taken@codecat.dev",
        password: "123456",
      }),
    ).rejects.toThrow("Пользователь с таким email уже существует");
  });

  it("mockOAuth returns github user data", async () => {
    const result = await mockOAuth({ provider: "github" });

    expect(result.user.email).toBe("github-user@codecat.dev");
    expect(result.user.name).toBe("GitHub User");
  });
});
