"use client";

import { use, useEffect, useMemo, useState } from "react";

import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

import {
  getPracticeTask,
  getPracticeTopic,
  savePracticeResult,
  type PracticeCompleteResult,
  type PracticeDifficulty,
  type PracticeTask,
  type PracticeTopic,
} from "@entities/practice";
import { PracticeGameScreen } from "@features/practice-runner";
import { CodeCompletionWidget, CodeEditorWidget, QuizWidget } from "@widgets/practice";

const VALID_DIFFICULTIES: PracticeDifficulty[] = ["easy", "medium", "hard"];

type Props = {
  params: Promise<{
    topicId: string;
    difficulty: string;
  }>;
};

export default function PracticeDifficultyPage({ params }: Props) {
  const { topicId, difficulty } = use(params);

  const t = useTranslations("Practice");
  const locale = useLocale();
  const searchParams = useSearchParams();

  const [topic, setTopic] = useState<PracticeTopic | null>(null);
  const [task, setTask] = useState<PracticeTask | null>(null);
  const [loading, setLoading] = useState(true);

  const resolvedDifficulty = useMemo<PracticeDifficulty | null>(() => {
    return VALID_DIFFICULTIES.includes(difficulty as PracticeDifficulty)
      ? (difficulty as PracticeDifficulty)
      : null;
  }, [difficulty]);

  const page = Number(searchParams.get("page") ?? "1");

  useEffect(() => {
    let mounted = true;

    if (!resolvedDifficulty) {
      setTopic(null);
      setTask(null);
      setLoading(false);

      return () => {
        mounted = false;
      };
    }

    const difficultyValue: PracticeDifficulty = resolvedDifficulty;

    setLoading(true);
    setTopic(null);
    setTask(null);

    async function loadData() {
      try {
        const [loadedTopic, loadedTask] = await Promise.all([
          getPracticeTopic(topicId, locale, difficultyValue),
          getPracticeTask(topicId, difficultyValue, locale),
        ]);

        if (!mounted) return;

        setTopic(loadedTopic);
        setTask(loadedTask);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void loadData();

    return () => {
      mounted = false;
    };
  }, [topicId, resolvedDifficulty, locale]);

  async function handleComplete(result: PracticeCompleteResult) {
    if (!resolvedDifficulty || !task) return;

    const difficultyValue: PracticeDifficulty = resolvedDifficulty;
    const earnedPoints =
      result.total > 0 ? Math.round((result.score / result.total) * task.points) : 0;

    try {
      await savePracticeResult({
        topicId,
        difficulty: difficultyValue,
        locale,
        result,
        earnedPoints,
      });
    } catch (error) {
      console.error("Failed to save practice result", error);
    }
  }

  if (loading) {
    return <div className="text-slate-600 dark:text-slate-300">{t("loadingTask")}</div>;
  }

  if (!resolvedDifficulty || !topic || !task) {
    return <div className="text-slate-600 dark:text-slate-300">{t("taskNotFound")}</div>;
  }

  return (
    <PracticeGameScreen topic={topic} difficulty={resolvedDifficulty} page={page}>
      {task.type === "quiz" ? <QuizWidget task={task} onComplete={handleComplete} /> : null}
      {task.type === "code-completion" ? (
        <CodeCompletionWidget task={task} onComplete={handleComplete} />
      ) : null}
      {task.type === "code-editor" ? (
        <CodeEditorWidget task={task} onComplete={handleComplete} />
      ) : null}
    </PracticeGameScreen>
  );
}
