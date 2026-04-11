import { PracticeDifficulty } from "@/entities/practice";

export type TaskStat = {
  lessonName: string;
  difficulty: PracticeDifficulty;
  earnedPoints: number;
  correctAnswers: number;
  wrongAnswers: number;
  taskType: string;
};

export type TaskStatPost = TaskStat;

export type TaskStatGetReturn = TaskStat[];
