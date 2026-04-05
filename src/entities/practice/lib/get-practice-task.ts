import { getPracticeTaskApi } from "../api";

import type { PracticeDifficulty, PracticeTask } from "../model";

export async function getPracticeTask(
  topicId: string,
  difficulty: PracticeDifficulty,
  locale: string,
): Promise<PracticeTask | null> {
  return getPracticeTaskApi({
    topicId,
    locale,
    difficulty,
  });
}
