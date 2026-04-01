"use client";

import { useState } from "react";
import { useMessages, useTranslations } from "next-intl";
import { cn } from "@/src/shared/lib";
import { LessonCard } from "./LessonCard";
import { Icon } from "@/src/shared/ui/button";

const PAGE_SIZE = 9;

export const LessonBoard = ({ className }: { className?: string }) => {
  const [page, setPage] = useState(1);
  const messages = useMessages();
  const translate = useTranslations("Dashboard");
  const topics = (messages.Glossary.topics as any[]).map((t) => ({
    ...t,
    completed: [1, 3, 5].includes(t.id),
  }));

  const totalPages = Math.ceil(topics.length / PAGE_SIZE);
  const currentTopics = topics.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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
          />
        ))}
      </div>

      <div className="mt-4 flex items-center justify-center gap-2">
        <div
          onClick={() => page > 1 && setPage(page - 1)}
          className={cn(
            "flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-[var(--card-border)] bg-[var(--input-bg)]",
            page === 1 && "cursor-not-allowed opacity-30",
          )}
        >
          <Icon name="leftArrow" size={12} color="#6a7285" />
        </div>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <div
            key={p}
            onClick={() => setPage(p)}
            className={cn(
              "flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-sm transition-all",
              p === page
                ? "bg-gradient-to-r from-[#13b2f6] to-[#84f59b] text-white"
                : "border border-[var(--card-border)] bg-[var(--input-bg)] text-[var(--text-muted)]",
            )}
          >
            {p}
          </div>
        ))}

        <div
          onClick={() => page < totalPages && setPage(page + 1)}
          className={cn(
            "flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-[var(--card-border)] bg-[var(--input-bg)]",
            page === totalPages && "cursor-not-allowed opacity-30",
          )}
        >
          <Icon name="rightArrow" size={12} color="#6a7285" />
        </div>
      </div>
    </div>
  );
};
