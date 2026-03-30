"use client";

import { use, useEffect, useMemo, useState } from "react";

import { useSearchParams } from "next/navigation";

import { useLocale, useTranslations } from "next-intl";

import type { PracticeDifficulty, PracticeTask, PracticeTopic } from "@/src/entities/practice";
import { getPracticeTask, getPracticeTopic } from "@/src/entities/practice";
import { PracticeGameScreen } from "@/src/features/practice-runner";
import { CodeCompletionWidget, CodeEditorWidget, QuizWidget } from "@/src/widgets/practice";

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

    const difficultyValue = resolvedDifficulty;

    setLoading(true);
    setTopic(null);
    setTask(null);

    async function loadData() {
      try {
        const [loadedTopic, loadedTask] = await Promise.all([
          getPracticeTopic(topicId, locale, difficultyValue),
          getPracticeTask(topicId, difficultyValue, locale),
        ]);

        if (!mounted) {
          return;
        }

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

  if (loading) {
    return <div className="text-slate-600 dark:text-slate-300">{t("loadingTask")}</div>;
  }

  if (!resolvedDifficulty || !topic || !task) {
    return <div className="text-slate-600 dark:text-slate-300">{t("taskNotFound")}</div>;
  }

  return (
    <PracticeGameScreen topic={topic} difficulty={resolvedDifficulty} page={page}>
      {task.type === "quiz" ? <QuizWidget task={task} /> : null}
      {task.type === "code-completion" ? <CodeCompletionWidget task={task} /> : null}
      {task.type === "code-editor" ? <CodeEditorWidget task={task} /> : null}
    </PracticeGameScreen>
  );
}
