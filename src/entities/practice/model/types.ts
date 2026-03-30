export type PracticeDifficulty = "easy" | "medium" | "hard";

export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
};

export type QuizTask = {
  type: "quiz";
  title: string;
  description: string;
  points: 10;
  questions: QuizQuestion[];
};

export type CodeCompletionQuestion = {
  id: string;
  title: string;
  description: string;
  code: string;
  options: string[];
  correctAnswer: string;
  hint?: string;
  explanation?: string;
};

export type CodeCompletionTask = {
  type: "code-completion";
  title: string;
  description: string;
  points: 20;
  questions: CodeCompletionQuestion[];
};

export type CodeEditorQuestion = {
  id: string;
  title: string;
  description: string;
  instructions: string;
  starterCode: string;
  expectedAnswers: string[];
  hint?: string;
};

export type CodeEditorTask = {
  type: "code-editor";
  title: string;
  description: string;
  points: 30;
  questions: CodeEditorQuestion[];
};

export type PracticeTask = QuizTask | CodeCompletionTask | CodeEditorTask;

export type PracticeTopic = {
  id: string;
  order: number;
  title: string;
  description: string;
  keywords?: string[];
  task: PracticeTask;
};

export type PracticeData = {
  topics: PracticeTopic[];
};

export type PracticeCompleteResult = {
  score: number;
  total: number;
  correctAnswers: number;
  wrongAnswers: number;
  answers?: unknown;
};
