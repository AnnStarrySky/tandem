"use client";

import Link from "next/link";

import { useLocale, useTranslations } from "next-intl";

import { cn } from "@/src/shared/lib";

type Props = {
  lessonNumber: number;
  title: string;
  completed?: boolean;
  className?: string;
  practiceTopicId?: string | null;
};

export const LessonCard = ({
  lessonNumber,
  title,
  completed,
  className,
  practiceTopicId,
}: Props) => {
  const translate = useTranslations("Dashboard");
  const locale = useLocale();

  const content = (
    <div
      className={cn(
        "relative flex min-h-[100px] flex-col gap-3 overflow-hidden rounded-xl border border-[var(--card-border)] bg-[var(--input-bg)] p-6 shadow-sm",
        practiceTopicId ? "cursor-pointer transition-all duration-300 hover:shadow-none" : "",
        className,
      )}
    >
      <span className="text-[12px] tracking-wider text-[var(--text-muted)] uppercase">
        {translate("lesson")} {lessonNumber}
      </span>

      <p className="text-[16px] leading-tight text-[var(--text-main)]">{title}</p>

      {completed ? <div className="absolute top-0 right-0 h-full w-4 bg-[#84f59b]" /> : null}
    </div>
  );

  if (!practiceTopicId) {
    return content;
  }

  return <Link href={`/${locale}/practice/${practiceTopicId}`}>{content}</Link>;
};
