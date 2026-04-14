"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import type { PracticeDifficulty, PracticeTopic } from "@/entities/practice";
import { TaskStatGetReturn } from "@shared/types";
import { BaseBtn } from "@/shared/ui/button";
import { Icon } from "@/shared/ui/icon";
import { useRouter } from "@i18n";

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
  const router = useRouter();
  const [completedDifficulties, setCompletedDifficulties] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/api/statistics/task")
      .then((res) => res.json())
      .then((data: TaskStatGetReturn) => {
        if (!Array.isArray(data)) return;
        const completed = new Set(
          data
            .filter((task) => {
              const total = task.correctAnswers + task.wrongAnswers;
              return (
                task.lessonName.toLowerCase() === topic.id.toLowerCase() &&
                total > 0 &&
                task.correctAnswers / total >= 0.7
              );
            })
            .map((task) => task.difficulty),
        );
        setCompletedDifficulties(completed);
      });
  }, [topic.id]);

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
    const base = `/practice/${topic.id}/${difficulty}`;
    return page && page > 1 ? `${base}?page=${page}` : base;
  }

  return (
    <div className="grid [grid-auto-rows:1fr] gap-6 md:grid-cols-3">
      {difficulties.map((difficultyItem) => {
        const isDone = completedDifficulties.has(difficultyItem.id);
        return (
          <article
            key={difficultyItem.id}
            className={`flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,23,42,0.14)] dark:border-white/10 dark:bg-white/5 ${isDone ? "opacity-60" : ""}`}
          >
            <div className="flex flex-1 flex-col">
              <div className="mb-3 flex items-start justify-between gap-3">
                <h2 className="text-2xl leading-tight font-semibold text-[var(--text-main)]">
                  {difficultyItem.title}
                </h2>

                <div className="shrink-0 rounded-full bg-linear-to-r from-[#13b2f6] to-[#84f59b] px-3 py-1 text-xs font-semibold text-white shadow-md">
                  {isDone ? (
                    <Icon name="check" size={12} color="white" />
                  ) : (
                    `+${difficultyItem.points}`
                  )}
                </div>
              </div>

              <p className="text-base leading-6 text-[var(--text-main)] opacity-82">
                {difficultyItem.description}
              </p>

              <div className="mt-3 text-sm font-medium text-[#13b2f6] dark:text-[#7dd3fc]">
                {t("pointsReward", { points: difficultyItem.points })}
              </div>

              <div className="mt-auto pt-6">
                <BaseBtn
                  className="w-full max-w-none text-base"
                  onClick={() => router.push(buildHref(difficultyItem.id))}
                  fullWidth
                >
                  {t("start")}
                </BaseBtn>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
