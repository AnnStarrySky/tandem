"use client";

import { use, useEffect, useState } from "react";

import { useSearchParams } from "next/navigation";

import { useLocale, useTranslations } from "next-intl";

import type { PracticeTopic } from "@/src/entities/practice";
import { getPracticeTopic } from "@/src/entities/practice";
import { TopicDifficultyCards } from "@/src/features/practice-runner";

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

  const page = Number(searchParams.get("page") ?? "1");

  useEffect(() => {
    let mounted = true;

    setLoading(true);
    setTopic(null);

    async function loadTopic() {
      try {
        const data = await getPracticeTopic(topicId, locale, "easy");

        if (!mounted) {
          return;
        }

        setTopic(data);
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
        <div
          className="mb-2 text-sm tracking-[0.2em] uppercase"
          style={{ color: "var(--text-main)", opacity: 0.7 }}
        >
          {t("lesson")} {topic.order}
        </div>

        <h1 className="text-4xl font-semibold md:text-5xl" style={{ color: "var(--text-main)" }}>
          {topic.title}
        </h1>

        <p
          className="mt-3 max-w-3xl text-base md:text-lg"
          style={{ color: "var(--text-main)", opacity: 0.82 }}
        >
          {topic.description}
        </p>
      </section>

      <TopicDifficultyCards topic={topic} page={page} />
    </div>
  );
}
