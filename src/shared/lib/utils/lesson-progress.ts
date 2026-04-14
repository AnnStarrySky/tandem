import { TaskStatGetReturn } from "@shared/types";

const COMPLETION_THRESHOLD = 0.7;

export function getLessonCompletionMap(data: TaskStatGetReturn): Record<string, boolean> {
  const result: Record<string, boolean> = {};

  for (const task of data) {
    const total = task.correctAnswers + task.wrongAnswers;
    if (total === 0) continue;

    const isPass = task.correctAnswers / total >= COMPLETION_THRESHOLD;
    result[task.lessonName.toLowerCase()] = result[task.lessonName.toLowerCase()] || isPass;
  }

  return result;
}

export function isLessonCompleted(
  lessonName: string,
  completionMap: Record<string, boolean>,
): boolean {
  return !!completionMap[lessonName.toLowerCase()];
}

export function isTopicFullyCompleted(topicId: string, data: TaskStatGetReturn): boolean {
  const difficulties: string[] = ["easy", "medium", "hard"];
  return difficulties.every((difficulty) => {
    const tasks = data.filter(
      (t) => t.lessonName.toLowerCase() === topicId.toLowerCase() && t.difficulty === difficulty,
    );
    return tasks.some((t) => {
      const total = t.correctAnswers + t.wrongAnswers;
      return total > 0 && t.correctAnswers / total >= COMPLETION_THRESHOLD;
    });
  });
}
