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
  if (USE_MOCK) {
    try {
      const body = (await req.json()) as RegisterBody;

      await mockRegister({
        email: body.email.trim(),
        password: body.password,
        name: body.name?.trim() || undefined,
      });
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
  } else {
    try {
      if (!BACKEND_URL) {
        throw Error("No backend URL");
      }
      const url = new URL("/api/register", BACKEND_URL);
      const body = (await req.json()) as RegisterBody;

      const backendResult = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: body.email.trim(),
          password: body.password,
          name: body.name?.trim() || "User",
        }),
      });
      if (backendResult.ok) {
        return NextResponse.json({ success: true });
      } else {
        return NextResponse.json(
          {
            success: false,
            message: backendResult.statusText,
          },
          { status: backendResult.status },
        );
      }
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
}
