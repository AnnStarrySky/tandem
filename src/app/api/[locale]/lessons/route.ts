import { NextRequest, NextResponse } from "next/server";

import type { Lesson } from "@shared/types";

type Props = {
  params: Promise<{ locale: string }>;
};

type BackendReturn = {
  id: number;
  name: string;
  title: string;
}[];

export async function GET(_request: NextRequest, { params }: Props): Promise<Response> {
  const { locale } = (await params) ?? "en";

  if (process.env.NEXT_PUBLIC_USE_MOCK === "true") {
    //TODO: mock logic for lessons if needed
  }

  const BACKEND_URL = process.env.BACKEND_URL;
  const url = new URL(`/api/${locale}/lessons/`, BACKEND_URL);

  const response = await fetch(url);

  if (response.ok) {
    const responseBody: BackendReturn = await response.json();
    const result = new Array<Lesson>();
    for (let i = 0; i < responseBody.length; i++) {
      result.push({
        id: responseBody[i].id,
        name: responseBody[i].name,
        title: responseBody[i].title,
        lessonNumber: i + 1,
      });
    }
    return NextResponse.json(result);
  } else {
    return NextResponse.json({ success: false }, { status: response.status });
  }
}
