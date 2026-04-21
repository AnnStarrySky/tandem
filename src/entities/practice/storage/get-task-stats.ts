import type { TaskStatGetReturn } from "@shared/types";

export type CompletedTasksResult = {
  completedTasks: number;
};

export async function getTaskStats(): Promise<CompletedTasksResult> {
  const response = await fetch("/api/statistics/task");

  if (!response.ok) {
    throw new Error("Failed to fetch task statistics");
  }

  const stats: TaskStatGetReturn = await response.json();

  const completedTasks = stats.filter((task) => {
    const total = task.correctAnswers + task.wrongAnswers;
    return total > 0 && task.correctAnswers / total >= 0.7;
  }).length;

  return { completedTasks };
}
