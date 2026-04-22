import { getPracticeDataApi } from "./get-practice-data";

import type { GetPracticeTopicParams, PracticeTopic } from "./types";

export async function getPracticeTopicApi({
  topicId,
  locale,
  difficulty,
}: GetPracticeTopicParams): Promise<PracticeTopic | null> {
  if (!(process.env.NEXT_PUBLIC_USE_MOCK === "true")) {
    return getPracticeTopicApiFromBackend(topicId, locale);
  }

  const data = await getPracticeDataApi({ locale, difficulty });

  return data.topics.find((topic) => topic.id === topicId) ?? null;
}

async function getPracticeTopicApiFromBackend(
  topicId: string,
  locale: string,
): Promise<PracticeTopic | null> {
  try {
    const response = await fetch(`/api/${locale}/topic/${topicId}`);

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.log(error);
    return null;
  }
}
