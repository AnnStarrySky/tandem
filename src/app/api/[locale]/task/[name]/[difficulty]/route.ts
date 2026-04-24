import { NextRequest, NextResponse } from "next/server";

type TaskResult = {
  id: string;
  type: string;
  title: string;
  description: string;
  points: number;
  questions: [];
};

type TaskResponse = {
  id: number;
  practiceTopicId: number;
  titile: string;
  description: string;
  questions: [];
};

type Props = {
  params: Promise<{
    locale: string;
    name: string;
    difficulty: string;
  }>;
};

export async function GET(_request: NextRequest, { params }: Props): Promise<Response> {
  try {
    const { locale } = (await params) ?? "en";
    const { name } = (await params) ?? "";
    const { difficulty } = (await params) ?? "";

    let result: Response | null;

    switch (difficulty) {
      case "easy":
        result = await fetchFromBackend(locale, name, "quiz", 10);
        break;
      case "medium":
        result = await fetchFromBackend(locale, name, "code-completion", 20);
        break;
      case "hard":
        result = await fetchFromBackend(locale, name, "code-editor", 30);
        break;

      default:
        result = null;
        break;
    }

    if (!result) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return result;
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

async function fetchFromBackend(
  locale: string,
  name: string,
  type: string,
  points: number,
): Promise<Response> {
  const BACKEND_URL = process.env.BACKEND_URL;
  const url = new URL(`/api/${locale}/task/${type}/${name}`, BACKEND_URL);

  const response = await fetch(url);
  if (!response.ok) {
    return NextResponse.json({ success: false }, { status: response.status });
  }

  const result: TaskResponse = await response.json();

  return NextResponse.json({
    id: result.id.toString(),
    type: type,
    title: result.titile,
    description: result.description,
    points: points,
    questions: result.questions,
  } as TaskResult);
}
