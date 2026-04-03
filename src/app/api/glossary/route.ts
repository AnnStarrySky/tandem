import { NextRequest, NextResponse } from "next/server";

import { getMessages } from "next-intl/server";

export async function GET(request: NextRequest): Promise<Response> {
  const locale = request.nextUrl.searchParams.get("locale") ?? "en";

  if (process.env.AUTH_USE_MOCK === "true") {
    const messages = await getMessages({ locale });
    return NextResponse.json(messages.Glossary.topics);
  }

  const BACKEND_URL = process.env.BACKEND_URL;
  const url = new URL(`/api/glossary/topics/pew}`, BACKEND_URL);

  const response = await fetch(url);

  if (response.ok) {
    return NextResponse.json(await response.json());
  } else {
    return NextResponse.json({ success: false }, { status: response.status });
  }
}
