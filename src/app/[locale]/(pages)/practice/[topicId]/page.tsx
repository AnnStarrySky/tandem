"use client";

import { use, useEffect, useState } from "react";

import { useSearchParams } from "next/navigation";

import { useLocale, useTranslations } from "next-intl";

import { getPracticeTopic, getPracticeStats, type PracticeTopic } from "@entities/practice";
import { TopicDifficultyCards } from "@features/practice-runner";

type Props = {
  params: Promise<{
    topicId: string;
  }>;
};

export default function PracticeTopicPage({ params }: Props) {
  const { topicId } = use(params);

  const t = useTranslations("Practice");
  const locale = useLocale();
  const searchParams = useSearchParams();

  const [topic, setTopic] = useState<PracticeTopic | null>(null);
  const [loading, setLoading] = useState(true);
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());

  const page = Number(searchParams.get("page") ?? "1");

  useEffect(() => {
    let mounted = true;

    setLoading(true);
    setTopic(null);

    async function loadTopic() {
      try {
        const data = await getPracticeTopic(topicId, locale, "easy");

        if (!mounted) return;

        setTopic(data);

        const stats = await getPracticeStats();
        if (mounted) setCompletedTasks(stats.completedTasks);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void loadTopic();

    return () => {
      mounted = false;
    };
  }, [topicId, locale]);

  if (loading) {
    return <div className="text-slate-600 dark:text-slate-300">{t("loadingTopic")}</div>;
  }

  if (!topic) {
    return <div className="text-slate-600 dark:text-slate-300">{t("topicNotFound")}</div>;
  }

  return (
    <div className="grid gap-8">
      <section>
        <div className="mb-2 text-sm tracking-[0.2em] text-(--text-main) uppercase opacity-70">
          {t("lesson")} {topic.order}
        </div>

        <h1 className="text-4xl font-semibold text-(--text-main) md:text-5xl">{topic.title}</h1>

        <p className="mt-3 max-w-3xl text-base text-(--text-main) opacity-82 md:text-lg">
          {topic.description}
        </p>
      </section>

      <TopicDifficultyCards topic={topic} page={page} completedTasks={completedTasks} />
    </div>
  );
}
