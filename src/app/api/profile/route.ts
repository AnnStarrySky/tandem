import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";

import { authOptions } from "@shared/config/auth";
import { updateMockUserProfile } from "@shared/lib/auth";

const USE_MOCK = process.env.AUTH_USE_MOCK === "true";

type UpdateProfileBody = {
  name: string;
  email: string;
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Profile update failed";
}

function getStatusCode(error: unknown): number {
  if (error instanceof Error && error.message.includes("уже существует")) {
    return 409;
  }

  return 400;
}

export async function PATCH(req: Request): Promise<Response> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as UpdateProfileBody;

    if (!USE_MOCK) {
      throw new Error("Backend profile update is not connected yet");
    }

    const updatedUser = await updateMockUserProfile({
      currentEmail: session.user.email,
      nextEmail: body.email,
      nextName: body.name,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
      },
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
