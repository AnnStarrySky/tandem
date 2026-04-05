import { getPracticeDataApi } from "../api";

import type { PracticeData, PracticeDifficulty } from "../model";

export async function getPracticeData(
  locale: string,
  difficulty: PracticeDifficulty,
): Promise<PracticeData> {
  return getPracticeDataApi({
    locale,
    difficulty,
  });
}
