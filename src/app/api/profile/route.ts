import { NextResponse } from "next/server";

import { updateMockUserProfile } from "@shared/lib/auth";

type ProfileBody = {
  currentEmail?: string;
  email?: string;
  name?: string;
};

const USE_MOCK = process.env.AUTH_USE_MOCK === "true";

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

    if (USE_MOCK) {
      const user = await updateMockUserProfile({
        currentEmail,
        nextEmail,
        nextName,
      });

      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      });
    }

    throw new Error("Backend profile update is not connected yet");
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
