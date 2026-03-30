import { getPracticeData } from "./get-practice-data";

import type { PracticeDifficulty, PracticeTask } from "../model";

export async function getPracticeTask(
  topicId: string,
  difficulty: PracticeDifficulty,
  locale: string,
): Promise<PracticeTask | null> {
  const data = await getPracticeData(locale, difficulty);

  const topic = data.topics.find((item) => item.id === topicId);

  if (!topic) {
    return null;
  }

  return topic.task ?? null;
}
