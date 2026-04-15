import type { TaskStatGetReturn } from "@shared/types";

export type PracticeStatsResult = {
  completedTasks: Set<string>;
  completedTopics: Set<string>;
};

const DIFFICULTIES = ["easy", "medium", "hard"] as const;

export async function getPracticeStats(): Promise<PracticeStatsResult> {
  const response = await fetch("/api/statistics/task");

  if (!response.ok) {
    return { completedTasks: new Set(), completedTopics: new Set() };
  }

  const stats: TaskStatGetReturn = await response.json();
  const completedTasks = new Set<string>();

  for (const task of stats) {
    const total = task.correctAnswers + task.wrongAnswers;
    if (total > 0 && task.correctAnswers / total > 0.7) {
      completedTasks.add(`${task.lessonName}:${task.difficulty}`);
    }
  }

  const completedTopics = new Set<string>();
  const topicIds = new Set(stats.map((t) => t.lessonName));

  for (const topicId of topicIds) {
    if (DIFFICULTIES.every((d) => completedTasks.has(`${topicId}:${d}`))) {
      completedTopics.add(topicId);
    }
  }

  return { completedTasks, completedTopics };
}
