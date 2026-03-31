import { getPracticeTopicApi } from "../api";

import type { PracticeDifficulty, PracticeTopic } from "../model";

export async function getPracticeTopic(
  topicId: string,
  locale: string,
  difficulty: PracticeDifficulty,
): Promise<PracticeTopic | null> {
  return getPracticeTopicApi({
    topicId,
    locale,
    difficulty,
  });
}
