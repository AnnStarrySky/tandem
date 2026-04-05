import { getPracticeDataApi } from "./get-practice-data";

import type { GetPracticeTopicParams, PracticeTopic } from "./types";

export async function getPracticeTopicApi({
  topicId,
  locale,
  difficulty,
}: GetPracticeTopicParams): Promise<PracticeTopic | null> {
  const data = await getPracticeDataApi({ locale, difficulty });

  return data.topics.find((topic) => topic.id === topicId) ?? null;
}
