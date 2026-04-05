"use client";

import { useState } from "react";

import { useMessages, useTranslations } from "next-intl";

import { getPracticeTopicIdByLessonNumber } from "@/src/entities/practice";
import { cn } from "@/src/shared/lib";
import { BaseBtn } from "@/src/shared/ui/button";
import { Icon } from "@/src/shared/ui/icon";

import { LessonCard } from "./LessonCard";

const PAGE_SIZE = 9;

type Topic = {
  id: number;
  title: string;
  completed?: boolean;
};

export const LessonBoard = ({ className }: { className?: string }) => {
  const [page, setPage] = useState(1);
  const messages = useMessages();
  const translate = useTranslations("Dashboard");
  const completedLessonIds = [1, 3, 5];

  const topics = (messages.Glossary.topics as any[]).map((t) => ({
    ...t,
    completed: [1, 3, 5].includes(t.id),
  }));

  const totalPages = Math.max(1, Math.ceil(topics.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const currentTopics = topics.slice(start, start + PAGE_SIZE);

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <h3 className="text-xl font-medium text-[var(--text-main)]">{translate("studyplan")}</h3>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {currentTopics.map((topic) => (
          <LessonCard
            key={topic.id}
            lessonNumber={topic.id}
            title={topic.title}
            completed={topic.completed}
            practiceTopicId={getPracticeTopicIdByLessonNumber(topic.id)}
          />
        ))}
      </div>

      <div className="mt-4 flex items-center justify-center gap-2">
        <BaseBtn
          variant="primary"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-md border border-[var(--card-border)] bg-[var(--input-bg)] p-0",
            page === 1 && "cursor-not-allowed opacity-30",
          )}
        >
          <Icon name="leftArrow" size={12} color="#6a7285" />
        </BaseBtn>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <BaseBtn
            key={p}
            variant="primary"
            onClick={() => setPage(p)}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-md p-0 text-sm transition-all",
              p === page
                ? "border-transparent bg-gradient-to-r from-[#13b2f6] to-[#84f59b] text-white"
                : "border border-[var(--card-border)] bg-[var(--input-bg)] text-[var(--text-muted)]",
            )}
          >
            {p}
          </BaseBtn>
        ))}

        <BaseBtn
          variant="primary"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-md border border-[var(--card-border)] bg-[var(--input-bg)] p-0",
            page === totalPages && "cursor-not-allowed opacity-30",
          )}
        >
          <Icon name="rightArrow" size={12} color="#6a7285" />
        </BaseBtn>
      </div>
    </div>
  );
};
