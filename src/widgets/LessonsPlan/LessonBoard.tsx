"use client";

import { useEffect, useState } from "react";

import { useTranslations, useLocale } from "next-intl";

import { getPracticeStats } from "@/entities/practice";
import { cn } from "@/shared/lib";
import { BaseBtn } from "@/shared/ui/button";
import { ServerError } from "@/shared/ui/errors";
import { Icon } from "@/shared/ui/icon";
import Loading from "@/shared/ui/loading";

import { LessonCard } from "./LessonCard";

import type { Lesson, ServerErrorInfo } from "@shared/types/";

const PAGE_SIZE = 9;

export const LessonBoard = ({ className }: { className?: string }) => {
  const translate = useTranslations("Dashboard");
  const locale = useLocale();

  const [page, setPage] = useState(1);
  const [lessons, setLessons] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<ServerErrorInfo | null>(null);
  const [completedTopics, setCompletedTopics] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`/api/${locale}/lessons`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      });

      if (response.ok) {
        setLessons(await response.json());
      } else {
        setError({ codeNumber: response.status, errorMessage: response.statusText });
      }

      const stats = await getPracticeStats();
      setCompletedTopics(stats.completedTopics);

      setLoading(false);
    }
    fetchData();
  }, [locale]);

  if (isLoading) {
    return <Loading />;
  } else if (error) {
    return <ServerError serverErrorInfo={error} />;
  }

  const totalPages = Math.max(1, Math.ceil(lessons.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const currentTopics = lessons.slice(start, start + PAGE_SIZE);

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <h3 className="text-xl font-medium text-[var(--text-main)]">{translate("studyplan")}</h3>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {currentTopics.map((lesson: Lesson) => (
          <LessonCard
            key={lesson.id}
            lessonNumber={lesson.lessonNumber}
            title={lesson.title}
            completed={completedTopics?.has(lesson.name)}
            practiceTopicId={lesson.name}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <BaseBtn
            variant="primary"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-md border border-[var(--card-border)] bg-[var(--input-bg)] p-0 transition-all duration-300",
              page === 1 ? "cursor-not-allowed opacity-30" : "hover:border-[var(--sidebar-text)]",
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
                  : "border border-[var(--card-border)] bg-[var(--input-bg)] text-[var(--text-muted)] hover:border-[var(--sidebar-text)]",
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
              "flex h-8 w-8 items-center justify-center rounded-md border border-[var(--card-border)] bg-[var(--input-bg)] p-0 transition-all duration-300",
              page === totalPages
                ? "cursor-not-allowed opacity-30"
                : "hover:border-[var(--sidebar-text)]",
            )}
          >
            <Icon name="rightArrow" size={12} color="#6a7285" />
          </BaseBtn>
        </div>
      )}
    </div>
  );
};
