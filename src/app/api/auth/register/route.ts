import { NextResponse } from "next/server";

import { mockRegister } from "@shared/config/auth-mocks";

type RegisterBody = {
  email: string;
  password: string;
  name?: string;
};

const USE_MOCK = process.env.AUTH_USE_MOCK === "true";

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

    const email = body.email?.trim().toLowerCase();
    const password = body.password ?? "";
    const name = body.name?.trim() || undefined;

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required",
        },
        { status: 400 },
      );
    }

    if (USE_MOCK) {
      await mockRegister({
        email,
        password,
        name,
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
