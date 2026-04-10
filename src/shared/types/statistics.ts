import { PracticeDifficulty } from "@/entities/practice";

export type TaskPost = {
  topicId: string;
  difficulty: PracticeDifficulty;
  earnedPoints: number;
  correctAnswers: number;
  wrongAnswers: number;
};
