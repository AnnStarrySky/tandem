import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/shared/config/auth";
import { TaskStatPost } from "@/shared/types/statistics";

const BACKEND_URL = process.env.BACKEND_URL;

export async function POST(request: Request): Promise<Response> {
  try {
    const taskPost: TaskStatPost = await request.json();

    taskPost.taskType = kebabToCamel(taskPost.taskType);

    const session = await getServerSession(authOptions);

    const url = new URL(`/api/stat/user/task`, BACKEND_URL);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.accessToken}`,
      },
      body: JSON.stringify(taskPost),
    });

    if (response.ok) {
      return NextResponse.json({ success: true });
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

function kebabToCamel(str: string): string {
  return str.replace(/-./g, (c) => c[1].toUpperCase());
}
