import { NextResponse } from "next/server";

import { backendPost } from "@shared/api/auth";

type RegisterBody = {
  email: string;
  password: string;
  name?: string;
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Registration failed";
}

export async function POST(req: Request): Promise<Response> {
  try {
    const body = (await req.json()) as RegisterBody;

    await backendPost("/auth/register", {
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
      { status: 400 },
    );
  }
}
