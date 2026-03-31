"use client";

import Link from "next/link";

import { useLocale, useTranslations } from "next-intl";

import type { PracticeDifficulty, PracticeTopic } from "@/src/entities/practice";
import { BaseBtn } from "@/src/shared/ui/button";

type Props = {
  topic: PracticeTopic;
  page?: number;
};

const DIFFICULTY_POINTS: Record<PracticeDifficulty, number> = {
  easy: 10,
  medium: 20,
  hard: 30,
};

export function TopicDifficultyCards({ topic, page }: Props) {
  const t = useTranslations("Practice");
  const locale = useLocale();

  const difficulties: Array<{
    id: PracticeDifficulty;
    title: string;
    description: string;
    points: number;
  }> = [
    {
      id: "easy",
      title: t("easy"),
      description: t("easyDescription"),
      points: DIFFICULTY_POINTS.easy,
    },
    {
      id: "medium",
      title: t("medium"),
      description: t("mediumDescription"),
      points: DIFFICULTY_POINTS.medium,
    },
    {
      id: "hard",
      title: t("hard"),
      description: t("hardDescription"),
      points: DIFFICULTY_POINTS.hard,
    },
  ];

  function buildHref(difficulty: PracticeDifficulty) {
    const base = `/${locale}/practice/${topic.id}/${difficulty}`;
    return page && page > 1 ? `${base}?page=${page}` : base;
  }

  return (
    <div className="grid [grid-auto-rows:1fr] gap-6 md:grid-cols-3">
      {difficulties.map((difficulty) => (
        <article
          key={difficulty.id}
          className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,23,42,0.14)] dark:border-white/10 dark:bg-white/5"
        >
          <div className="flex flex-1 flex-col">
            <div className="mb-3 flex items-start justify-between gap-3">
              <h2
                className="text-2xl leading-tight font-semibold"
                style={{ color: "var(--text-main)" }}
              >
                {difficulty.title}
              </h2>

              <div className="shrink-0 rounded-full bg-linear-to-r from-[#13b2f6] to-[#84f59b] px-3 py-1 text-xs font-semibold text-white shadow-md">
                +{difficulty.points}
              </div>
            </div>

            <p className="text-base leading-6" style={{ color: "var(--text-main)", opacity: 0.82 }}>
              {difficulty.description}
            </p>

            <div className="mt-3 text-sm font-medium text-[#13b2f6] dark:text-[#7dd3fc]">
              {t("pointsReward", { points: difficulty.points })}
            </div>

            <div className="mt-auto pt-6">
              <Link href={buildHref(difficulty.id)} className="block">
                <BaseBtn className="w-full max-w-none text-base">{t("start")}</BaseBtn>
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
