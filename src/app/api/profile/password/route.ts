import { NextResponse } from "next/server";

import { updateMockUserPassword } from "@shared/lib/auth";

type PasswordBody = {
  email?: string;
  currentPassword?: string;
  nextPassword?: string;
};

const USE_MOCK = process.env.AUTH_USE_MOCK === "true";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Password change failed";
}

function getStatusCode(error: unknown): number {
  if (error instanceof Error) {
    if (
      error.message.includes("Пользователь не найден") ||
      error.message.includes("Текущий пароль введён неверно")
    ) {
      return 400;
    }
  }

  return 400;
}

export async function PATCH(req: Request): Promise<Response> {
  try {
    const body = (await req.json()) as PasswordBody;

    const email = body.email?.trim().toLowerCase() ?? "";
    const currentPassword = body.currentPassword ?? "";
    const nextPassword = body.nextPassword ?? "";

    if (!email || !currentPassword || !nextPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Email, current password and next password are required",
        },
        { status: 400 },
      );
    }

    if (nextPassword.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: "Новый пароль должен содержать минимум 6 символов",
        },
        { status: 400 },
      );
    }

    if (USE_MOCK) {
      await updateMockUserPassword({
        email,
        currentPassword,
        nextPassword,
      });
    } else {
      throw new Error("Backend password change is not connected yet");
    }

    return NextResponse.json({
      success: true,
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
