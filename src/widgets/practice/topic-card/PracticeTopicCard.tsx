"use client";

import { useTranslations } from "next-intl";

import { Link } from "@i18n";
import { cn } from "@shared/lib";
import { BaseBtn } from "@shared/ui/button";

import type { PracticeTopic } from "@entities/practice";

type Props = {
  topic: PracticeTopic;
  page?: number;
  completed?: boolean;
};

export function PracticeTopicCard({ topic, page, completed }: Props) {
  const t = useTranslations("Practice");

  const href = page && page > 1 ? `/practice/${topic.id}?page=${page}` : `/practice/${topic.id}`;

  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-3xl border border-[var(--card-border)] bg-[var(--input-bg)] p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,23,42,0.14)]",
        completed && "opacity-50",
      )}
    >
      <div className="mb-3 text-sm text-(--text-main) opacity-70">
        {t("lesson")} {topic.order}
      </div>

      <div className="flex flex-1 flex-col">
        <h3 className="mb-3 text-2xl leading-tight font-semibold text-(--text-main)">
          {topic.title}
        </h3>

        <p className="text-base leading-6 text-(--text-main) opacity-82">{topic.description}</p>

        <div className="mt-auto pt-6">
          <Link href={href} className="block">
            <BaseBtn className="w-full max-w-none text-base" fullWidth>
              {t("openTopic")}
            </BaseBtn>
          </Link>
        </div>
      </div>
    </article>
  );
}
