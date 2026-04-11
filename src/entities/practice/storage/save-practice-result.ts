import {
  PRACTICE_PROGRESS_STORAGE_KEY,
  buildPracticeProgressKey,
  getPracticeProgress,
} from "./get-practice-progress";

import type {
  PracticeCompleteResult,
  PracticeDifficulty,
  PracticeProgressResponse,
  SavePracticeResultPayload,
  SavePracticeResultResponse,
} from "..";

import { TaskStatPost } from "@/shared/types/statistics";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

const NEXT_PUBLIC_USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

export async function savePracticeResult({
  topicId,
  difficulty,
  result,
  earnedPoints,
  taskType,
}: SavePracticeResultPayload): Promise<SavePracticeResultResponse> {
  if (!isBrowser()) {
    return {
      success: false,
      savedAt: new Date().toISOString(),
    };
  }

  if (!NEXT_PUBLIC_USE_MOCK) {
    return savePracticeResultToBackend(topicId, difficulty, result, earnedPoints, taskType);
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

async function savePracticeResultToBackend(
  topicId: string,
  difficulty: PracticeDifficulty,
  result: PracticeCompleteResult,
  earnedPoints: number,
  taskType: string,
): Promise<SavePracticeResultResponse> {
  const taskPost: TaskStatPost = {
    lessonName: topicId,
    difficulty,
    earnedPoints,
    correctAnswers: result.correctAnswers,
    wrongAnswers: result.wrongAnswers,
    taskType,
  };

  const apiResult = await fetch(`/api/statistics/task`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(taskPost),
  });

  if (apiResult.ok) {
    return {
      success: true,
      savedAt: new Date().toISOString(),
    };
  }
  return {
    success: false,
    savedAt: new Date().toISOString(),
  };
}
