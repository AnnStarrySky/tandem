"use client";

import { cn } from "@/src/shared/lib";
import { useTranslations } from "next-intl";

type Props = {
  lessonNumber: number;
  title: string;
  completed?: boolean;
  className?: string;
};

export const LessonCard = ({ lessonNumber, title, completed, className }: Props) => {
  const translate = useTranslations("Dashboard");

  return (
    <div
      className={cn(
        "relative flex min-h-[100px] flex-col gap-3 overflow-hidden rounded-xl border border-[var(--card-border)] bg-[var(--input-bg)] p-6 shadow-sm",
        className,
      )}
    >
      <span className="text-[12px] tracking-wider text-[var(--text-muted)] uppercase">
        {translate("lesson")} {lessonNumber}
      </span>

      <p className="text-[16px] leading-tight font-bold text-[var(--text-main)]">{title}</p>

      {completed && <div className="absolute top-0 right-0 h-full w-4 bg-[#84f59b]" />}
    </div>
  );
};
