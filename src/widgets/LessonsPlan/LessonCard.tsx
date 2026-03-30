"use client";

import Link from "next/link";

import { Typography } from "antd";
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
        "relative flex flex-col gap-2 rounded-lg border border-[#f4f3f8] bg-[#fefefe] p-4 shadow-[0px_0px_10px_0px_rgba(0,0,0,0.1)] transition-all duration-300",
        practiceTopicId ? "cursor-pointer hover:shadow-none" : "",
        className,
      )}
    >
      <Typography.Text style={{ fontSize: "12px", color: "#6a7285" }}>
        {translate("lesson")} {lessonNumber}
      </Typography.Text>

      <Typography.Text style={{ fontSize: "15px", color: "var(--text-main)", fontWeight: 500 }}>
        {title}
      </Typography.Text>

      {completed ? (
        <div
          className="absolute top-0 right-0 h-full"
          style={{
            width: "5%",
            backgroundColor: "#A7F3D0",
          }}
        />
      ) : null}
    </div>
  );

  if (!practiceTopicId) {
    return content;
  }

  return <Link href={`/${locale}/practice/${practiceTopicId}`}>{content}</Link>;
};
