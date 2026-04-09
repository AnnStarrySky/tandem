import type { PracticeDifficulty, PracticeProgressResponse } from "..";

const STORAGE_KEY = "practice-progress";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export async function getPracticeProgress(): Promise<PracticeProgressResponse> {
  if (!isBrowser()) {
    return {
      totalPoints: 0,
      completedTopics: 0,
      progress: [],
    };
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return {
      totalPoints: 0,
      completedTopics: 0,
      progress: [],
    };
  }

  try {
    const parsed = JSON.parse(raw) as PracticeProgressResponse;

    return {
      totalPoints: parsed.totalPoints ?? 0,
      completedTopics: parsed.completedTopics ?? 0,
      progress: parsed.progress ?? [],
    };
  } catch {
    return {
      totalPoints: 0,
      completedTopics: 0,
      progress: [],
    };
  }
}

export function buildPracticeProgressKey(topicId: string, difficulty: PracticeDifficulty): string {
  return `${topicId}:${difficulty}`;
}

export { STORAGE_KEY as PRACTICE_PROGRESS_STORAGE_KEY };
