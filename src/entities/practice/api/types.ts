import type {
  PracticeCompleteResult,
  PracticeData,
  PracticeDifficulty,
  PracticeTask,
  PracticeTopic,
} from "../model";

export type PracticeProgressItem = {
  topicId: string;
  difficulty: PracticeDifficulty;
  completed: boolean;
  bestScore: number;
  totalQuestions: number;
  earnedPoints: number;
  attempts: number;
  updatedAt: string;
};

export type PracticeProgressResponse = {
  totalPoints: number;
  completedTopics: number;
  progress: PracticeProgressItem[];
};

export type SavePracticeResultPayload = {
  topicId: string;
  difficulty: PracticeDifficulty;
  locale: string;
  result: PracticeCompleteResult;
  earnedPoints: number;
  taskType: string;
};

export type SavePracticeResultResponse = {
  success: boolean;
  savedAt: string;
};

export type GetPracticeDataParams = {
  locale: string;
  difficulty: PracticeDifficulty;
};

export type GetPracticeTopicParams = {
  topicId: string;
  locale: string;
  difficulty: PracticeDifficulty;
};

export type GetPracticeTaskParams = {
  topicId: string;
  locale: string;
  difficulty: PracticeDifficulty;
};

export type {
  PracticeData,
  PracticeDifficulty,
  PracticeTask,
  PracticeTopic,
  PracticeCompleteResult,
};
