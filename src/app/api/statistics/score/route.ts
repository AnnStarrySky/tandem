import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/shared/config/auth";

const BACKEND_URL = process.env.BACKEND_URL;

export async function GET(): Promise<Response> {
  try {
    const session = await getServerSession(authOptions);

    const url = new URL("/api/stat/user/score", BACKEND_URL);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
    });

    if (response.ok) {
      return NextResponse.json(await response.json());
    } else {
      return NextResponse.json({ success: false }, { status: response.status });
    }
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Internal Server Error", message: error.message },
        { status: 500 },
      );
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
