"use client";

import type { ReactNode } from "react";

import { useTranslations } from "next-intl";

import type { PracticeDifficulty, PracticeTopic } from "@/entities/practice";
import { BaseBtn } from "@/shared/ui/button";

import { useRouter } from "../../../i18n";

type Props = {
  topic: PracticeTopic;
  difficulty: PracticeDifficulty;
  page?: number;
  children: ReactNode;
};

export function PracticeGameScreen({ topic, difficulty, page, children }: Props) {
  const t = useTranslations("Practice");
  const router = useRouter();

  const topicHref =
    page && page > 1 ? `/practice/${topic.id}?page=${page}` : `/practice/${topic.id}`;

  const allTopicsHref = page && page > 1 ? `/practice?page=${page}` : `/practice`;

  return (
    <div className="grid gap-6">
      <section className="grid gap-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="mb-2 text-sm tracking-[0.2em] text-[var(--text-main)] uppercase opacity-70">
              {t("lesson")} {topic.order} • {t(difficulty)}
            </div>

            <h1 className="text-3xl font-semibold text-[var(--text-main)] md:text-4xl">
              {topic.title}
            </h1>

            <p className="mt-3 max-w-3xl text-base text-[var(--text-main)] opacity-82 md:text-lg">
              {topic.description}
            </p>
          </div>

          <div className="ml-auto flex flex-wrap items-center gap-3 p-2">
            <BaseBtn
              variant="outline"
              className="max-w-none text-[15px]"
              onClick={() => router.push(topicHref)}
            >
              {t("backToTopic")}
            </BaseBtn>

            <BaseBtn
              variant="outline"
              className="max-w-none text-[15px]"
              onClick={() => router.push(allTopicsHref)}
            >
              {t("allTopics")}
            </BaseBtn>
          </div>
        </div>
      </section>

      <div className="w-full">{children}</div>
    </div>
  );
}
