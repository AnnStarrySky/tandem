"use client";

import type { ReactNode } from "react";

import Link from "next/link";

import { useLocale, useTranslations } from "next-intl";

import type { PracticeDifficulty, PracticeTopic } from "@/src/entities/practice";

type Props = {
  topic: PracticeTopic;
  difficulty: PracticeDifficulty;
  page?: number;
  children: ReactNode;
};

export function PracticeGameScreen({ topic, difficulty, page, children }: Props) {
  const t = useTranslations("Practice");
  const locale = useLocale();

  const topicHref =
    page && page > 1
      ? `/${locale}/practice/${topic.id}?page=${page}`
      : `/${locale}/practice/${topic.id}`;

  const allTopicsHref =
    page && page > 1 ? `/${locale}/practice?page=${page}` : `/${locale}/practice`;

  return (
    <div className="grid gap-6">
      <section className="grid gap-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div
              className="mb-2 text-sm tracking-[0.2em] uppercase"
              style={{ color: "var(--text-main)", opacity: 0.7 }}
            >
              {t("lesson")} {topic.order} • {t(difficulty)}
            </div>

            <h1
              className="text-3xl font-semibold md:text-4xl"
              style={{ color: "var(--text-main)" }}
            >
              {topic.title}
            </h1>

            <p
              className="mt-3 max-w-3xl text-base md:text-lg"
              style={{ color: "var(--text-main)", opacity: 0.82 }}
            >
              {topic.description}
            </p>
          </div>

          <div className="ml-auto flex flex-wrap items-center gap-3 p-2">
            <Link
              href={topicHref}
              className="inline-flex h-11 items-center justify-center rounded-2xl border border-[#38bdf8] bg-white/70 px-6 text-[15px] font-medium text-slate-800 shadow-[0_0_0_1px_rgba(56,189,248,0.18)] transition hover:bg-sky-50 hover:shadow-[0_0_0_1px_rgba(56,189,248,0.32)] dark:border-[#38bdf8] dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
            >
              {t("backToTopic")}
            </Link>

            <Link
              href={allTopicsHref}
              className="inline-flex h-11 items-center justify-center rounded-2xl border border-[#38bdf8] bg-white/70 px-6 text-[15px] font-medium text-slate-800 shadow-[0_0_0_1px_rgba(56,189,248,0.18)] transition hover:bg-sky-50 hover:shadow-[0_0_0_1px_rgba(56,189,248,0.32)] dark:border-[#38bdf8] dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
            >
              {t("allTopics")}
            </Link>
          </div>
        </div>
      </section>

      <div className="w-full">{children}</div>
    </div>
  );
}
