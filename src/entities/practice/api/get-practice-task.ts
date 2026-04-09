import { getPracticeDataApi } from "./get-practice-data";

import type { GetPracticeTaskParams, PracticeTask } from "./types";

export async function getPracticeTaskApi({
  topicId,
  locale,
  difficulty,
}: GetPracticeTaskParams): Promise<PracticeTask | null> {
  const data = await getPracticeDataApi({ locale, difficulty });
  const topic = data.topics.find((item) => item.id === topicId);

  if (!topic) {
    return null;
  }

  return topic.task ?? null;
}
