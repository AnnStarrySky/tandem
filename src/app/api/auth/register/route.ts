import { NextResponse } from "next/server";

import { mockRegister } from "@shared/config/auth-mocks";

type RegisterBody = {
  email: string;
  password: string;
  name?: string;
};

const USE_MOCK = process.env.AUTH_USE_MOCK === "true";
const BACKEND_URL = process.env.BACKEND_URL;

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

      return NextResponse.json({ success: true });
    }

    if (!BACKEND_URL) {
      throw new Error("No backend URL");
    }

    const url = new URL("/api/register", BACKEND_URL);

    const backendResult = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        name: name || "User",
      }),
    });

    if (!backendResult.ok) {
      return NextResponse.json(
        {
          success: false,
          message: backendResult.statusText,
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
