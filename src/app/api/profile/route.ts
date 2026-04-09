import { NextResponse } from "next/server";

import { updateDevMockUserProfile } from "@shared/api/auth";
import { AUTH_ENV } from "@shared/config/auth";

type ProfileBody = {
  currentEmail?: string;
  email?: string;
  name?: string;
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Profile update failed";
}

function getStatusCode(error: unknown): number {
  if (error instanceof Error) {
    if (error.message.includes("Пользователь не найден")) {
      return 404;
    }

    if (error.message.includes("уже существует")) {
      return 409;
    }
  }

  return 400;
}

export async function PATCH(req: Request): Promise<Response> {
  try {
    const body = (await req.json()) as ProfileBody;

    const currentEmail = body.currentEmail?.trim().toLowerCase() ?? "";
    const nextEmail = body.email?.trim().toLowerCase() ?? "";
    const nextName = body.name?.trim() ?? "";

    if (!currentEmail || !nextEmail || !nextName) {
      return NextResponse.json(
        {
          success: false,
          message: "Current email, next email and name are required",
        },
        { status: 400 },
      );
    }

    if (AUTH_ENV.useMock) {
      const user = await updateDevMockUserProfile({
        currentEmail,
        nextEmail,
        nextName,
      });

      return NextResponse.json({
        success: true,
        user: {
          id: String(user.id),
          email: user.email,
          name: user.name,
        },
      });
    }

    if (!AUTH_ENV.backendUrl) {
      throw new Error("BACKEND_URL is not configured");
    }

    const url = new URL("/api/profile", AUTH_ENV.backendUrl);

    const backendResult = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        currentEmail,
        email: nextEmail,
        name: nextName,
      }),
    });

    if (!backendResult.ok) {
      let message = backendResult.statusText;

      try {
        const data = (await backendResult.json()) as { message?: string };
        message = data.message ?? message;
      } catch {
        // ignore parse error
      }

      return NextResponse.json(
        {
          success: false,
          message,
        },
        { status: backendResult.status },
      );
    }

    const data = (await backendResult.json()) as {
      user?: {
        id: string;
        email?: string | null;
        name?: string | null;
      };
    };

    return NextResponse.json({
      success: true,
      user: data.user,
    });
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
