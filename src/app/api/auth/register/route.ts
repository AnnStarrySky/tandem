import { NextResponse } from "next/server";

import { createDevMockUser } from "@shared/api/auth";
import { AUTH_ENV } from "@shared/config/auth";

type RegisterBody = {
  email?: string;
  password?: string;
  name?: string;
};

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

    const email = body.email?.trim().toLowerCase() ?? "";
    const password = body.password ?? "";
    const name = body.name?.trim() || "CodeCat User";

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required",
        },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must contain at least 6 characters",
        },
        { status: 400 },
      );
    }

    if (AUTH_ENV.useMock) {
      await createDevMockUser({
        email,
        password,
        name,
      });

      return NextResponse.json({ success: true });
    }

    if (!AUTH_ENV.backendUrl) {
      throw new Error("BACKEND_URL is not configured");
    }

    const url = new URL("/api/register", AUTH_ENV.backendUrl);

    const backendResult = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        name,
      }),
    });

    if (!backendResult.ok) {
      let message = backendResult.statusText;

      try {
        const data = (await backendResult.json()) as { message?: string };
        message = data.message ?? message;
      } catch {
        // ignore
      }

      return NextResponse.json(
        {
          success: false,
          message,
        },
        { status: backendResult.status },
      );
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
