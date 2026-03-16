import { NextResponse } from "next/server";

type RegisterBody = {
  email: string;
  password: string;
  name?: string;
};

const USE_MOCK = process.env.AUTH_USE_MOCK === "true";

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function mockRegister(input: RegisterBody): Promise<{ success: true }> {
  await wait(500);

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

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Registration failed";
}

function getStatusCode(error: unknown): number {
  if (error instanceof Error && error.message.includes("уже существует")) {
    return 409;
  }

  return 400;
}

export async function POST(req: Request): Promise<Response> {
  try {
    const body = (await req.json()) as RegisterBody;

    if (USE_MOCK) {
      await mockRegister({
        email: body.email.trim(),
        password: body.password,
        name: body.name?.trim() || undefined,
      });
    } else {
      throw new Error("Backend register is not connected yet");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: getErrorMessage(error),
      },
      { status: getStatusCode(error) },
    );
  }
}
