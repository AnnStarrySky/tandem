"use client";

import Link from "next/link";

import { useLocale, useTranslations } from "next-intl";

import type { PracticeTopic } from "@/src/entities/practice";
import { BaseBtn } from "@/src/shared/ui/button";

type Props = {
  topic: PracticeTopic;
  page?: number;
};

export function PracticeTopicCard({ topic, page }: Props) {
  const t = useTranslations("Practice");
  const locale = useLocale();

  const href =
    page && page > 1
      ? `/${locale}/practice/${topic.id}?page=${page}`
      : `/${locale}/practice/${topic.id}`;

  return (
    <article className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,23,42,0.14)] dark:border-white/10 dark:bg-white/5">
      <div className="mb-3 text-sm" style={{ color: "var(--text-main)", opacity: 0.7 }}>
        {t("lesson")} {topic.order}
      </div>

      <div className="flex flex-1 flex-col">
        <h3
          className="mb-3 text-2xl leading-tight font-semibold"
          style={{ color: "var(--text-main)" }}
        >
          {topic.title}
        </h3>

        <p className="text-base leading-6" style={{ color: "var(--text-main)", opacity: 0.82 }}>
          {topic.description}
        </p>

        <div className="mt-auto pt-6">
          <Link href={href} className="block">
            <BaseBtn className="w-full max-w-none text-base">{t("openTopic")}</BaseBtn>
          </Link>
        </div>
      </div>
    </article>
  );
}
