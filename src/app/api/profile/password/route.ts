import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";

import { authOptions } from "@shared/config/auth";
import { updateMockUserPassword } from "@shared/lib/auth";

const USE_MOCK = process.env.AUTH_USE_MOCK === "true";

type UpdatePasswordBody = {
  currentPassword: string;
  nextPassword: string;
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Password update failed";
}

export async function PATCH(req: Request): Promise<Response> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as UpdatePasswordBody;

    if (!body.currentPassword || !body.nextPassword) {
      throw new Error("Текущий и новый пароль обязательны");
    }

    if (body.nextPassword.length < 6) {
      throw new Error("Пароль должен содержать минимум 6 символов");
    }

    if (!USE_MOCK) {
      throw new Error("Backend password update is not connected yet");
    }

    await updateMockUserPassword({
      email: session.user.email,
      currentPassword: body.currentPassword,
      nextPassword: body.nextPassword,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: getErrorMessage(error),
      },
      { status: 400 },
    );
  }
}
