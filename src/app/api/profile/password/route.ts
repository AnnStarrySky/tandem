import { NextResponse } from "next/server";

import { updateDevMockUserPassword } from "@shared/api/auth";
import { AUTH_ENV, authOptions } from "@shared/config/auth";
import { getServerSession } from "next-auth";

type PasswordBody = {
  email?: string;
  currentPassword?: string;
  nextPassword?: string;
};

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

    // This check is pointless and breaks the app because the passwords are not encrypted here.
    //
    // if (currentPassword.length < 64 || nextPassword.length < 64) {
    //   return NextResponse.json(
    //     {
    //       success: false,
    //       message: "Password hashes are required",
    //     },
    //     { status: 400 },
    //   );
    // }

    if (AUTH_ENV.useMock) {
      await updateDevMockUserPassword({
        email,
        currentPassword,
        nextPassword,
      });

      return NextResponse.json({
        success: true,
      });
    }

    if (!AUTH_ENV.backendUrl) {
      throw new Error("BACKEND_URL is not configured");
    }

    const session = await getServerSession(authOptions);

    const url = new URL("/api/user/profile/password", AUTH_ENV.backendUrl);

    const backendResult = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.accessToken}`,
      },
      body: JSON.stringify({
        previousPassword: currentPassword,
        newPassword: nextPassword,
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
