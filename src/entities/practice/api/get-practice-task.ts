import { getPracticeDataApi } from "./get-practice-data";

import type { GetPracticeTaskParams, PracticeTask } from "./types";

export async function getPracticeTaskApi({
  topicId,
  locale,
  difficulty,
}: GetPracticeTaskParams): Promise<PracticeTask | null> {
  if (!(process.env.NEXT_PUBLIC_USE_MOCK === "true")) {
    return getPracticeTaskApiFromBackend(topicId, locale, difficulty);
  }

  const data = await getPracticeDataApi({ locale, difficulty });
  const topic = data.topics.find((item) => item.id === topicId);

  if (!topic) {
    return null;
  }
  return topic.task ?? null;
}

async function getPracticeTaskApiFromBackend(
  topicId: string,
  locale: string,
  difficulty: string,
): Promise<PracticeTask | null> {
  try {
    const response = await fetch(`/api/${locale}/task/${topicId}/${difficulty}`);

    if (!response.ok) {
      return null;
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
}
