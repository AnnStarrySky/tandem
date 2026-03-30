import { getPracticeData } from "./get-practice-data";

import type { PracticeDifficulty, PracticeTopic } from "../model";

export async function getPracticeTopic(
  topicId: string,
  locale: string,
  difficulty: PracticeDifficulty,
): Promise<PracticeTopic | null> {
  const data = await getPracticeData(locale, difficulty);

  return data.topics.find((topic) => topic.id === topicId) ?? null;
}
