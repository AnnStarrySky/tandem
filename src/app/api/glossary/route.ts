import { NextRequest, NextResponse } from "next/server";

import { getMessages } from "next-intl/server";

export async function GET(request: NextRequest): Promise<Response> {
  const locale = request.nextUrl.searchParams.get("locale") ?? "en";

  if (process.env.AUTH_USE_MOCK === "true") {
    const messages = await getMessages({ locale });
    return NextResponse.json(messages.Glossary.topics);
  }

  return NextResponse.json([]);
}
