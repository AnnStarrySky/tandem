import {
  PRACTICE_PROGRESS_STORAGE_KEY,
  buildPracticeProgressKey,
  getPracticeProgress,
} from "./get-practice-progress";

import type {
  PracticeProgressResponse,
  SavePracticeResultPayload,
  SavePracticeResultResponse,
} from "..";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export async function savePracticeResult({
  topicId,
  difficulty,
  result,
  earnedPoints,
}: SavePracticeResultPayload): Promise<SavePracticeResultResponse> {
  if (!isBrowser()) {
    return {
      success: false,
      savedAt: new Date().toISOString(),
    };
  }

  const progressData = await getPracticeProgress();
  const now = new Date().toISOString();
  const key = buildPracticeProgressKey(topicId, difficulty);

  const existingIndex = progressData.progress.findIndex(
    (item) => buildPracticeProgressKey(item.topicId, item.difficulty) === key,
  );

  const nextItem = {
    topicId,
    difficulty,
    completed: true,
    bestScore:
      existingIndex >= 0
        ? Math.max(progressData.progress[existingIndex].bestScore, result.score)
        : result.score,
    totalQuestions: result.total,
    earnedPoints:
      existingIndex >= 0
        ? Math.max(progressData.progress[existingIndex].earnedPoints, earnedPoints)
        : earnedPoints,
    attempts: existingIndex >= 0 ? progressData.progress[existingIndex].attempts + 1 : 1,
    updatedAt: now,
  };

  const nextProgress = [...progressData.progress];

  if (existingIndex >= 0) {
    nextProgress[existingIndex] = nextItem;
  } else {
    nextProgress.push(nextItem);
  }

  const uniqueCompletedTopics = new Set(nextProgress.map((item) => item.topicId));

  const nextState: PracticeProgressResponse = {
    totalPoints: nextProgress.reduce((sum, item) => sum + item.earnedPoints, 0),
    completedTopics: uniqueCompletedTopics.size,
    progress: nextProgress,
  };

  window.localStorage.setItem(PRACTICE_PROGRESS_STORAGE_KEY, JSON.stringify(nextState));

  return {
    success: true,
    savedAt: now,
  };
}
