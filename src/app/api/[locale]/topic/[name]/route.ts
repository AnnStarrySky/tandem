import { NextRequest, NextResponse } from "next/server";

type ResponseTopic = {
  id: number;
  name: string;
  title: string;
  description: string;
};

type TopicResult = {
  id: string;
  title: string;
  description: string;
};

type Props = {
  params: Promise<{
    locale: string;
    name: string;
  }>;
};

export async function GET(_request: NextRequest, { params }: Props): Promise<Response> {
  try {
    const { locale } = (await params) ?? "en";
    const { name } = (await params) ?? "";

    const BACKEND_URL = process.env.BACKEND_URL;
    const url = new URL(`/api/${locale}/topic/${name}`, BACKEND_URL);

    const response = await fetch(url);

    if (response.ok) {
      return NextResponse.json(responseToResultTopic(await response.json()));
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

function responseToResultTopic(response: ResponseTopic): TopicResult {
  const result: TopicResult = {
    id: response.name,
    title: response.title,
    description: response.description,
  };
  return result;
}
