export type TaskStat = {
  lessonName: string;
  difficulty: string;
  earnedPoints: number;
  correctAnswers: number;
  wrongAnswers: number;
  taskType: string;
};

export type TaskStatPost = TaskStat;

export type TaskStatGetReturn = TaskStat[];
