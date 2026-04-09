import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";

import { authOptions } from "@shared/config/auth";

export async function GET(): Promise<Response> {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const response = await fetch("http://45.12.130.140:1314/api/stat/user/task", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.error("Ошибка сервера:", response.status);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: response.status },
    );
  }

  const data = await response.json();

  return NextResponse.json({ success: true, data });
}
